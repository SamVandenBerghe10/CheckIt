import { createNativeStackNavigator }
from '@react-navigation/native-stack'

import ProjectView from './ProjectView'
import TaskListView from './TaskListView'
import TaskView from './TaskView'
import { useContext } from 'react'
import { ThemeContext } from '../../../App'
import { ThemeStyles } from '../../themes/themeStyles'
import { AccessibilityInfo } from 'react-native'
import { useState } from 'react'
import { useEffect } from 'react'

const Stack = createNativeStackNavigator()

const HomeScreenView = () => {
    const { isDarkMode, toggleTheme } = useContext(ThemeContext);
    const themeStyles = ThemeStyles(isDarkMode)

    const [isVoiceOverEnabled, setIsVoiceOverEnabled] = useState(false);

    useEffect(() => {
      AccessibilityInfo.isScreenReaderEnabled().then((enabled) => setIsVoiceOverEnabled(enabled))
    }, []);
    return (
        <Stack.Navigator screenOptions={{
            headerStyle: themeStyles.nav,
            headerTintColor:isDarkMode ? '#fff' : '#000000',
            }}>
            <Stack.Group>
                <Stack.Screen name="Projects" component={ProjectView} options={{headerShown: false}} />
                <Stack.Screen name="Tasks" component={TaskListView} options={{title: 'Project'}} />
            </Stack.Group>
            <Stack.Group screenOptions={{presentation: isVoiceOverEnabled ? 'card' : 'modal'}}>
                <Stack.Screen name="TaskDetail" component={TaskView} options={{title: 'Task'}}/>
                <Stack.Screen name="SubTaskDetail" component={TaskView} options={{title: 'SubTask'}}/>
            </Stack.Group>
            
        </Stack.Navigator>
    )
}

export default HomeScreenView