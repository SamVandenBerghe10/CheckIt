import React from "react"
import { View, Text, FlatList, Dimensions, TouchableWithoutFeedback } from "react-native"
import { styles } from "../../themes/styles"
import { useState, useEffect } from "react"
import { Modal } from "react-native"
import { TextInput } from "react-native"
import { useContext } from "react"
import { ThemeContext } from "../../../App"
import Icon from 'react-native-vector-icons/MaterialIcons';
import { postObject } from "./TaskListView"
import { ThemeStyles } from "../../themes/themeStyles"
import { useFocusEffect } from "@react-navigation/native"
import { useCallback } from "react"
import { Pressable } from "react-native"

export const ip = "192.168.0.204"

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

    useFocusEffect(
        useCallback(() => {
            getProjects(setProjects)
    }, []))

    const [modalVisible, setModalVisible] = useState(false);

    const { isDarkMode, toggleTheme } = useContext(ThemeContext);
    const themeStyles = ThemeStyles(isDarkMode)
    return (
        <View style={[styles.container, themeStyles.container]}>
            <Text style={[styles.header, themeStyles.header]}><Icon name='done-all' color='#1169d4' size={40}/>CheckIt!</Text>
            <FlatList key={columnsNumber} data={projects} renderItem={({item}) => <Project navigation={navigation} project={item}/>} numColumns={columnsNumber}/>
            <Pressable onPress={() => setModalVisible(true)} style={styles.addProject} > 
                <Icon name='add-circle' color='white' size={20} accessible={true} accesibilityHint="Double-tap to add a new project" accessibilityLabel="add a new project" accessibilityRole="button"/>
            </Pressable>
            <Modal visible={modalVisible} animationType="fade" transparent={true} onRequestClose={() => setModalVisible(false)}>
                <AddProject setModalVisible={setModalVisible} setProjects={setProjects}/>
            </Modal>
        </View>
    )
}

const getProjects = (setProjects) => {
    fetch("http://" + ip + ":8080/projects")
                .then(res => res.json())
                .then(data => {
                    setProjects((prev) => data)
                    console.log("projecten: " + JSON.stringify(data))
                })
                .catch(error => console.error(error))
}

const Project = ({navigation, project}) => {
    const { isDarkMode, toggleTheme } = useContext(ThemeContext);
    const themeStyles = ThemeStyles(isDarkMode)
    return (
        <Pressable onPress={() => navigation.navigate('Tasks', {project})} style={[styles.projectTile, themeStyles.projectTile]}>
            <Text style={[styles.projectTileName, themeStyles.projectTileName]}>Project {project.name}</Text>
            <Text style={themeStyles.projectTileDescription}>{project.description}</Text>
        </Pressable>
    )
}

const AddProject = ({setModalVisible, setProjects}) => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');

    const [nameError, setNameError] = useState("");

    const updateProjectLambda = () => {getProjects(setProjects)}

    const handleSubmit = () => {
        var temp = {Id: -1, name: name, description: description}
        if(validateProjectPost(name))
        {
            postObject(temp, setProjects, '/projects/add', updateProjectLambda)
            setModalVisible(false)
            setName("")
            setDescription("")
            setNameError("")
        }
        else 
        {
            setNameError("Please enter a name for the project.")
        }
    };

    const validateProjectPost = (name) => {
        if(name.length > 0){
            return true
        }
        return false
    }

    return (
        <View style={styles.addProjectTransparant}>
            <Pressable onPress={() => setModalVisible(false)} style={{flex: 1, justifyContent: 'center'}}>
            <TouchableWithoutFeedback>
            <View style={styles.addProjectForm}>
                <Pressable onPress={() => setModalVisible(false)} style={{position: 'absolute', right: 10, top: 10}}>
                    <Icon name='delete'size={18} color='#0a3d62'/>
                </Pressable>
                <Text style={styles.addProjectTitle}>Add a new Project!</Text>
                <Text style={styles.inputlabel}>Project name:</Text>
                {nameError.length > 0 && <Text style={{color: 'red'}}>{nameError}</Text>}
                <TextInput placeholder="name" placeholderTextColor={"gray"} onChangeText={(text) => setName(text)} value={name} style={styles.addProjectInput} label/>
                <Text style={styles.inputlabel}>Project description:</Text>
                <TextInput placeholder="description" placeholderTextColor={"gray"} onChangeText={(text) => setDescription(text)} value={description} multiline numberOfLines={4} style={styles.addProjectInput}/>
                <Pressable onPress={handleSubmit} style={styles.button}><Text style={styles.buttonText}>add project</Text></Pressable>
            </View>
            </TouchableWithoutFeedback>
        </Pressable>
        </View>
        
    );
}

export default ProjectView