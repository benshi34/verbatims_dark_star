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
  Modal,
  Pressable,
  ScrollView,
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
  update,
} from "firebase/database";

const db = getDatabase(app);

const AddScreen = ({ route }) => {
  const [users, setUsers] = useState([]);
  const [verbatimText, setVerbatimText] = useState(""); // Store the selected group
  const [sampledGroups, setSampledGroups] = useState([]);
  const [sampledUsers, setSampledUsers] = useState([]);
  const [groups, setGroups] = useState([]); // Store the groups
  const [groupsModalVisible, setGroupsModalVisible] = useState(false);
  const [isPopupVisible, setPopupVisible] = useState(false);
  const [isAlertPopupVisible, setAlertPopupVisible] = useState(false);
  const [isGroupPopupVisible, setGroupPopupVisible] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [pressedIndexes, setPressedIndexes] = useState([]);
  const [updatedIndexes, setUpdatedIndexes] = useState([]);
  const { userID } = route.params;

  const fetchGroups = () => {
    const dbref = ref(db, "Users/" + userID + "/groups");
    get(dbref)
      .then((snapshot) => {
        if (snapshot.exists()) {
          data = snapshot.val();
          let groups = Object.values(data);

          const groupsArr = groups.map((element) => ({
            id: element,
          }));

          const promises = [];
          for (let i = 0; i < groupsArr.length; i++) {
            const group = groupsArr[i];
            const promise = getGroupnameFromID(group["id"])
              .then((groupData) => {
                groupsArr[i]["name"] = groupData["name"];
                groupsArr[i]["members"] = Object.values(groupData["users"]);
                console.log(groupsArr);
              })
              .catch((error) => {
                console.error(error);
              });
            promises.push(promise);
          }

          Promise.all(promises)
            .then(() => {
              selectedUser = sampledUsers[selectedIndex];

              if (selectedUser != null) {
                const filteredGroups = groupsArr.filter((element) => {
                  return element["members"].includes(selectedUser["id"]);
                });

                setGroups(filteredGroups);

                if (filteredGroups.length <= 5) {
                  setSampledGroups(filteredGroups);
                } else {
                  const shuffledGroups = filteredGroups.sort(
                    () => 0.5 - Math.random()
                  );
                  const sampledGroups = shuffledGroups.slice(0, 5);
                  setSampledGroups(sampledGroups);
                }
              } else {
                setGroups([]);
                setSampledGroups([]);
              }
            })
            .catch((error) => {
              console.error(error);
            });
        }
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const getUsernameFromID = (userIdValue) => {
    const dbref = ref(db, "Users/" + userIdValue);

    return new Promise((resolve, reject) => {
      get(dbref)
        .then((snapshot) => {
          if (snapshot.exists()) {
            const data = snapshot.val();
            resolve(data["username"]);
          } else {
            reject(new Error("User not found."));
          }
        })
        .catch((error) => {
          reject(error);
        });
    });
  };

  const getGroupnameFromID = (groupIDValue) => {
    const dbref = ref(db, "Groups/" + groupIDValue);

    return new Promise((resolve, reject) => {
      get(dbref)
        .then((snapshot) => {
          if (snapshot.exists()) {
            const data = snapshot.val();
            console.log(data);
            resolve(data);
          } else {
            reject(new Error("Group not found."));
          }
        })
        .catch((error) => {
          reject(error);
        });
    });
  };

  // Fetch the user data from Firebase
  const fetchUsers = () => {
    const dbref = ref(db, "Users/" + userID + "/friends");
    get(dbref)
      .then((snapshot) => {
        if (snapshot.exists()) {
          data = snapshot.val();
          let friends = Object.values(data);

          const friendsArr = friends.map((element) => ({
            id: element,
          }));

          const promises = [];
          for (let i = 0; i < friendsArr.length; i++) {
            const friend = friendsArr[i];
            const promise = getUsernameFromID(friend["id"])
              .then((username) => {
                friendsArr[i]["username"] = username;
              })
              .catch((error) => {
                console.error(error);
              });
            promises.push(promise);
          }

          Promise.all(promises)
            .then(() => {
              setUsers(friendsArr);

              if (friendsArr.length <= 5) {
                setSampledUsers(friendsArr);
              } else {
                const shuffledUsers = friendsArr.sort(
                  () => 0.5 - Math.random()
                );
                const sampledUsers = shuffledUsers.slice(0, 5);
                setSampledUsers(sampledUsers);
              }
            })
            .catch((error) => {
              console.error(error);
            });
        }
      })
      .catch((error) => {
        //console.log("6");
        console.error(error);
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

    if (
      pressedIndexes.length == 0 ||
      verbatimText == "" ||
      pressedIndexes == null
    ) {
      toggleAlert();
      return;
    }

    // Convert timestamp to YYYY-MM-DD format
    const date = new Date(timestamp);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const formattedDate = `${year}-${month}-${day}`;

    getUsernameFromID(userID)
      .then((username) => {
        selectedUser = sampledUsers[selectedIndex];

        const selectedGroups = sampledGroups.filter((item) =>
          pressedIndexes.includes(item.id)
        );

        for (let i = 0; i < selectedGroups.length; i++) {
          group = selectedGroups[i];

          const newVerbatimKey = push(child(ref(db), "Verbatims")).key;

          set(ref(db, "Verbatims/" + newVerbatimKey), {
            group: group["id"],
            groupName: group["name"],
            post: verbatimText,
            timestamp: formattedDate,
            verbaiter: selectedUser["id"],
            verbaiterName: selectedUser["username"],
            verbastard: userID,
            verbastardName: username,
          });
        }
      })
      .catch((error) => {
        console.error(error);
      });

    const newVerbatimKey = push(child(ref(db), "Verbatims")).key;
    selectedUser = sampledUsers[selectedIndex];
  };

  const dismissKeyboard = () => {
    Keyboard.dismiss(); // Dismiss the keyboard
  };

  const toggleGroupsModal = () => {
    setGroupsModalVisible(!groupsModalVisible);
  };

  const toggleVerbaiterModal = () => {
    setGroupsModalVisible(!verbaiterModalVisible);
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

  const togglePopup = () => {
    setPopupVisible(!isPopupVisible);
  };

  const toggleGroupPopup = () => {
    setGroupPopupVisible(!isGroupPopupVisible);
  };

  const toggleAlert = () => {
    setAlertPopupVisible(!isAlertPopupVisible);
  };

  const groupSelected = (index, group) => {
    if (pressedIndexes.includes(group.id)) {
      setPressedIndexes(
        pressedIndexes.filter((pressedIndex) => pressedIndex !== group.id)
      );
      setUpdatedIndexes(
        updatedIndexes.filter((updatedIndex) => updatedIndex !== group.id)
      );
    } else {
      setPressedIndexes([...pressedIndexes, group.id]);
      setUpdatedIndexes([...pressedIndexes, group.id]);
      var include = true;
      for (let sampledGroup of sampledGroups) {
        if (sampledGroup.id == group.id) {
          include = false;
        }
      }

      if (include) {
        setSampledGroups(sampledGroups.concat(group));
      }
    }
  };

  const Popup = React.memo(({ visible, onClose, children }) => {
    const handleOverlayPress = () => {
      if (visible && onClose) {
        onClose();
      }
    };

    return (
      <Modal
        visible={visible}
        transparent={true}
        animationType="fade"
        onRequestClose={onClose}
      >
        <TouchableOpacity
          activeOpacity={1}
          style={styles.modalContainer}
          onPress={handleOverlayPress}
        >
          <View style={styles.popupContainer}>{children}</View>
        </TouchableOpacity>
      </Modal>
    );
  });

  const GroupList = ({}) => {
    return (
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {groups.map((group, index) => {
          const isPressed = pressedIndexes.includes(group.id);
          const textStyle = isPressed
            ? styles.buttonTextInnerPressed
            : styles.buttonText;

          return (
            <TouchableOpacity
              style={styles.chooseButtonContainer}
              key={index}
              onPress={() => groupSelected(index, group)}
            >
              <Image
                source={require("../assets/kharn.jpg")}
                style={styles.image}
              />
              <Text style={textStyle}>{group.name}</Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    );
  };

  const selectUser = (index) => {
    setSelectedIndex(index);
  };

  const selectGroup = (groupID) => {
    if (updatedIndexes.includes(groupID)) {
      const updatedItems = updatedIndexes.filter(
        (element) => element !== groupID
      );
      setUpdatedIndexes(updatedItems);
      setPressedIndexes(updatedItems);
    } else {
      setUpdatedIndexes(updatedIndexes.concat(groupID));
      setPressedIndexes(updatedIndexes.concat(groupID));
    }
  };

  // Fetch the user data when the component mounts
  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    fetchGroups();
  }, [selectedIndex]);

  const contactChosen = (userItem, index) => {
    if (!sampledUsers.includes(userItem)) {
      newSampledUsers = sampledUsers.concat(userItem);
      setSampledUsers(newSampledUsers);
      setSelectedIndex(sampledUsers.length);
    }
    setSelectedIndex(index);
    togglePopup();
  };

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

            <Popup visible={isAlertPopupVisible} onClose={toggleAlert}>
              <View style={styles.alertRectangle}>
                <Text style={styles.alertText}>Alert</Text>
                <Text style={styles.alertDescriptionText}>
                  Oops, We Can't Add Your Verbatim! Make Sure You Have Entered
                  All Fields
                </Text>
                <TouchableOpacity
                  style={styles.alertOtherButton}
                  onPress={toggleAlert}
                >
                  <Text style={styles.alertOtherButtonText}>Close</Text>
                </TouchableOpacity>
              </View>
            </Popup>

            <View style={styles.innerContactsContainer}>
              {sampledUsers.map((user, index) => {
                const isSelected = index === selectedIndex;
                const buttonStyle = isSelected
                  ? styles.buttonPressed
                  : styles.buttonContainer;
                const textStyle = isSelected
                  ? styles.buttonTextPressed
                  : styles.buttonText;

                return (
                  <TouchableOpacity
                    onPress={() => selectUser(index)}
                    style={buttonStyle}
                    key={index}
                  >
                    <Image
                      source={require("../assets/kharn.jpg")}
                      style={styles.image}
                    />
                    <Text style={textStyle}>{user.username}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            <TouchableOpacity style={styles.otherButton} onPress={togglePopup}>
              <Text style={styles.otherButtonText}>Choose Other Contact</Text>
            </TouchableOpacity>

            <Popup visible={isPopupVisible} onClose={togglePopup}>
              <View style={styles.smallerRectangle}>
                <Text style={styles.modalText}>Choose Other Contact</Text>
              </View>
              <ScrollView contentContainerStyle={styles.scrollContainer}>
                {users.map((user, index) => (
                  <TouchableOpacity
                    onPress={() => contactChosen(user, index)}
                    style={styles.chooseButtonContainer}
                    key={index}
                  >
                    <Image
                      source={require("../assets/kharn.jpg")}
                      style={styles.image}
                    />
                    <Text
                      style={
                        selectedIndex === index
                          ? styles.purpleButtonText
                          : styles.buttonText
                      }
                    >
                      {user.username}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </Popup>
          </View>
          <Text style={styles.flippedTitleText}>What did they say?</Text>
          <TextInput
            style={styles.textInput}
            placeholder=""
            placeholderTextColor="transparent"
            multiline={true}
            numberOfLines={2}
            textAlignVertical="top"
            onChangeText={setVerbatimText}
          />

          <Text style={styles.finalTitleText}>
            Who do you want to send it to?
          </Text>
          <View style={styles.suggestedContactsContainer}>
            <Text style={styles.subText}>Suggested Groups</Text>

            <View style={styles.innerContactsContainer}>
              {sampledGroups.length === 0 ? (
                <View style={styles.noGroupContainer}>
                  {selectedIndex === null ? (
                    <Text style={styles.noGroupText}>
                      Choose a Contact to See Available Groups
                    </Text>
                  ) : (
                    <Text style={styles.noGroupText}>
                      You Don't Have Groups in Common With That User
                    </Text>
                  )}
                </View>
              ) : (
                sampledGroups.map((group, index) => {
                  const isPressed = updatedIndexes.includes(group.id);
                  const buttonStyle = isPressed
                    ? styles.buttonPressed
                    : styles.buttonContainer;
                  const textStyle = isPressed
                    ? styles.buttonTextPressed
                    : styles.buttonText;

                  return (
                    <TouchableOpacity
                      style={buttonStyle}
                      key={index}
                      onPress={() => selectGroup(group.id)}
                    >
                      <Image
                        source={require("../assets/kharn.jpg")}
                        style={styles.image}
                      />
                      <Text style={textStyle}>{group.name}</Text>
                    </TouchableOpacity>
                  );
                })
              )}
            </View>

            <TouchableOpacity
              style={styles.otherButton}
              onPress={toggleGroupPopup}
            >
              <Text style={styles.otherButtonText}>Choose Other Group</Text>
            </TouchableOpacity>
          </View>

          <Popup visible={isGroupPopupVisible} onClose={toggleGroupPopup}>
            <View style={styles.smallerRectangle}>
              <Text style={styles.modalText}>Choose Other Group</Text>
            </View>
            <GroupList />
            <TouchableOpacity
              style={styles.otherButton}
              onPress={toggleGroupPopup}
            >
              <Text style={styles.otherButtonText}>Close</Text>
            </TouchableOpacity>
          </Popup>

          <TouchableOpacity
            onPress={submitVerbatim}
            style={styles.submitButton}
          >
            <Image
              source={require("../assets/send.png")}
              style={styles.image2}
            />
            <Text style={styles.submitButtonText}>Add Verbatim</Text>
          </TouchableOpacity>
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
  buttonPressed: {
    backgroundColor: "#3E63E4",
    borderRadius: 11,
    borderColor: "gray",
    paddingTop: 5,
    paddingBottom: 3,
    paddingLeft: 9,
    paddingRight: 9,
    flexDirection: "row",
    alignItems: "center",
    margin: 5,
  },

  chooseButtonContainer: {
    backgroundColor: "white",
    borderRadius: 11,
    borderWidth: 0,
    borderColor: "gray",
    paddingTop: 5,
    paddingBottom: 3,
    paddingLeft: 9,
    paddingRight: 9,
    paddingBottom: 10,
    paddingTop: 10,
    marginLeft: -5,
    marginRight: -5,

    flexDirection: "row",
    alignItems: "center",
  },
  buttonText: {
    color: "black",
    fontWeight: "bold",
    fontSize: 14,
    marginLeft: 7,
  },
  purpleButtonText: {
    color: "#3E63E4",
    fontWeight: "bold",
    fontSize: 14,
    marginLeft: 7,
  },

  buttonTextPressed: {
    color: "white",
    fontWeight: "bold",
    fontSize: 14,
    marginLeft: 7,
  },
  buttonTextInnerPressed: {
    color: "#3E63E4",
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
  alertOtherButton: {
    backgroundColor: "#3E63E4",
    borderRadius: 11,
    marginLeft: 0,
    marginRight: 0,
    paddingLeft: 10,
    paddingRight: 17,
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
  alertOtherButtonText: {
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

  alertRectangle: {
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
    padding: 0,
    display: "flex",
  },

  alertText: {
    fontSize: 20,
    color: "red",
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },

  alertDescriptionText: {
    fontSize: 15,
    color: "black",
    fontWeight: "bold",
    marginBottom: 10,
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

  // modalContainer: {
  //   flex: 1,
  //   justifyContent: 'flex-end',
  //   alignItems: 'center',
  // },
  modalContainer: {
    flex: 1,
    paddingTop: 160,
    // justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Semi-transparent background color
  },
  popupContainer: {
    backgroundColor: "#FFF",
    padding: 20,
    borderRadius: 8,
    maxHeight: "60%",
    width: "90%",
  },

  modalContent: {
    backgroundColor: "#fff",
    borderRadius: 8,
    width: "100%",
    height: "70%",
    paddingHorizontal: 16,
    paddingTop: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  addButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
    paddingBottom: 20,
  },
  noGroupText: {
    fontWeight: "bold",
    textAlign: "center",
    fontSize: 16,
    color: "#334CA4",
  },
  noGroupContainer: {
    alignItems: "center",
    flex: 1,
    marginLeft: 25,
    marginRight: 25,
    paddingTop: 10,
    paddingBottom: 10,
  },

  buttonOpen: {
    backgroundColor: "#F194FF",
  },
  buttonClose: {
    backgroundColor: "#2196F3",
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
    alignItems: "center",
  },
  modalText: {
    color: "#375FEA",
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
    /*
    marginTop: 63,
    marginRight: 185,
    */
  },
  scrollContainer: {
    flexGrow: 1,
    paddingBottom: 10,
  },
});

export default AddScreen;

