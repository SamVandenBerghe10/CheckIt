import React from "react"
import { View, Text, TouchableOpacity, ScrollView, FlatList, Dimensions, TouchableWithoutFeedback } from "react-native"
import { styles } from "../../themes/styles"
import { useState, useEffect } from "react"
import { Modal } from "react-native-web"
import { Button } from "react-native"
import { TextInput } from "react-native"

const ProjectView = ({navigation}) => {
    
    const [columnsNumber, setColumns] = useState(Math.floor((Dimensions.get('window').width - (Dimensions.get('window').width/300)*30)/300))
 
    const [projects, setProjects] = useState([])

    useEffect(() => {
        fetch("http://192.168.0.202:3000/projects")
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
            console.log('Name:', name);
            console.log('Email:', email);
        };
    
        return (
            <TouchableOpacity onPress={() => setModalVisible(false)} activeOpacity={1}>
                <TouchableWithoutFeedback>
                <View style={styles.addProjectContainer}>
                    <Text style={styles.addProjectTitle}>Add a new Project!</Text>
                    <Text>Project name:</Text>
                    <TextInput placeholder="Project Name" onChangeText={(text) => setName(text)} value={name} style={styles.addProjectInput} label/>
                    <Text>Project description:</Text>
                    <TextInput placeholder="Project Description" onChangeText={(text) => setDescription(text)} value={description} multiline numberOfLines={4} style={styles.addProjectInput}/>
                    <Button title="Submit" onPress={handleSubmit}/>
                </View>
                </TouchableWithoutFeedback>
                
            </TouchableOpacity>
            
        );
    }

    return (
        <View style={styles.container}>
            <Text style={styles.header}>CheckIt!</Text>
            <ScrollView>
                <View>
                    <FlatList data={projects} renderItem={({item}) => <Project navigation={navigation} project={item}/>} numColumns={columnsNumber}/>
                </View>
            </ScrollView>
            <TouchableOpacity onPress={() => setModalVisible(true)} style={styles.addProject}>
                <Text style={styles.addProjectText}>+</Text>
            </TouchableOpacity>
            <Modal visible={modalVisible} animationType="fade" transparent={true} >
                <View style={styles.addProjectTransparant}>
                    <AddProject/>
                </View>
            </Modal>
        </View>
    )
}

const Project = ({navigation, project}) => {
    return (
        <TouchableOpacity onPress={() => navigation.navigate('Tasks', {project})} style={styles.projectTile}>
            <Text style={styles.projectTileName}>Project {project.Name}</Text>
            <Text>Project {project.Description}</Text>
        </TouchableOpacity>
    )
}







export default ProjectView