import React from "react"
import { View, Text, TouchableOpacity, ScrollView, FlatList, Dimensions, TouchableWithoutFeedback } from "react-native"
import { styles } from "../../themes/styles"
import { useState, useEffect } from "react"
import { Modal } from "react-native"
import { Button } from "react-native"
import { TextInput } from "react-native"
import { useContext } from "react"
import { ThemeContext } from "../../../App"
import Icon from 'react-native-vector-icons/MaterialIcons';
import { postObject } from "./TaskListView"
import { ThemeStyles } from "../../themes/themeStyles"

const ProjectView = ({navigation}) => {
    
    const [columnsNumber, setColumns] = useState(Math.floor((Dimensions.get('window').width - (Dimensions.get('window').width/300)*30)/300))

    useEffect(() => {
        const updateNumColumns = () => {
            setColumns(Math.floor((Dimensions.get('window').width - (Dimensions.get('window').width/300)*30)/300));
        };
    
        updateNumColumns();
    
        const subscription = Dimensions.addEventListener('change', updateNumColumns);
        return () => subscription.remove();
      }, []);
 
    const [projects, setProjects] = useState([])

    useEffect(() => {
        fetch("http://192.168.0.101:8080/projects")
                .then(res => res.json())
                .then(data => {
                    setProjects(data)
                    console.log("projecten: " + JSON.stringify(data))
                })
                .catch(error => console.error(error))
      
    }, [])

    const [modalVisible, setModalVisible] = useState(false);

    const { isDarkMode, toggleTheme } = useContext(ThemeContext);
    const themeStyles = ThemeStyles(isDarkMode)
    return (
        <View style={[styles.container, themeStyles.container]}>
            <Text style={[styles.header, themeStyles.header]}><Icon name='done-all' color='#1169d4' size={40}/>CheckIt!</Text>
            <FlatList key={columnsNumber} data={projects} renderItem={({item}) => <Project navigation={navigation} project={item}/>} numColumns={columnsNumber}/>
            <TouchableOpacity onPress={() => setModalVisible(true)} style={styles.addProject}>
                <Icon name='add-circle' color='white' size={20}/>
            </TouchableOpacity>
            <Modal visible={modalVisible} animationType="fade" transparent={true} >
                <AddProject setModalVisible={setModalVisible} setProjects={setProjects}/>
            </Modal>
        </View>
    )
}

const Project = ({navigation, project}) => {
    const { isDarkMode, toggleTheme } = useContext(ThemeContext);
    const themeStyles = ThemeStyles(isDarkMode)
    return (
        <TouchableOpacity onPress={() => navigation.navigate('Tasks', {project})} style={[styles.projectTile, themeStyles.projectTile]}>
            <Text style={[styles.projectTileName, themeStyles.projectTileName]}>Project {project.name}</Text>
            <Text style={themeStyles.projectTileDescription}>{project.description}</Text>
        </TouchableOpacity>
    )
}

const AddProject = ({setModalVisible, setProjects}) => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');

    const handleSubmit = () => {
        var temp = {Id: -1, name: name, description: description}
        postObject(temp, setProjects, '/projects/add')
        setModalVisible(false)
        setName("")
        setDescription("")
    };

    return (
        <View style={styles.addProjectTransparant}>
            <TouchableOpacity onPress={() => setModalVisible(false)} activeOpacity={1} >
            <TouchableWithoutFeedback >
            <View style={styles.addProjectForm}>
                <Text style={styles.addProjectTitle}>Add a new Project!</Text>
                <Text style={styles.inputlabel}>Project name:</Text>
                <TextInput placeholder="name" placeholderTextColor={"gray"} onChangeText={(text) => setName(text)} value={name} style={styles.addProjectInput} label/>
                <Text style={styles.inputlabel}>Project description:</Text>
                <TextInput placeholder="description" placeholderTextColor={"gray"} onChangeText={(text) => setDescription(text)} value={description} multiline numberOfLines={4} style={styles.addProjectInput}/>
                <Button title="add project" onPress={handleSubmit} color='#1169d4'/>
            </View>
            </TouchableWithoutFeedback>
        </TouchableOpacity>
        </View>
        
    );
}

export default ProjectView