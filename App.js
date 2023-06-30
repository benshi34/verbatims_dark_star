import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import React, { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";

import MainNavigator from "./pages/LoginScreen.js";
import SettingScreen from "./pages/SettingScreen.js";
import ProfileScreen from "./pages/ProfileScreen.js";
import HomeScreen from "./pages/HomeScreen.js";
import GroupScreen from "./pages/GroupScreen.js";
import FirebaseTest from "./pages/FirebaseTest.js";
import AddScreen from "./pages/AddScreen.js";
import ChatScreen from "./pages/ChatScreen.js";
import SearchScreen from "./pages/SearchScreen.js";
import { createStackNavigator } from '@react-navigation/stack';

const Tab = createBottomTabNavigator();

export default function App() {
  const [isLoggedIn, setLoggedIn] = React.useState(false);
  const [isLoading, setLoading] = React.useState(false);
  const [userID, setUserID] = React.useState('');

  React.useEffect(() => {
    const checkAuthentication = async () => {
      try {
        // Check if the user ID and login information exist in AsyncStorage
        const userId = await AsyncStorage.getItem("userId");
        const loggedIn = await AsyncStorage.getItem("loggedIn");
        setUserID(userId);
        // Update the authentication status based on the retrieved data
        
        console.log(">>>>>> CHECK AUTH >>>>>>");
        if (userId && loggedIn) {
          console.log("USER ID: ", userId);
          setLoggedIn(true);
        } else {
          console.log("No user logged in");
        }

        setLoading(false);
      } catch (error) {
        console.log("Error reading authentication data:", error);
      }
    };

    checkAuthentication();
  }, []);

  const handleLogin = async (userId, loggedIn) => {
    try {
      console.log(">>>>>HANDLE LOGIN USER ID: ", userID)
      // Save the user ID and login information to AsyncStorage
      await AsyncStorage.setItem("userId", userId);
      await AsyncStorage.setItem("loggedIn", loggedIn);

      setUserID(userId);
      setLoggedIn(true);
    } catch (error) {
      console.log("Error saving authentication data:", error);
    }
  };

  const handleLogout = async () => {
    try {
      // Remove the user ID and login information from AsyncStorage
      await AsyncStorage.removeItem("userId");
      await AsyncStorage.removeItem("loggedIn");

      setLoggedIn(false);
    } catch (error) {
      console.log("Error removing authentication data:", error);
    }
  };

  if (isLoading) {
    // You can show a loading screen while checking the authentication status
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading...</Text>
      </View>
    );
  }

  if (!isLoggedIn) {
    return (
      <NavigationContainer>
        <MainNavigator onLogin={handleLogin} />
      </NavigationContainer>
    );
  }

  const Stack = createStackNavigator();
  const SearchStack = () => (
    <Stack.Navigator>
      <Stack.Screen name="Search" component={SearchScreen} />
      <Stack.Screen name="UserProfile" component={ProfileScreen} />
    </Stack.Navigator>
  );  

  return (
    <NavigationContainer>
      <Tab.Navigator>
        <Tab.Screen
          name="Home"
          component={HomeScreen}
          initialParams={{ value: userID }}
        />
        <Tab.Screen
          name="Profile"
          component={ProfileScreen}
          initialParams={{ value: userID }}
        />
        <Tab.Screen
          name="Settings"
          component={() => <SettingScreen onLogout={handleLogout} />}
          initialParams={{ value: userID }}
        />
        <Tab.Screen
          name="Groups"
          component={GroupScreen}
          initialParams={{ value: userID }}
        />
        <Tab.Screen
          name="Add Verbatim"
          options={{ headerShown: false }}
          component={AddScreen}
          initialParams={{ value: userID }}
        />
        <Tab.Screen 
          name="Search Screen"
          options={{ headerShown: false }}
          component={SearchStack}/>
      </Tab.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  screen: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  label: {
    fontSize: 12,
    marginBottom: 4,
  },
  icon: {
    width: 24,
    height: 24,
  },
  tab: {
    paddingTop: 8,
  },
  bar: {
    borderTopWidth: 1,
    borderTopColor: "#ccc",
    backgroundColor: "#fff",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
