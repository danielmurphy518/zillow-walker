import React, { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

const buttonWithBackground = props => {
  const [count, setCount] = useState(0);
  

  return (
    <View style={styles.container}>
      <View style={styles.countContainer}>
      </View>
      <TouchableOpacity
        style={styles.button}
        onPress={props.onPress}
      >
        <Text style={{fontWeight:'bold'}}>{props.text}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 20
  },
  button: {
    alignItems: "center",
    backgroundColor: "white",
    padding: 30
  },
  countContainer: {
    alignItems: "center",
    padding: 0
  }
});

export default buttonWithBackground