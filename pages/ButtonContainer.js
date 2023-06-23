import React from "react";
import { View, StyleSheet, Button } from "react-native";

const ButtonContainer = () => {
  return (
    <View style={styles.container}>
      <Button title="Button 1" onPress={() => {}} />
      <Button title="Buttonfkjnfkjfnknlwknfflerjnjknj 2" onPress={() => {}} />
      <Button title="Button 3" onPress={() => {}} />
      <Button title="Button 4" onPress={() => {}} />
      <Button title="Button 5" onPress={() => {}} />
      <Button title="Button 6" onPress={() => {}} />
      <Button title="Button 7" onPress={() => {}} />
      <Button title="Button 8" onPress={() => {}} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
});

export default ButtonContainer;
