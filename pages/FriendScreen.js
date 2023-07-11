import { View, Text, FlatList, StyleSheet, Image, TouchableOpacity } from 'react-native';

const FriendScreen = ({ route }) => {
    const { userId, profileId } = route.params;
    const friendsData = [
        { id: '1', name: 'John Doe'},
        { id: '2', name: 'Jane Smith'},
        { id: '3', name: 'Alex Johnson'},
        // Add more friend objects as needed
    ];

    const friendRequestsData = [
        { id: '4', name: 'Emily Davis'},
        { id: '5', name: 'Michael Brown'},
        { id: '6', name: 'Olivia Wilson'},
        // Add more friend request objects as needed
      ];

    const renderFriendItem = ({ item }) => {
        return (
            <View style={styles.friendItemContainer}>
            <Image source={item.avatar} style={styles.friendAvatar} />
            <Text style={styles.friendName}>{item.name}</Text>
            </View>
        );
    };
    
    const renderFriendRequestItem = ({ item }) => {
        return (
          <View style={styles.friendRequestItemContainer}>
            <Image source={item.avatar} style={styles.friendRequestAvatar} />
            <Text style={styles.friendRequestName}>{item.name}</Text>
            <TouchableOpacity style={styles.acceptButton}>
              <Text style={styles.acceptButtonText}>Accept</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.declineButton}>
              <Text style={styles.declineButtonText}>Decline</Text>
            </TouchableOpacity>
          </View>
        );
    };

    return (
        <View style={styles.container}>
          <Text style={styles.title}>Friends</Text>
          <FlatList
            data={friendsData}
            renderItem={renderFriendItem}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.listContainer}
          />
          <Text style={styles.title}>Friend Requests</Text>
          <FlatList
            data={friendRequestsData}
            renderItem={renderFriendRequestItem}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.listContainer}
          />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      paddingHorizontal: 20,
      paddingTop: 20,
      backgroundColor: '#fff',
    },
    title: {
      fontSize: 20,
      fontWeight: 'bold',
      marginBottom: 10,
    },
    friendItemContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 10,
    },
    friendAvatar: {
      width: 50,
      height: 50,
      borderRadius: 25,
      marginRight: 10,
    },
    friendName: {
      fontSize: 16,
      fontWeight: 'bold',
    },
    friendRequestItemContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 10,
    },
    friendRequestAvatar: {
      width: 50,
      height: 50,
      borderRadius: 25,
      marginRight: 10,
    },
    friendRequestName: {
      flex: 1,
      fontSize: 16,
      fontWeight: 'bold',
    },
    acceptButton: {
      backgroundColor: '#2ecc71',
      borderRadius: 5,
      paddingVertical: 5,
      paddingHorizontal: 10,
      marginRight: 10,
    },
    acceptButtonText: {
      color: '#fff',
      fontWeight: 'bold',
    },
    declineButton: {
      backgroundColor: '#e74c3c',
      borderRadius: 5,
      paddingVertical: 5,
      paddingHorizontal: 10,
    },
    declineButtonText: {
      color: '#fff',
      fontWeight: 'bold',
    },
    listContainer: {
      paddingBottom: 20,
    },
  });
export default FriendScreen