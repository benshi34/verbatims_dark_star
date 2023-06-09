import { onLog } from "firebase/app";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Button,
  SafeAreaView,
} from "react-native";

const SettingScreen = ({ navigation, onLogout }) => {
  console.log("onLogout prop:", onLogout);
  const handleLogout = async () => {
    try {
      onLogout();
    } catch (error) {
      console.log("Error saving authentication data:", error);
    }
  };

  return (
    <View style={styles.container}>
      <View style={{ flex: 1, display: "flex" }}>
        <TouchableOpacity style={styles.button}>
          <Text style={styles.text}>Profile</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button}>
          <Text style={styles.text}>Friends</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button}>
          <Text style={styles.text}>Verbatims Premium</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button}>
          <Text style={styles.text}>Password</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button}>
          <Text style={styles.text}>Privacy</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button}>
          <Text style={styles.text}>Notifications</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button}>
          <Text style={styles.text}>Help</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button}>
          <Text style={styles.text} onPress={handleLogout}>
            Logout
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: "#147EFB",
    padding: 20,
    borderRadius: 4,
    borderColor: "black",
    borderWidth: 1,
  },
  text: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
  },
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
});
export default SettingScreen;
