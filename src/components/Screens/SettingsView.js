import React from "react"
import { View, Text, Pressable } from "react-native"
import { Switch } from "react-native"
import { useContext } from "react"
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
import { useNavigation } from "@react-navigation/native"
import { api_url } from "./AppContent"

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
      getCategories(setCategories)
    }, [])

    const [priorities, setPriorities] = useState([])
    const [selectedPriority, setSelectedPriority] = useState(0);

    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetch(api_url + "priorities")
                .then(res => res.json())
                .then(data => {
                  setLoading(false)
                  setPriorities(data)
                  setSelectedPriority(data.find(priority => priority.standardpriority === true)?.id)
                  console.log("priorities: " + JSON.stringify(data))
                })
                .catch(error => {
                  setLoading(false)
                  console.error(error)
                })
      
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

    const handleCategorySave = () => {
      var temp = {id: -1, name: addCategoryName, description: addCategoryDescription, color: addCategoryColor}
      setNameError("")
      setColorError("")
      if(validateCategoryPost(temp))
      {
        var updateCategoryLambda = () => {getCategories(setCategories)}
        postObject(temp, setCategories, 'categories/add', updateCategoryLambda)
        setAddCategoryVisible(false)
        setAddCategoryName("")
        setAddCategoryDescription("")
        setAddCategoryColor("")
      }
    }

    const handleCategorySaveCancel = () => {
      setAddCategoryVisible(false)
                setAddCategoryName("")
                setAddCategoryDescription("")
                setAddCategoryColor("")
                setNameError("")
                setColorError("")
    }
    var navigation = useNavigation()

    return (
      <View style={[styles.container, themeStyles.container]}>
        <ScrollView style={{width:'75%'}}>
          <View style={styles.settings}>
            {loading ? <ActivityIndicator size="large"/>: null}
            <Text style={[styles.settingsTitle, themeStyles.projectTile, themeStyles.projectTileName]}>Dark Mode:</Text>
            <Switch value={isDarkMode} onValueChange={toggleTheme} style={{marginLeft: 20}} accessible={true} accessibilityLabel={isDarkMode ? "disable darkmode" : "enable darkmode"} accesibilityHint="press to switch setting" accessibilityRole="switch" accessibilityValue={{min: 0, max: 1, now: isDarkMode, text: isDarkMode ? "enabled": "disabled"}}/>
            <View style={styles.horizontalLine}/>
                    <Text style={[styles.settingsTitle, themeStyles.projectTile, themeStyles.projectTileName]}>Standard Priority:</Text>
                    <Picker selectedValue={selectedPriority} onValueChange={(itemValue, itemIndex) => setSelectedPriority(itemValue)} style={[styles.addPicker, themeStyles.settingspicker, {width: 200}]}>
                      {priorities.map((priority) => (<Picker.Item label={priority.name} value={priority.id} key={priority.id} color="black"/>))}
                    </Picker>
                    <View style={{marginLeft: 20, marginBottom: 10, alignContent: 'flex-start'}}>
                      <Pressable onPress={() => setStandardPriority(priorities, setPriorities, '/priorities/standard/', selectedPriority, navigation)} style={styles.button} accessible={true} accessibilityLabel="update standard priority" accesibilityHint="Double-tap to update standard priority" accessibilityRole="button"><Text style={styles.buttonText}>update</Text></Pressable>
                    </View>
                    <View style={styles.horizontalLine}/>
            <Text style={[styles.settingsTitle, themeStyles.projectTile, themeStyles.projectTileName]}>Categories:</Text>
              {categories.length > 0 ? 
              (<ScrollView horizontal={true}><FlatList
                data={categories}
                renderItem={({ item }) =>
                  <View style={[styles.category, themeStyles.task, {borderColor: item.color}]}>
                    <Text style={themeStyles.taskText} accessible={true} accessibilityLabel={"category " + item.name} accessibilityRole="text">{item.name}</Text>
                    <Pressable onLongPress={ () => deleteCategory(setCategories, 'categories/delete/',item.id)} style={{borderColor: item.color}} accessible={true} accessibilityLabel={"delete category " + item.name} accesibilityHint="Double-tap to delete this category" accessibilityRole="button">
                      <Icon name='delete'size={20} color={isDarkMode ? '#f0f0f0' : '#0a3d62'}/>
                    </Pressable>
                  </View>}
              keyExtractor={(item) => item.id} numColumns={columnsNumber} key={columnsNumber} nestedScrollEnabled={true}/></ScrollView>): 
              (<Text>No categories yet</Text>)}
              {!addCategoryVisible && 
              <View style={{marginLeft: 20}}>
                  <Pressable onPress={() => setAddCategoryVisible(!addCategoryVisible)} style={styles.button} accessible={true} accessibilityLabel="add category" accesibilityHint="Double-tap to add a category" accessibilityRole="button"><Text style={styles.buttonText}>Add category</Text></Pressable>
              </View>}
              {addCategoryVisible && <View style={[themeStyles.taskColumn, styles.addCategoryContainer, {maxHeight: 400, marginTop: 20}]}>
              <Pressable onPress={() =>  handleCategorySaveCancel()} style={{position: 'absolute', right: 5, top: 5}} accessible={true} accessibilityLabel="remove add-category-menu" accesibilityHint="Double-tap to remove the add-category-menu" accessibilityRole="button">
                <Icon name='delete'size={20} color={isDarkMode ? '#0a3d62' : '#f0f0f0'}/>
              </Pressable>
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
                    accessible={true}
                    accessibilityLabel={"color " + addCategoryColor}
                    accessibilityRole="button"
                    accesibilityHint={"color " + addCategoryColor}
                />
              <Pressable onPress={handleCategorySave} style={[styles.button, themeStyles.task]}><Text style={[styles.buttonText, themeStyles.taskText]} accessible={true} accessibilityLabel="add new category" accesibilityHint="Double-tap to save new category" accessibilityRole="button">save</Text></Pressable>
            </View>}
            </View>   
        </ScrollView> 
      </View> 
    )
}

const getCategories = async (setCategories) => {
  fetch(api_url + "categories")
    .then(res => res.json())
    .then(data => {
      setCategories((prev) => data)
      console.log("categories: " + JSON.stringify(data))
    })
    .catch(error => console.error(error))
}

const deleteCategory = async (setState, urlExtention, id) => {
    try {
      const response = await fetch(api_url + urlExtention + id, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
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

  const setStandardPriority = async (data, setState, urlExtention, id, navigation, updatePriorityLambda) => {
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
      console.log('Response: ', response);
      navigation.navigate("Home", {screen :"Projects"})
      
    } catch (error) {
      console.error('Error:', error.message);
    }
  };

export default SettingsView