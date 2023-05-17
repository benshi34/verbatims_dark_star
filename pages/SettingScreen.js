import { View, Text, TouchableOpacity, StyleSheet, Button, SafeAreaView } from "react-native"

const SettingScreen = ({ navigation }) => {
    return (
      <View style ={styles.container}>
        <View style={styles.header}>
        <Text style={styles.headerText}>Settings</Text>
        </View>

        <View
      style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
    >
      <TouchableOpacity style={{ backgroundColor: '#147EFB', padding: 10, borderRadius:4 }}>
        <Text style={{ color: '#fff' }}>Profile</Text>
      </TouchableOpacity>

      <TouchableOpacity style={{ backgroundColor: '#147EFB', padding: 10, borderRadius:4 }}>
        <Text style={{ color: '#fff' }}>Friends</Text>
      </TouchableOpacity>

      <TouchableOpacity style={{ backgroundColor: '#147EFB', padding: 10, borderRadius:4 }}>
        <Text style={{ color: '#fff' }}>Verbatims Premium</Text>
      </TouchableOpacity>

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
        backgroundColor: 'orange',
        alignItems: 'center',
        justifyContent: 'center', 
        borderRadius: 4
      },
      IDFK: {
        alignItems: 'center',
      }
    }); 
export default SettingScreen