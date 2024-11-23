import React from "react"
import { SafeAreaView } from "react-native"
import Navigator from "../Navigator"
import { useContext } from "react"
import { ThemeContext } from "../../../App"
import { StyleSheet } from "react-native"
import { StatusBar } from "react-native"

export default AppContent = () => {
    const { isDarkMode, toggleTheme } = useContext(ThemeContext);
    const styles = Styles(isDarkMode);
    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle={isDarkMode ? 'light-content': 'dark-content'} backgroundColor="green"/>
            <Navigator/>
        </SafeAreaView>
    )
}

const Styles = (isDarkMode) => StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: isDarkMode ? '#232529': '#ffff',
    },
  });