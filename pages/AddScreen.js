import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  TouchableWithoutFeedback, 
  Keyboard, 
} from "react-native";
import { Picker } from '@react-native-picker/picker';

import { app } from "../Firebase.js";
import { 
  getDatabase, 
  ref, 
  set, 
  get, 
  child, 
  once, 
  push, 
  onValue 
} from "firebase/database"

const db = getDatabase(app);

var num = 0;


const AddScreen = ({ navigation }) => {
  const [postText, setPostText] = useState('');
  const [verbaiter, setVerbaiter] = useState(''); 
  const [users, setUsers] = useState([]);
  const [showPicker, setShowPicker] = useState(false); // Track whether the picker is visible or not
  const [selectedVerbaiter, setSelectedVerbaiter] = useState(''); // Store the selected verbaiter

  // Fetch the user data from Firebase
  const fetchUsers = () => {
    const usersRef = ref(db, 'Users');
    onValue(usersRef, (snapshot) => {
      if (snapshot.exists()) {
        const usersData = snapshot.val();
        const usersArray = Object.entries(usersData).map(([id, user]) => ({
          id, // Store the user's ID
          ...user,
        }));
        setUsers(usersArray);
      }
    });
  };


  const submitVerbatim = () => {
    
    // Generate a unique ID for the post
    // ?????????????????????????????
    

    // Get the current timestamp
    const timestamp = Date.now();

    // Convert timestamp to YYYY-MM-DD format
    const date = new Date(timestamp);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const formattedDate = `${year}-${month}-${day}`;
    
    
    // Create verbatim, save the verbatim to the database
    set(ref(db, 'SentVerbatims/' + num), {
      id: num,
      timestamp: formattedDate,
      post: postText,
      verbaiter: selectedVerbaiter ? selectedVerbaiter.id : '', // Store the ID of the selected verbaiter
    });
    
    num++;
    setPostText('');
    setVerbaiter('');
    setSelectedVerbaiter(''); // Reset the selected verbaiter

    // Reset the button text to "Choose Verbaiter" if it's not already displaying that
    if (selectedVerbaiter !== 'Choose Verbaiter') {
      setShowPicker(false);
    }
  };


  const dismissKeyboard = () => {
    Keyboard.dismiss(); // Dismiss the keyboard
  };

  // Function to handle the selection of verbaiter from the picker
  const handleVerbaiterSelection = (itemValue) => {
    const selectedUser = users.find(user => user.id === itemValue);
    setSelectedVerbaiter(selectedUser); // Set the selected verbaiter object
    setShowPicker(false);
  };

  // Fetch the user data when the component mounts
  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <TouchableWithoutFeedback onPress={dismissKeyboard}>
      <View style={styles.container}>
        <View style={styles.headerContainer}>
          <Text style={styles.headerText}>AddScreen 2.0</Text>
        </View>

        <TouchableOpacity
          style={styles.chooseVerbaiterButton}
          onPress={() => setShowPicker(true)}
        >
        <Text style={styles.chooseVerbaiterButtonText}>
          {selectedVerbaiter ? selectedVerbaiter.username : 'choose verbaiter...'}
        </Text>
        </TouchableOpacity>

        {showPicker && (
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={selectedVerbaiter}
              onValueChange={handleVerbaiterSelection}
            >
              {users.map((user) => (
                <Picker.Item
                key={user.id}
                label={user.username}
                value={user.id}
              />
              ))}
            </Picker>
            <TouchableOpacity
              style={styles.pickerCloseButton}
              onPress={() => setShowPicker(false)}
            >
              <Text style={styles.pickerCloseButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        )}
          
        <View style={styles.verbatimInputContainer}>
          <TextInput 
            multiline={true}
            style={styles.verbatimInputTextbox} 
            placeholder='"Yeken is so smart and cool and handsome! What would we ever do without Test Dummy Yeken?" ' 
            onChangeText={(val) => setPostText(val)}
            value={postText}
          />
                
          <TouchableOpacity style={styles.addButton} onPress={submitVerbatim}>
            <Text style={styles.addButtonText}>Add Verbatim</Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableWithoutFeedback>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  headerContainer: {
    padding: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  headerText: {
    fontSize: 20,
    color: 'blue',
    fontWeight: 'bold',
  },
  chooseVerbaiterButton: {
    borderWidth: 1,
    borderColor: '#777',
    borderRadius: 10,
    paddingHorizontal: 20,
    paddingVertical: 8,
    marginVertical: 10,
    alignSelf: 'center',
  },
  chooseVerbaiterButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'blue',
  },
  pickerContainer: {
    backgroundColor: '#fff',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
  },
  pickerCloseButton: {
    marginTop: 10,
    alignSelf: 'flex-end',
  },
  pickerCloseButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'blue',
  },
  verbatimInputContainer: {
    marginTop: 0,
    alignItems: 'center',
  },
  verbatimInputTextbox: {
    borderWidth: 1,
    borderColor: '#777',
    padding: 8,
    margin: 10,
    width: 250,
    height: 100,
    borderRadius: 10,
  },
  addButton: {
    backgroundColor: 'blue',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  addButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});


export default AddScreen