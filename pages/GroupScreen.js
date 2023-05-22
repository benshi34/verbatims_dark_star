import { StyleSheet, View, Text, Button, TextInput } from "react-native";

const GroupScreen = ({ navigation }) => {
  // const [Groups, setGroups] = useState([]);

  

  // const renderGroups = ({ item }) => {
  //   return (
  //     <View style={styles.postContainer}>
  //       <View style={styles.userContainer}>
  //         <Image source={item.profilePic} style={styles.profilePic} />
  //         <Text style={styles.username}>{item.user}</Text>
  //       </View>
  //       <View style={styles.postTextContainer}>
  //         <Text style={styles.postText}>{item.post}</Text>
  //       </View>
  //     </View>
  //   );
  // };

    return (
      <View style={styles.container}>
      <Text style={styles.header}>Groups</Text>
      {/* <FlatList
        data={Groups}
        renderItem={renderGroups}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContainer}
        /> */}
    </View>
    );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  listContainer: {
    paddingBottom: 16,
  },
  postContainer: {
    backgroundColor: '#f5f5f5',
    padding: 16,
    marginBottom: 16,
    borderRadius: 8,
    flexDirection: 'column',
    alignItems: 'flex-start',
    position: 'relative',
  },
  userContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  profilePic: {
    width: 24,
    height: 24,
    borderRadius: 12,
    marginRight: 8,
  },
  postTextContainer: {
    flex: 1,
  },
  username: {
    fontWeight: 'bold',
  },
  postText: {
    fontSize: 16,
  },
});

export default GroupScreen