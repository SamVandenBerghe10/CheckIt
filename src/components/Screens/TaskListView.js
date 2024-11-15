import React from "react"
import { View, Text, ScrollView, FlatList } from "react-native"
import { useState } from "react"
import { useEffect } from "react"
import { styles } from "../../themes/styles"


const TaskListView = ({route}) => {
    var {project} = route.params

    const [tasks, setTasks] = useState([])

    useEffect(() => {
        fetch("http://localhost:3000/tasks/project/" + project.Id)
                .then(res => res.json())
                .then(data => {
                    setTasks(data)
                    console.log("taksks: " + JSON.stringify(data))
                })
                .catch(error => console.error(error))
      
    }, [])

    const [status, setStatus] = useState([])

    useEffect(() => {
        fetch("http://localhost:3000/tasks/status/")
                .then(res => res.json())
                .then(data => {
                    setStatus(data)
                    console.log("taksks: " + JSON.stringify(data))
                })
                .catch(error => console.error(error))
      
    }, [])
    return (
        <View>
            <Text style={styles.taskHeader}>{project.Name}</Text>
            <ScrollView>
                <FlatList
                    data={tasks}
                    renderItem={({item}) => 
                        <Text>{item.Title}</Text>
                    }
                />
             </ScrollView>
        </View>
    )
}

export default TaskListView