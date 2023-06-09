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
import { createUserAuth, loginUserAuth, sendResetEmail } from "../Firebase.js";
import { getAuth } from "firebase/auth";

const Stack = createNativeStackNavigator();

const Signup = ({ navigation, onLogin }) => {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isPasswordValid, setIsPasswordValid] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  const handleSignup = () => {
    if (password.length < 8) {
      message = "Password is too short (must be at least 8 characters).";
      setErrorMessage(message);
      return;
    }

    createUserAuth(email, password, username)
      .then((userId) => {
        var created = `User created with ID: ${userId}`;
        console.log(created);
        onLogin["onLogin"](userId, "true");
        // setShowing(true);
        // setMessage(created);
        setErrorMessage("");
      })
      .catch((errorMessage) => {
        console.log(`Error creating user: ${errorMessage}`);

        message =
          "We are unable to sign you up at this time. Please try again later.";

        if (errorMessage === "auth/email-already-in-use") {
          message =
            "This email is already associated with an account. Please login instead.";
        }

        setErrorMessage(message);
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
            autoCapitalize="none"
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
          <Text style={styles.usernameTextLabel}>Username</Text>
          <TextInput
            style={styles.input}
            onChangeText={(val) => setUsername(val)}
            AutoCapitalize="none"
          />
        </View>

        <TouchableOpacity
          style={styles.finalLoginContainer}
          onPress={handleSignup}
        >
          <Text style={styles.buttonText2}>{"Sign Up"}</Text>
        </TouchableOpacity>

        {errorMessage !== "" && (
          <View>
            <Text style={styles.errorText}>{errorMessage}</Text>
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
  const [errorMessage, setErrorMessage] = useState("");

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
        setErrorMessage("");

        message =
          "We are unable to log you in at this time. Please try again later.";

        if (errorMessage === "auth/wrong-password") {
          message =
            "Invalid login credentials. The password you entered does not match the email account.";
        }

        if (errorMessage === "auth/too-many-requests") {
          message =
            "Login attempts exceeded for this account. Please try again later.";
        }

        if (errorMessage === "auth/user-not-found") {
          message =
            "We couldn't find a user associated with that email. Please sign up if you don't have an account registered with us yet.";
        }

        setErrorMessage(message);
      });
  };

  const clickForgotPassword = () => {
    navigation.navigate("ForgotPassword");
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
            autoCapitalize="none"
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

        {errorMessage !== "" && (
          <View>
            <Text style={styles.errorText}>{errorMessage}</Text>
          </View>
        )}
      </ScrollView>
    </TouchableWithoutFeedback>
  );
};

const ForgotPassword = ({ navigation, onLogin }) => {
  const [emailAddress, setEmailAddress] = useState("");
  const [confirmationMessage, setConfirmationMessage] = useState("");

  const handlePasswordReset = () => {
    sendResetEmail(emailAddress);
    setConfirmationMessage(
      "We sent a password reset email to you! Please check your email to reset your password."
    );
  };

  const dismissKeyboard = () => {
    Keyboard.dismiss(); // Dismiss the keyboard
  };

  return (
    <TouchableWithoutFeedback onPress={dismissKeyboard}>
      <ScrollView
        contentContainerStyle={styles.container}
        style={styles.scrollView}
      >
        <View style={styles.header}>
          <Text style={styles.loginHeaderText}>Forgot Password?</Text>
        </View>

        <View style={styles.label}>
          <Text style={styles.textLabelForgot}>
            Enter your email address below to get a password reset link.
          </Text>
          <TextInput
            style={styles.inputForgot}
            onChangeText={(val) => setEmailAddress(val)}
            autoCapitalize="none"
          />
        </View>
        <TouchableOpacity
          style={styles.finalLoginContainer}
          onPress={handlePasswordReset}
        >
          <Text style={styles.buttonText2}>{"Reset Your Password"}</Text>
        </TouchableOpacity>

        {confirmationMessage !== "" && (
          <View>
            <Text style={styles.confirmationText}>{confirmationMessage}</Text>
          </View>
        )}
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
      <Stack.Screen name="ForgotPassword" component={ForgotPassword} />
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
  inputForgot: {
    borderWidth: 0,
    backgroundColor: "#1F46CF",
    borderColor: "#777",
    color: "#ffffff",
    padding: 13,
    fontWeight: "bold",
    margin: 10,
    marginBottom: -5,
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
  textLabelForgot: {
    color: "#FFFFFF",
    marginRight: 0,
    marginBottom: 20,
    fontSize: 17,
    width: 320,
    fontWeight: "bold",
    textAlign: "center",
  },

  displayTextLabel: {
    color: "#ffffff",
    marginRight: 190,
    fontSize: 17,
    fontWeight: "bold",
    textAlign: "left",
  },

  usernameTextLabel: {
    color: "#ffffff",
    marginRight: 218,
    fontSize: 17,
    fontWeight: "bold",
    textAlign: "left",
  },

  fullNameTextLabel: {
    color: "#ffffff",
    marginRight: 218,
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
    color: "#FF7272",
    marginTop: 10,
    marginLeft: 60,
    width: 300,
    fontWeight: "bold",
    alignSelf: "flex-start", // Adjusts the alignment to the start of the container
    fontSize: 15,
  },
  confirmationText: {
    color: "white",
    marginTop: 10,
    marginLeft: 60,
    width: 300,
    fontWeight: "bold",
    alignSelf: "flex-start", // Adjusts the alignment to the start of the container
    fontSize: 15,
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