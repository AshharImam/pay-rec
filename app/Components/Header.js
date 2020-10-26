import { FontAwesome } from "@expo/vector-icons";
import { AppLoading } from "expo";
import { useFonts } from "expo-font";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Appbar } from "react-native-paper";
import firebase from "firebase";

const Header = ({ home = false }) => {
  let [loaded] = useFonts({
    Precious: require("../assets/fonts/Precious.ttf"),
  });
  if (!loaded) {
    return <AppLoading />;
  }
  return (
    <Appbar.Header style={styles.header}>
      <Text style={styles.logo}>pay-rec</Text>
      {home && (
        <TouchableOpacity
          style={styles.signOut}
          onPress={() => firebase.auth().signOut()}
        >
          <FontAwesome name="sign-out" size={30} color="#FFE28E" />
        </TouchableOpacity>
      )}
    </Appbar.Header>
  );
};

export default Header;

const styles = StyleSheet.create({
  header: {
    backgroundColor: "#2B4D59",
    justifyContent: "center",
  },
  logo: {
    fontSize: 50,
    fontFamily: "Precious",
    color: "#FFE28E",
    marginBottom: 10,
  },
  signOut: {
    position: "absolute",
    right: "5%",
  },
});
