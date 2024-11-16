import { Text } from "react-native";

const TaskView = ({route}) => {
    const { task } = route.params;
    return (
        <Text>{task.Title}</Text>
    )
}

export default TaskView;