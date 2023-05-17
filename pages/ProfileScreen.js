import React, { useState } from 'react';
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

export default ProfileScreen