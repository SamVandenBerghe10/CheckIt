import React from "react"
import { View, Text, TouchableOpacity, ScrollView, FlatList, Dimensions } from "react-native"
import { styles } from "../../themes/styles"
import { useState, useEffect } from "react"

const ProjectView = ({navigation}) => {
    //var projects = [0,1,2,3,4,5,6,7,8,9]
    var screenWidth = Dimensions.get('window').width
    var columnsNumber = Math.floor((screenWidth - (screenWidth/300)*30)/300)


    const [projects, setProjects] = useState([])

    useEffect(() => {
        fetch("http://localhost:3000/projects")
                .then(res => res.json())
                .then(data => {
                    setProjects(data)
                    console.log("projecten: " + JSON.stringify(data))
                })
                .catch(error => console.error(error))
      
    }, [])
    return (
        <View style={styles.container}>
            <Text style={styles.header}>CheckIt!</Text>
            <ScrollView>
                <View style={styles.projectTileContainer}>
                    <FlatList data={projects} renderItem={({item}) => <Project navigation={navigation} project={item}/>} numColumns={columnsNumber}/>
                </View>
            </ScrollView>
            <TouchableOpacity onPress={() => navigation.navigate('Settings')} style={styles.addProject}>
                <Text style={styles.addProjectText}>+</Text>
            </TouchableOpacity>
        </View>
    )
}

const Project = ({navigation, project}) => {
    return (
        <TouchableOpacity onPress={() => navigation.navigate('Tasks', {project: project})} style={styles.projectTile}>
            <Text>Project {project.Name}</Text>
        </TouchableOpacity>
    )
}




export default ProjectView