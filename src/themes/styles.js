import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor:'#fff',
      alignItems: 'center',
    },
    container2: {
        flex: 1,
        backgroundColor:'#fff',
      },
    header: {
        fontSize: 40,
        fontWeight: 'bold',
        backgroundColor: 'green',
        width: '100%',
        alignItems: 'center',
        padding: 10
    },
    projectTileName: {
        fontWeight: 'bold',
        fontSize: 20,
        marginBottom: 5,
    },
    projectTile: {
        width: 300,
        height: 150,
        backgroundColor: 'yellow',
        margin: 15,
        borderRadius: 25,
        padding: 35,
        borderWidth: 2,
        borderColor: 'lightgrey'
    },
    addProject: {
        position: 'absolute',
        bottom: 20,
        right: 20,
        width: 50,
        height: 50,
        backgroundColor: 'green',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 15,
        
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
        margin: 20,
        padding: 10,
        borderRadius: 15,
        alignSelf: "flex-start"
    },
    taskColumn: {
        flex: 1,
        width: 300,
        height: 'auto',
        margin: 20,
        padding: 10,
        borderRadius: 15,
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
        width: 250,
        height: 50,
        margin: 10,
        padding: 10,
        borderRadius: 15,
        borderWidth: 3,
        backgroundColor: 'darkgrey',
    },
    addTask: {
        width: 250,
        height: 50,
        margin: 10,
        padding: 10,
        borderRadius: 15,
        borderWidth: 1,
        backgroundColor: 'lightgrey',
    },
    addProjectContainer: {
        flex: 1,
        alignContent: 'center',
    },
    addProjectForm: {
        margin: 20,
        marginTop: 50,
        paddingBottom: 20,
        paddingHorizontal: 30,
        backgroundColor: 'lightgray',
        width: '80%',
        borderRadius: 25,
        alignSelf: 'center',
    },
    addProjectInput: {
        backgroundColor: 'white',
        margin: 10,
        padding: 5,
        borderRadius: 15,
        borderWidth: 1,
    },
    addPicker: {
        backgroundColor: 'white',
        margin: 10,
        padding: 5,
        borderRadius: 15,
        borderWidth: 1,
    },
    addPickerIos: {
        backgroundColor: '#42474f',
        margin: 20,
    },
    addProjectTitle: {
        fontWeight: 'bold',
        color: 'white',
        margin: 10,
        padding: 5,
        fontSize: 20,
        backgroundColor: 'gray',
        borderRadius: 15,
        alignSelf: 'center'
    },
    addProjectTransparant: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
    },
    horizontalLine: {
        width: '100%',
        height: 1,
        backgroundColor: 'gray',
        marginTop: 10,
        marginBottom: 10,
      },
      category: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignSelf: 'center',
      },
      addCategoryText: {
        borderWidth: 3, 
        borderRadius: 10, 
        padding: 5,
        width: '30%'
    }
  });