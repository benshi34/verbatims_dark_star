import React, { useState } from "react";
import { StyleSheet, View, Text, Button, TextInput } from "react-native";
import { createUserAuth, loginUserAuth } from "../Firebase.js";

const FirebaseTest = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [username, setUsername] = useState("");
  const [showing, setShowing] = useState(false); // New state for showing
  const [message, setMessage] = useState(""); // New state for showing

  const createUser = () => {
    createUserAuth(email, pass, username)
      .then((userId) => {
        var created = `User created with ID: ${userId}`;
        console.log(created);
        setShowing(true);
        setMessage(created);
      })
      .catch((errorMessage) => {
        console.log(`Error creating user: ${errorMessage}`);
        setShowing(true);
        setMessage(errorMessage);
        // Handle the error case
      });
  };

  const loginUser = () => {
    loginUserAuth(email, pass)
      .then((userId) => {
        var loggedIn = `User logged in  with ID: ${userId}`;
        console.log(loggedIn);
        setShowing(true);
        setMessage(loggedIn);
        // Handle the successful creation of the user
      })
      .catch((errorMessage) => {
        console.log(`Error logging in user: ${errorMessage}`);
        setShowing(true);
        setMessage(errorMessage);
        // Handle the error case
      });
  };

  return (
    <View style={styles.container}>
      <View style={styles.label}>
        <TextInput
          style={styles.input}
          placeholder="Enter Email"
          onChangeText={(val) => setEmail(val)}
          autoCapitalize="none"
        />
      </View>
      <View style={styles.label}>
        <TextInput
          style={styles.input}
          placeholder="Enter Password"
          onChangeText={(val) => setPass(val)}
          autoCapitalize="none"
        />
      </View>
      <View style={styles.label}>
        <TextInput
          style={styles.input}
          placeholder="Enter Display Name"
          onChangeText={(val) => setUsername(val)}
        />
      </View>

      <Button title="Create Account!" onPress={createUser} />
      <Button title="Login!" onPress={loginUser} />

      <Text style={styles.text}>{showing ? message : null}</Text>
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
