import { StyleSheet } from "react-native";
import React from "react";
import { useTheme } from "../../App";

export const ThemeStyles = (isDarkMode) => StyleSheet.create({
    container: {
      backgroundColor: isDarkMode ? '#42474f' : '#e3eefa',
    },
    header: {
        color: isDarkMode ? 'white' :'black', 
        backgroundColor: isDarkMode ? '#232529' :'#fff'
    },
    nav: {
        backgroundColor: isDarkMode ? '#232529' :'#fff'
    },
    projectTile: {
      backgroundColor: isDarkMode ? '#f0f0f0' : '#0a3d62',
    },
    projectTileName: {
      color: isDarkMode ? '#0a3d62' :'#f0f0f0', 
    },
    projectTileDescription: {
      color: isDarkMode ? '#0a3d62' :'#f0f0f0', 
      fontWeight: 300
    },
    taskColumn: {
      backgroundColor: isDarkMode ? '#f0f0f0' : '#1169d4',
    },
    task: {
      backgroundColor: isDarkMode? '#1169d4' : '#f0f0f0',
    },
    taskText: {
      color: isDarkMode ? '#f0f0f0' : '#0a3d62',
    },
    childTaskContainer: {
      backgroundColor: isDarkMode? '#1169d4' : '#f0f0f0',
    },
    rProjectTile: {
      backgroundColor: isDarkMode ? '#0a3d62' : '#f0f0f0',
    },
    rProjectTileName: {
      color: isDarkMode ? '#f0f0f0' :'#0a3d62', 
    },
  });