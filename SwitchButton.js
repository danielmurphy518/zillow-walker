import React, { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

const SwitchButton = props => {
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
    marginTop: -30,
    alignSelf: 'flex-end'
  },
  button: {
    alignItems: "center",
    backgroundColor: "white",
    padding: 7
  },
  countContainer: {
    alignItems: "center",
    padding: 0
  }
});

export default SwitchButton