import React, { useEffect} from 'react';
import { getDatabase, ref, get, onValue } from "firebase/database";
import { app } from "../Firebase.js";
import { View, Text, TextInput, FlatList, StyleSheet, Image, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';

const db = getDatabase(app);

const ChatScreen = ({ route, navigation }) => {
  const [verbatims, setVerbatims] = React.useState([
    //{ id: '1', sender: 'John', message: 'Hello!' },
    //{ id: '2', sender: 'Jane', message: 'Hi there!' },
    //{ id: '3', sender: 'Jim', message: 'How are you?' },
  ]);
  const [messages, setMessages] = React.useState([]);
  const [currID, setCurrID] = React.useState(messages.length);
  const [inputMessage, setInputMessage] = React.useState('');

  const fetchChatMessages = async (groupID) => {
    try {
      const dbref = ref(db, `Groups/${groupID}/verbatims`);
      onValue(dbref, async (snapshot) => {
        const verbatimIds = snapshot.val()
        if (verbatimIds) {
          verbatimsData = []
          for (const verbatim of verbatimIds) {
            const verbatimSnapshot = await get(ref(db, `Verbatims/${verbatim}`));

            if (verbatimSnapshot.exists()) {
              verbatimsData.push(verbatimSnapshot.val());
            } else {
              console.log(`No such document for verbatimId: ${verbatim}`);
            }
          }
          setVerbatims(verbatimsData);
        }
      })
    } catch (error) {
      console.error('Error fetching groups: ', error);
    }
  };

  const renderItem = ({ item }) => {
    let isLiked = false;
    return (
      <View style={styles.postContainer}>
        <View style={styles.userContainer}>
          <Image source={{uri: item.profilePic}} style={styles.profilePic} />
          <Text style={styles.username}>{item.verbaiterName} Said:</Text>
        </View>
        <Text>{item.timestamp}</Text>
        <Text>Submitted by: {item.verbastardName} | {item.groupName}</Text>
        <View style={styles.postTextContainer}>
          <Text style={styles.postText}>{item.post}</Text>
        </View>
        <TouchableOpacity
          style={[styles.favoriteButton, item.isFavorite && styles.favoriteButtonActive]}
          onPress={() => toggleFavorite(item.id)}
        >
          <Text style={[styles.favoriteButtonText, item.isFavorite && styles.favoriteButtonTextActive]}>
            {item.isFavorite ? 'Unfavorite' : 'Favorite'}
          </Text>
        </TouchableOpacity>
        <View style={styles.actionsContainer}>
        <TouchableOpacity style={[styles.likeButton, isLiked && styles.likeButtonLiked]} onPress={() => toggleLike(item.id)}>
          <Text style={styles.likeButtonText}>Like</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.commentButton} onPress={() => openModal(item.id)}>
          <Text style={styles.commentButtonText}>View Comments</Text>
        </TouchableOpacity>
        </View>
      </View>
    );
    };

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
        data={verbatims}
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
    container: {
      flex: 1,
      padding: 16,
      backgroundColor: '#fff',
      paddingTop: 40,
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
      width: 24,
      height: 24,
      borderRadius: 12,
      marginRight: 8,
    },
    postTextContainer: {
      flex: 1,
      marginBottom: 8,
    },
    username: {
      fontSize: 16,
      fontWeight: 'bold',
    },
    postText: {
      fontSize: 16,
    },
    favoriteButton: {
      position: 'absolute',
      top: 8,
      right: 8,
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 16,
      backgroundColor: '#e1e1e1',
    },
    favoriteButtonText: {
      fontSize: 14,
      color: '#333',
    },
    favoriteButtonActive: {
      backgroundColor: '#ffcc00',
    },
    likeButton: {
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 16,
      backgroundColor: '#e1e1e1',
    },
    likeButtonLiked: {
      backgroundColor: 'red',
    },
    likeButtonText: {
      fontSize: 14,
      color: '#333',
    },
    scrollContainer: {
      flexGrow: 1,
      paddingBottom: 16,
    },
    actionsContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    commentButton: {
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 16,
      backgroundColor: '#e1e1e1',
    },
    closeButton: {
      alignSelf: 'flex-end',
      backgroundColor: '#ddd',
      paddingVertical: 8,
      paddingHorizontal: 12,
      borderRadius: 8,
    },
    closeButtonText: {
      fontSize: 14,
      color: '#333',
    },
    commentsHeading: {
      paddingHorizontal: 12,
      paddingVertical: 12,
    },
    commentInput: {
      borderWidth: 1,
      borderColor: '#ccc',
      borderRadius: 8,
      padding: 8,
      marginBottom: 16,
    },
    commentList: {
      maxHeight: 200,
    },
    comment: {
      marginBottom: 8,
    },
    commentText: {
      flexDirection: 'row',
      marginBottom: 12,
      alignItems: 'center',
    },
    commentButtonText: {
      fontSize: 14,
      color: '#333',
    },
    modalContainer: {
      flex: 1,
      justifyContent: 'flex-end',
      alignItems: 'center',
    },
    modalContent: {
      backgroundColor: '#fff',
      borderRadius: 8,
      width: '100%',
      height: '70%',
      paddingHorizontal: 16,
      paddingTop: 16,
    },
    commentsContainer: {
      marginTop: 16,
      borderTopWidth: 1,
      borderTopColor: '#ccc',
      paddingTop: 16,
    },
  });

export default ChatScreen