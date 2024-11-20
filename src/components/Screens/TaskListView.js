import React from "react"
import { View, Text, ScrollView, FlatList } from "react-native"
import { useState } from "react"
import { useEffect } from "react"
import { styles } from "../../themes/styles"
import { TouchableOpacity } from "react-native"
import { Modal } from "react-native"
import { TouchableWithoutFeedback } from "react-native"
import { TextInput } from "react-native"
import { Button } from "react-native"
import {Picker} from '@react-native-picker/picker';
import { useNavigation } from '@react-navigation/native';
import { useContext } from "react"
import { ThemeContext } from "../../../App"
import { Platform } from "react-native"
import Icon from 'react-native-vector-icons/MaterialIcons';


const TaskListView = ({route}) => {
    var {project} = route.params

    const [tasks, setTasks] = useState([])
    
    useEffect(() => {
        fetch("http://localhost:8080/tasks/project/" + project.id)
                .then(res => res.json())
                .then(data => {
                    setTasks(data)
                    console.log("tasks: " + JSON.stringify(data))
                })
                .catch(error => console.error(error))
      
    }, [])

    const [categories, setCategories] = useState([])

    useEffect(() => {
        fetch("http://localhost:8080/categories")
                .then(res => res.json())
                .then(data => {
                    var temp = [{Id: -1, Name: ""}, ...data]
                    setCategories(temp)
                    console.log("categories: " + JSON.stringify(temp))
                })
                .catch(error => console.error(error))
      
    }, [])

    const [priorities, setPriorities] = useState([])

    useEffect(() => {
        fetch("http://localhost:8080/priorities/notstandard")
                .then(res => res.json())
                .then(data => {
                    setPriorities(data)
                    console.log("(not standard)priorities: " + JSON.stringify(data))
                })
                .catch(error => console.error(error))
      
    }, [])

    const [selectedPriority, setSelectedPriority] = useState([]);

        useEffect(() => {
            fetch("http://localhost:8080/priorities/standard")
                    .then(res => res.json())
                    .then(data => {
                        setSelectedPriority(data)
                        console.log("standard priority: " + JSON.stringify(data))
                    })
                    .catch(error => console.error(error))
          
        }, [])

    const status = ["Nog doen", "Mee bezig", "Nakijken", "Klaar"]
    const { isDarkMode, toggleTheme } = useContext(ThemeContext);
    return (
        <View style={[styles.container2,{backgroundColor: isDarkMode ? '#42474f' :'#fff'}]}>
            <Text style={styles.taskHeader}>{project.name}</Text>
            <ScrollView horizontal>
            <FlatList data={status} renderItem={({item}) => <TaskColumn item={item} tasks={tasks} setTasks={setTasks} statusList={status} categories={categories} priorities={[...selectedPriority, ...priorities]} project={project}/>} numColumns={4}/>
             </ScrollView>
        </View>
    )
}

const TaskColumn = ({item, tasks, setTasks, statusList, categories, priorities, project}) => {
    const [modalVisible, setModalVisible] = useState(false);

    const AddTask = ({status}) => {
        const [title, setTitle] = useState('');
        const [description, setDescription] = useState('');
        const [deadline, setDeadline] = useState('');
        const [selectedStatus, setSelectedStatus] = useState(item);
        const [selectedCategory, setSelectedCategory] = useState("");
        const [selectedPriority, setSelectedPriority] = useState(priorities[0].id);
    
        const handleSubmit = () => {
            var temp ={id: -1, title: title, description: description, deadline: deadline, status: selectedStatus, projectid: project.id, categoryid: selectedCategory, priorityid: selectedPriority, childtasks: []}
            postTask(temp, setTasks)
            setModalVisible(false)
            setTitle('')
            setDescription('')
            setDeadline('')
            setSelectedStatus(item)
            setSelectedCategory("")
            setSelectedPriority(priorities[0].id)
        };
    
        return (
            <View style={styles.addProjectTransparant}>
                <TouchableOpacity onPress={() => setModalVisible(false)} activeOpacity={1}>
                <TouchableWithoutFeedback>
                <View style={styles.addProjectForm}>
                    <ScrollView>
                    <Text style={styles.addProjectTitle}>Add a new Task in "{status}"</Text>
                    <Text>Project Title:</Text>
                    <TextInput placeholder="Task Title" onChangeText={(text) => setTitle(text)} value={title} style={styles.addProjectInput} label/>
                    <Text>Task description:</Text>
                    <TextInput placeholder="Task Description" onChangeText={(text) => setDescription(text)} value={description} multiline numberOfLines={4} style={styles.addProjectInput}/>
                    <Text>Deadline (yyyy-MM-dd HH:mm:ss):</Text>
                    <TextInput placeholder="Task deadline" onChangeText={(text) => setDeadline(text)} value={deadline} style={styles.addProjectInput} label/>
                    <Text>Status</Text>
                    <Picker selectedValue={selectedStatus} onValueChange={(itemValue, itemIndex) => setSelectedStatus(itemValue)} style={[styles.addPicker, Platform.OS == 'ios' ? styles.addPickerIos: null]}>
                        {statusList.map((statusItem) => (<Picker.Item label={statusItem} value={statusItem} key={statusItem}/>))}
                    </Picker>
                    <Text>Category</Text>
                    <Picker selectedValue={selectedCategory} onValueChange={(itemValue, itemIndex) => setSelectedCategory(itemValue)} style={[styles.addPicker, Platform.OS == 'ios' ? styles.addPickerIos: null]}>
                        {categories.map((category) => (<Picker.Item label={category.name} value={category.id} key={category.id}/>))}
                    </Picker>
                    <Text>Priority</Text>
                    <Picker selectedValue={selectedPriority} onValueChange={(itemValue, itemIndex) => setSelectedPriority(itemValue)} style={[styles.addPicker, Platform.OS == 'ios' ? styles.addPickerIos: null]}>
                        {priorities.map((priority) => (<Picker.Item label={priority.name} value={priority.id} key={priority.id}/>))}
                    </Picker>
                    
                    <Button title="Submit" onPress={handleSubmit}/>
                    </ScrollView>
                    
                </View>
                </TouchableWithoutFeedback>
            </TouchableOpacity>
            </View>
        );
    }
    return (
        <View style={styles.taskColumn}>
            <Text style={styles.taskColumnText}>{item}</Text>
            <FlatList data={tasks.filter(i => i.status == item && i.parenttaskid == null)} renderItem={({item}) => <Task task={item}></Task>}/>
            <TouchableOpacity style={styles.addTask} onPress={() => setModalVisible(true)}>
                <Icon name='add-circle' color='gray' size={20} style={{alignSelf: 'center', margin: 5, borderColor: 'gray', borderRadius: 20, borderWidth: 2}}/>
            </TouchableOpacity>

            <Modal visible={modalVisible} animationType="fade" transparent={true} >
                <AddTask status={item}/>
            </Modal>
        </View>
        
    )
}

export const Task = ({task}) => {
    var navigation = useNavigation()
    return (
        <TouchableOpacity style={[styles.task, {borderColor: task.category?.color}]} onPress={() => navigation.navigate('TaskDetail', {task})}>
            <Text>{task.title + " "}{task.category ? "| " + task.category?.name : ""}{task.childtasks?.length > 0 ? <Icon name='account-tree' size={18} color='#000' style={{position: 'absolute', right: 1}}/>: null}</Text>
        </TouchableOpacity>
    )
}

const postTask = async (data, setTasks) => {
    try {
      const response = await fetch('http://localhost:8080/tasks/add', {
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

export default TaskListView