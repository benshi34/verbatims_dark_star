import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, Image, TouchableOpacity, Button, TextInput } from 'react-native';
import { getDatabase, ref, get, onValue } from "firebase/database";
import { getStorage, ref as refStorage, getDownloadURL } from "firebase/storage";
import { app } from "../Firebase.js";
import { useNavigation } from '@react-navigation/native';

const storage = getStorage();

const GroupAddScreen = ({ route }) => {
    const { id } = route.params;
    console.log(id);
    const [groupName, setGroupName] = useState('');
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [allUsers, setAllUsers] = useState([])
    const [sampledUsers, setSampledUsers] = useState([]);

    const db = getDatabase(app);
    const navigation = useNavigation();

    const createGroup = () => {
        navigation.goBack();
    }
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Create New Group</Text>
            <TextInput
                placeholder='Group Name'
                value={groupName}
                onChangeText={text => setGroupName(text)}
                style={styles.input}
            />
            <TouchableOpacity
                style={styles.button}
                onPress={createGroup}
            >
            <Text style={styles.buttonText}>Create Group Chat</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5F5F5',
      },
      title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
      },
      input: {
        width: '80%',
        height: 40,
        borderRadius: 8,
        borderColor: '#CCCCCC',
        borderWidth: 1,
        paddingHorizontal: 10,
        marginBottom: 20,
      },
      button: {
        width: '80%',
        height: 40,
        backgroundColor: '#4287f5',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 8,
      },
      buttonText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#FFFFFF',
      },
});

export default GroupAddScreen