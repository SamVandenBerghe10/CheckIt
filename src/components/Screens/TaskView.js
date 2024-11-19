import { FlatList, Text } from "react-native";
import { useContext } from "react";
import { ThemeContext } from "../../../App";
import { styles } from "../../themes/styles";
import { View } from "react-native";
import { Task } from "./TaskListView";
import { ScrollView } from "react-native";

const TaskView = ({route}) => {
    const { task } = route.params;
    const { isDarkMode, toggleTheme } = useContext(ThemeContext);
    return (
        <View style={[styles.container, {backgroundColor: isDarkMode ? '#42474f' :'#fff'}]}>
            <ScrollView>
            <Text style={styles.addProjectTitle}>{task.title}</Text>
            <Text>{task.description}</Text>
            <Text>Deadline: {" " + task.deadline}</Text>
            {task.childtasks.length > 0 && (
                <View>
                    <Text>Subtasks:</Text>
                    <SubTask task={task}/>
                </View>
                )}
            
        </ScrollView>
        </View>
        
        
    )
}

const SubTask = ({task}) => {
    return (
        <FlatList data={task.childtasks} renderItem={({item}) => (
            <View>
                <Task task={item}/>
                {item.childtasks.length > 0 ? (
                    <SubTask task={item.childtasks}/>
                ) : null}
            </View>
            

        )}/>
    )
}

export default TaskView;