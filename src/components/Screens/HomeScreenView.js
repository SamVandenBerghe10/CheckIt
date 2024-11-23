import { createNativeStackNavigator }
from '@react-navigation/native-stack'

import ProjectView from './ProjectView'
import TaskListView from './TaskListView'
import TaskView from './TaskView'
import { useContext } from 'react'
import { ThemeContext } from '../../../App'
import { ThemeStyles } from '../../themes/themeStyles'

const Stack = createNativeStackNavigator()

const HomeScreenView = () => {
    const { isDarkMode, toggleTheme } = useContext(ThemeContext);
    const themeStyles = ThemeStyles(isDarkMode)
    return (
        <Stack.Navigator screenOptions={{
            headerStyle: themeStyles.nav,
            headerTintColor:isDarkMode ? '#fff' : '#000000',
            }}>
            <Stack.Group>
                <Stack.Screen name="Projects" component={ProjectView} options={{headerShown: false}} />
                <Stack.Screen name="Tasks" component={TaskListView} options={{title: 'Task'}} />
            </Stack.Group>
            <Stack.Group screenOptions={{presentation: 'modal'}}>
                <Stack.Screen name="TaskDetail" component={TaskView} options={{title: 'TaskDetail'}}/>
            </Stack.Group>
            
        </Stack.Navigator>
    )
}

export default HomeScreenView