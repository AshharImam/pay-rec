import React from "react";
import { View, StyleSheet, Text } from "react-native";
import { ActivityIndicator } from "react-native-paper";
const AppLoader = ({
  backgroundCOlor = "dodgerblue",
  color,
  text,
  opacity = 1,
}) => {
  return (
    <View
      style={[
        styles.loadingContainer,
        { backgroundColor: backgroundCOlor, opacity: opacity },
      ]}
    >
      <View style={styles.loading}>
        <ActivityIndicator size={50} color={color ? color : "#fff"} />
        {/* <ActivityIndicator size={50} color={color ? color : "#fff"} /> */}
        <Text style={styles.infoText}>{text}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  loading: {
    width: "70%",
    alignSelf: "center",
    justifyContent: "center",
    alignItems: "center",
  },
  loadingContainer: {
    backgroundColor: "#rgb(30, 144, 255)",
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    alignContent: "center",
    justifyContent: "center",
  },
  infoText: {
    fontSize: 18,
    color: "#fff",
    marginTop: 10,
  },
});

export default AppLoader;
