import { createNativeStackNavigator }
from '@react-navigation/native-stack'

import ProjectView from './ProjectView'
import TaskListView from './TaskListView'
import TaskView from './TaskView'

const Stack = createNativeStackNavigator()

const HomeScreenView = () => {
    return (
        <Stack.Navigator>
            <Stack.Screen name="Projects" component={ProjectView} options={{headerShown: false}} />
            <Stack.Screen name="Tasks" component={TaskListView} options={{title: 'Task'}} />
            <Stack.Screen name="TaskDetail" component={TaskView} options={{title: 'TaskDetail'}} />
        </Stack.Navigator>
    )
}

export default HomeScreenView