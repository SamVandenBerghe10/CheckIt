import React from "react"
import { View, Text, ScrollView, FlatList } from "react-native"
import { useState } from "react"
import { useEffect } from "react"
import { styles } from "../../themes/styles"
import { Modal } from "react-native"
import { TouchableWithoutFeedback } from "react-native"
import { TextInput } from "react-native"
import {Picker} from '@react-native-picker/picker';
import { useNavigation } from '@react-navigation/native';
import { useContext } from "react"
import { ThemeContext } from "../../../App"
import { Platform } from "react-native"
import Icon from 'react-native-vector-icons/MaterialIcons';
import { ThemeStyles } from "../../themes/themeStyles"
import { useFocusEffect } from "@react-navigation/native";
import { useCallback } from "react";
import { Pressable } from "react-native"

const TaskListView = ({route}) => {
    var {project} = route.params

    const [tasks, setTasks] = useState([])
    
    useFocusEffect(
        useCallback(() => {
            getTasks(setTasks, project)
        }, []))

    const [categories, setCategories] = useState([])

    useFocusEffect(
        useCallback(() => {
        fetch("http://localhost:8080/categories")
                .then(res => res.json())
                .then(data => {
                    var temp = [{id: 99999999, name: ""}, ...data]
                    setCategories(temp)
                    console.log("categories: " + JSON.stringify(temp))
                })
                .catch(error => console.error(error))
    }, []))

    const [priorities, setPriorities] = useState([])

    useEffect(() => {
        fetch("http://localhost:8080/priorities")
                .then(res => res.json())
                .then(data => {
                    setPriorities(data)
                    console.log("(sorted)priorities: " + JSON.stringify(data))
                })
                .catch(error => console.error(error))
      
    }, [])

    const statusList = ["To Do", "In Progress", "Review", "Done"]

    const { isDarkMode, toggleTheme } = useContext(ThemeContext);
    const themeStyles = ThemeStyles(isDarkMode)

    const [deleteModal, setDeleteModal] = useState(false)
    return (
        <View style={[styles.container2, themeStyles.container]}>
            <Pressable onPress={() => setDeleteModal(true)} style={{position: 'absolute', right: 10, top: 10}}>
                <Icon name='delete'size={30} color={isDarkMode ? '#f0f0f0' : '#0a3d62'}/>
            </Pressable>
            <Text style={[styles.taskHeader ,themeStyles.projectTile, themeStyles.projectTileName]}>{project.name}</Text>
            <ScrollView horizontal>
                <FlatList data={statusList} renderItem={({item}) => <TaskColumn status={item} tasks={tasks} setTasks={setTasks} statusList={statusList} categories={categories} priorities={priorities} project={project}/>} numColumns={4}/>
            </ScrollView>
            <Modal visible={deleteModal} animationType="fade" transparent={true} >
                <DeleteProject setModalVisible={setDeleteModal} project={project} />
            </Modal>
        </View>
    )
}

const getTasks = (setTasks, project) => {
    fetch("http://localhost:8080/tasks/project/" + project.id)
                .then(res => res.json())
                .then(data => {
                    setTasks((prev) => data)
                    console.log("tasks: " + JSON.stringify(data))
                })
                .catch(error => console.error(error))
}

const TaskColumn = ({status, tasks, setTasks, statusList, categories, priorities, project}) => {
    const [modalVisible, setModalVisible] = useState(false);

    const { isDarkMode, toggleTheme } = useContext(ThemeContext);
    const themeStyles = ThemeStyles(isDarkMode)

    const updateTaskLambda = () => {getTasks(setTasks, project)}
    return (
        <View style={[styles.taskColumn, themeStyles.taskColumn]}>
            <Text style={[styles.taskColumnText, themeStyles.projectTileName]}>{status}</Text>
            <FlatList data={tasks.filter(i => i.status == status && i.parenttaskid == null)} renderItem={({item}) => <Task task={item} statusList={statusList} categories={categories} priorities={priorities} project={project}></Task>}/>
            <Pressable style={styles.addTask} onPress={() => setModalVisible(true)}>
                <Icon name='add-circle' color='#0a3d62' size={20} style={{alignSelf: 'center', margin: 2}}/>
            </Pressable>
            <Modal visible={modalVisible} animationType="fade" transparent={true} >
                <AddTask parenttask={null} status={status} setModalVisible={setModalVisible} project={project} statusList={statusList} categories={categories} priorities={priorities} setTasks={setTasks} titleText={'Add new Task in "' + status + '"'} updateTaskLambda={updateTaskLambda}/>
            </Modal>
        </View>
    )
}

export const Task = ({task, statusList, categories, priorities}) => {
    const { isDarkMode, toggleTheme } = useContext(ThemeContext);
    const themeStyles = ThemeStyles(isDarkMode)

    var navigation = useNavigation()
    var temp = task

    var category = task.category?.name
    if(task.category?.name?.length > 10)
    {
        category = task.category?.name?.substring(0, 10) + "..."
    }

    var title = task.title
    if(task.title.length > 18)
    {
        if(task.category?.name?.length > 10)
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
        <Pressable style={[styles.task, themeStyles.task, {borderColor: task.category?.color}]} onPress={() => navigation.push('TaskDetail', {temp, statusList, categories, priorities})}>
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

export const AddTask = ({parenttask, status, setModalVisible, project, statusList, categories, priorities, setTasks, titleText, updateTaskLambda}) => {
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

    const handleSubmit = () => {
        var temp ={id: -1, title: title, description: description, deadline: deadline, status: selectedStatus, projectid: project.id, categoryid: selectedCategory, priorityid: selectedPriority, childtasks: [], parenttaskid: parenttask?.id}
        setTitleError("")
        setDeadlineError("")
        if(validateTaskPost(temp)) {
            postObject(temp, setTasks, '/tasks/add', updateTaskLambda)
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
        <View style={styles.addProjectTransparant}>
            <Pressable onPress={() => setModalVisible((prevModalVisible) => false)} style={{flex: 1, justifyContent: 'center'}}>
            <TouchableWithoutFeedback>
            <View style={styles.addProjectForm}>
                <ScrollView>
                <Text style={styles.addProjectTitle}>{titleText}</Text>
                <Text style={styles.inputlabel}>Project Title:</Text>
                {titleError.length > 0 && <Text style={{color: 'red'}}>{titleError}</Text>}
                <TextInput placeholder="title" placeholderTextColor={"gray"} onChangeText={(text) => setTitle(text)} value={title} style={styles.addProjectInput} label/>
                <Text style={styles.inputlabel}>Task description:</Text>
                <TextInput placeholder="description" placeholderTextColor={"gray"} onChangeText={(text) => setDescription(text)} value={description} multiline numberOfLines={4} style={styles.addProjectInput}/>
                <Text style={styles.inputlabel}>Deadline (yyyy-MM-dd HH:mm:ss):</Text>
                {deadlineError.length > 0 && <Text style={{color: 'red'}}>{deadlineError}</Text>}
                <TextInput placeholder=" yyyy-MM-dd HH:mm:ss" placeholderTextColor={"gray"} onChangeText={(text) => setDeadline(text)} value={deadline} style={styles.addProjectInput} label/>
                <Text style={styles.inputlabel}>Status</Text>
                <Picker selectedValue={selectedStatus} onValueChange={(itemValue, itemIndex) => setSelectedStatus(itemValue)} style={[styles.addPicker, Platform.OS == 'ios' ? styles.addPickerIos: null]}>
                    {statusList.map((statusItem) => (<Picker.Item label={statusItem} value={statusItem} key={statusItem}/>))}
                </Picker>
                <Text style={styles.inputlabel}>Category</Text>
                <Picker selectedValue={selectedCategory} onValueChange={(itemValue, itemIndex) => setSelectedCategory(itemValue)} style={[styles.addPicker, Platform.OS == 'ios' ? styles.addPickerIos: null]}>
                    {categories.map((category) => (<Picker.Item label={category.name} value={category.id} key={category.id}/>))}
                </Picker>
                <Text style={styles.inputlabel}>Priority</Text>
                <Picker selectedValue={selectedPriority} onValueChange={(itemValue, itemIndex) => setSelectedPriority(itemValue)} style={[styles.addPicker, Platform.OS == 'ios' ? styles.addPickerIos: null]}>
                    {priorities.map((priority) => (<Picker.Item label={priority.name} value={priority.id} key={priority.id}/>))}
                </Picker>
                <Pressable onPress={handleSubmit} style={styles.button}><Text style={styles.buttonText}>add task</Text></Pressable>
                </ScrollView>
                
            </View>
            </TouchableWithoutFeedback>
        </Pressable>
        </View>
    );
}

export const postObject = async (data, setState, urlExtention, updateTaskLambda) => {
    try {
      const response = await fetch('http://localhost:8080' + urlExtention, {
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
      console.log('Response: ', response);
      
    } catch (error) {
      console.error('Error:', error.message);
    }
  };

const DeleteProject = ({setModalVisible, project}) => {
    const [confirmText, setConfirmText] = useState("")
    const [confirmError, setConfirmError] = useState("")

    const navigation = useNavigation()

    const HandleProjectDelete = () => {
        setConfirmError("Project name does not match")
        if(confirmText == project.name) {
            deleteProject(navigation, '/projects/delete/', project.id)
            setConfirmError("")
            setModalVisible((prevModalVisible) => false)
        }
    }

    return (
        <View style={styles.addProjectTransparant}>
            <Pressable onPress={() => setModalVisible((prevModalVisible) => false)} style={{flex: 1, justifyContent: 'center'}}>
                <TouchableWithoutFeedback>
                    <View style={styles.addProjectForm}>
                        <Text style={styles.addProjectTitle}>Are you sure??</Text>
                        <Text style={styles.inputlabel}>To verify the deletion of: "<Text style={{color: "red"}}>{project.name}</Text>", please type the project name:</Text>
                        {confirmError.length > 0 && <Text style={{color: 'red'}}>{confirmError}</Text>}
                        <TextInput placeholder={project.name} placeholderTextColor={"gray"} onChangeText={(text) => setConfirmText(text)} value={confirmText} style={styles.addProjectInput} label/>
                        <Pressable onPress={HandleProjectDelete} style={[styles.button, {backgroundColor: "red"}]}><Text style={styles.buttonText}>delete</Text></Pressable>
                    </View>
                </TouchableWithoutFeedback>
        </Pressable>
        </View>
    )
}

const deleteProject = async (navigation, urlExtention, id) => {
    try {
      const response = await fetch('http://localhost:8080' + urlExtention + id, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        }
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      console.log('Response: ', response);
      navigation.goBack()
      
    } catch (error) {
      console.error('Error:', error.message);
    }
  };

export default TaskListView