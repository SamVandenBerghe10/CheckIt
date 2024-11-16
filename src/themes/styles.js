import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      alignItems: 'center',
    },
    header: {
        fontSize: 40,
        fontWeight: 'bold',
        backgroundColor: 'green',
        width: '100%',
        alignItems: 'center',
        padding: "10px"
    },
    projectTileName: {
        fontWeight: 'bold',
        fontSize: 20,
        marginBottom: "5px",
    },
    projectTile: {
        width: '300px',
        height: '150px',
        backgroundColor: 'yellow',
        margin: '15px',
        borderRadius: '25px',
        padding: "35px",
        borderWidth: 2,
        borderColor: 'lightgrey'
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
        backgroundColor: 'darkgrey',
    },
    addTask: {
        width: '250px',
        height: '50px',
        margin: '10px',
        padding: '10px',
        borderRadius: '15px',
        borderWidth: 1,
        backgroundColor: 'lightgrey',
    },
    addProjectContainer: {
        flex: 1,
        margin: '20px',
        paddingBottom: '20px',
        paddingHorizontal: '30px',
        backgroundColor: 'lightgray',
        width: '40%',
        alignSelf: 'center',
        justifyContent: 'center',
        borderRadius: '25px',
    },
    addProjectInput: {
        backgroundColor: 'white',
        margin: '10px',
        padding: '5px',
        borderRadius: '15px',
        borderWidth: 1,
    },
    addProjectTitle: {
        fontWeight: 'bold',
        color: 'white',
        margin: '10px',
        padding: '5px',
        fontSize: 20,
        backgroundColor: 'gray',
        borderRadius: '15px',
        alignSelf: 'center'
    },
    addProjectTransparant: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        height: "auto",
        justifyContent: 'center',
    }
  });