import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      alignItems: 'center'
    },
    header: {
        fontSize: '300%',
        fontWeight: 'bold',
        backgroundColor: 'green',
        width: '100%',
        alignItems: 'center'
    },
    projectTileContainer: {
    },
    projectTile: {
        width: '300px',
        height: '150px',
        backgroundColor: 'yellow',
        margin: '15px',
        borderRadius: '25px',
        padding: "15px"
    },
    addProject: {
        position: 'absolute',
        bottom: '20px',
        right: '20px',
        width: '50px',
        height: '50px',
        backgroundColor: 'green',
        alignItems: 'center',
        justifyContent: 'center',
        
    },
    addProjectText: {
        fontWeight: 'bold',
        color: 'white',
    }
  });