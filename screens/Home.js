import React, {useLayoutEffect, useState, useEffect} from 'react';
import { StyleSheet, Text, View,TouchableOpacity, FlatList } from 'react-native';
import { Ionicons } from "@expo/vector-icons"
import Colors from "../constants/Colors"
import {onSnapshot, addDoc, removeDoc, updateDoc} from "../services/collections";
import { firestore, auth } from "firebase";

const ListButton = ({title,color, onPress, onDelete, onOptions}) => {
    return(
        <TouchableOpacity 
            style={[styles.itemContainer, {backgroundColor: color}]}
            onPress={onPress}
        >
            <View><Text style={styles.itemTitle}>{title}</Text></View>
            <View style={{ flexDirection: "row" }}>
                <TouchableOpacity onPress={onOptions}>
                    <Ionicons name="options-outline" size={24} color="white" />
                </TouchableOpacity>
                <TouchableOpacity onPress={onDelete}>
                    <Ionicons name="trash-outline" size={24} color="white" />
                </TouchableOpacity>
            </View>
        </TouchableOpacity>
    );
}

const renderAddListIcon = (navigation, addItemToLists) => {
    return(
        <View style={{flexDirection: "row"}}>
        <TouchableOpacity style={{justifyContent: "center", marginRight: 4, color: "white"}} onPress={() => navigation.navigate("Settings")}>
        <Ionicons name="settings" size={20} color="white" />
        </TouchableOpacity>
        <TouchableOpacity style={{justifyContent: "center", marginRight: 8}} onPress={() => navigation.navigate("Edit", {saveChanges: addItemToLists})}>
            <Text style={styles.icon}> + </Text>
        </TouchableOpacity>
        </View>
    )
}

export default ({navigation}) => {
    const [Lists, setLists] = useState([]);
    const ListsRef = firestore()
        .collection("users")
        .doc(auth().currentUser.uid)
        .collection("lists");  

        useEffect(() => {
            onSnapshot(
                ListsRef,
                (newLists) => {
                    setLists(newLists);
                },
                {
                    sort: (a, b) => {
                        if (a.index < b.index) {
                            return -1;
                        }
    
                        if (a.index > b.index) {
                            return 1;
                        }
    
                        return 0;
                    },
                }
            );
        }, []);
     
    const addItemToLists = ({title, color}) => {
        const index = Lists.length > 1 ? Lists[Lists.length - 1].index + 1 : 0;
        addDoc(ListsRef, {title, color, index})
    }

    const removeItemFromLists = (id) => {
        removeDoc(ListsRef, id);
    };

    const updateItemFromLists = (id, item) => {
        updateDoc(ListsRef, id, item);
    };

    useLayoutEffect(() => {
        navigation.setOptions({
            headerRight: () => renderAddListIcon(navigation, addItemToLists)
        })
    })
    return(
        <View style={styles.container}>
            <FlatList 
                data= {Lists}
                    renderItem={({item: { title, color, id, index }}) => {
                    return(
                        <ListButton 
                            title={title} 
                            color={color} 
                            navigation={navigation}
                            onPress={()=> {navigation.navigate("ToDoList", {title, color, listId: id})}}
                            onOptions= {()=> {navigation.navigate("Edit", {title, color, saveChanges: (newItem) => updateItemFromLists(id, {index, ...newItem})})}}
                            onDelete={() => removeItemFromLists(id)}    
                        />
                    );
                }}
        />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "white",
    },
    itemTitle: { fontSize: 24, padding: 5, color: "white" },
    itemContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        height: 60,
        flex: 1,
        borderRadius: 20,
        marginHorizontal: 20,
        marginVertical: 10,
        padding: 15,
        
    },
    icon: {
        padding: 5,
        fontSize: 30,
        color: "white",
    },
    centeredView: {
        justifyContent: "center",
        alignItems: "center",
        marginTop: 50,
    },
    modalView: {
        backgroundColor: "white",
        borderRadius: 20,
        padding: 35,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
});