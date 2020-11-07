import React from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

const AppSignInButton = ({ title, onPress, disabled }) => {
  return (
    <TouchableOpacity
      style={[styles.button, disabled && { opacity: "60%" }]}
      onPress={onPress}
      disabled={disabled}
    >
      <Image
        source={require("../assets/images/google_image.png")}
        fadeDuration={0}
        style={styles.icon}
      />
      <Text style={styles.text}>{title}</Text>
    </TouchableOpacity>
  );
};

export default AppSignInButton;

const styles = StyleSheet.create({
  button: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    backgroundColor: "#2B4D59",
    padding: 9,
  },
  text: {
    fontSize: 18,
    fontWeight: "500",
    color: "white",
  },
  icon: {
    width: 40,
    height: 40,
    position: "absolute",
    left: 0,
    backgroundColor: "white",
  },
});
