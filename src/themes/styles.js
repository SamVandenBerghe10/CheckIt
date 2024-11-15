import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      alignItems: 'center'
    },
    header: {
        fontSize: 40,
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
        borderRadius: '15px',
        
    },
    addProjectText: {
        fontWeight: 'bold',
        color: 'white',
    },
    taskHeader: {
        fontSize: 30,
        fontWeight: 'bold',
        backgroundColor: 'yellow',
        width: '50%',
        margin: '20px',
        padding: '10px',
        borderRadius: '15px',
        alignSelf: "flex-start"
    },
    taskColumn: {
        flex: 1,
        width: '300px',
        height: 'auto',
        margin: '20px',
        padding: '10px',
        borderRadius: '15px',
        backgroundColor: 'gray',
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
    taskColumnText: {
        flex: 1,
        fontWeight: 'bold',
        color: 'white',
    },
    task: {
        width: '250px',
        height: '50px',
        margin: '10px',
        padding: '10px',
        borderRadius: '15px',
        borderWidth: 1,
        backgroundColor: 'darkgray',
    }
  });