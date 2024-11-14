import React from "react"
import { View, Text, ScrollView, FlatList } from "react-native"


const TaskListView = ({route}) => {
    var array = [1,2,3,4,5,6,7,8,9,10]
    var {project} = route.params
    return (
        <View>
            <Text>TaskListView</Text>
            <Text>Project: {project}</Text>
            <ScrollView>
                <FlatList
                    data={array}
                    renderItem={({item}) => 
                        <Text>{item}</Text>
                    }
                />
             </ScrollView>
        </View>
    )
}

export default TaskListView