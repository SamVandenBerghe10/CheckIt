import React from "react"
import { View, Text, ScrollView, FlatList } from "react-native"


const TaskListView = () => {
    var array = [1,2,3,4,5,6,7,8,9,10]
    return (
        <View>
            <Text>TaskListView</Text>
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