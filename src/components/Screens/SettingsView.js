import React from "react"
import { View, Text } from "react-native"
import { Switch } from "react-native-web"
import { useContext } from "react"
import { Button } from "react-native"
import { ThemeContext } from "../../../App"
import { styles } from "../../themes/styles"

const SettingsView = () => {
      const { isDarkMode, toggleTheme } = useContext(ThemeContext);
    return (
        <View style={[styles.container, {backgroundColor: isDarkMode ? '#42474f' :'#fff'}]}>
            <Text>Dark Mode:</Text>
            <Switch value={isDarkMode} onValueChange={toggleTheme}/>
        </View>
        
    )
}

export default SettingsView