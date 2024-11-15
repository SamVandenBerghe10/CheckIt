import { createNativeStackNavigator }
from '@react-navigation/native-stack'

import ProjectView from './ProjectView'
import TaskListView from './TaskListView'

const Stack = createNativeStackNavigator()

const HomeScreenView = () => {
    return (
        <Stack.Navigator>
            <Stack.Screen name="Projects" component={ProjectView} options={{headerShown: false}} />
            <Stack.Screen name="Tasks" component={TaskListView} options={{title: 'Task'}} />
        </Stack.Navigator>
    )
}

export default HomeScreenView