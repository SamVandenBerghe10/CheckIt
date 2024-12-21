import { FlatList, Pressable, Text } from "react-native";
import { useContext } from "react";
import { ThemeContext } from "../../../App";
import { styles } from "../../themes/styles";
import { View } from "react-native";
import { Task } from "./TaskListView";
import { ScrollView } from "react-native";
import { PriorityIndicator } from "./TaskListView";
import { useState, useEffect } from "react"
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Modal } from "react-native";
import { TextInput } from "react-native";
import { Picker } from "@react-native-picker/picker";
import moment from "moment";
import { ThemeStyles } from "../../themes/themeStyles";
import { Dimensions } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useFocusEffect } from "@react-navigation/native";
import { useCallback } from "react";
import { AddTask } from "./TaskListView";
import { ActivityIndicator } from "react-native"
import { api_url } from "./AppContent";

const TaskView = ({route}) => {
    
    const {temp, statusList, tempCategories, priorities} = route.params;

    const { isDarkMode, toggleTheme } = useContext(ThemeContext);
    const themeStyles = ThemeStyles(isDarkMode)

    const [task, setTask] = useState(temp);
    const [categories, setCategories] = useState(tempCategories);

    const [loading, setLoading] = useState(true)

    useFocusEffect(
        useCallback(() => {
        fetch(api_url + "tasks/" + task.id)
                .then(res => res.json())
                .then(data => {
                    setLoading(false)
                    setTask(data)
                    console.log("task: " + JSON.stringify(data))
                })
                .catch(error => {
                    setLoading(false)
                    console.error(error)
                })

        fetch(api_url + "categories")
                .then(res => res.json())
                .then(data => {
                    var temp = [{id: 99999999, name: ""}, ...data]
                    setCategories(temp)
                    console.log("categories: " + JSON.stringify(temp))
                })
                .catch(error => console.error(error))
      
    }, []))

    useFocusEffect(
        useCallback(() => {
        
    }, []))

    const [modalVisible, setModalVisible] = useState(false);
    const [modalAddVisible, setModalAddVisible] = useState(false);
    const navigation = useNavigation()
    const updateTaskLambda = () => {getTask(setTask, task)}

    var color = isDarkMode ? '#f0f0f0' : '#0a3d62'
    var dateObject = new Date(Date.parse(task.deadline))
    var now = new Date()
    if((dateObject - now) / (1000 * 60 * 60 * 24) < 1)
    {
        
        color = "#f2c213"
    }
    if(dateObject - now < 0)
    {
        color = "red"
    }

    return (
        <View style={[styles.container, themeStyles.container]}>
            <ScrollView style={[styles.taskDetailContainer, themeStyles.projectTile]}>
            <Pressable onLongPress={ () => deleteTask(task, navigation, setLoading)} style={{position: 'absolute', right: 5, top: 5}} accessible={true} accessibilityLabel="delete task" accesibilityHint="Double-tap to delete this task" accessibilityRole="button">
                <Icon name='delete'size={20} color={isDarkMode ? '#0a3d62' : '#f0f0f0'}/>
            </Pressable>
            <Text style={[styles.addProjectTitle, themeStyles.rProjectTile, themeStyles.rProjectTileName]} accessible={true} accessibilityLabel={"task " + task.title} accessibilityRole="header">{task.title}</Text>
            {loading ? <ActivityIndicator size="large"/>: null}
                <View style={[styles.taskDetailInfo ,themeStyles.childTaskContainer]}>
                    <Text style={[styles.inputlabel, themeStyles.taskText]}>Description:</Text>
                    {task.description?.length > 0 ? <Text style={[themeStyles.taskText, styles.taskDetailInfoIndividual]}>{task.description}</Text> : <Text style={[themeStyles.taskText, styles.taskDetailInfoIndividual]}>No description</Text>}
                    <Text style={[styles.inputlabel, themeStyles.taskText]}>Deadline:</Text>
                    <Text style={[styles.taskDetailInfoIndividual, {color: color}]}>{new Date(task.deadline).toDateString()}</Text>
                    <Text style={[styles.inputlabel, themeStyles.taskText]}>Category:</Text> 
                    {task.category != null ? 
                        <View>
                            <Text style={[{borderColor: task.category?.color}, themeStyles.taskText, styles.taskDetailInfoIndividual]}>{" " + task.category?.name}</Text>
                        </View>
                        : <Text style={[themeStyles.taskText, styles.taskDetailInfoIndividual]}>No category selected</Text>}
                    <Text style={[styles.inputlabel, themeStyles.taskText]}>Status:</Text>
                    <Text style={[themeStyles.taskText, styles.taskDetailInfoIndividual]}>{task.status}</Text>
                    <Text style={[styles.inputlabel, themeStyles.taskText]}>Priority:</Text>
                    <Text style={[themeStyles.taskText, styles.taskDetailInfoIndividual]}>{task.priority.name} <PriorityIndicator priority={task.priority}/></Text>
                    {task.parenttaskid != null ?<Text style={themeStyles.taskText}><Text style={[styles.inputlabel, themeStyles.taskText]}>Subtask:</Text> is a subtask <Icon name='account-tree' size={18} color={themeStyles.taskText}/></Text> : null}
                </View>
                {task.childtasks?.length > 0 && (
                <View style={[styles.childTask, themeStyles.childTaskContainer]}>
                    <Text style={[themeStyles.rProjectTileName, {paddingTop: 10, paddingLeft: 10}]}>Subtask(s):</Text>
                    <SubTask task={task} statusList={statusList} categories={categories} priorities={priorities}/>
                </View>)}
            </ScrollView>
            
            <Pressable onPress={() => setModalAddVisible(true)} style={styles.addProject} accessible={true} accessibilityLabel="Add subtask" accesibilityHint="Double tap to add a subtask" accessibilityRole="button">
                <Icon name='add-circle' color='white' size={20}/>
            </Pressable>
            <Pressable onPress={() => setModalVisible(true)} style={styles.updateTask} accessible={true} accessibilityLabel="Edit current task" accesibilityHint="Double tap to edit current task" accessibilityRole="button">
                <Icon name='edit' color='white' size={20}/>
            </Pressable>
            <Modal visible={modalVisible} animationType="fade" transparent={true} onRequestClose={() => setModalVisible(false)}>
                <EditTask task={task} status={task.status} setModalVisible={setModalVisible} project={task.project} statusList={statusList} categories={categories} priorities={priorities} setTask={setTask}/>
            </Modal> 
            <Modal visible={modalAddVisible} animationType="fade" transparent={true} onRequestClose={() => setModalAddVisible(false)}>
                <AddTask parenttask={task} status={task.status} setModalVisible={setModalAddVisible} project={task.project} statusList={statusList} categories={categories} priorities={priorities} setTasks={setTask} titleText={'Add new Subtask to "' + task.title + '"'} updateTaskLambda={updateTaskLambda}/>
            </Modal> 
        </View>
        
        
    )
}

const getTask = (setTask, task) => {
    fetch(api_url + "tasks/" + task.id)
                .then(res => res.json())
                .then(data => {
                    setTask(data)
                    console.log("task: " + JSON.stringify(data))
                })
                .catch(error => console.error(error))
}

//{item.childtasks?.length > 0 ? (<SubTask task={item} />) : null}
const SubTask = ({task, statusList, categories, priorities, onGoBack}) => {
    const [columnsNumber, setColumns] = useState(Math.floor((Dimensions.get('window').width - (Dimensions.get('window').width/300)*30)/300))

    useEffect(() => {
        const updateNumColumns = () => {
            setColumns(Math.floor((Dimensions.get('window').width - (Dimensions.get('window').width/300)*30)/300));
        };
    
        updateNumColumns();
    
        const subscription = Dimensions.addEventListener('change', updateNumColumns);
        return () => subscription.remove();
      }, []);

    return (
        <ScrollView horizontal={true}>
            <FlatList data={task.childtasks} renderItem={({item}) => (
                <Task task={item} statusList={statusList} categories={categories} priorities={priorities} onGoBack={onGoBack}/>
            )} numColumns={columnsNumber} key={columnsNumber}/>
        </ScrollView>
        
    )
}

const EditTask = ({task, status, setModalVisible, project, statusList, categories, priorities, setTask}) => {
    const [title, setTitle] = useState(task.title);
    const [description, setDescription] = useState(task.description);
    const [deadline, setDeadline] = useState(moment(task.deadline).format('YYYY-MM-DD HH:mm:ss'));
    const [selectedStatus, setSelectedStatus] = useState(status);
    const [selectedCategory, setSelectedCategory] = useState(task.category?.id);
    const [selectedPriority, setSelectedPriority] = useState(task.priority.id);

    const [titleError, setTitleError] = useState("");
    const [deadlineError, setDeadlineError] = useState("");

    const [loading, setLoading] = useState(true);
    
        useEffect(() => {
            if(priorities.length > 0){
                setLoading(false)
            }
        }, [priorities.length])

    const handleSubmit = async () => {
        var temp ={id: -1, title: title, description: description, deadline: deadline, status: selectedStatus, projectid: project.id, categoryid: selectedCategory == 99999999 ? null: selectedCategory, priorityid: selectedPriority, parenttaskid: task.parenttaskid}
        setTitleError("")
        setDeadlineError("")
        if(validateTaskPost(temp)){
            setLoading(true)
            await updateTask(temp, setTask, '/tasks/update/', task.id)
            setLoading(false)
            setModalVisible((prevModalVisible) => false)
            setTitle('')
            setDescription('')
            setDeadline('')
            setSelectedStatus(status)
            setSelectedCategory("")
            setSelectedPriority(priorities.find(priority => priority.standardpriority === true)?.id)
        }
    };

    const validateTaskPost = (task) => {
        var returnTitle = true
        var returnDeadline = true
        const date = new Date(task.deadline)
        const regex = /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/;
        if(task.title.length == 0){
            returnTitle = false
          setTitleError("title is required")
        }
        if(isNaN(date.getTime()) || !regex.test(task.deadline)){
            returnDeadline = false
            setDeadlineError("deadline must be (yyyy-MM-dd HH:mm:ss)")
        }
        if(task.deadline.length == 0){
            returnDeadline = false
          setDeadlineError("deadline is required")
        }
        return (returnTitle && returnDeadline)
      }

    return (
        <View style={styles.addProjectTransparant} accessible={false} importantForAccessibility="no-hide-descendants">
            <Pressable onPress={() => setModalVisible((prevModalVisible) => false)} style={{flex: 1, justifyContent: 'center', maxHeight: 720}} accessible={false} importantForAccessibility="no">
            <ScrollView style={styles.addProjectForm} accessible={false} importantForAccessibility="no">
                <Pressable accessible={false} importantForAccessibility="no">
                <Text style={styles.addProjectTitle} accessible={true} accessibilityLabel={"Edit Task: " + task.title} accessibilityRole="header">Edit Task: "{task.title}"</Text>
                {loading ? <ActivityIndicator size="small"/>: null}
                <Text style={styles.inputlabel } accessible={true} accessibilityLabel="task title" accessibilityRole="text">Title:</Text>
                {titleError.length > 0 && <Text style={{color: 'red'}} accessible={true} accessibilityLabel={"title-error " + titleError} accessibilityRole="alert">{titleError}</Text>}
                <TextInput placeholder="Task Title" placeholderTextColor={"gray"} onChangeText={(text) => setTitle(text)} value={title} style={styles.addProjectInput} label/>
                <Text style={styles.inputlabel} accessible={true} accessibilityLabel="task description" accessibilityRole="text">Description:</Text>
                <TextInput placeholder="Task Description" placeholderTextColor={"gray"} onChangeText={(text) => setDescription(text)} value={description} multiline numberOfLines={4} style={styles.addProjectInput}/>
                <Text style={styles.inputlabel} accessible={true} accessibilityLabel="task deadline" accessibilityRole="text">Deadline (yyyy-MM-dd HH:mm:ss):</Text>
                {deadlineError.length > 0 && <Text style={{color: 'red'}} accessible={true} accessibilityLabel={"deadline-error " + deadlineError} accessibilityRole="text">{deadlineError}</Text>}
                <TextInput placeholder="Task deadline" placeholderTextColor={"gray"} onChangeText={(text) => setDeadline(text)} value={deadline} style={styles.addProjectInput} label/>
                <Text style={styles.inputlabel} accessible={true} accessibilityLabel="task status" accessibilityRole="text">Status</Text>
                <Picker selectedValue={selectedStatus} onValueChange={(itemValue, itemIndex) => setSelectedStatus(itemValue)} style={[styles.addPicker]}>
                    {statusList.map((statusItem) => (<Picker.Item label={statusItem} value={statusItem} key={statusItem} color="black"/>))}
                </Picker>
                <Text style={styles.inputlabel} accessible={true} accessibilityLabel="task category" accessibilityRole="text">Category</Text>
                <Picker selectedValue={selectedCategory} onValueChange={(itemValue, itemIndex) => setSelectedCategory(itemValue)} style={[styles.addPicker]}>
                    {categories.map((category) => (<Picker.Item label={category.name} value={category.id} key={category.id} color="black"/>))}
                </Picker>
                <Text style={styles.inputlabel} accessible={true} accessibilityLabel="task priority" accessibilityRole="text">Priority</Text>
                <Picker selectedValue={selectedPriority} onValueChange={(itemValue, itemIndex) => setSelectedPriority(itemValue)} style={[styles.addPicker]}>
                    {priorities.map((priority) => (<Picker.Item label={priority.name} value={priority.id} key={priority.id} color="black"/>))}
                </Picker>
                <Pressable onPress={handleSubmit} style={styles.button}><Text style={styles.buttonText} accessible={true} accessibilityLabel="update task" accessibilityHint="Double-tap to update task" accessibilityRole="button">update task</Text></Pressable>
                <Pressable onPress={() => setModalVisible(false)} style={{alignSelf: "center"}} accessible={true} accessibilityLabel="remove edit-task-menu" accessibilityHint="Double-tap to remove edit-task-menu" accessibilityRole="button">
                    <Icon name='keyboard-arrow-down'size={30} color='#0a3d62'/>
                </Pressable>
                </Pressable>
            </ScrollView>
        </Pressable>
        </View>
    );
}

const updateTask = async (data, setState, urlExtention, id) => {
    try {
      const response = await fetch(api_url + urlExtention + id, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const result = await response.json()
      setState((prevTasks) => result)
      console.log('Response: ', response);
      
    } catch (error) {
      console.error('Error:', error.message);
    }
  };

  const deleteTask = async (task, navigation, setLoading) => {
    setLoading(true)
    try {
        console.log("delete task: " + task.id)
        const response = await fetch(api_url + "tasks/delete/" + task.id, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
        });
    
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        setLoading(false)
        console.log('Response: ', response);
        navigation.goBack()
        
      } catch (error) {
        setLoading(false)
        console.error('Error:', error.message);
      }
  }

export default TaskView;