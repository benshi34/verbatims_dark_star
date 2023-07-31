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

const SettingScreen = ({ navigation, onLogout }) => {

  const [isPopupVisible, setPopupVisible] = useState(false);
  const [profileUsername, setProfileUsername] = useState('');
  //const { userId, profileId } = route.params;

  console.log("onLogout prop:", onLogout);
  const handleLogout = async () => {
    try {
      onLogout();
    } catch (error) {
      console.log("Error saving authentication data:", error);
    }
  };

  useEffect(() => {

    const findUsername = async () => {
      //console.log("1");
      const dbref = ref(db, 'Users/' + profileId);
      onValue(dbref, (snapshot) => {
        if (snapshot.exists()) {
          setProfileUsername(snapshot.val().username);
        }
      }).catch((error) => {
        //console.log("6");
        console.error(error);
      });
    }

    findUsername();

  }, []);

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

  const togglePopup = () => {
    setPopupVisible(!isPopupVisible);
  };

  const updateUsername = (userID) => {

  }

  return (
    <View style={styles.container}>
      <View style={{ flex: 1, display: "flex" }}>
        <TouchableOpacity style={styles.button}>
          <Text style={styles.text}>Account Information</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button}>
          <Text style={styles.text}>Friends</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button}>
          <Text style={styles.text}>Verbatims Premium</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button}>
          <Text style={styles.text}>Password</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.button}>
          <Text style={styles.text}>Privacy</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button}>
          <Text style={styles.text}>Notifications</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button}>
          <Text style={styles.text}>Help</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button}>
          <Text style={styles.text} onPress={handleLogout}>
            Logout
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={togglePopup}>
          <Text style={styles.text}>Change Username</Text>
        </TouchableOpacity>

        <Popup visible={isPopupVisible} onClose={togglePopup} animationType="slide">
          <View>
            <TextInput
            style={styles.input}
            placeholder="Put new username here"
            placeholderTextColor="#888"/>
            <TouchableOpacity>
              <Text>Change Username</Text>
            </TouchableOpacity>
          </View>
        </Popup>
        
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: "#147EFB",
    padding: 20,
    borderRadius: 4,
    borderColor: "black",
    borderWidth: 1,
  },
  text: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
  },
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  popupContainer: {
    backgroundColor: "#FFF",
    padding: 20,
    borderRadius: 8,
    maxHeight: "60%",
    width: "90%",
  },
  modalContainer: {
    flex: 1,
    paddingTop: 160,
    // justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Semi-transparent background color
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 16,
    fontSize: 16,
    color: '#333',
    backgroundColor: '#fff',
  },
});
export default SettingScreen;
