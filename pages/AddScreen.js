import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Keyboard,
  Image,
  Button,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import ButtonContainer from "./ButtonContainer.js";

import { app } from "../Firebase.js";
import {
  getDatabase,
  ref,
  set,
  get,
  child,
  once,
  push,
  onValue,
} from "firebase/database";
import { ScrollView } from "react-native-gesture-handler";

const db = getDatabase(app);

const AddScreen = ({ route }) => {
  const [postText, setPostText] = useState("");
  const [verbaiter, setVerbaiter] = useState("");
  const [users, setUsers] = useState([]);
  const [showGroupPicker, setShowGroupPicker] = useState(false); // Track whether the group picker is visible or not
  const [selectedGroup, setSelectedGroup] = useState(""); // Store the selected group
  const [sampledGroups, setSampledGroups] = useState([]);
  const [groups, setGroups] = useState([]); // Store the groups
  const [showVerbaiterPicker, setShowVerbaiterPicker] = useState(false); // Track whether the verbaiter picker is visible or not
  const [selectedVerbaiter, setSelectedVerbaiter] = useState(""); // Store the selected verbaiter

  const fetchGroups = () => {
    const groupsRef = ref(db, "Groups");
    onValue(groupsRef, (snapshot) => {
      if (snapshot.exists()) {
        const groupsData = snapshot.val();
        const groupsArray = Object.entries(groupsData).map(([id, group]) => ({
          id,
          ...group,
        }));

        setGroups(groupsArray);

        if (groupsArray.length <= 5) {
          setSampledGroups(groupsArray);
        } else {
          const shuffledGroups = groupsArray.sort(() => 0.5 - Math.random());
          const sampledGroups = shuffledGroups.slice(0, 5);
          setSampledGroups(sampledGroups);
        }
      }
    });
  };

  // Fetch the user data from Firebase
  const fetchUsers = () => {
    const usersRef = ref(db, "Users");
    onValue(usersRef, (snapshot) => {
      if (snapshot.exists()) {
        const usersData = snapshot.val();
        const usersArray = Object.entries(usersData).map(([id, user]) => ({
          id,
          ...user,
        }));
        setUsers(usersArray);
      }
    });
  };

  const sampleGroups = () => {
    if (groups.length <= 5) {
      setSampledGroups(groups);
    } else {
      const shuffledGroups = groups.sort(() => 0.5 - Math.random());
      const sampledGroups = shuffledGroups.slice(0, 5);
      setSampledGroups(sampledGroups);
    }
  };

  const submitVerbatim = () => {
    // Get the current timestamp
    const timestamp = Date.now();

    // Convert timestamp to YYYY-MM-DD format
    const date = new Date(timestamp);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const formattedDate = `${year}-${month}-${day}`;

    const newVerbatimKey = push(child(ref(db), "Verbatims")).key;

    const usersRef = ref(db, "Users");
    onValue(usersRef, (snapshot) => {
      if (snapshot.exists()) {
        const usersData = snapshot.val();
        const matchingUser = Object.entries(usersData).find(
          ([id, user]) => user.username === selectedVerbaiter.username
        );

        if (matchingUser) {
          const [userId] = matchingUser; // Get the ID of the matching user

          // Set the selectedVerbaiter to the matching user's ID
          setSelectedVerbaiter(userId);
          
          const { value } = route.params;
          // Create verbatim, save the verbatim to the database
          set(ref(db, "Verbatims/" + newVerbatimKey), {
            group: selectedGroup ? selectedGroup.id : "",
            id: newVerbatimKey,
            post: postText,
            timestamp: formattedDate,
            verbaiter: userId,
            // verbaiterName: snapshot.val().{$userId}.username,
            verbastard: value,
            // verbastardName: snapshot.val().{$userId}.username,
          });

          setPostText("");
          setVerbaiter("");
          setSelectedGroup("");
          setSelectedVerbaiter("");

          // Reset the button text to "Choose Verbaiter" if it's not already displaying that
          if (selectedVerbaiter !== "Choose Verbaiter") {
            setShowVerbaiterPicker(false);
          }
        } else {
          console.log("User not found with the selected verbaiter username.");
        }
      }
    });
  };

  const dismissKeyboard = () => {
    Keyboard.dismiss(); // Dismiss the keyboard
  };

  const handleGroupSelection = (itemValue) => {
    const selectedGroup = groups.find((group) => group.id === itemValue);
    setSelectedGroup(selectedGroup ? selectedGroup : ""); // Set the selected group object

    if (selectedGroup) {
      const usersRef = ref(db, "Users");
      onValue(usersRef, (snapshot) => {
        if (snapshot.exists()) {
          const usersData = snapshot.val();
          const groupUsers = selectedGroup.users.map(
            (userId) => usersData[userId]
          );
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

  const handleVerbaiterSelection = (itemValue) => {
    const selectedUser = users.find((user) => user.id === itemValue);
    setSelectedVerbaiter(selectedUser ? selectedUser : ""); // Update selectedVerbaiter
    setShowVerbaiterPicker(false);
  };

  // Fetch the user data when the component mounts
  useEffect(() => {
    fetchUsers(), fetchGroups();
    fetchGroups(), sampleGroups();
  }, []);

  return (
    <TouchableWithoutFeedback onPress={dismissKeyboard}>
      <View style={styles.generalContainer}>
        <View style={styles.rectangle}>
          <Text style={styles.verbatimText}>Add Verbatim</Text>
        </View>

        <ScrollView style={styles.container}>
          <Text style={styles.titleText}>Who said it?</Text>
          <View style={styles.suggestedContactsContainer}>
            <Text style={styles.subText}>Suggested Contacts</Text>

            <View style={styles.innerContactsContainer}>
              {sampledGroups.map((group, index) => (
                <TouchableOpacity style={styles.buttonContainer} key={index}>
                  <Image
                    source={require("../assets/kharn.jpg")}
                    style={styles.image}
                  />
                  <Text style={styles.buttonText}>{group.name}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <TouchableOpacity style={styles.otherButton}>
              <Text style={styles.otherButtonText}>Choose Other Contact</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.flippedTitleText}>What did they say?</Text>
          <TextInput
            style={styles.textInput}
            placeholder=""
            placeholderTextColor="transparent"
            multiline={true}
            numberOfLines={2}
            textAlignVertical="top"
          />

          <Text style={styles.finalTitleText}>
            Who do you want to send it to?
          </Text>
          <View style={styles.suggestedContactsContainer}>
            <Text style={styles.subText}>Suggested Groups</Text>

            <View style={styles.innerContactsContainer}>
              {sampledGroups.map((group, index) => (
                <TouchableOpacity style={styles.buttonContainer} key={index}>
                  <Image
                    source={require("../assets/kharn.jpg")}
                    style={styles.image}
                  />
                  <Text style={styles.buttonText}>{group.name}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <TouchableOpacity style={styles.otherButton}>
              <Text style={styles.otherButtonText}>Choose Other Group</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.submitButton}>
            <Image
              source={require("../assets/send.png")}
              style={styles.image2}
            />
            <Text style={styles.submitButtonText}>Add Verbatim</Text>
          </TouchableOpacity>

          {/* <TouchableOpacity
            style={styles.chooseGroupsButton}
            onPress={() => setShowGroupPicker(true)}
          >
            <Text style={styles.chooseGroupsButtonText}>
              {selectedGroup ? selectedGroup.name : "Choose group..."}
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

          {selectedGroup && ( // Check if a group is selected before showing the "Choose verbaiter..." picker
            <TouchableOpacity
              style={styles.chooseVerbaiterButton}
              onPress={() => setShowVerbaiterPicker(true)}
            >
              <Text style={styles.chooseVerbaiterButtonText}>
                {selectedVerbaiter
                  ? selectedVerbaiter.username
                  : "Choose verbaiter..."}
              </Text>
            </TouchableOpacity>
          )}

          {showVerbaiterPicker &&
            selectedGroup && ( // Check if a group is selected before showing the "Choose verbaiter..." picker
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
              placeholder='"Yechan is so smart and cool and handsome! What would we ever do without Test Dummy Yechan?" '
              onChangeText={(val) => setPostText(val)}
              value={postText}
            />

            <TouchableOpacity style={styles.addButton} onPress={submitVerbatim}>
              <Text style={styles.addButtonText}>Add Verbatim</Text>
            </TouchableOpacity> */}
          {/* </View> */}
        </ScrollView>
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#7090FF",
    flex: 1,
  },
  generalContainer: {
    flex: 1,
    position: "relative",
  },

  headerContainer: {
    padding: 50,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },
  headerText: {
    fontSize: 20,
    color: "blue",
    fontWeight: "bold",
  },
  chooseGroupsButtonContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  chooseGroupsButton: {
    borderWidth: 1,
    borderColor: "#777",
    borderRadius: 10,
    paddingHorizontal: 20,
    paddingVertical: 8,
    marginVertical: 10,
    marginLeft: 10,
    alignSelf: "center",
  },
  chooseGroupsButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "blue",
  },
  chooseVerbaiterButton: {
    borderWidth: 1,
    borderColor: "#777",
    borderRadius: 10,
    paddingHorizontal: 20,
    paddingVertical: 8,
    marginVertical: 10,
    alignSelf: "center",
  },
  chooseVerbaiterButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "blue",
  },
  pickerContainer: {
    backgroundColor: "#fff",
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
  },
  pickerCloseButton: {
    marginTop: 10,
    alignSelf: "flex-end",
  },
  pickerCloseButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "blue",
  },
  verbatimInputContainer: {
    marginTop: 0,
    alignItems: "center",
  },
  verbatimInputTextbox: {
    borderWidth: 1,
    borderColor: "#777",
    padding: 8,
    margin: 10,
    width: 250,
    height: 100,
    borderRadius: 10,
  },
  addButton: {
    backgroundColor: "blue",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },

  suggestedContactsContainer: {
    backgroundColor: "white",
    borderRadius: 24,
    paddingLeft: 0,
    paddingRight: 0,
    marginLeft: 23,
    marginRight: 20,
    marginTop: 0,
    paddingTop: 15,
    paddingBottom: 15,
  },
  grayContainer: {
    backgroundColor: "#F5F5F5",
    borderRadius: 24,
    width: 350,
    paddingLeft: 0,
    paddingRight: 0,
    marginLeft: 33,
    marginRight: 50,
    marginTop: 25,
    paddingTop: 15,
    paddingBottom: 15,
  },
  flippedTitleText: {
    color: "white",
    marginLeft: 40,
    fontWeight: "bold",
    fontSize: 20,
    marginTop: 15,
  },
  innerContactsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    margin: 10,
  },
  buttonContainer: {
    backgroundColor: "white",
    borderRadius: 11,
    borderWidth: 0.5,
    borderColor: "gray",
    paddingTop: 5,
    paddingBottom: 3,
    paddingLeft: 9,
    paddingRight: 9,
    flexDirection: "row",
    alignItems: "center",
    margin: 5,
  },
  buttonText: {
    color: "black",
    fontWeight: "bold",
    fontSize: 14,
    marginLeft: 7,
  },
  otherButton: {
    backgroundColor: "#3E63E4",
    borderRadius: 11,
    marginLeft: 79,
    marginRight: 79,
    paddingTop: 7,
    paddingBottom: 7,
    flexDirection: "row",
    justifyContent: "center",
  },
  submitButton: {
    backgroundColor: "#3E63E4",
    borderRadius: 11,
    marginLeft: 79,
    marginTop: 25,
    marginRight: 79,
    paddingTop: 12,
    paddingBottom: 12,
    paddingLeft: -5,
    paddingRight: -5,
    flexDirection: "row",
    justifyContent: "center",
  },
  submitButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 17,
    textAlign: "center",
  },
  otherButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 14,
    marginLeft: 7,
    textAlign: "center",
  },
  image: {
    width: 20,
    height: 20,
    borderRadius: 20,
  },
  image2: {
    width: 22,
    height: 22,
    marginRight: 10,
  },
  titleText: {
    color: "white",
    marginLeft: 40,
    marginTop: 20,
    marginBottom: 10,
    fontWeight: "bold",
    fontSize: 20,
  },
  finalTitleText: {
    color: "white",
    marginLeft: 40,
    marginTop: 15,
    marginBottom: 10,
    fontWeight: "bold",
    fontSize: 20,
  },
  subText: {
    color: "#0F205A",
    marginLeft: 20,
    marginTop: 5,
    fontWeight: "bold",
    fontSize: 17,
  },

  rectangle: {
    bottom: 0,
    width: "100%",
    height: 110,
    backgroundColor: "#375FEA",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 4,
    elevation: 5,
    justifyContent: "center",
    alignItems: "center",
  },
  verbatimText: {
    fontSize: 26,
    color: "white",
    fontWeight: "bold",
    marginTop: 63,
    marginRight: 185,
  },
  textInput: {
    backgroundColor: "white",
    color: "black",
    fontWeight: "bold",
    paddingLeft: 20,
    paddingRight: 20,
    paddingTop: 14,
    paddingBottom: 10,
    borderRadius: 15,
    height: 75,
    marginLeft: 25,
    marginRight: 25,
    marginTop: 10,
    marginBottom: 5,
    fontSize: 16,
  },

  addButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
});


export default AddScreen