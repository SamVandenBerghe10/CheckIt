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

const ProjectView = ({navigation}) => {
    
    const [columnsNumber, setColumns] = useState(Math.floor((Dimensions.get('window').width - (Dimensions.get('window').width/300)*30)/300))
 
    const [projects, setProjects] = useState([])

    useEffect(() => {
        fetch("http://localhost:8080/projects")
                .then(res => res.json())
                .then(data => {
                    setProjects(data)
                    console.log("projecten: " + JSON.stringify(data))
                })
                .catch(error => console.error(error))
      
    }, [])

    const [modalVisible, setModalVisible] = useState(false);

    const AddProject = () => {
        const [name, setName] = useState('');
        const [description, setDescription] = useState('');
    
        const handleSubmit = () => {
            var temp = {Id: -1, name: name, description: description}
            postProject(temp, setProjects)
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
                    <Text>Project name:</Text>
                    <TextInput placeholder="Project Name" onChangeText={(text) => setName(text)} value={name} style={styles.addProjectInput} label/>
                    <Text>Project description:</Text>
                    <TextInput placeholder="Project Description" onChangeText={(text) => setDescription(text)} value={description} multiline numberOfLines={4} style={styles.addProjectInput}/>
                    <Button title="Submit" onPress={handleSubmit}/>
                </View>
                </TouchableWithoutFeedback>
            </TouchableOpacity>
            </View>
            
        );
    }

    const { isDarkMode, toggleTheme } = useContext(ThemeContext);
    return (
        <View style={[styles.container, {backgroundColor: isDarkMode ? '#42474f' :'#fff'}]}>
            <Text style={styles.header}>CheckIt!</Text>
            <ScrollView>
                <View>
                    <FlatList data={projects} renderItem={({item}) => <Project navigation={navigation} project={item}/>} numColumns={columnsNumber}/>
                </View>
            </ScrollView>
            <TouchableOpacity onPress={() => setModalVisible(true)} style={styles.addProject}>
                <Icon name='add-circle' color='white' size={20}/>
            </TouchableOpacity>
            <Modal visible={modalVisible} animationType="fade" transparent={true} >
                <AddProject/>
            </Modal>
        </View>
    )
}

const Project = ({navigation, project}) => {
    return (
        <TouchableOpacity onPress={() => navigation.navigate('Tasks', {project})} style={styles.projectTile}>
            <Text style={styles.projectTileName}>Project {project.name}</Text>
            <Text>Project {project.Description}</Text>
        </TouchableOpacity>
    )
}



const postProject = async (data, setTasks) => {
    try {
      const response = await fetch('http://localhost:8080/projects/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json()
      setTasks((prevTasks) => [...prevTasks, result])
      console.log('Response:', result.title);
      
    } catch (error) {
      console.error('Error:', error.message);
    }
  };



export default ProjectView