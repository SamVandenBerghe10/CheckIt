import { createContext } from 'react';
import { useState } from 'react';
import AppContent from './src/components/Screens/AppContent.js';

export default function App() {
  return (
    <ThemeProvider>
      <AppContent/>
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

export { ThemeContext };
