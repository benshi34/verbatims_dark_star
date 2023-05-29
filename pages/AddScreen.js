import React, { useState } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  TouchableWithoutFeedback, 
  Keyboard 
} from "react-native";

/*
import { useNavigation } from '@react-navigation/native';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';

import HomeScreen from './HomeScreen.js';
*/

import { app } from "../Firebase.js";
import { getDatabase, ref, set, get, child, once } from "firebase/database"

const db = getDatabase(app);

const AddScreen = ({ navigation }) => {
  const [verbatim, addVerbatim] = useState('');
  const [verbaiter, setVerbaiter] = useState(''); 
  
  const submitVerbatim = () => {
    set(ref(db, 'SentVerbatims/' + verbaiter), {
      Verbatim: verbatim, 
    });

    addVerbatim('');
    setVerbaiter('');
  };


  const dismissKeyboard = () => {
    Keyboard.dismiss(); // Dismiss the keyboard
  };

  return (
    <TouchableWithoutFeedback onPress={dismissKeyboard}>
      <View style={styles.container}>
        <View style={styles.headerContainer}>
          <Text style={styles.headerText}>Sugma Sugandese Deez Beekeeper SlowBunny</Text>
        </View>

        <View style={styles.verbaiterContainer}>
          <Text style={styles.verbaiterText}>
            Verbaiter:   
          </Text> 
          <TextInput
          style={styles.verbaiterInputTextbox}
          placeholder='e.g. Benshi shi shi'
          placeholderTextColor="#999"
          onChangeText={(val) => setVerbaiter(val)}
          value={verbaiter}
          />
        </View>
          
        <View style={styles.verbatimInputContainer}>
          <TextInput 
          multiline={true}
          style={styles.verbatimInputTextbox} 
          placeholder='"I looooooooooooooooove pp <3 :D :D :D <3 :3 ( ; = ;) 8======D" ' 
          onChangeText={(val) => addVerbatim(val)}
          value={verbatim}
          />
                
          <TouchableOpacity 
          style={styles.addButton}
          onPress={submitVerbatim}>
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
    verbaiterContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginLeft: 83, 
      marginTop: 100,
    },
    verbaiterText: {
      fontSize: 16,
      fontWeight: 'bold', 
      color: 'blue',
    },
    verbaiterInputTextbox: {
      flex: 0.635,
      borderWidth: 1,
      borderColor: '#777',
      padding: 8,
      marginLeft: 10,
      borderRadius: 10,
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