import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';

import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

import LoginScreen from './pages/LoginScreen.js';
import SettingScreen from './pages/SettingScreen.js';
import ProfileScreen from './pages/ProfileScreen.js';
import HomeScreen from './pages/HomeScreen.js';
import GroupScreen from './pages/GroupScreen.js';
import FirebaseTest from './pages/FirebaseTest.js';
import AddScreen from './pages/AddScreen.js';

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator>
        <Tab.Screen name="Home" component={HomeScreen} />
        <Tab.Screen name="Profile" component={ProfileScreen} />
        <Tab.Screen
          name="Login"
          component={LoginScreen}
          options={{
            headerShown: false,
            color: "blue",
          }}
        />
        <Tab.Screen name="Settings" component={SettingScreen} />
        <Tab.Screen name="Firebase Test" component={FirebaseTest} />
        <Tab.Screen name="Groups" component={GroupScreen} />
        <Tab.Screen name="Add Verbatim" component={AddScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  screen: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
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
    borderTopColor: '#ccc',
    backgroundColor: '#fff',
  }, 
});
