import React, { useState, useEffect } from "react";
import {
  ScrollView,
  StyleSheet,
  View,
  Text,
  Button,
  TextInput,
  TouchableOpacity,
  Keyboard,
  TouchableWithoutFeedback,
  ImageBackground,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { createNativeStackNavigator } from "react-native-screens/native-stack";
import * as Font from "expo-font";
import { createUserAuth, loginUserAuth } from "../Firebase.js";

const Stack = createNativeStackNavigator();

const Signup = ({ navigation, onLogin }) => {
  console.log("HERE onLogin prop:", onLogin);

  const [email, setEmail] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isPasswordValid, setIsPasswordValid] = useState(true);

  const handleSignup = () => {
    createUserAuth(email, password, displayName)
      .then((userId) => {
        var created = `User created with ID: ${userId}`;
        console.log(created);
        onLogin["onLogin"](userId, "true");
        // setShowing(true);
        // setMessage(created);
      })
      .catch((errorMessage) => {
        console.log(`Error creating user: ${errorMessage}`);
        // setShowing(true);
        // setMessage(errorMessage);
        // Handle the error case
      });
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
        style={styles.scrollView}
      >
        <View style={styles.signUpHeader}>
          <Text style={styles.signUpHeaderText}>Sign Up</Text>
        </View>

        <View style={styles.signUpTextInputLabel}>
          <Text style={styles.textLabel}>Email Address</Text>

          <TextInput
            style={styles.input}
            onChangeText={(val) => setEmail(val)}
            AutoCapitalize="none"
          />
        </View>

        <View style={styles.signUpTextInputLabel}>
          <Text style={styles.passwordTextLabel}>Password</Text>
          <TextInput
            style={styles.input}
            onChangeText={(val) => setPassword(val)}
            secureTextEntry={!showPassword}
          />
          <TouchableOpacity
            style={styles.visibilityButton}
            onPress={togglePasswordVisibility}
          >
            <Ionicons
              name={showPassword ? "eye-off-outline" : "eye-outline"}
              size={24}
              color="gray"
            />
          </TouchableOpacity>
        </View>

        <View style={styles.signUpTextInputLabel}>
          <Text style={styles.displayTextLabel}>Display Name</Text>
          <TextInput
            style={styles.input}
            onChangeText={(val) => setDisplayName(val)}
            AutoCapitalize="none"
          />
        </View>

        <TouchableOpacity
          style={styles.finalLoginContainer}
          onPress={handleSignup}
        >
          <Text style={styles.buttonText2}>{"Sign Up"}</Text>
        </TouchableOpacity>

        {!isPasswordValid && (
          <View>
            <Text style={styles.errorText}>
              Password must be at least 8 characters
            </Text>
          </View>
        )}
      </ScrollView>
    </TouchableWithoutFeedback>
  );
};

const Login = ({ navigation, onLogin }) => {
  const [emailAddress, setEmailAddress] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = () => {
    // Perform login logic here
    loginUserAuth(emailAddress, password)
      .then((userId) => {
        var loggedIn = `User logged in  with ID: ${userId}`;
        console.log(loggedIn);
        onLogin["onLogin"](userId, "true");
        // Handle the successful creation of the user
      })
      .catch((errorMessage) => {
        console.log(`Error logging in user: ${errorMessage}`);
        // Handle the error case
      });
  };

  const clickForgotUser = () => {
    // Log username/pw
  };

  const clickForgotPassword = () => {
    // Log username/pw
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
        style={styles.scrollView}
      >
        <View style={styles.header}>
          <Text style={styles.loginHeaderText}>Login</Text>
        </View>

        <View style={styles.label}>
          <Text style={styles.textLabel}>Email Address</Text>
          <TextInput
            style={styles.input}
            onChangeText={(val) => setEmailAddress(val)}
            AutoCapitalize="none"
          />
        </View>
        <View style={styles.label}>
          <Text style={styles.passwordTextLabel}>Password</Text>
          <TextInput
            style={styles.input}
            onChangeText={(val) => setPassword(val)}
            secureTextEntry={!showPassword}
          />
          <TouchableOpacity
            style={styles.visibilityButton}
            onPress={togglePasswordVisibility}
          >
            <Ionicons
              name={showPassword ? "eye-off-outline" : "eye-outline"}
              size={24}
              color="gray"
            />
          </TouchableOpacity>
        </View>

        <TouchableOpacity onPress={clickForgotPassword}>
          <Text style={styles.loginForgot}>Forgot Password?</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.finalLoginContainer}
          onPress={handleLogin}
        >
          <Text style={styles.buttonText2}>{"Login"}</Text>
        </TouchableOpacity>
      </ScrollView>
    </TouchableWithoutFeedback>
  );
};

const BaseScreen = ({ navigation }) => {
  const loadFonts = async () => {
    await Font.loadAsync({
      "grand-hotel": require("./GrandHotel-Regular.ttf"),
    });
  };

  useEffect(() => {
    loadFonts();
  }, []);

  const handleLoginPress = () => {
    navigation.navigate("Login");
  };

  const handleSignupPress = () => {
    navigation.navigate("Signup");
  };

  const fontStyle = StyleSheet.create({
    text: {
      fontFamily: "grand-hotel",
      fontSize: 70,
      textAlign: "center",
      color: "white",
      fontWeight: "regular",
    },
  });

  return (
    <ImageBackground
      source={require("./people.png")} // Replace with your background image path
      style={styles.imageBackground}
      imageStyle={styles.image}
    >
      <View style={styles.overlay} />
      <View style={styles.baseScreenContainer}>
        <View style={styles.baseTitleContainer}>
          <Text style={fontStyle.text}>Verbatims</Text>
        </View>

        <TouchableOpacity
          style={styles.buttonContainer2}
          onPress={handleSignupPress}
        >
          <Text style={styles.buttonText}>{"Sign Up"}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.buttonContainer3}
          onPress={handleLoginPress}
        >
          <Text style={styles.buttonText2}>{"Login"}</Text>
        </TouchableOpacity>

        {/* <View style={styles.buttonContainer}>
        <Button
          title="Already Have An Account?"
          onPress={handleLoginPress}
          style={styles.baseScreenLoginButton}
        />
      </View> */}
      </View>
    </ImageBackground>
  );
};

const MainNavigator = (onLogin) => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="  " component={BaseScreen} />
      <Stack.Screen name="Login" options={{ onLogin: onLogin }}>
        {(props) => <Login {...props} onLogin={onLogin} />}
      </Stack.Screen>
      <Stack.Screen name="Signup" options={{ onLogin: onLogin }}>
        {(props) => <Signup {...props} onLogin={onLogin} />}
      </Stack.Screen>
    </Stack.Navigator>
  );
};

const styles = StyleSheet.create({
  imageBackground: {
    flex: 1,
  },
  image: {
    resizeMode: "cover",
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "#3E63E4",
    opacity: 0.9,
  },
  container: {
    flex: 1,
    backgroundColor: "#3E63E4",
    margin: 0,
  },
  scrollView: {
    backgroundColor: "#fff",
  },
  header: {
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 80,
    marginBottom: 30,
  },
  loginHeaderText: {
    fontSize: 35,
    color: "white",
    fontWeight: "bold",
  },
  label: {
    marginTop: 20,
    alignItems: "center",
  },
  signUpTextInputLabel: {
    marginTop: 10,
    alignItems: "center",
  },
  input: {
    borderWidth: 0,
    backgroundColor: "#1F46CF",
    borderColor: "#777",
    color: "#ffffff",
    padding: 13,
    fontWeight: "bold",
    margin: 10,
    width: 300,

    borderRadius: 10,
  },
  textLabel: {
    color: "#FFFFFF",
    marginRight: 180,
    fontSize: 17,
    fontWeight: "bold",
    textAlign: "left",
  },

  displayTextLabel: {
    color: "#ffffff",
    marginRight: 190,
    fontSize: 17,
    fontWeight: "bold",
    textAlign: "left",
  },
  passwordTextLabel: {
    marginRight: 220,
    color: "#ffffff",
    fontSize: 17,
    fontWeight: "bold",
    textAlign: "left",
  },
  visibilityButton: {
    position: "absolute",
    right: 77,
    color: "white",
    top: 23,
    height: 57,
    justifyContent: "center",
    alignItems: "center",
  },
  signUpHeader: {
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 80,
    marginBottom: 30,
  },
  signUpHeaderText: {
    fontSize: 35,
    color: "white",
    fontWeight: "bold",
  },
  errorText: {
    color: "red",
    marginTop: 50,
    position: "absolute",
    alignSelf: "flex-start", // Adjusts the alignment to the start of the container
    alignSelf: "center",
    fontSize: 10,
  },
  buttonContainer: {
    marginTop: 20,
    marginBottom: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  termsAndAgreements: {
    alignItems: "center",
  },
  baseScreenContainer: {
    flex: 1,
    // backgroundColor: "#3E63E4",
  },
  baseTitleContainer: {
    padding: 10,
    marginBottom: 285,
    marginTop: 125,
  },
  baseScreenSignUpButton: {
    color: "white",
  },
  baseScreenLoginButton: {
    color: "white",
  },

  buttonContainer2: {
    backgroundColor: "#1F46CF",
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 24,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
    marginBottom: 10,
    marginLeft: 30,
    marginRight: 30,
  },

  finalLoginContainer: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 24,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 30,
    marginBottom: 20,
    marginLeft: 60,
    marginRight: 60,
  },
  buttonContainer3: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 24,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
    marginBottom: 20,
    marginLeft: 30,
    marginRight: 30,
  },
  loginForgot: {
    color: "white",
    marginLeft: 230,
    fontWeight: "bold",
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  buttonText2: {
    color: "#1F46CF",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default MainNavigator;