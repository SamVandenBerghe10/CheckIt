import React from "react"
import { View, Text, FlatList, Dimensions } from "react-native"
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
import { ActivityIndicator } from "react-native"
import { api_url } from "./AppContent"

export const ip = "localhost"

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
    const [filteredProjects, setFilteredProjects] = useState([])

    const [loading, setLoading] = useState(true)

    useFocusEffect(
        useCallback(() => {
            getProjects({setProjects, setFilteredProjects, setSearchProject, setLoading})
    }, []))

    const [modalVisible, setModalVisible] = useState(false);

    const { isDarkMode, toggleTheme } = useContext(ThemeContext);
    const themeStyles = ThemeStyles(isDarkMode)

    const [searchProject, setSearchProject] = useState("");

    const filterProjects = (text) => {
        setSearchProject(text)
        setFilteredProjects(projects.filter(project => project.name.toLowerCase().includes(text.toLowerCase())))
    }
    return (
        <View style={[styles.container, themeStyles.container]}>
            <Text style={[styles.header, themeStyles.header]} accessible={true} accessibilityLabel="CheckIt" accessibilityRole="header"><Icon name='done-all' color='#1169d4' size={40}/>CheckIt!</Text>
            <TextInput placeholder="search project" placeholderTextColor={"gray"} onChangeText={(text) => filterProjects(text)} value={searchProject} style={[styles.addProjectInput, {alignSelf: 'flex-end'}]} label/>
            {loading ? <ActivityIndicator size="large"/>: null}
            {loading == false && projects.length == 0 ? <Text>0 Projects found</Text>: null}
            <FlatList key={columnsNumber} data={filteredProjects} renderItem={({item}) => <Project navigation={navigation} project={item}/>} numColumns={columnsNumber}/>
            <Pressable onPress={() => setModalVisible(true)} style={styles.addProject} > 
                <Icon name='add-circle' color='white' size={20} accessible={true} accesibilityHint="Double-tap to add a new project" accessibilityLabel="add a new project" accessibilityRole="button"/>
            </Pressable>
            <Modal visible={modalVisible} animationType="fade" transparent={true} onRequestClose={() => setModalVisible(false)}>
                <AddProject setModalVisible={setModalVisible} setProjects={setProjects} setFilteredProjects={setFilteredProjects} setSearchProject={setSearchProject} setLoading={setLoading}/>
            </Modal>
        </View>
    )
}

const getProjects = async (props) => {
    const {setProjects, setFilteredProjects, setSearchProject, setLoading} = props

    setLoading(true)
    await fetch( api_url + "projects")
                .then(res => res.json())
                .then(data => {
                    setLoading(false)
                    setProjects((prev) => data)
                    setFilteredProjects((prev) => data)
                    setSearchProject((prev) => "")
                    console.log("projecten: " + JSON.stringify(data))
                })
                .catch(error => {
                    console.error(error)
                    setLoading(false)
                })
}

const Project = (props) => {
    const {navigation, project} = props
    const { isDarkMode, toggleTheme } = useContext(ThemeContext);
    const themeStyles = ThemeStyles(isDarkMode)
    return (
        <Pressable onPress={() => navigation.navigate('Tasks', {project})} style={[styles.projectTile, themeStyles.projectTile]} accessible={true} accesibilityHint="Double-tap to see project" accessibilityLabel={"project " + project.name} accessibilityRole="menuItem">
            <Text style={[styles.projectTileName, themeStyles.projectTileName]}>Project {project.name}</Text>
            <Text style={themeStyles.projectTileDescription}>{project.description}</Text>
        </Pressable>
    )
}

const AddProject = (props) => {
    const {setModalVisible, setProjects, setFilteredProjects, setSearchProject, setLoading} = props

    const [name, setName] = useState('');
    const [description, setDescription] = useState('');

    const [nameError, setNameError] = useState("");

    const updateProjectLambda = () => {getProjects({setProjects, setFilteredProjects, setSearchProject, setLoading})}

    const [loading2, setLoading2] = useState(false);

    const handleSubmit = async () => {
        var temp = {Id: -1, name: name, description: description}
        if(validateProjectPost(name))
        {
            setLoading2(true)
            await postObject(temp, 'projects/add', updateProjectLambda)
            setLoading2(false)
            HandleExit()
        }
        else 
        {
            setNameError("Please enter a name for the project.")
        }
    };

    const HandleExit = () => {
        setName("")
        setDescription("")
        setNameError("")
        setModalVisible(false)
    }

    const validateProjectPost = (name) => {
        if(name.length > 0){
            return true
        }
        return false
    }

    return (
        <View style={styles.addProjectTransparant} accessible={false} importantForAccessibility="no-hide-descendants">
            <Pressable onPress={() => HandleExit()} style={{flex: 1, justifyContent: 'center'}} accessible={false} importantForAccessibility="no">
            <View style={styles.addProjectForm} accessible={false} importantForAccessibility="no">
                <Pressable accessible={false} importantForAccessibility="no">
                    <Pressable onPress={() => HandleExit()} style={{position: 'absolute', right: -20, top: 10}} accessible={true} accessibilityLabel="remove add-project-menu" accesibilityHint="Double-tap to remove the add-project-menu" accessibilityRole="button">
                        <Icon name='delete'size={18} color='#0a3d62'/>
                    </Pressable>
                    <Text style={styles.addProjectTitle} accessible={true} accessibilityLabel="Add a new project" accessibilityRole="header">Add a new Project!</Text>
                    {loading2 ? <ActivityIndicator size="small" style={{alignSelf: 'center'}}/>: null}
                    <Text style={styles.inputlabel} accessible={true} accessibilityLabel="project name"  accessibilityRole="text">Project name:</Text>
                    {nameError.length > 0 && <Text style={{color: 'red'}} accessible={true} accessibilityLabel={"name-error: " + nameError} accessibilityRole="alert">{nameError}</Text>}
                    <TextInput placeholder="name" placeholderTextColor={"gray"} onChangeText={(text) => setName(text)} value={name} style={styles.addProjectInput} label/>
                    <Text style={styles.inputlabel} accessible={true} accessibilityLabel={"project description"}  accessibilityRole="text">Project description:</Text>
                    <TextInput placeholder="description" placeholderTextColor={"gray"} onChangeText={(text) => setDescription(text)} value={description} multiline numberOfLines={4} style={styles.addProjectInput}/>
                    <Pressable onPress={handleSubmit} style={styles.button} accessible={true} accessibilityLabel={"add project"} accessibilityHint="Double-tap to add this project"  accessibilityRole="button"><Text style={styles.buttonText}>add project</Text></Pressable>
                </Pressable>
            </View>
        </Pressable>
        </View>
        
    );
}

export default ProjectView