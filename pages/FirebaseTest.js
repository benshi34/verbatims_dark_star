import React, { useState } from "react";
import { StyleSheet, View, Text, Button, TextInput } from "react-native";
import { writeUserData } from "../Firebase.js";

const FirebaseTest = ({ navigation }) => {
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");

  const createUser = () => {
    writeUserData(userName, email);
  };

  return (
    <View style={styles.container}>
      <View style={styles.label}>
        <TextInput
          style={styles.input}
          placeholder="Enter Username"
          onChangeText={(val) => setUserName(val)}
        />
      </View>

      <View style={styles.label}>
        <TextInput
          style={styles.input}
          placeholder="Enter Email"
          onChangeText={(val) => setEmail(val)}
        />
      </View>
      <Button title="Create Account!" onPress={createUser} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    padding: 50,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 100,
  },
  headerText: {
    fontSize: 20,
    color: "blue",
    fontWeight: "bold",
  },
  label: {
    marginTop: 50,
    marginLeft: 100,
  },
  input: {
    borderWidth: 1,
    borderColor: "#777",
    padding: 8,
    margin: 0,
    width: 200,
    borderRadius: 10,
  },
  buttonContainer: {
    marginTop: 20,
    marginBottom: 20,
  },
  IDFK: {
    alignItems: "center",
  },
});

export default FirebaseTest;
