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


const TaskListView = ({route}) => {
    var {project} = route.params

    const [tasks, setTasks] = useState([])

    useEffect(() => {
        fetch("http://192.168.0.101:3000/tasks/project/" + project.Id)
                .then(res => res.json())
                .then(data => {
                    setTasks(data)
                    console.log("tasks: " + JSON.stringify(data))
                })
                .catch(error => console.error(error))
      
    }, [])

    const [categories, setCategories] = useState([])

    useEffect(() => {
        fetch("http://192.168.0.101:3000/categories")
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
        fetch("http://192.168.0.101:3000/priorities")
                .then(res => res.json())
                .then(data => {
                    setPriorities(data)
                    console.log("priorities: " + JSON.stringify(data))
                })
                .catch(error => console.error(error))
      
    }, [])

    const [selectedPriority, setSelectedPriority] = useState([]);

        useEffect(() => {
            fetch("http://192.168.0.101:3000/priorities/standard")
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
            <Text style={styles.taskHeader}>{project.Name}</Text>
            <ScrollView horizontal>
            <FlatList data={status} renderItem={({item}) => <TaskColumn item={item} tasks={tasks} statusList={status} categories={categories} priorities={[...selectedPriority, ...priorities]}/>} numColumns={4}/>
             </ScrollView>
        </View>
    )
}

const TaskColumn = ({item, tasks, statusList, categories, priorities}) => {
    const [modalVisible, setModalVisible] = useState(false);

    const AddTask = ({status}) => {
        const [title, setTitle] = useState('');
        const [description, setDescription] = useState('');
        const [deadline, setDeadline] = useState('');
        const [selectedStatus, setSelectedStatus] = useState(item);
        const [selectedCategory, setSelectedCategory] = useState("");
        const [selectedPriority, setSelectedPriority] = useState({});
    
        const handleSubmit = () => {
            console.log('post new task')
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
                    <Text>Deadline (YYYY-MM-DD HH:MM:SS):</Text>
                    <TextInput placeholder="Task deadline" onChangeText={(text) => setDeadline(text)} value={deadline} style={styles.addProjectInput} label/>
                    <Text>Status</Text>
                    <Picker selectedValue={selectedStatus} onValueChange={(itemValue, itemIndex) => setSelectedStatus(itemValue)} style={[styles.addPicker, Platform.OS == 'ios' ? styles.addPickerIos: null]}>
                        {statusList.map((statusItem) => (<Picker.Item label={statusItem} value={statusItem} key={statusItem}/>))}
                    </Picker>
                    <Text>Category</Text>
                    <Picker selectedValue={selectedCategory} onValueChange={(itemValue, itemIndex) => setSelectedCategory(itemValue)} style={[styles.addPicker, Platform.OS == 'ios' ? styles.addPickerIos: null]}>
                        {categories.map((category) => (<Picker.Item label={category.Name} value={category.Name} key={category.Id} color='white'/>))}
                    </Picker>
                    <Text>Priority</Text>
                    <Picker selectedValue={selectedPriority} onValueChange={(itemValue, itemIndex) => setSelectedPriority(itemValue)} style={[styles.addPicker, Platform.OS == 'ios' ? styles.addPickerIos: null]}>
                        {priorities.map((priority) => (<Picker.Item label={priority.Name} value={priority.Name} key={priority.Id} color='white'/>))}
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
            <FlatList data={tasks.filter(i => i.Status == item)} renderItem={({item}) => <Task task={item}></Task>}/>
            <TouchableOpacity style={styles.addTask} onPress={() => setModalVisible(true)}>
                <Text>+</Text>
            </TouchableOpacity>

            <Modal visible={modalVisible} animationType="fade" transparent={true} >
                <AddTask status={item}/>
            </Modal>
        </View>
        
    )
}

const Task = ({task}) => {
    const [taskCategory, setTaskCategory] = useState([]);

    useEffect(() => {
        fetch("http://192.168.0.101:3000/tasks/"+ task.CategoryId +"/category")
                .then(res => res.json())
                .then(data => {
                    setTaskCategory(data)
                    console.log("category of task " + JSON.stringify(data))
                })
                .catch(error => console.error(error))
      
    }, [])

    var navigation = useNavigation()
    var category = taskCategory[0]
    return (
        <TouchableOpacity style={[styles.task, {borderColor: category?.Color}]} onPress={() => navigation.navigate('TaskDetail', {task})}>
            <Text>{task.Title + " "}{category ? "| " + category.Name : ""}</Text>
        </TouchableOpacity>
    )
}

export default TaskListView