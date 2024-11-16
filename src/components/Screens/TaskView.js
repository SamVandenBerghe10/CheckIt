import { Text } from "react-native";
import { useContext } from "react";
import { ThemeContext } from "../../../App";
import { styles } from "../../themes/styles";
import { View } from "react-native";

const TaskView = ({route}) => {
    const { task } = route.params;
    const { isDarkMode, toggleTheme } = useContext(ThemeContext);
    return (
        <View style={[styles.container, {backgroundColor: isDarkMode ? '#42474f' :'#fff'}]}>
            <Text>{task.Title}</Text>
        </View>
        
    )
}

export default TaskView;