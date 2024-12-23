import React from "react"
import { View, Text, ScrollView, FlatList } from "react-native"
import { useState } from "react"
import { useEffect } from "react"
import { styles } from "../../themes/styles"
import { Modal } from "react-native"
import { TextInput } from "react-native"
import {Picker} from '@react-native-picker/picker';
import { useNavigation } from '@react-navigation/native';
import { useContext } from "react"
import { ThemeContext } from "../../../App"
import Icon from 'react-native-vector-icons/MaterialIcons';
import { ThemeStyles } from "../../themes/themeStyles"
import { useFocusEffect } from "@react-navigation/native";
import { useCallback } from "react";
import { Pressable } from "react-native"
import { ActivityIndicator } from "react-native"
import { api_url } from "./AppContent"

const TaskListView = ({route}) => {
    var {project} = route.params

    const [tasks, setTasks] = useState([])

    const [loading, setLoading] = useState(true)
    
    useFocusEffect(
        useCallback(() => {
            getTasks({setTasks, project, setLoading})
        }, []))

    const [categories, setCategories] = useState([])

    useFocusEffect(
        useCallback(() => {
        fetch( api_url + "categories")
                .then(res => res.json())
                .then(data => {
                    var temp = [{id: 99999999, name: ""}, ...data]
                    setCategories(temp)
                })
                .catch(error => console.error(error))
    }, []))

    const [priorities, setPriorities] = useState([])

    useEffect(() => {
        fetch(api_url + "priorities")
                .then(res => res.json())
                .then(data => {
                    setPriorities(data)
                })
                .catch(error => console.error(error))
      
    }, [])

    const statusList = ["To Do", "In Progress", "Review", "Done"]

    const { isDarkMode, toggleTheme } = useContext(ThemeContext);
    const themeStyles = ThemeStyles(isDarkMode)

    const [deleteModal, setDeleteModal] = useState(false)
    return (
        <View style={[styles.container2, themeStyles.container]}>
            <Text style={[styles.taskHeader ,themeStyles.projectTile, themeStyles.projectTileName]} accessible={true} accessibilityLabel={"Tasks of project " + project.name} accessibilityRole="header">{project.name}</Text>
            {loading ? <ActivityIndicator size="large"/>: null}
            <Pressable onLongPress={() => setDeleteModal(true)} style={{position: 'absolute', right: 10, top: 10}} accessible={true} accessibilityLabel="Delete Project" accesibilityHint={"Double tap to delete a project"} accessibilityRole="button">
                <Icon name='delete'size={30} color={isDarkMode ? '#f0f0f0' : '#0a3d62'}/>
            </Pressable>
            <ScrollView horizontal>
                <FlatList data={statusList} renderItem={({item}) => <TaskColumn status={item} tasks={tasks} setTasks={setTasks} statusList={statusList} categories={categories} priorities={priorities} project={project} setLoading={setLoading}/>} numColumns={4}/>
            </ScrollView>
            <Modal visible={deleteModal} animationType="fade" transparent={true} onRequestClose={() => setDeleteModal(false)}>
                <DeleteProject setModalVisible={setDeleteModal} project={project} />
            </Modal>
        </View>
    )
}

const getTasks = async (props) => {
    const {setTasks, project, setLoading} = props

    setLoading(true)
    await fetch(api_url + "tasks/project/" + project.id)
                .then(res => res.json())
                .then(data => {
                    setLoading(false)
                    setTasks((prev) => data)
                })
                .catch(error => {
                    setLoading(false)
                    console.error(error)
                })
}

const TaskColumn = (props) => {
    const {status, tasks, setTasks, statusList, categories, priorities, project, setLoading} = props

    const [modalVisible, setModalVisible] = useState(false);

    const { isDarkMode, toggleTheme } = useContext(ThemeContext);
    const themeStyles = ThemeStyles(isDarkMode)

    const updateTaskLambda = () => {getTasks({setTasks, project, setLoading})}
    return (
        <View style={[styles.taskColumn, themeStyles.taskColumn]}>
            <Text style={[styles.taskColumnText, themeStyles.projectTileName]}>{status}</Text>
            <FlatList data={tasks.filter(i => i.status == status && i.parenttaskid == null)} renderItem={({item}) => <Task task={item} statusList={statusList} categories={categories} priorities={priorities} project={project}></Task>}/>
            <Pressable style={styles.addTask} onPress={() => setModalVisible(true)} accessible={true} accessibilityLabel="Add Task" accesibilityHint={"Double tap to add a task"} accessibilityRole="button">
                <Icon name='add-circle' color='#0a3d62' size={20} style={{alignSelf: 'center', margin: 2}}/>
            </Pressable>
            <Modal visible={modalVisible} animationType="fade" transparent={true} onRequestClose={() => setModalVisible(false)}>
                <AddTask parenttask={null} status={status} setModalVisible={setModalVisible} project={project} statusList={statusList} categories={categories} priorities={priorities} setTasks={setTasks} titleText={'Add new Task in "' + status + '"'} updateTaskLambda={updateTaskLambda}/>
            </Modal>
        </View>
    )
}

export const Task = (props) => {
    const {task, statusList, categories, priorities} = props

    const { isDarkMode, toggleTheme } = useContext(ThemeContext);
    const themeStyles = ThemeStyles(isDarkMode)

    var navigation = useNavigation()
    var temp = task
    var tempCategories = categories

    var category = task.category?.name
    if(task.category?.name?.length > 10)
    {
        category = task.category?.name?.substring(0, 10) + "..."
    }

    var title = task.title
    if(task.title.length > 18)
    {
        if(task.title?.length > 10)
        {
            title = task.title.substring(0, 17) + "..."
        }
    }

    var color = isDarkMode ? '#f0f0f0' : '#0a3d62'
    var dateObject = new Date(Date.parse(task.deadline))
    var now = new Date()
    if((dateObject - now) / (1000 * 60 * 60 * 24) < 1)
    {
        
        color = "#f2c213"
    }
    if(dateObject - now < 0)
    {
        color = "red"
    }
    return (
        <Pressable style={[styles.task, themeStyles.task, {borderColor: task.category?.color}]} onPress={() => navigation.push(task.parenttaskid == null ? 'TaskDetail' : 'SubTaskDetail', {temp, statusList, tempCategories, priorities})} accessible={true} accessibilityLabel={"Task: " + task.title} accessibilityHint="Double-tap to see task details" accessibilityRole="button">
            <Text style={themeStyles.taskText}><Text style={{color: color}}>{title}</Text>{task.category ? " | " + category + " | ": " | "}{<PriorityIndicator priority={task.priority} style={{position: 'absolute', right: 1}}/>}{task.childtasks?.length > 0 ? <Icon name='account-tree' size={18} color={themeStyles.taskText} style={{position: 'absolute', right: 1}}/>: null}</Text>
        </Pressable>
    )
}

export const PriorityIndicator = ({priority}) =>{
    var showPriority = ""
    var color = ""
    var bgColor = false
    if(priority == null)
    {
        return null
    }
    if(priority.sequence == 1)
    {
        showPriority = "keyboard-double-arrow-up"
        color = "red"
    } else if(priority.sequence == 2)
    {
        showPriority = "keyboard-arrow-up"
        color = "red"
    } else if(priority.sequence == 3)
    {
        showPriority = "minimize"
        color = "#f2c213"
        bgColor = true
    } else if(priority.sequence == 4)
    {
        showPriority = "keyboard-arrow-down"
        color = "blue"
    } else if(priority.sequence == 5)
    {
        showPriority = "keyboard-double-arrow-down"
        color = "blue"
    }
    return (
        <Icon name={showPriority} color={color} size={18}/>
    )
}

export const AddTask = (props) => {
    const {parenttask, status, setModalVisible, project, statusList, categories, priorities, setTasks, titleText, updateTaskLambda} = props

    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    var date = new Date()
    date.setDate(date.getDate() +1)
    const [deadline, setDeadline] = useState(date.getFullYear() + "-" + (date.getMonth()+1).toString().padStart(2, '0') + "-" + date.getDate().toString().padStart(2, '0') + " 12:00:00");
    const [selectedStatus, setSelectedStatus] = useState(status);
    const [selectedCategory, setSelectedCategory] = useState("");
    const [selectedPriority, setSelectedPriority] = useState(priorities.find(priority => priority.standardpriority === true)?.id);

    const [titleError, setTitleError] = useState("");
    const [deadlineError, setDeadlineError] = useState("");

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if(priorities.length > 0){
            setLoading(false)
        }
    }, [priorities.length])

    const handleSubmit = async () => {
        var temp ={id: -1, title: title, description: description, deadline: deadline, status: selectedStatus, projectid: project.id, categoryid: selectedCategory, priorityid: selectedPriority, childtasks: [], parenttaskid: parenttask?.id}
        setTitleError("")
        setDeadlineError("")
        if(validateTaskPost(temp)) {
            setLoading(true)
            await postObject(temp, 'tasks/add', updateTaskLambda)
            setLoading(false)
            setModalVisible((prevModalVisible) => false)
            setTitle('')
            setDescription('')
            setDeadline('')
            setSelectedStatus(status)
            setSelectedCategory("")
            setSelectedPriority(priorities.find(priority => priority.standardpriority === true)?.id)
        }
        
    };
    
    const validateTaskPost = (task) => {
        var returnTitle = true
        var returnDeadline = true
        const date = new Date(task.deadline)
        const regex = /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/;
        if(task.title.length == 0){
            returnTitle = false
          setTitleError("title is required")
        }
        if(isNaN(date.getTime()) || !regex.test(task.deadline)){
            returnDeadline = false
            setDeadlineError("deadline must be (yyyy-MM-dd HH:mm:ss)")
        }
        if(task.deadline.length == 0){
            returnDeadline = false
          setDeadlineError("deadline is required")
        }
        return (returnTitle && returnDeadline)
      }

    return (
        <View style={styles.addProjectTransparant} accessible={false} importantForAccessibility="no-hide-descendants">
            <Pressable onPress={() => setModalVisible((prevModalVisible) => false)} style={{flex: 1, justifyContent: 'center', maxHeight: 720}} accessible={false} importantForAccessibility="no">
            <ScrollView style={styles.addProjectForm} accessible={false} importantForAccessibility="no">
                <Pressable accessible={false} importantForAccessibility="no">
                <Text style={styles.addProjectTitle} accessible={true} accessibilityLabel={titleText} accessibilityRole="header">{titleText}</Text>
                {loading ? <ActivityIndicator size="small"/>: null}
                <Text style={styles.inputlabel} accessible={true} accessibilityLabel="task title" accessibilityRole="text">Title:</Text>
                {titleError.length > 0 && <Text style={{color: 'red'}} accessible={true} accessibilityLabel={"title-error " + titleError} accessibilityRole="alert">{titleError}</Text>}
                <TextInput placeholder="title" placeholderTextColor={"gray"} onChangeText={(text) => setTitle(text)} value={title} style={styles.addProjectInput} label/>
                <Text style={styles.inputlabel} accessible={true} accessibilityLabel="task description" accessibilityRole="text">Description:</Text>
                <TextInput placeholder="description" placeholderTextColor={"gray"} onChangeText={(text) => setDescription(text)} value={description} multiline numberOfLines={4} style={styles.addProjectInput}/>
                <Text style={styles.inputlabel} accessible={true} accessibilityLabel="task deadline" accessibilityRole="text">Deadline (yyyy-MM-dd HH:mm:ss):</Text>
                {deadlineError.length > 0 && <Text style={{color: 'red'}} accessible={true} accessibilityLabel={"deadline-error: " + deadlineError} accessibilityRole="text">{deadlineError}</Text>}
                <TextInput placeholder=" yyyy-MM-dd HH:mm:ss" placeholderTextColor={"gray"} onChangeText={(text) => setDeadline(text)} value={deadline} style={styles.addProjectInput} label/>
                <Text style={styles.inputlabel} accessible={true} accessibilityLabel="task status" accessibilityRole="text">Status</Text>
                <Picker selectedValue={selectedStatus} onValueChange={(itemValue, itemIndex) => setSelectedStatus(itemValue)} style={styles.addPicker}>
                    {statusList.map((statusItem) => (<Picker.Item label={statusItem} value={statusItem} key={statusItem} color="black"/>))}
                </Picker>
                <Text style={styles.inputlabel} accessible={true} accessibilityLabel="task category" accessibilityRole="text">Category</Text>
                <Picker selectedValue={selectedCategory} onValueChange={(itemValue, itemIndex) => setSelectedCategory(itemValue)} style={styles.addPicker}>
                    {categories.map((category) => (<Picker.Item label={category.name} value={category.id} key={category.id} color="black"/>))}
                </Picker>
                <Text style={styles.inputlabel} accessible={true} accessibilityLabel="task priority" accessibilityRole="text">Priority</Text>
                <Picker selectedValue={selectedPriority} onValueChange={(itemValue, itemIndex) => setSelectedPriority(itemValue)} style={styles.addPicker}>
                    {priorities.map((priority) => (<Picker.Item label={priority.name} value={priority.id} key={priority.id} color="black"/>))}
                </Picker>
                <Pressable onPress={handleSubmit} style={styles.button} accessible={true} accessibilityLabel="add new task" accessibilityRole="button"><Text style={styles.buttonText}>add task</Text></Pressable>
                <Pressable onPress={() => setModalVisible(false)} style={{alignSelf: "center"}} accessible={true} accessibilityLabel="remove add-task-menu" accessibilityHint="Double-tap to remove add-task-menu" accessibilityRole="button">
                    <Icon name='keyboard-arrow-down'size={30} color='#0a3d62'/>
                </Pressable>
                </Pressable>
            </ScrollView>
        </Pressable>
        </View>
    );
}

export const postObject = async (data, urlExtention, updateTaskLambda) => {
    try {
      const response = await fetch(api_url + urlExtention, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      updateTaskLambda()
      
    } catch (error) {
      console.error('Error:', error.message);
    }
  };

const DeleteProject = ({setModalVisible, project}) => {
    const [confirmText, setConfirmText] = useState("")
    const [confirmError, setConfirmError] = useState("")

    const navigation = useNavigation()

    const [loading, setLoading] = useState(false);

    const HandleProjectDelete = async () => {
        setConfirmError("Project name does not match")
        if(confirmText == project.name) {
            setLoading(true)
            await deleteProject(navigation, 'projects/delete/', project.id)
            setLoading(false)
            setConfirmError("")
            setModalVisible((prevModalVisible) => false)
        }
    }

    return (
        <View style={styles.addProjectTransparant} importantForAccessibility="no-hide-descendants">
            <Pressable onPress={() => setModalVisible((prevModalVisible) => false)} style={{flex: 1, justifyContent: 'center'}} accessible={false} importantForAccessibility="no">
                    <View style={styles.addProjectForm} accessible={false} importantForAccessibility="no">
                        <Pressable accessible={false} importantForAccessibility="no">
                        <Text style={styles.addProjectTitle}>Are you sure??</Text>
                        {loading ? <ActivityIndicator size="small" style={{alignSelf: 'center'}}/>: null}
                        <Pressable onPress={() => setModalVisible(false)} style={{position: 'absolute', right: -20, top: 10}} accessible={true} accessibilityLabel="remove delete-project-menu" accesibilityHint="Double-tap to remove the delete-project-menu" accessibilityRole="button">
                            <Icon name='close'size={18} color='#0a3d62'/>
                        </Pressable>
                        <Text style={styles.inputlabel} accessible={true} accessibilityLabel={"To verify the deletion of " + project.name + "please type the projects name"} accessibilityRole="text">To verify the deletion of: "<Text style={{color: "red"}}>{project.name}</Text>", please type the project name:</Text>
                        {confirmError.length > 0 && <Text style={{color: 'red'}} accessible={true} accessibilityLabel={"confirm-error: " + confirmError} accessibilityRole="alert">{confirmError}</Text>}
                        <TextInput placeholder={project.name} placeholderTextColor={"gray"} onChangeText={(text) => setConfirmText(text)} value={confirmText} style={styles.addProjectInput} label/>
                        <Pressable onPress={HandleProjectDelete} style={[styles.button, {backgroundColor: "red"}]} accessible={true} accessibilityLabel="delete current project" accesibilityHint="Double-tap to delete current project" accessibilityRole="button"><Text style={styles.buttonText}>delete</Text></Pressable>
                        </Pressable>
                    </View>
        </Pressable>
        </View>
    )
}

const deleteProject = async (navigation, urlExtention, id) => {
    try {
      const response = await fetch(api_url + urlExtention + id, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        }
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      navigation.goBack()
      
    } catch (error) {
      console.error('Error:', error.message);
    }
  };

export default TaskListView