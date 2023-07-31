import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  ScrollView,
  StyleSheet,
  Image,
  TouchableOpacity,
  Button,
  TextInput,
} from "react-native";
import { getDatabase, ref, get, onValue } from "firebase/database";
import {
  getStorage,
  ref as refStorage,
  getDownloadURL,
} from "firebase/storage";
import { app } from "../Firebase.js";
import { useNavigation } from "@react-navigation/native";

const storage = getStorage();

const GroupAddScreen = ({ route }) => {
  const { id } = route.params;
  console.log(id);
  const [groupName, setGroupName] = useState("");
  const [users, setUsers] = useState([]);
  const [pressedIndices, setPressedIndices] = useState([]);

  const db = getDatabase(app);
  const navigation = useNavigation();

  const createGroup = () => {
    navigation.goBack();
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

  const fetchUsers = () => {
    console.log("USER ID");
    console.log(id);
    const dbref = ref(db, "Users/" + id + "/friends");
    get(dbref)
      .then((snapshot) => {
        if (snapshot.exists()) {
          data = snapshot.val();
          let friends = Object.values(data);
          console.log(friends);

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
              console.log(users);
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

  const userSelected = (index, user) => {
    if (pressedIndices.includes(index)) {
      setPressedIndices(
        pressedIndices.filter((pressedIndex) => pressedIndex !== index)
      );
    } else {
      setPressedIndices([...pressedIndices, index]);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.centerContainer}>
        <Text style={styles.title}>Create New Group</Text>
        <TextInput
          placeholder="Group Name"
          value={groupName}
          onChangeText={(text) => setGroupName(text)}
          style={styles.input}
        />
      </View>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {users.map((user, index) => {
          const isPressed = pressedIndices.includes(index);
          const buttonStyle = isPressed
            ? styles.listText
            : styles.purpleButtonText;
          return (
            <TouchableOpacity
              onPress={() => userSelected(index, user)}
              style={styles.chooseButtonContainer}
              key={index}
            >
              <Image
                source={require("../assets/kharn.jpg")}
                style={styles.image}
              />
              <Text style={buttonStyle}>{user["username"]}</Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
      <View style={styles.centerContainer}>
        <TouchableOpacity style={styles.button} onPress={createGroup}>
          <Text style={styles.buttonText}>Create Group Chat</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: 30,
    // justifyContent: 'center',
    // alignItems: "center",
    backgroundColor: "white",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  image: {
    width: 20,
    height: 20,
    borderRadius: 20,
  },
  input: {
    width: "80%",
    height: 40,
    borderRadius: 8,
    borderColor: "#CCCCCC",
    borderWidth: 1,
    paddingHorizontal: 10,
    marginBottom: 20,
  },
  centerContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
  purpleButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#3E63E4",
    marginLeft: 10,
  },
  button: {
    width: "80%",
    height: 40,
    backgroundColor: "#4287f5",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
  },
  listText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "black",
    marginLeft: 10,
  },
  scrollContainer: {
    paddingLeft: 40,
    marginBottom: 20,
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
});

export default GroupAddScreen