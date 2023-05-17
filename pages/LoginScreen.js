import React, { useState } from 'react';
import { StyleSheet, View, Text, Button, TextInput } from "react-native";

const LoginScreen = ({ navigation }) => {
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');
  
  const clickForgotUser = () => {
    // Log username/pw
  }

  const clickForgotPass = () => {
    // Log username/pw
  }

  const clickLoginHandler = () => {
    // Log username/pw
  }

  const clickSignupHandler = () => {
    // Log username/pw
  }



  return (
      <View style={styles.container}>
        <View style={styles.header}>
        <Text style={styles.headerText}>Login here, noob</Text>
        </View>

        <View style={styles.label}>
        <TextInput 
          style={styles.input} 
          placeholder='Username' 
          onChangeText={(val) => setUserName(val)}/>
        </View>
        <Button title='forgot username?' onPress={clickForgotUser}/>

        <View style={styles.label}>
        <TextInput 
          style={styles.input}
          placeholder='Password' 
          onChangeText={(val) => setPassword(val)}/>
        </View>
        <Button title='forgot password?' onPress={clickForgotPass}/>

        <View style={styles.buttonContainer}>
          <Button title='Signup nerd' onPress={clickSignupHandler} />
        </View>
        
        <View style={styles.IDFK}>
        <Text>--------or--------</Text>
        </View>

        <View style={styles.buttonContainer}>
          <Button title='Login!!' onPress={clickLoginHandler} />
        </View>
      </View>
    );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: { 
    padding: 50, 
    alignItems: 'center',
    justifyContent: 'center', 
    marginBottom: 100,
  },
  headerText: {
    fontSize: 20,
    color: 'blue',
    fontWeight: 'bold',
  },
  label: {
    marginTop: 50,
    marginLeft: 100,
  },
  input: {
    borderWidth: 1, 
    borderColor: '#777',
    padding: 8,
    margin: 10,
    width: 200, 
    borderRadius: 10,
  },
  buttonContainer: {
    marginTop: 20,
    marginBottom: 20,
  },
  IDFK: {
    alignItems: 'center',
  }
}); 
export default LoginScreen