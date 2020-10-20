import React from "react";
import { StyleSheet, Text, TouchableOpacity } from "react-native";
import { FontAwesome } from "@expo/vector-icons";

const AppSignoutButton = ({ title, onPress }) => {
  return (
    <TouchableOpacity style={styles.button} onPress={onPress}>
      <FontAwesome
        style={styles.icon}
        name="sign-out"
        size={30}
        color="white"
      />
      <Text style={styles.text}>{title}</Text>
    </TouchableOpacity>
  );
};

export default AppSignoutButton;

const styles = StyleSheet.create({
  button: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    backgroundColor: "dodgerblue",
    padding: 7,
  },
  text: {
    fontSize: 18,
    color: "white",
  },
  icon: {
    position: "absolute",
    left: "30%",
  },
});
