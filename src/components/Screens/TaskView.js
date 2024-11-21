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

const TaskView = ({route}) => {
    
    const {temp, statusList, categories, priorities} = route.params;

    const { isDarkMode, toggleTheme } = useContext(ThemeContext);

    const [task, setTask] = useState(temp);
    const [modalVisible, setModalVisible] = useState(false);
    const [modalAddVisible, setModalAddVisible] = useState(false);
    return (
        <View style={[styles.container, {backgroundColor: isDarkMode ? '#42474f' :'#fff'}]}>
            <ScrollView  style={{width: '80%'}}>
                <Text style={styles.addProjectTitle}>{task.title}</Text>
                <Text>{task.description}</Text>
                <Text>Deadline: {" " + task.deadline}</Text>
                {task.category != null ? <Text style={{borderColor: task.category.color, borderWidth: 2, borderRadius: 10}}>Category: {" " + task.category?.name}</Text> : <Text>No category selected</Text>}
                <Text>Status: {task.status}</Text>
                <Text>Priority: {task.priority.name} <PriorityIndicator priority={task.priority}/></Text>
                {task.parenttaskid != null ?<Text>Is a subtask<Icon name='account-tree' size={18} color='#000'/></Text> : null}
            </ScrollView>
            {task.childtasks?.length > 0 && (
                <View style={styles.childTask}>
                    <Text>Subtask(s):</Text>
                    <SubTask task={task} statusList={statusList} categories={categories} priorities={priorities}/>
                </View>)}
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
const SubTask = ({task, statusList, categories, priorities}) => {
    return (
        <FlatList data={task.childtasks} renderItem={({item}) => (
            <View>
                <Task task={item} statusList={statusList} categories={categories} priorities={priorities}/>
            </View>
            

        )}/>
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
                <Text>Project Title:</Text>
                <TextInput placeholder="Task Title" placeholderTextColor={"gray"} onChangeText={(text) => setTitle(text)} value={title} style={styles.addProjectInput} label/>
                <Text>Task description:</Text>
                <TextInput placeholder="Task Description" placeholderTextColor={"gray"} onChangeText={(text) => setDescription(text)} value={description} multiline numberOfLines={4} style={styles.addProjectInput}/>
                <Text>Deadline (yyyy-MM-dd HH:mm:ss):</Text>
                <TextInput placeholder="Task deadline" placeholderTextColor={"gray"} onChangeText={(text) => setDeadline(text)} value={deadline} style={styles.addProjectInput} label/>
                <Text>Status</Text>
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
                
                <Button title="Submit" onPress={handleSubmit}/>
                </ScrollView>
                
            </View>
            </TouchableWithoutFeedback>
        </TouchableOpacity>
        </View>
    );
}

const postObject = async (data, setState, urlExtention) => {
    try {
      const response = await fetch('http://192.168.0.204:8080' + urlExtention, {
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
      setState((task) => ({...task, childtasks: [...task.childtasks, result]}))
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
    const [selectedCategory, setSelectedCategory] = useState(task.category.id);
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
        setSelectedPriority(priorities[0].id)
    };

    return (
        <View style={styles.addProjectTransparant}>
            <TouchableOpacity onPress={() => setModalVisible((prevModalVisible) => false)} activeOpacity={1}>
            <TouchableWithoutFeedback>
            <View style={styles.addProjectForm}>
                <ScrollView>
                <Text style={styles.addProjectTitle}>Edit Task: "{task.title}"</Text>
                <Text>Project Title:</Text>
                <TextInput placeholder="Task Title" placeholderTextColor={"gray"} onChangeText={(text) => setTitle(text)} value={title} style={styles.addProjectInput} label/>
                <Text>Task description:</Text>
                <TextInput placeholder="Task Description" placeholderTextColor={"gray"} onChangeText={(text) => setDescription(text)} value={description} multiline numberOfLines={4} style={styles.addProjectInput}/>
                <Text>Deadline (yyyy-MM-dd HH:mm:ss):</Text>
                <TextInput placeholder="Task deadline" placeholderTextColor={"gray"} onChangeText={(text) => setDeadline(text)} value={deadline} style={styles.addProjectInput} label/>
                <Text>Status</Text>
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
                
                <Button title="UPDATE" onPress={handleSubmit}/>
                </ScrollView>
                
            </View>
            </TouchableWithoutFeedback>
        </TouchableOpacity>
        </View>
    );
}

const updateTask = async (data, setState, urlExtention, id) => {
    try {
      const response = await fetch('http://192.168.0.204:8080' + urlExtention + id, {
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
      setState((prevTasks) => result)
      console.log('Response: ', response);
      
    } catch (error) {
      console.error('Error:', error.message);
    }
  };

export default TaskView;