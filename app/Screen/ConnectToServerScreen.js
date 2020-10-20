import Axios from "axios";
import { parse } from "fast-xml-parser";
import React, { useEffect, useState } from "react";
import {
  Button,
  Keyboard,
  Platform,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { Constants, Permissions } from "react-native-unimodules";
import AppTextInput from "../Components/AppTextInput";
import Screen from "../Components/Screen";

function ConnectToServerScreen({ navigation }) {
  useEffect(() => {
    (async () => {
      if (Constants.isDevice) {
        const { status: existingStatus } = await Permissions.getAsync(
          Permissions.NOTIFICATIONS
        );
        let finalStatus = existingStatus;
        if (existingStatus !== "granted") {
          const { status } = await Permissions.askAsync(
            Permissions.NOTIFICATIONS
          );
          finalStatus = status;
        }
        if (finalStatus !== "granted") {
          alert("Failed to get push token for push notification!");
          return;
        }
        const token = await Notifications.getExpoPushTokenAsync();
        console.log(token);
        this.setState({ expoPushToken: token });
      } else {
        alert("Must use physical device for Push Notifications");
      }

      if (Platform.OS === "android") {
        Notifications.setNotificationChannelAsync("default", {
          name: "default",
          importance: Notifications.AndroidImportance.MAX,
          vibrationPattern: [0, 250, 250, 250],
          lightColor: "#FF231F7C",
        });
      }
    })();
  }, []);
  return (
    <Screen style={styles.screen}>
      <View style={styles.buttonContainer}>
        <Button onPress={handleConnection} title="Click Me" />
      </View>
      {showError && (
        <Text style={styles.dangerText}>Unsuccessful Connection!</Text>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  screen: {
    justifyContent: "center",
    alignItems: "center",
  },
  buttonContainer: {
    marginTop: 20,
    width: "100%",
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
  },
  connectButton: {
    marginLeft: 10,
    width: 100,
    height: 30,
  },

  dangerText: {
    fontSize: 15,
    color: "red",
    alignSelf: "center",
  },
});

export default ConnectToServerScreen;
