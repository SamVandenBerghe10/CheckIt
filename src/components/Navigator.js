import SettingsView from "./Screens/SettingsView";
import HomeScreenView from "./Screens/HomeScreenView";
import { useContext } from "react";
import { ThemeContext } from "../../App";
import Icon from 'react-native-vector-icons/MaterialIcons';
import { ThemeStyles } from "../themes/themeStyles";


import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";



const Tab = createBottomTabNavigator();

const Navigator = () => {
    const { isDarkMode, toggleTheme } = useContext(ThemeContext);
    const themeStyles = ThemeStyles(isDarkMode)
    return (
        <NavigationContainer>
            <Tab.Navigator screenOptions={({route}) =>({
                tabBarStyle: themeStyles.nav,
                headerStyle: themeStyles.nav,
                headerTintColor:isDarkMode ? '#fff' : '#000000',
                tabBarIcon: ({ color, size }) => {
                    let iconName;
        
                    if (route.name === 'Home') {
                      iconName = 'home';
                    } else if (route.name === 'Settings') {
                      iconName = 'settings';
                    }
        
                    return <Icon name={iconName} size={size} color={color} />;
                  },
            })}>
                <Tab.Screen name="Home" component={HomeScreenView} options={{title: 'Projects', headerShown:false}}/>
                <Tab.Screen name="Settings" component={SettingsView} options={{title: 'Settings'}} />
            </Tab.Navigator>
        </NavigationContainer>
    )
}

export default Navigator