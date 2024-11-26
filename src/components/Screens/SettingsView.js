import React from "react"
import { View, Text, TouchableOpacity } from "react-native"
import { Switch } from "react-native"
import { useContext } from "react"
import { Button } from "react-native"
import { ThemeContext } from "../../../App"
import { styles } from "../../themes/styles"
import { FlatList } from "react-native"
import { useState } from "react"
import { useEffect } from "react"
import { TextInput } from "react-native"
import { ScrollView } from "react-native"
import ColorPicker from 'react-native-wheel-color-picker'
import { ActivityIndicator } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { postObject } from "./TaskListView"
import { ThemeStyles } from "../../themes/themeStyles"
import { Dimensions } from "react-native"
import {Picker} from '@react-native-picker/picker';
import { Platform } from "react-native"

const SettingsView = () => {
      const { isDarkMode, toggleTheme } = useContext(ThemeContext);
      const themeStyles = ThemeStyles(isDarkMode)

      const [columnsNumber, setColumns] = useState(Math.floor((Dimensions.get('window').width - (Dimensions.get('window').width/300)*30)/300))

    useEffect(() => {
        const updateNumColumns = () => {
            setColumns(Math.floor((Dimensions.get('window').width - (Dimensions.get('window').width/300)*30)/300));
        };
    
        updateNumColumns();
    
        const subscription = Dimensions.addEventListener('change', updateNumColumns);
        return () => subscription.remove();
      }, []);

      const [categories, setCategories] = useState([])
      const [addCategoryVisible, setAddCategoryVisible] = useState(false)
      const [addCategoryName, setAddCategoryName] = useState("")
      const [addCategoryDescription, setAddCategoryDescription] = useState("")
      const [addCategoryColor, setAddCategoryColor] = useState("")

    useEffect(() => {
        fetch("http://localhost:8080/categories")
                .then(res => res.json())
                .then(data => {
                    setCategories(data)
                    console.log("categories: " + JSON.stringify(data))
                })
                .catch(error => console.error(error))
      
    }, [])

    const [priorities, setPriorities] = useState([])
    const [selectedPriority, setSelectedPriority] = useState(0);

    useEffect(() => {
        fetch("http://localhost:8080/priorities")
                .then(res => res.json())
                .then(data => {
                    setPriorities(data)
                    setSelectedPriority(data.find(priority => priority.standardpriority === true)?.id)
                    console.log("priorities: " + JSON.stringify(data))
                })
                .catch(error => console.error(error))
      
    }, [])

    const [nameError, setNameError] = useState("");
    const [colorError, setColorError] = useState("");
    
    const validateCategoryPost = (category) => {
      var returnName = true
      var returnColor = true
      if(category.name.length == 0){
        returnName = false
        setNameError("name is required")
      }
      if(category.color.length == 0){
        returnColor = false
        setColorError("color is required")
      }
      return (returnName && returnColor)
    }

    return (
      <View style={[styles.container, themeStyles.container]}>
        <ScrollView style={{width:'75%'}}>
          <View style={styles.settings}>
            <Text style={[styles.settingsTitle, themeStyles.projectTile, themeStyles.projectTileName]}>Dark Mode:</Text>
            <Switch value={isDarkMode} onValueChange={toggleTheme} style={{marginLeft: 20}}/>
            <View style={styles.horizontalLine}/>
            <Text style={[styles.settingsTitle, themeStyles.projectTile, themeStyles.projectTileName]}>Categories:</Text>
              {categories.length > 0 ? (<FlatList
                data={categories}
                renderItem={({ item }) =>
                  <View style={[styles.category, themeStyles.task, {borderColor: item.color}]}>
                    <Text style={themeStyles.taskText}>{item.name}</Text>
                    <TouchableOpacity onLongPress={ () => deleteCategory(categories, setCategories, '/categories/delete/',item.id)} style={{borderColor: item.color}}>
                      <Icon name='delete'size={20} color={isDarkMode ? '#f0f0f0' : '#0a3d62'}/>
                    </TouchableOpacity>
                  </View>}
              keyExtractor={(item) => item.id} numColumns={columnsNumber} key={columnsNumber} nestedScrollEnabled/>): (<Text>No categories yet</Text>)}
              {!addCategoryVisible && <Button title="Add category" onPress={() => setAddCategoryVisible(!addCategoryVisible)} color='#1169d4'/>}
              {addCategoryVisible && <View style={[themeStyles.taskColumn, styles.addCategoryContainer]}>
              <TouchableOpacity onPress={ () =>  {
                setAddCategoryVisible(false)
                setAddCategoryName("")
                setAddCategoryDescription("")
                setAddCategoryColor("")
                setNameError("")
                setColorError("")
              }} style={{position: 'absolute', right: 5, top: 5}}>
                <Icon name='delete'size={20} color={isDarkMode ? '#0a3d62' : '#f0f0f0'}/>
            </TouchableOpacity>
              <Text style={[styles.settingsTitle, themeStyles.projectTile, themeStyles.projectTileName]}>Add a new category</Text>
              <Text style={styles.inputlabel}>Name:</Text>
              {nameError.length > 0 && <Text style={{color: 'red'}}>{nameError}</Text>}
              <TextInput placeholder="name" onChangeText={(text) => setAddCategoryName(text)} value={addCategoryName} style={styles.addProjectInput}/>
              <Text style={styles.inputlabel}>Description:</Text>
              <TextInput placeholder="description" onChangeText={(text) => setAddCategoryDescription(text)} value={addCategoryDescription} style={styles.addProjectInput}/>
              <Text style={[{borderColor: addCategoryColor}, styles.addProjectInput, styles.addCategoryText]}>Color: {addCategoryColor != "" ? addCategoryColor : "Click on a color!"}</Text>
              {colorError.length > 0 && <Text style={{color: 'red'}}>{colorError}</Text>}
              <ColorPicker
                    color={addCategoryColor}
                    swatchesOnly={true}
                    onColorChange={(color) => setAddCategoryColor(color)}
                    thumbSize={40}
                    sliderSize={40}
                    noSnap={true}
                    row={false}
                    wheelLodingIndicator={<ActivityIndicator size={40} />}
                    sliderLodingIndicator={<ActivityIndicator size={20} />}
                    useNativeDriver={false}
                    useNativeLayout={false}
                    style={{margin: 20}}
                />
                    <Button title="save" onPress={() => {
                        var temp = {id: -1, name: addCategoryName, description: addCategoryDescription, color: addCategoryColor}
                        setNameError("")
                        setColorError("")
                        if(validateCategoryPost(temp))
                        {
                          postObject(temp, setCategories, '/categories/add')
                          setAddCategoryVisible(false)
                          setAddCategoryName("")
                          setAddCategoryDescription("")
                          setAddCategoryColor("")
                        }
                    }}/>
                    </View>}
                    <View style={styles.horizontalLine}/>
                    <Text style={[styles.settingsTitle, themeStyles.projectTile, themeStyles.projectTileName]}>Standard Priority:</Text>
                    <Picker selectedValue={selectedPriority} onValueChange={(itemValue, itemIndex) => setSelectedPriority(itemValue)} style={[styles.addPicker, Platform.OS == 'ios' ? styles.addPickerIos: null, {width: 200}]}>
                      {priorities.map((priority) => (<Picker.Item label={priority.name} value={priority.id} key={priority.id}/>))}
                    </Picker>
                    <Button title='update' onPress={() => setStandardPriority(priorities, setPriorities, '/priorities/standard/', selectedPriority)} color='#1169d4'/>
            </View>   
        </ScrollView> 
      </View> 
    )
}

const deleteCategory = async (data, setState, urlExtention, id) => {
    try {
      const response = await fetch('http://localhost:8080' + urlExtention + id, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      setState((prevCategories) => prevCategories.filter((category) => category.id != id))
      console.log('Response: ', response);
      
    } catch (error) {
      console.error('Error:', error.message);
    }
  };

  const setStandardPriority = async (data, setState, urlExtention, id) => {
    try {
      const response = await fetch('http://localhost:8080' + urlExtention + id, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      setState((prevCategories) => prevCategories)
      console.log('Response: ', response);
      
    } catch (error) {
      console.error('Error:', error.message);
    }
  };

export default SettingsView