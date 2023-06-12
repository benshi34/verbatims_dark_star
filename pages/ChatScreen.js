import React from 'react';
import { View, Text, TextInput, FlatList, StyleSheet, Image, TouchableOpacity, ScrollView } from 'react-native';


const ChatScreen = ({ navigation }) => {
    const [messages, setMessages] = React.useState([
      { id: '1', sender: 'John', message: 'Hello!' },
      { id: '2', sender: 'Jane', message: 'Hi there!' },
      { id: '3', sender: 'John', message: 'How are you?' },
      // Add more messages here
    ]);
    const [currID, setCurrID] = React.useState(messages.length);
    const [inputMessage, setInputMessage] = React.useState('');
  
    const renderItem = ({ item }) => (
      <View style={styles.messageContainer}>
        <Text style={styles.sender}>{item.sender}</Text>
        <Text style={styles.message}>{item.message}</Text>
      </View>
    );
  
    const sendMessage = () => {
      const newMessage = { id: String(currID + 1), sender: 'You', message: inputMessage };
      setMessages([...messages, newMessage]);
      setInputMessage('');
      setCurrID(currID + 1);
    };
  
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
          <TextInput
            style={styles.input}
            placeholder="Type your message..."
            value={inputMessage}
            onChangeText={setInputMessage}
          />
          <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
            <Text style={styles.sendButtonText}>Send</Text>
          </TouchableOpacity>
        </View>
      </View>
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