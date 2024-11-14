import React from "react"
import { View, Text, TouchableOpacity, ScrollView, FlatList, Dimensions } from "react-native"
import { styles } from "../../themes/styles"

const ProjectView = ({navigation}) => {
    var data = [0,1,2,3,4,5,6,7,8,9]
    var screenWidth = Dimensions.get('screen').width
    var columnsNumber = Math.floor((screenWidth - (screenWidth/300)*30)/300)

    return (
        <View style={styles.container}>
            <Text style={styles.header}>CheckIt!</Text>
            <ScrollView>
                <View style={styles.projectTileContainer}>
                    <FlatList data={data} renderItem={({item}) => <Project navigation={navigation} project={item}/>} numColumns={columnsNumber}/>
                </View>
            </ScrollView>
            
        </View>
    )
}

const Project = ({navigation, project}) => {
    return (
        <TouchableOpacity onPress={() => navigation.navigate('Tasks', {project: project})} style={styles.projectTile}>
            <Text>Project {project}</Text>
        </TouchableOpacity>
    )
}




export default ProjectView