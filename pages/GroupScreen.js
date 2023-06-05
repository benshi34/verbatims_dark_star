import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, FlatList, StyleSheet, Image, TouchableOpacity, ScrollView } from 'react-native';
import { writeMessageData } from "../Firebase.js";
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

const Stack = createNativeStackNavigator();

const GroupScreen = ({ navigation }) => {
  const [Groups, setGroups] = useState([]);

  useEffect(() => {
    // Simulated data for discussion posts
    const dummyData = [
      {
        id: 1,
        name: 'Dark Star',
        message: 'One new message',
        profilePic: require('../assets/kharn.jpg'),
      },
      {
        id: 2,
        name: 'Ben sucks I hate him so much',
        message: '10+ new messages',
        profilePic: require('../assets/kharn.jpg'),
      },
    ];

    setGroups(dummyData);
  }, []);

  const renderGroups = ({ item }) => {
    const handleGroupPress = () => {
      // Navigate to the chat window screen
      navigation.navigate('Groups', { screen: 'Chat'});
    };

    return (
      <TouchableOpacity style={styles.groupContainer} onPress={handleGroupPress}>
        <View style={styles.leftHalf}>
          <Image source={item.profilePic} style={styles.profilePic} />
        </View>
        <View style={styles.rightHalf}>
          <Text style={styles.username}>{item.name}</Text>
          <Text style={styles.postText}>{item.message}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  const groupListScreen = () => {
    return (
      <View style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <FlatList
            data={Groups}
            renderItem={renderGroups}
            keyExtractor={(item) => item.id.toString()}
            contentContainerStyle={styles.listContainer}
          />
        </ScrollView>
      </View>
    )
  };
  const chatWindow = () => {
    const messages = [
      { id: '1', sender: 'John', message: 'Hello!' },
      { id: '2', sender: 'Jane', message: 'Hi there!' },
      { id: '3', sender: 'John', message: 'How are you?' },
      // Add more messages here
    ];

    const renderItem = ({ item }) => (
      <View style={styles.messageContainer}>
        <Text style={styles.sender}>{item.sender}</Text>
        <Text style={styles.message}>{item.message}</Text>
      </View>
    );

    return (
      <View style={styles.container}>
        <FlatList
          data={messages}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.chatContainer}
          inverted
        />
        <View style={styles.inputContainer}>
          <TextInput style={styles.input} placeholder="Type your message..." />
          <TouchableOpacity style={styles.sendButton}>
            <Text style={styles.sendButtonText}>Send</Text>
          </TouchableOpacity>
        </View>
      </View>
      );
    };

  return (
    <Stack.Navigator>
        <Stack.Screen name="Groups" component={groupListScreen} />
        <Stack.Screen name="Chat" component={chatWindow} />
    </Stack.Navigator>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  listContainer: {
    paddingBottom: 16,
  },
  postContainer: {
    backgroundColor: '#f5f5f5',
    padding: 16,
    marginBottom: 16,
    borderRadius: 8,
    flexDirection: 'column',
    alignItems: 'flex-start',
    position: 'relative',
  },
  userContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  profilePic: {
    width: 40,
    height: 40,
    borderRadius: 12,
    marginRight: 8,
  },
  postTextContainer: {
    flex: 1,
  },
  username: {
    fontWeight: 'bold',
  },
  postText: {
    fontSize: 16,
  },
  groupContainer: {
    flex: 1,
    flexDirection: 'row', // Arrange children in a row
    backgroundColor: '#f5f5f5',
    padding: 16,
    marginBottom: 16,
    borderRadius: 8,
    alignItems: 'flex-start',
    position: 'relative',
  },
  leftHalf: {
    flex: 1, // Take half of the available space
    backgroundColor: '#f5f5f5', // Customize the left half's background color
  },
  rightHalf: {
    flexDirection: 'column', // Arrange children in a row
    flex: 4, // Take half of the available space
    backgroundColor: '#F5F5F5', // Customize the right half's background color
  },
  scrollContainer: {
    paddingBottom: 16,
  },
});

export default GroupScreen