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


const TaskListView = ({route}) => {
    var {project} = route.params

    const [tasks, setTasks] = useState([])

    useEffect(() => {
        fetch("http://192.168.0.202:3000/tasks/project/" + project.Id)
                .then(res => res.json())
                .then(data => {
                    setTasks(data)
                    console.log("tasks: " + JSON.stringify(data))
                })
                .catch(error => console.error(error))
      
    }, [])

    const [categories, setCategories] = useState([])

    useEffect(() => {
        fetch("http://192.168.0.202:3000/categories")
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
        fetch("http://192.168.0.202:3000/priorities")
                .then(res => res.json())
                .then(data => {
                    setPriorities(data)
                    console.log("priorities: " + JSON.stringify(temp))
                })
                .catch(error => console.error(error))
      
    }, [])

    const [selectedPriority, setSelectedPriority] = useState([]);

        useEffect(() => {
            fetch("http://192.168.0.202:3000/priorities/standard")
                    .then(res => res.json())
                    .then(data => {
                        setSelectedPriority(data)
                        console.log("standard priority: " + JSON.stringify(data))
                    })
                    .catch(error => console.error(error))
          
        }, [])

    const status = ["Nog doen", "Mee bezig", "Nakijken", "Klaar"]
    return (
        <View>
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
            console.log('Name:', name);
            console.log('Email:', email);
        };
    
        return (
            <TouchableOpacity onPress={() => setModalVisible(false)} activeOpacity={1}>
                <TouchableWithoutFeedback>
                <View style={styles.addProjectContainer}>
                    <Text style={styles.addProjectTitle}>Add a new Task in "{status}"</Text>
                    <Text>Project Title:</Text>
                    <TextInput placeholder="Task Title" onChangeText={(text) => setTitle(text)} value={title} style={styles.addProjectInput} label/>
                    <Text>Task description:</Text>
                    <TextInput placeholder="Task Description" onChangeText={(text) => setDescription(text)} value={description} multiline numberOfLines={4} style={styles.addProjectInput}/>
                    <Text>Deadline (YYYY-MM-DD HH:MM:SS):</Text>
                    <TextInput placeholder="Task deadline" onChangeText={(text) => setDeadline(text)} value={deadline} style={styles.addProjectInput} label/>
                    <Text>Status</Text>
                    <Picker selectedValue={selectedStatus} onValueChange={(itemValue, itemIndex) => setSelectedStatus(itemValue)}>
                        {statusList.map((statusItem) => (<Picker.Item label={statusItem} value={statusItem} key={statusItem}/>))}
                    </Picker>
                    <Text>Category</Text>
                    <Picker selectedValue={selectedCategory} onValueChange={(itemValue, itemIndex) => setSelectedCategory(itemValue)}>
                        {categories.map((category) => (<Picker.Item label={category.Name} value={category.Name} key={category.Id}/>))}
                    </Picker>
                    <Text>Priority</Text>
                    <Picker selectedValue={selectedPriority} onValueChange={(itemValue, itemIndex) => setSelectedPriority(itemValue)}>
                        {priorities.map((priority) => (<Picker.Item label={priority.Name} value={priority.Name} key={priority.Id}/>))}
                    </Picker>
                    <Button title="Submit" onPress={handleSubmit}/>
                </View>
                </TouchableWithoutFeedback>
            </TouchableOpacity>
            
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
                <View style={styles.addProjectTransparant}>
                    <AddTask status={item}/>
                </View>
            </Modal>
        </View>
        
    )
}

const Task = ({task}) => {
    return (
        <TouchableOpacity style={styles.task}>
            <Text>{task.Title}</Text>
        </TouchableOpacity>
    )
}

export default TaskListView