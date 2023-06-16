import React, { useEffect} from 'react';
import { getDatabase, ref, get, onValue } from "firebase/database";
import { app } from "../Firebase.js";
import { View, Text, TextInput, FlatList, StyleSheet, Image, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';

const db = getDatabase(app);

const ChatScreen = ({ route, navigation }) => {
  const [messages, setMessages] = React.useState([
    //{ id: '1', sender: 'John', message: 'Hello!' },
    //{ id: '2', sender: 'Jane', message: 'Hi there!' },
    //{ id: '3', sender: 'Jim', message: 'How are you?' },
  ]);
  const [currID, setCurrID] = React.useState(messages.length);
  const [inputMessage, setInputMessage] = React.useState('');

  const fetchChatMessages = async (groupID) => {
    try {
      const dbref = ref(db, `Groups/${groupID}/chat`);
      onValue(dbref, (snapshot) => {
        data = snapshot.val()
        if (data) {
          const messages = data.slice(1);
          setMessages(messages);
        }
      })
    } catch (error) {
      console.error('Error fetching groups: ', error);
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.messageContainer}>
      <View style={styles.messageContent}>
        <Text style={styles.sender}>{item.sender}: </Text>
        <Text style={styles.message}>{item.message}</Text>
      </View>
    </View>
  );

  const sendMessage = () => {
    const newMessage = { id: String(currID + 1), sender: 'You', message: inputMessage };
    setMessages([newMessage, ...messages]);
    setInputMessage('');
    setCurrID(currID + 1);
  };

  const handleInputSubmit = () => {
    if (inputMessage.trim() !== '') {
      sendMessage();
    }
  };

  useEffect(() => {
    const groupID = route.params.id;
    fetchChatMessages(groupID);
  }, [route.params.id]);

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : null} keyboardVerticalOffset={Platform.OS === 'ios' ? 140 : 0}>
      <FlatList
        data={messages}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.chatContainer}
        inverted
      />
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'position' : null} keyboardVerticalOffset={Platform.OS === 'ios' ? -120 : null}>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Type your message..."
            value={inputMessage}
            onChangeText={setInputMessage}
            onSubmitEditing={handleInputSubmit}
          />
        </View>
      </KeyboardAvoidingView>
    </KeyboardAvoidingView>
  );
};

//Just pushed changes that makes the userID globally accessible: just add 
//"route" to your params for the screen and call route.params to retrieve the value. 
//Follow the example in HomeScreen.js

const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 16,
      backgroundColor: '#fff',
    },
    messageContent: {
      flexDirection: 'row',
      alignItems: 'center',
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
    inputContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 16,
      paddingVertical: 8,
      borderTopWidth: 1,
      borderTopColor: '#CCCCCC',
      backgroundColor: '#FFFFFF',
    },
    input: {
      flex: 1,
      height: 40,
      borderWidth: 1,
      borderColor: '#CCCCCC',
      borderRadius: 4,
      paddingHorizontal: 8,
      marginRight: 8,
    },
    messageContainer: {
      marginBottom: 16,
    },
    messageContent: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    sender: {
      fontWeight: 'bold',
      marginRight: 4,
    },
    message: {
      fontSize: 16,
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
    timeStampContainer: {
      position: 'absolute',
      top: 8,
      right: 8,
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 16,
      backgroundColor: '#f5f5f5',
    },
    timeStampText: {
      position: 'absolute',
      top: 8,
      right: 8,
      paddingHorizontal: 12,
      paddingVertical: 6,
      fontSize: 14,
      color: '#333',
    },
  });

export default ChatScreen