import React from "react"
import { View, Text } from "react-native"
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

const SettingsView = () => {
      const { isDarkMode, toggleTheme } = useContext(ThemeContext);

      const [categories, setCategories] = useState([])
      const [addCategoryVisible, setAddCategoryVisible] = useState(false)
      const [addCategoryName, setAddCategoryName] = useState("")
      const [addCategoryDescription, setAddCategoryDescription] = useState("")
      const [addCategoryColor, setAddCategoryColor] = useState("")

    useEffect(() => {
        fetch("http://192.168.0.101:3000/categories")
                .then(res => res.json())
                .then(data => {
                    setCategories(data)
                    console.log("categories: " + JSON.stringify(data))
                })
                .catch(error => console.error(error))
      
    }, [])
    return (
        <View style={[styles.container, {backgroundColor: isDarkMode ? '#42474f' :'#fff'}]}>
            <ScrollView style={{width:'75%'}}>
                <Text style={styles.addProjectTitle}>Dark Mode:</Text>
                <Switch value={isDarkMode} onValueChange={toggleTheme}/>
                <View style={styles.horizontalLine}/>
                <Text style={styles.addProjectTitle}>Categories:</Text>
                <FlatList
                    data={categories}
                    renderItem={({ item }) =>
                    <View style={[styles.category, styles.task, {borderColor: item.Color}]}>
                        <Text>{item.Name}</Text>
                        <Button title="x" onPress={ () => setCategories(categories.filter(category => category.Id != item.Id))} style={{borderColor: item.Color}}/>
                    </View>}
                    keyExtractor={(item) => item.Id}/>
                <View style={styles.horizontalLine}/>
                {!addCategoryVisible && <Button title="Add category" onPress={() => setAddCategoryVisible(!addCategoryVisible)}/>}
                {addCategoryVisible && <View style={{paddingHorizontal: "20px"}}>
                    <Text style={styles.addProjectTitle}>Add a new category</Text>
                    <Text>Name:</Text>
                    <TextInput placeholder="name" onChangeText={(text) => setAddCategoryName(text)} value={addCategoryName} style={styles.addProjectInput}/>
                    <Text>Description:</Text>
                    <TextInput placeholder="description" onChangeText={(text) => setAddCategoryDescription(text)} value={addCategoryDescription} style={styles.addProjectInput}/>
                    <Text style={[styles.addCategoryText, {borderColor: addCategoryColor}, styles.addProjectInput]}>Color: {addCategoryColor != "" ? addCategoryColor : "Click on a color!"}</Text>
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
                            categories.push({Id: -1, Name: addCategoryName, Description: addCategoryDescription, color: addCategoryDescription})
                            setAddCategoryVisible(false)
                            setAddCategoryName("")
                            setAddCategoryDescription("")
                            setAddCategoryColor("")
                        }}/>
                        <Button title="cancel" onPress={() => {
                            setAddCategoryVisible(false)
                            setAddCategoryName("")
                            setAddCategoryDescription("")
                            setAddCategoryColor("")
                        }}/>
                    </View>}
            </ScrollView>
            
        </View>
        
    )
}

export default SettingsView