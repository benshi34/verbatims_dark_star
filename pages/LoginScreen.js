import React, { useState } from 'react';
import { StyleSheet, View, Text, Button, TextInput, TouchableOpacity, Keyboard, TouchableWithoutFeedback } from "react-native";
import { Ionicons } from '@expo/vector-icons'; 

const LoginScreen = ({ navigation }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false); 
  //const [isPasswordValid, setIsPasswordValid] = useState(true);
  
  const handleLogin = () => {
    // Perform login logic here
    console.log('Logging in with: username ', username, ' and password ', password);
    
    /*if (password.length < 8) {
      setIsPasswordValid(false); // Invalid password, set isPasswordValid to false
    } else {
      setIsPasswordValid(true); // Valid password, set isPasswordValid to true
    }
    */
  };
  
  const clickForgotUser = () => {
    // Log username/pw
  }

  const clickForgotPassword = () => {
    // Log username/pw
  }

  const clickSignupHandler = () => {
    // Log username/pw
  }

  const dismissKeyboard = () => {
    Keyboard.dismiss(); // Dismiss the keyboard
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };


  return (
      <TouchableWithoutFeedback onPress={dismissKeyboard}>
        <View style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.headerText}>Login here, noob</Text>
          </View>

          <View style={styles.label}>
            <TextInput 
              style={styles.input} 
              placeholder='Username' 
              onChangeText={(val) => setUsername(val)}
              AutoCapitalize='none'
            />
          </View>
          
          <Button title='forgot username?' onPress={clickForgotUser}/>

          <View style={styles.label}>
            <TextInput 
              style={styles.input}
              placeholder='Password' 
              onChangeText={(val) => setPassword(val)}
              secureTextEntry={!showPassword}
            />   
            <TouchableOpacity style={styles.visibilityButton} onPress={togglePasswordVisibility}>
              <Ionicons
                name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                size={24}
                color="gray"
              />
            </TouchableOpacity>
          </View>
          
          <View>
            <Button title='forgot password?' onPress={clickForgotPassword}/>
          </View>

          <View style={styles.buttonContainer}>
            <Button title='Login!!' onPress={handleLogin} />
          </View>
          
          <View style={styles.IDFK}>
            <Text>--------or--------</Text>
          </View>
          
          <View style={styles.buttonContainer}>
            <Button title='Signup nerd' onPress={clickSignupHandler} />
          </View>
          
        </View>
      </TouchableWithoutFeedback>
    );
};

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
    alignItems: 'center',
  },
  input: {
    borderWidth: 1, 
    borderColor: '#777',
    padding: 8,
    margin: 10,
    width: 200, 
    borderRadius: 10,
  },
  visibilityButton: {
    position: 'absolute',
    right: 120,
    height: 55,
    justifyContent: 'center',
    alignItems: 'center',
  },
  /*errorText: {
    color: 'red',
    marginTop: 50,
    position: 'absolute',
    alignSelf: 'flex-start', // Adjusts the alignment to the start of the container
    alignSelf: 'center',
    fontSize: 10
  },*/
  buttonContainer: {
    marginTop: 20,
    marginBottom: 20,
  },
  IDFK: {
    alignItems: 'center',
  }
}); 
export default LoginScreen