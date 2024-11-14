import SettingsView from "./Screens/SettingsView";
import HomeScreenView from "./Screens/HomeScreenView";

import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";



const Tab = createBottomTabNavigator();

const Navigator = () => {
    return (
        <NavigationContainer>
            <Tab.Navigator>
                <Tab.Screen name="Projects" component={HomeScreenView} options={{title: 'Projects', headerShown:false}} />
                <Tab.Screen name="Settings" component={SettingsView} options={{title: 'Settings'}} />
            </Tab.Navigator>
        </NavigationContainer>
    )
}

export default Navigator