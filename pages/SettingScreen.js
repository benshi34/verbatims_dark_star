import { View, Text, TouchableOpacity, StyleSheet } from "react-native"

const SettingScreen = ({ navigation }) => {
    return (
      <View style ={styles.container}>
        <View style = {styles.header}>
        <Text style = {styles.boldText}> Setting Screen </Text>
        </View>
        <View style = {styles.body}> 
        <TouchableOpacity><Text>Profile </Text></TouchableOpacity>
        <TouchableOpacity><Text>Friends</Text></TouchableOpacity>
        <TouchableOpacity><Text>Premium Verbatims</Text></TouchableOpacity>
        </View>
      </View>
    );
    };

    const styles = StyleSheet.create({
      container: {
        flex: 1,
        backgroundColor: '#fff',
      },
      header: { 
        padding: 50, 
        alignItems: 'center',
        justifyContent: 'center', 
        marginBottom: 100,
      },
      headerText: {
        fontSize: 20,
        color: 'blue',
        fontWeight: 'bold',
      },
      label: {
        marginTop: 50,
        marginLeft: 100,
      },
      input: {
        borderWidth: 1, 
        borderColor: '#777',
        padding: 8,
        margin: 10,
        width: 200, 
        borderRadius: 10,
      },
      buttonContainer: {
        marginTop: 20,
        marginBottom: 20,
      },
      IDFK: {
        alignItems: 'center',
      }
    }); 
export default SettingScreen