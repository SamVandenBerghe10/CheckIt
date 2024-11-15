import React from "react"
import { View, Text, ScrollView, FlatList } from "react-native"
import { useState } from "react"
import { useEffect } from "react"
import { styles } from "../../themes/styles"
import { TouchableOpacity } from "react-native"


const TaskListView = ({route}) => {
    var {project} = route.params

    const [tasks, setTasks] = useState([])

    useEffect(() => {
        fetch("http://localhost:3000/tasks/project/" + project.Id)
                .then(res => res.json())
                .then(data => {
                    setTasks(data)
                    console.log("tasks: " + JSON.stringify(data))
                })
                .catch(error => console.error(error))
      
    }, [])

    const [status, setStatus] = useState([])

    useEffect(() => {
        fetch("http://localhost:3000/tasks/status/")
                .then(res => res.json())
                .then(data => {
                    setStatus(data)
                    console.log("status: " + JSON.stringify(data))
                })
                .catch(error => console.error(error))
      
    }, [])
    return (
        <View>
            <Text style={styles.taskHeader}>{project.Name}</Text>
            <ScrollView horizontal>
            <FlatList data={status} renderItem={({item}) => <TaskColumn item={item} tasks={tasks}/>} numColumns={4}/>
             </ScrollView>
        </View>
    )
}

const TaskColumn = ({item, tasks}) => {
    return (
        <View style={styles.taskColumn}>
            <Text style={styles.taskColumnText}>{item.Status}</Text>
            <FlatList data={tasks.filter(i => i.Status == item.Status)} renderItem={({item}) => <Task task={item}></Task>}/>
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