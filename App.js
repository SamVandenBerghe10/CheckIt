import { StatusBar } from 'expo-status-bar';
import { StyleSheet } from 'react-native';
import Navigator from './src/components/Navigator.js';
import { SafeAreaView } from 'react-native';
import { createContext } from 'react';
import { useState } from 'react';

export default function App() {
  return (
    <ThemeProvider>
      <SafeAreaView style={styles.container}>
        <StatusBar style="auto" />
        <Navigator/>
      </SafeAreaView>
    </ThemeProvider>
    
  );
}

const ThemeContext = createContext({
  isDarkMode: false,
  toggleTheme: () => {},
});

const ThemeProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleTheme }}>
      {children}
    </ThemeContext.Provider>

  );
};

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});



export { ThemeContext };
