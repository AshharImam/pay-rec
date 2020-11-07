import React, { useEffect, useState } from "react";
import { useFonts } from "expo-font";
import {
  Alert,
  StyleSheet,
  Text,
  TouchableHighlight,
  TouchableOpacity,
  View,
} from "react-native";
import * as Notifications from "expo-notifications";
import * as Permissions from "expo-permissions";

import Screen from "../Components/Screen";
import { AppLoading } from "expo";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import Header from "../Components/Header";
import { Constants } from "react-native-unimodules";
import firebase from "firebase";
import db from "../../firebase";
import axios from "../../axios/axios";
import { useStateValue } from "../../StateProvider";
import AsyncStorage from "@react-native-async-storage/async-storage";

function DashboardScreen({ route, navigation }) {
  const [state, dispatch] = useStateValue();
  const [user, setUser] = useState(true);
  const [connect, setConnect] = useState(true);
  const [connected, setConnected] = useState(null);

  const getItem = async (key) => {
    try {
      const item = await AsyncStorage.getItem(key);
      return item;
    } catch (error) {}
  };

  const setItem = async (key, value) => {
    try {
      await AsyncStorage.setItem(key, value);
    } catch (error) {}
  };

  useEffect(() => {
    axios({
      method: "GET",
      url: "/",
    })
      .then((res) => res.status === 201 && setConnected(true))
      .catch((e) => setConnected(false));
    setConnect(false);
  }, [connect]);

  useEffect(() => {
    getItem("uid").then((uid) => {
      // console.log(uid);
      registerForPushNotificationsAsync(uid);
    }),
      navigation.addListener("beforeRemove", (e) => {
        // Prevent default behavior of leaving the screen
        e.preventDefault();
        Alert.alert("Logout?", "Are you sure, you want to logout?", [
          { text: "Don't logout", style: "cancel", onPress: () => {} },
          {
            text: "Logout",
            style: "destructive",
            // If the user confirmed, then we dispatch the action we blocked earlier
            // This will continue the action that had triggered the removal of the screen
            onPress: () => {
              console.log("LOGOUT>>>>");
              firebase.auth().signOut();
              dispatch({
                type: "SET_USER",
                user: "null",
              });
              setItem("uid", null);
              navigation.dispatch(e.data.action);
            },
          },
        ]);
        // Prompt the user before leaving the screen
      });
  }, [navigation]);

  const registerForPushNotificationsAsync = async (uid) => {
    if (Constants.isDevice) {
      const { status } = await Permissions.getAsync(Permissions.NOTIFICATIONS);
      let finalStatus = status;

      if (finalStatus !== "granted") {
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

      db.collection("users")
        .doc(uid)
        .get()
        .then(function (snapshot) {
          let dbTokenList;
          flag = false;
          dbTokenList = snapshot.data().token;

          for (const key in dbTokenList) {
            if (dbTokenList.hasOwnProperty(key)) {
              const element = dbTokenList[key];
              if (element === token.data) {
                flag = true;
                continue;
              }

              console.log(element.data);
            }
          }
          if (!flag) {
            db.collection("users")
              .doc(uid)
              .update({
                token: firebase.firestore.FieldValue.arrayUnion({
                  data: token.data,
                }),
              });
          }
        });

      setItem("token", token.data);
    } else {
      alert("Must use physical device for Push Notifications");
    }

    if (Platform.OS === "android") {
      Notifications.setNotificationChannelAsync("myChannelId", {
        name: "myChannelId",
        sound: true,
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: "#FFE28E",
      });
    }
  };
  let [loaded] = useFonts({
    Precious: require("../assets/fonts/Precious.ttf"),
  });

  if (!loaded) {
    return <AppLoading />;
  }

  return (
    <Screen>
      <Header
        home
        onPress={() => {
          navigation.navigate("LoginScreen");
        }}
      />
      <View style={styles.container}>
        <TouchableHighlight
          onPress={() => setConnect(true)}
          style={[
            styles.connectionContainer,
            connected
              ? { backgroundColor: "#2B4D59" }
              : { backgroundColor: "#7D0C0C" },
          ]}
        >
          {connected ? (
            <Text style={styles.connectionText}>Connected</Text>
          ) : (
            <Text style={styles.connectionText}>Connection Error</Text>
          )}
        </TouchableHighlight>
        <TouchableOpacity
          onPress={() => navigation.navigate("BarcodeScanScreen")}
        >
          <MaterialCommunityIcons
            name="qrcode-scan"
            size={150}
            color="#2B4D59"
          />
        </TouchableOpacity>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  connectionContainer: {
    width: "50%",
    paddingVertical: 5,
    borderRadius: 5,
    alignItems: "center",
    marginBottom: 20,
  },
  connectionText: {
    color: "#FFE28E",
  },
});

export default DashboardScreen;
