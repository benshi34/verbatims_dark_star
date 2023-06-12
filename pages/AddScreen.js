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
  const [showGroupPicker, setShowGroupPicker] = useState(false); // Track whether the group picker is visible or not
  const [selectedGroup, setSelectedGroup] = useState(''); // Store the selected group
  const [groups, setGroups] = useState([]); // Store the groups
  const [showVerbaiterPicker, setShowVerbaiterPicker] = useState(false); // Track whether the verbaiter picker is visible or not
  const [selectedVerbaiter, setSelectedVerbaiter] = useState(''); // Store the selected verbaiter


  

  const fetchGroups = () => {
    const groupsRef = ref(db, 'Groups');
    onValue(groupsRef, (snapshot) => {
      if (snapshot.exists()) {
        const groupsData = snapshot.val();
        const groupsArray = Object.entries(groupsData).map(([id, group]) => ({
          id, 
          ...group,
        }));
        setGroups(groupsArray);
      }
    });
  };
  
  useEffect(() => {
      fetchGroups();
    }, []);


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
    set(ref(db, 'Verbatims/' + num), {
      group: selectedGroup ? selectedGroup.id : '', 
      id: num,
      post: postText,
      timestamp: formattedDate,
      verbaiter: selectedVerbaiter ? selectedVerbaiter.id : '', // Store the ID of the selected verbaiter
      verbastard: '', 
    });
    
    num++;
    setPostText('');
    setVerbaiter('');
    setSelectedVerbaiter(''); // Reset the selected verbaiter
    setSelectedGroup('');

    // Reset the button text to "Choose Verbaiter" if it's not already displaying that
    if (selectedVerbaiter !== 'Choose Verbaiter') {
      setShowVerbaiterPicker(false);
    }
  };


  const dismissKeyboard = () => {
    Keyboard.dismiss(); // Dismiss the keyboard
  };


  const handleGroupSelection = (itemValue) => {
    const selectedGroup = groups.find(group => group.id === itemValue);
    setSelectedGroup(selectedGroup); // Set the selected group object
  
    if (selectedGroup) {
      const usersRef = ref(db, 'Users');
      onValue(usersRef, (snapshot) => {
        if (snapshot.exists()) {
          const usersData = snapshot.val();
          const groupUsers = selectedGroup.users.map(userId => usersData[userId]);
          const usersArray = Object.entries(groupUsers).map(([id, user]) => ({
            id,
            ...user,
          }));
          setUsers(usersArray);
        }
      });
    }
  
    setShowGroupPicker(false);
  };

  // Function to handle the selection of verbaiter from the picker
  const handleVerbaiterSelection = (itemValue) => {
    const selectedUser = users.find(user => user.id === itemValue);
    setSelectedVerbaiter(selectedUser); // Set the selected verbaiter object
    setShowVerbaiterPicker(false);
  };

  // Fetch the user data when the component mounts
  useEffect(() => {
    fetchUsers(),
    fetchGroups(); 
  }, []);

  return (
    <TouchableWithoutFeedback onPress={dismissKeyboard}>
      <View style={styles.container}>
        <View style={styles.headerContainer}>
          <Text style={styles.headerText}>AddScreen 2.0</Text>
        </View>

        <TouchableOpacity
          style={styles.chooseGroupsButton}
          onPress={() => setShowGroupPicker(true)}
        >
          <Text style={styles.chooseGroupsButtonText}>
            {selectedGroup ? selectedGroup.name : 'Choose group...'}
          </Text>
        </TouchableOpacity>
       
        {showGroupPicker && (
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={selectedGroup}
              style={styles.picker}
              onValueChange={handleGroupSelection}
            >
              <Picker.Item label="Choose group..." value="" />
              {groups.map((group) => (
                <Picker.Item 
                  key={group.id} 
                  label={group.name} 
                  value={group.id} 
                />
              ))}
            </Picker>
            <TouchableOpacity
              style={styles.pickerCloseButton}
              onPress={() => setShowGroupPicker(false)}
            >
              <Text style={styles.pickerCloseButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        )}

        <TouchableOpacity
          style={styles.chooseVerbaiterButton}
          onPress={() => setShowVerbaiterPicker(true)}
        >
          <Text style={styles.chooseVerbaiterButtonText}>
            {selectedVerbaiter ? selectedVerbaiter.username : 'Choose verbaiter...'}
          </Text>
        </TouchableOpacity>

        {showVerbaiterPicker && (
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={selectedVerbaiter}
              onValueChange={handleVerbaiterSelection}
            >
              <Picker.Item label="Choose verbaiter..." value="" />
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
              onPress={() => setShowVerbaiterPicker(false)}
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
  chooseGroupsButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  chooseGroupsButton: {
    borderWidth: 1,
    borderColor: '#777',
    borderRadius: 10,
    paddingHorizontal: 20,
    paddingVertical: 8,
    marginVertical: 10,
    marginLeft: 10,
    alignSelf: 'center',
  },
  chooseGroupsButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'blue',
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