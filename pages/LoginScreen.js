import React, { useState } from 'react';
import { ScrollView, StyleSheet, View, Text, Button, TextInput, TouchableOpacity, Keyboard, TouchableWithoutFeedback, } from "react-native";
import { Ionicons } from '@expo/vector-icons'; 
import { createNativeStackNavigator } from 'react-native-screens/native-stack';

const Stack = createNativeStackNavigator();

const Signup = ({ navigation }) => {
  const [username, setUsername] = useState('');
  const [MobileOrEmail, setMobileOrEmail] = useState('');
  const [FullName, setFullName] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false); 
  const [isPasswordValid, setIsPasswordValid] = useState(true);
  
  const handleSignup = () => {
    // Perform login logic here
    console.log('Signing up with: mobile/email ', MobileOrEmail, ', full name ', FullName, ', username ', username, ', password ', password);

    if (password.length < 8) {
      setIsPasswordValid(false); // Invalid password, set isPasswordValid to false
    } else {
      setIsPasswordValid(true); // Valid password, set isPasswordValid to true
    }
    
  };

  const dismissKeyboard = () => {
    Keyboard.dismiss(); // Dismiss the keyboard
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
      <TouchableWithoutFeedback onPress={dismissKeyboard}>
        <ScrollView 
          contentContainerStyle={styles.container}
          style={styles.scrollView}>
          <View style={styles.signUpHeader}>
            <Text style={styles.signUpHeaderText}>Sign Up here, noob</Text>
          </View>

          <View style={styles.signUpTextInputLabel}>
            <TextInput 
              style={styles.input} 
              placeholder='Mobile Number or Email' 
              onChangeText={(val) => setMobileOrEmail(val)}
              AutoCapitalize='none'
            />
          </View>

          <View style={styles.signUpTextInputLabel}>
            <TextInput 
              style={styles.input} 
              placeholder='Full Name' 
              onChangeText={(val) => setFullName(val)}
              AutoCapitalize='none'
            />
          </View>

          <View style={styles.signUpTextInputLabel}>
            <TextInput 
              style={styles.input} 
              placeholder='Username' 
              onChangeText={(val) => setUsername(val)}
              AutoCapitalize='none'
            />
          </View>

          <View style={styles.signUpTextInputLabel}>
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

          {!isPasswordValid && (
            <View>
              <Text style={styles.errorText}>Password must be at least 8 characters</Text>
            </View>
)}

          <View style={styles.buttonContainer}>
            <Button title='Sign Up' onPress={handleSignup} />
          </View>
          
          <View style={styles.termsAndAgreements}>
            <Text>By signing up, you agree to our Terms, Privacy Policy and Cookies Policy, and also become a slave for the rest of your life :D</Text>
          </View>

        </ScrollView>
      </TouchableWithoutFeedback>
    );
};


const Login = ({ navigation }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false); 

  const handleLogin = () => {
    // Perform login logic here
    console.log('Logging in with: username ', username, ' and password ', password);
  };
  
  const clickForgotUser = () => {
    // Log username/pw
  }

  const clickForgotPassword = () => {
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
        <ScrollView 
          contentContainerStyle={styles.container}
          style={styles.scrollView}>
          <View style={styles.header}>
            <Text style={styles.loginHeaderText}>Login here, noob</Text>
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
        </ScrollView>
      </TouchableWithoutFeedback>
    );
};



const BaseScreen = ({ navigation }) => {
  const handleLoginPress = () => {
    navigation.navigate('Login');
  };

  const handleSignupPress = () => {
    navigation.navigate('Signup');
  };

  return (
    <ScrollView 
          contentContainerStyle={styles.container}
          style={styles.scrollView}>
      <View style={styles.baseScreenContainer}>
        <View style={styles.baseTitleContainer}>
          <Text style={styles.baseScreenTitle}>
            Verbatims 
         </Text>
       </View>

       <View style={styles.buttonContainer}>
          <Button 
          title="Sign Up" 
          onPress={handleSignupPress} 
          style={styles.baseScreenSignUpButton}/>
        </View>
        <View style={styles.buttonContainer}>
          <Button 
          title="Already Have An Account?" 
          onPress={handleLoginPress} 
          style={styles.baseScreenLoginButton}/>
        </View>

     </View>
    </ScrollView>
  );
};

const MainNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="  " component={BaseScreen} />
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="Signup" component={Signup} />
    </Stack.Navigator>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollView: {
    backgroundColor: '#fff',
  },
  header: { 
    padding: 50, 
    alignItems: 'center',
    justifyContent: 'center', 
    marginBottom: 100,
  },
  loginHeaderText: {
    fontSize: 20,
    color: 'blue',
    fontWeight: 'bold',
  },
  label: {
    marginTop: 50,
    alignItems: 'center',
  },
  signUpTextInputLabel: {
    marginTop: 10,
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
  signUpHeader: {
    padding: 50, 
    alignItems: 'center',
    justifyContent: 'center', 
    marginBottom: 0,
  },
  signUpHeaderText: {
    fontSize: 20,
    color: 'blue',
    fontWeight: 'bold',
  },
  errorText: {
    color: 'red',
    marginTop: 50,
    position: 'absolute',
    alignSelf: 'flex-start', // Adjusts the alignment to the start of the container
    alignSelf: 'center',
    fontSize: 10
  },
  buttonContainer: {
    marginTop: 20,
    marginBottom: 20,
  },
  termsAndAgreements: {
    alignItems: 'center',
  },
  baseScreenContainer: {
    flex: 1,
    backgroundColor: '#3E63E4',
  },
  baseTitleContainer: {
    padding: 10,
    marginBottom: 250,
  },
  baseScreenSignUpButton: {
    color: 'white',
  },
  baseScreenLoginButton: {
    color: 'white',
  },
  baseScreenTitle: {
    fontFamily: 'Zapfino',
    fontSize: 30,
    textAlign: 'center',
    color: 'white',
  },
}); 


export default MainNavigator