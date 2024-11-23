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
        backgroundColor: 'white',
        width: '100%',
        alignItems: 'center',
        padding: 10,
        paddingLeft: 25
    },
    projectTileName: {
        fontWeight: 'bold',
        fontSize: 20,
        marginBottom: 5,
        color: 'black'
    },
    projectTile: {
        width: 300,
        height: 150,
        margin: 15,
        borderRadius: 25,
        padding: 35,
        borderWidth: 2,
        borderColor: 'lightgrey',
    },
    addProject: {
        position: 'absolute',
        bottom: 15,
        right: 15,
        width: 50,
        height: 50,
        backgroundColor: '#1169d4',
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
        width: '50%',
        margin: 20,
        padding: 10,
        borderRadius: 15,
        alignSelf: "flex-start"
    },
    taskColumn: {
        width: 300,
        height: 'auto',
        margin: 20,
        padding: 10,
        borderRadius: 15,
        alignItems: 'center',
    },
    taskColumnText: {
        //flex: 1,
        fontWeight: 'bold',
        justifyContent: 'flex-start',
    },
    task: {
        width: 250,
        height: 50,
        margin: 10,
        padding: 10,
        borderRadius: 15,
        borderWidth: 3.5,
        backgroundColor: 'darkgrey',
    },
    addTask: {
        width: 250,
        height: 50,
        margin: 10,
        padding: 10,
        borderRadius: 15,
        borderWidth: 3.5,
        borderColor: '#0a3d62',
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
        padding: 10,
        fontSize: 20,
        backgroundColor: '#1169d4',
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
        width: 250,
        height: 50,
        margin: 10,
        padding: 10,
        borderRadius: 15,
        borderWidth: 3.5,
        backgroundColor: '#f0f0f0',
      },
      addCategoryText: {
        borderWidth: 3, 
        borderRadius: 10, 
        padding: 5,
        width: '50%',
        backgroundColor: '#f0f0f0',
    },
    childTask: {
        flex: 5,
        borderRadius: 10,
        marginTop: 10,
        height: '100%',
        marginBottom: 10
    },
    updateTask: {
        position: 'absolute',
        bottom: 15,
        left: 15,
        width: 50,
        height: 50,
        backgroundColor: '#1169d4',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 15,
    },
    inputlabel: {
        fontWeight: 500
    },
    settings: {
        alignItems: 'flex-start'
    },
    settingsTitle: {
        fontWeight: 'bold',
        color: 'white',
        margin: 10,
        padding: 10,
        fontSize: 20,
        backgroundColor: '#1169d4',
        borderRadius: 15,
    },
    addCategoryContainer: {
        borderRadius: 15,
        paddingHorizontal: 20,
        marginBottom: 10,
        paddingBottom: 10,
        alignSelf: 'center'
    },
    taskDetailContainer: {
        width: '80%',
        margin: 30,
        borderRadius: 20,
        padding: 10
    },
    taskDetailInfo: {
        height: 240,
        borderRadius: 10,
        padding: 10,
    },
    taskDetailInfoIndividual:
    {
        marginLeft: 5,
        margin: 3
    },
    taskDetailCategory: {
        borderWidth: 2, 
        borderRadius: 10, 
        width: 100, 
        padding: 3
    }
  });