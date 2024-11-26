import { FlatList, Text } from "react-native";
import { useContext } from "react";
import { ThemeContext } from "../../../App";
import { styles } from "../../themes/styles";
import { View } from "react-native";
import { Task } from "./TaskListView";
import { ScrollView } from "react-native";
import { PriorityIndicator } from "./TaskListView";
import { useState, useEffect } from "react"
import { TouchableOpacity } from "react-native";
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Modal } from "react-native";
import { TouchableWithoutFeedback } from "react-native";
import { TextInput } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { Platform } from "react-native";
import { Button } from "react-native";
import moment from "moment";
import { ThemeStyles } from "../../themes/themeStyles";
import { Dimensions } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useFocusEffect } from "@react-navigation/native";
import { useCallback } from "react";

const TaskView = ({route}) => {
    
    const {temp, statusList, categories, priorities} = route.params;

    const { isDarkMode, toggleTheme } = useContext(ThemeContext);
    const themeStyles = ThemeStyles(isDarkMode)

    const [task, setTask] = useState(temp);

    useFocusEffect(
        useCallback(() => {
        fetch("http://localhost:8080/tasks/" + task.id)
                .then(res => res.json())
                .then(data => {
                    setTask(data)
                    console.log("task: " + JSON.stringify(data))
                })
                .catch(error => console.error(error))
      
    }, []))

    const [modalVisible, setModalVisible] = useState(false);
    const [modalAddVisible, setModalAddVisible] = useState(false);
    const navigation = useNavigation()
    const handleDelete = (task, navigation) => {

        deleteTask(task, navigation);
    }
    return (
        <View style={[styles.container, themeStyles.container]}>
            <ScrollView style={[styles.taskDetailContainer, themeStyles.projectTile]}>
            <TouchableOpacity onLongPress={ () => handleDelete(task, navigation)} style={{position: 'absolute', right: 5, top: 5}}>
                <Icon name='delete'size={20} color={isDarkMode ? '#0a3d62' : '#f0f0f0'}/>
            </TouchableOpacity>
            <Text style={[styles.addProjectTitle, themeStyles.rProjectTile, themeStyles.rProjectTileName]}>{task.title}</Text>
                <View style={[styles.taskDetailInfo ,themeStyles.childTaskContainer]}>
                    <Text style={[styles.inputlabel, themeStyles.taskText]}>Description:</Text>
                    <Text style={[themeStyles.taskText, styles.taskDetailInfoIndividual]}>{task.description}</Text>
                    <Text style={[styles.inputlabel, themeStyles.taskText]}>Deadline:</Text>
                    <Text style={[themeStyles.taskText, styles.taskDetailInfoIndividual]}>{task.deadline}</Text>
                    {task.category != null ? 
                        <View>
                            <Text style={[styles.inputlabel, themeStyles.taskText]}>Category:</Text> 
                            <Text style={[{borderColor: task.category?.color}, themeStyles.taskText, styles.taskDetailInfoIndividual]}>{" " + task.category?.name}</Text>
                        </View>
                        : <Text style={[themeStyles.taskText, styles.taskDetailInfoIndividual]}>No category selected</Text>}
                    <Text style={[styles.inputlabel, themeStyles.taskText]}>Status:</Text>
                    <Text style={[themeStyles.taskText, styles.taskDetailInfoIndividual]}>{task.status}</Text>
                    <Text style={[styles.inputlabel, themeStyles.taskText]}>Priority:</Text>
                    <Text style={[themeStyles.taskText, styles.taskDetailInfoIndividual]}>{task.priority.name} <PriorityIndicator priority={task.priority}/></Text>
                    {task.parenttaskid != null ?<Text style={themeStyles.taskText}>-is a subtask<Icon name='account-tree' size={18} color={themeStyles.taskText}/></Text> : null}
                </View>
                {task.childtasks?.length > 0 && (
                <View style={[styles.childTask, themeStyles.childTaskContainer]}>
                    <Text style={[themeStyles.rProjectTileName, {paddingTop: 10, paddingLeft: 10}]}>Subtask(s):</Text>
                    <SubTask task={task} statusList={statusList} categories={categories} priorities={priorities}/>
                </View>)}
            </ScrollView>
            
            <TouchableOpacity onPress={() => setModalAddVisible(true)} style={styles.addProject}>
                <Icon name='add-circle' color='white' size={20}/>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setModalVisible(true)} style={styles.updateTask}>
                <Icon name='edit' color='white' size={20}/>
            </TouchableOpacity>
            <Modal visible={modalVisible} animationType="fade" transparent={true} >
                <EditTask task={task} status={task.status} setModalVisible={setModalVisible} project={task.project} statusList={statusList} categories={categories} priorities={priorities} setTask={setTask}/>
            </Modal> 
            <Modal visible={modalAddVisible} animationType="fade" transparent={true} >
                <AddTask parenttask={task} status={task.status} setModalVisible={setModalAddVisible} project={task.project} statusList={statusList} categories={categories} priorities={priorities} setTasks={setTask}/>
            </Modal> 
        </View>
        
        
    )
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
        <FlatList data={task.childtasks} renderItem={({item}) => (
            <Task task={item} statusList={statusList} categories={categories} priorities={priorities} onGoBack={onGoBack}/>
        )} numColumns={columnsNumber} key={columnsNumber}/>
    )
}

const AddTask = ({parenttask, status, setModalVisible, project, statusList, categories, priorities, setTasks}) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [deadline, setDeadline] = useState('');
    const [selectedStatus, setSelectedStatus] = useState(status);
    const [selectedCategory, setSelectedCategory] = useState("");
    const [selectedPriority, setSelectedPriority] = useState(priorities[0].id);

    const handleSubmit = () => {
        var temp ={id: -1, title: title, description: description, deadline: deadline, status: selectedStatus, projectid: project.id, categoryid: selectedCategory, priorityid: selectedPriority, childtasks: [], parenttaskid: parenttask.id}
        postObject(temp, setTasks, '/tasks/add')
        setModalVisible((prevModalVisible) => false)
        setTitle('')
        setDescription('')
        setDeadline('')
        setSelectedStatus(status)
        setSelectedCategory("")
        setSelectedPriority(priorities[0].id)
    };

    return (
        <View style={styles.addProjectTransparant}>
            <TouchableOpacity onPress={() => setModalVisible((prevModalVisible) => false)} activeOpacity={1}>
            <TouchableWithoutFeedback>
            <View style={styles.addProjectForm}>
                <ScrollView>
                <Text style={styles.addProjectTitle}>Add new SubTask to "{parenttask.title}"</Text>
                <Text style={styles.inputlabel}>Project Title:</Text>
                <TextInput placeholder="title" placeholderTextColor={"gray"} onChangeText={(text) => setTitle(text)} value={title} style={styles.addProjectInput} label/>
                <Text style={styles.inputlabel}>Task description:</Text>
                <TextInput placeholder="description" placeholderTextColor={"gray"} onChangeText={(text) => setDescription(text)} value={description} multiline numberOfLines={4} style={styles.addProjectInput}/>
                <Text style={styles.inputlabel}>Deadline (yyyy-MM-dd HH:mm:ss):</Text>
                <TextInput placeholder="deadline" placeholderTextColor={"gray"} onChangeText={(text) => setDeadline(text)} value={deadline} style={styles.addProjectInput} label/>
                <Text style={styles.inputlabel}>Status</Text>
                <Picker selectedValue={selectedStatus} onValueChange={(itemValue, itemIndex) => setSelectedStatus(itemValue)} style={[styles.addPicker, Platform.OS == 'ios' ? styles.addPickerIos: null]}>
                    {statusList.map((statusItem) => (<Picker.Item label={statusItem} value={statusItem} key={statusItem}/>))}
                </Picker>
                <Text style={styles.inputlabel}>Category</Text>
                <Picker selectedValue={selectedCategory} onValueChange={(itemValue, itemIndex) => setSelectedCategory(itemValue)} style={[styles.addPicker, Platform.OS == 'ios' ? styles.addPickerIos: null]}>
                    {categories.map((category) => (<Picker.Item label={category.name} value={category.id} key={category.id}/>))}
                </Picker>
                <Text style={styles.inputlabel}>Priority</Text>
                <Picker selectedValue={selectedPriority} onValueChange={(itemValue, itemIndex) => setSelectedPriority(itemValue)} style={[styles.addPicker, Platform.OS == 'ios' ? styles.addPickerIos: null]}>
                    {priorities.map((priority) => (<Picker.Item label={priority.name} value={priority.id} key={priority.id}/>))}
                </Picker>
                
                <Button title="add subtask" onPress={handleSubmit}/>
                </ScrollView>
                
            </View>
            </TouchableWithoutFeedback>
        </TouchableOpacity>
        </View>
    );
}

const postObject = async (data, setState, urlExtention) => {
    try {
      const response = await fetch('http://localhost:8080' + urlExtention, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json()
      setState((task) => ({...task, childtasks: [...task.childtasks || [], result]}))
      console.log('Response: ', response);
      
    } catch (error) {
      console.error('Error:', error.message);
    }
  };

const EditTask = ({task, status, setModalVisible, project, statusList, categories, priorities, setTask}) => {
    const [title, setTitle] = useState(task.title);
    const [description, setDescription] = useState(task.description);
    const [deadline, setDeadline] = useState(moment(task.deadline).format('YYYY-MM-DD HH:mm:ss'));
    const [selectedStatus, setSelectedStatus] = useState(status);
    const [selectedCategory, setSelectedCategory] = useState(task.category?.id);
    const [selectedPriority, setSelectedPriority] = useState(task.priority.id);

    const handleSubmit = () => {
        var temp ={id: -1, title: title, description: description, deadline: deadline, status: selectedStatus, projectid: project.id, categoryid: selectedCategory, priorityid: selectedPriority, parenttaskid: task.parenttaskid}
        updateTask(temp, setTask, '/tasks/update/', task.id)
        setModalVisible((prevModalVisible) => false)
        setTitle('')
        setDescription('')
        setDeadline('')
        setSelectedStatus(status)
        setSelectedCategory("")
        setSelectedPriority(priorities.find(priority => priority.standardpriority === true)?.id)
    };

    return (
        <View style={styles.addProjectTransparant}>
            <TouchableOpacity onPress={() => setModalVisible((prevModalVisible) => false)} activeOpacity={1}>
            <TouchableWithoutFeedback>
            <View style={styles.addProjectForm}>
                <ScrollView>
                <Text style={styles.addProjectTitle}>Edit Task: "{task.title}"</Text>
                <Text style={styles.inputlabel}>Project Title:</Text>
                <TextInput placeholder="Task Title" placeholderTextColor={"gray"} onChangeText={(text) => setTitle(text)} value={title} style={styles.addProjectInput} label/>
                <Text style={styles.inputlabel}>Task description:</Text>
                <TextInput placeholder="Task Description" placeholderTextColor={"gray"} onChangeText={(text) => setDescription(text)} value={description} multiline numberOfLines={4} style={styles.addProjectInput}/>
                <Text style={styles.inputlabel}>Deadline (yyyy-MM-dd HH:mm:ss):</Text>
                <TextInput placeholder="Task deadline" placeholderTextColor={"gray"} onChangeText={(text) => setDeadline(text)} value={deadline} style={styles.addProjectInput} label/>
                <Text style={styles.inputlabel}>Status</Text>
                <Picker selectedValue={selectedStatus} onValueChange={(itemValue, itemIndex) => setSelectedStatus(itemValue)} style={[styles.addPicker, Platform.OS == 'ios' ? styles.addPickerIos: null]}>
                    {statusList.map((statusItem) => (<Picker.Item label={statusItem} value={statusItem} key={statusItem}/>))}
                </Picker>
                <Text>Category</Text>
                <Picker selectedValue={selectedCategory} onValueChange={(itemValue, itemIndex) => setSelectedCategory(itemValue)} style={[styles.addPicker, Platform.OS == 'ios' ? styles.addPickerIos: null]}>
                    {categories.map((category) => (<Picker.Item label={category.name} value={category.id} key={category.id}/>))}
                </Picker>
                <Text>Priority</Text>
                <Picker selectedValue={selectedPriority} onValueChange={(itemValue, itemIndex) => setSelectedPriority(itemValue)} style={[styles.addPicker, Platform.OS == 'ios' ? styles.addPickerIos: null]}>
                    {priorities.map((priority) => (<Picker.Item label={priority.name} value={priority.id} key={priority.id}/>))}
                </Picker>
                
                <Button title="update task" onPress={handleSubmit}/>
                </ScrollView>
                
            </View>
            </TouchableWithoutFeedback>
        </TouchableOpacity>
        </View>
    );
}

const updateTask = async (data, setState, urlExtention, id) => {
    try {
      const response = await fetch('http://localhost:8080' + urlExtention + id, {
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

  const deleteTask = async (task, navigation) => {
    try {
        console.log("delete task: " + task.id)
        const response = await fetch('http://localhost:8080/tasks/delete/' + task.id, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
        });
    
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        console.log('Response: ', response);
        navigation.goBack()
        
      } catch (error) {
        console.error('Error:', error.message);
      }
  }

export default TaskView;