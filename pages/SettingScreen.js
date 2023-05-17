import { View, Text, TouchableOpacity, StyleSheet } from "react-native"

const SettingScreen = ({ navigation }) => {
    return (
      <View style ={style.container}>
        <View style = {style.header}>
        <Text style = {style.boldText}> Setting Screen </Text>
        </View>
        <View style = {style.body}> 
        <TouchableOpacity><Text>Profile </Text></TouchableOpacity>
        <TouchableOpacity><Text>Friends</Text></TouchableOpacity>
        <TouchableOpacity><Text>Premium Verbatims</Text></TouchableOpacity>
        </View>
      </View>
    );
    };

const style = StyleSheet.create({
  container: {
    flex:1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  header: {
    backgroundColor: 'blue',
    padding: 20,
  },
  boldText: {
    fontWeight: 'bold',
    fontSize: 20
  },
  body: {
    padding: 20
  },
});
export default SettingScreen