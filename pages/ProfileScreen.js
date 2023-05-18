import React from 'react';
import { View, Image, TouchableOpacity, Text, StyleSheet, ImageBackground } from 'react-native';

const ProfileScreen = () => {
  const handleImagePress = () => {
    // Handle the button press event here
    console.log('Image button pressed!');
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={handleImagePress} style={styles.imageButton}>
        <Image source={require('../assets/favicon.png')} style={styles.image} />
      </TouchableOpacity>
      <Text style={styles.text}>Verbatims You Said</Text>
      <ImageBackground source={require('../assets/icon.png')} style={styles.backgroundImage}>
        <View style={{position: 'absolute', top: 0, left: 0, right: 100, bottom: 75, justifyContent: 'center', alignItems: 'center'}}>
          <Text>Mark Said</Text>
        </View>
        <View style={{position: 'absolute', top: 0, left: 0, right: 0, bottom: 25, justifyContent: 'center', alignItems: 'center'}}>
          <Text>"Ben Sucks Sooooo Much"</Text>
        </View>
        <View style={{position: 'absolute', top: 0, left: 0, right: 0, bottom: -25, justifyContent: 'center', alignItems: 'center'}}>
          <Text>"Submitted by Adam Kelch"</Text>
        </View>
      </ImageBackground>
      <Text style={styles.text}>Verbatims You Submitted</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start', // Align items to the top
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  imageButton: {
    marginTop: 50, // Add top margin for spacing
  },
  image: {
    width: 200,
    height: 200,
  },
  backgroundImage: {
    position: 'relative',
    width: 200,
    height: 100,
  },
  text: {
    marginTop: 20,
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default ProfileScreen;

/*import React, { useState } from 'react';
import { StyleSheet, View, Text, Button, TextInput } from "react-native";

const ProfileScreen = ({ navigation }) => {
    return (
      <View>
        <Text>Profile Screen </Text>
      </View>
    );
    };

ProfileScreen.navigationOptions = {
  tabBarLabel: 'Profile',
  tabBarIcon: ({ tintColor }) => (
    <Icon name="gear" size={24} color={tintColor} />
  ),
  tabBarAccessibilityLabel: 'Home Tab',
};

export default ProfileScreen*/