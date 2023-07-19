import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import React, { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View, Image } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";

import MainNavigator from "./pages/LoginScreen.js";
import SettingScreen from "./pages/SettingScreen.js";
import ProfileScreen from "./pages/ProfileScreen.js";
import HomeScreen from "./pages/HomeScreen.js";
import GroupScreen from "./pages/GroupScreen.js";
import AddScreen from "./pages/AddScreen.js";
import ChatScreen from "./pages/ChatScreen.js";
import SearchScreen from "./pages/SearchScreen.js";
import FriendScreen from "./pages/FriendScreen.js";
import GroupAddScreen from "./pages/GroupAddScreen.js";
import { createStackNavigator } from "@react-navigation/stack";

const Tab = createBottomTabNavigator();

export default function App() {
  const [isLoggedIn, setLoggedIn] = React.useState(false);
  const [isLoading, setLoading] = React.useState(false);
  const [userID, setUserID] = React.useState("");

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
      console.log(">>>>>HANDLE LOGIN USER ID: ", userID);
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
  const GroupStack = () => {
    return (
      <Stack.Navigator>
        <Stack.Screen name="Groups" component={GroupScreen} initialParams={{ curUserId: userID }}/>
        <Stack.Screen name="Chat" component={ChatScreen}/>
        <Stack.Screen name="CreateGroup" component={GroupAddScreen}/>
      </Stack.Navigator>
    );
  };

  const SearchStack = () => (
    <Stack.Navigator>
      <Stack.Screen name="Search" component={SearchScreen} initialParams={{ curUserId: userID }}/>
      <Stack.Screen name="Friends" component={FriendScreen}  />
      <Stack.Screen name="UserProfile" component={ProfileScreen} />
    </Stack.Navigator>
  );

  const ProfileStack = () => (
    <Stack.Navigator>
      <Stack.Screen name="Profile" component={ProfileScreen} initialParams={{ userId: userID, profileId: userID }}/>
      <Stack.Screen name="Friends" component={FriendScreen}  />
      <Stack.Screen name="UserProfile" component={ProfileScreen} />
    </Stack.Navigator>
  )

  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={{
          tabBarInactiveTintColor: "black", // Set the inactive tab text color here
          tabBarActiveTintColor: "#3E63E4", // Set the active tab text color here
          headerShown: false,
        }}
      >
        <Tab.Screen
          name="Home"
          component={HomeScreen}
          initialParams={{ value: userID }}
          options={{
            tabBarIcon: ({ focused, color, size }) => (
              <Image
                source={
                  focused
                    ? require("./assets/home-blue.png")
                    : require("./assets/home.png")
                } // Provide the path to your image file
                style={styles.bottomIcon} // Adjust the width and height of the image based on the size parameter
              />
            ),
          }}
        />
        <Tab.Screen
          name="Groups"
          component={GroupStack}
          options={{
            headerShown: false,
            tabBarIcon: ({ focused, color, size }) => (
              <Image
                source={
                  focused
                    ? require("./assets/groups-blue.png")
                    : require("./assets/groups.png")
                } // Provide the path to your image file
                style={styles.bottomIcon} // Adjust the width and height of the image based on the size parameter
              />
            ),
          }}
        />
        <Tab.Screen
          name="Profile"
          component={ProfileStack}
          options={{
            headerShown: false,
            tabBarIcon: ({ focused, color, size }) => (
              <Image
                source={
                  focused
                    ? require("./assets/profile-blue.png")
                    : require("./assets/profile.png")
                } // Provide the path to your image file
                style={styles.bottomIcon} // Adjust the width and height of the image based on the size parameter
              />
            ),
          }}
        />
        <Tab.Screen
          name="Add Verbatim"
          component={AddScreen}
          initialParams={{ userID: userID }}
          options={{
            headerShown: false,
            tabBarIcon: ({ focused, color, size }) => (
              <Image
                source={
                  focused
                    ? require("./assets/add-blue.png")
                    : require("./assets/add.png")
                } // Provide the path to your image file
                style={styles.bottomIcon} // Adjust the width and height of the image based on the size parameter
              />
            ),
          }}
        />
        <Tab.Screen
          name="Search"
          component={SearchStack}
          options={{
            headerShown: false,
            tabBarIcon: ({ focused, color, size }) => (
              <Image
                source={
                  focused
                    ? require("./assets/search-blue.png")
                    : require("./assets/search.png")
                } // Provide the path to your image file
                style={styles.bottomIcon} // Adjust the width and height of the image based on the size parameter
              />
            ),
          }}
        />
        <Tab.Screen
          name="Settings"
          component={() => <SettingScreen onLogout={handleLogout} />}
          initialParams={{ value: userID }}
          options={{
            tabBarIcon: ({ focused, color, size }) => (
              <Image
                source={
                  focused
                    ? require("./assets/settings-blue.png")
                    : require("./assets/settings.png")
                } // Provide the path to your image file
                style={styles.bottomIcon} // Adjust the width and height of the image based on the size parameter
              />
            ),
          }}
        />
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
  bottomIcon: {
    width: 25,
    height: 25,
    marginTop: 5,
  },
});
