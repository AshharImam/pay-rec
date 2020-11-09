import React, { useEffect, useState } from "react";
import * as Google from "expo-google-app-auth";
import firebase from "firebase";
import Screen from "../Components/Screen";
import AppSignInButton from "../Components/AppSignInButton";
import db, { auth, provider } from "../../firebase";
import { Text } from "react-native";
import { useFonts } from "expo-font";
import { useStateValue } from "../../StateProvider";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ActivityIndicator } from "react-native-paper";
import AppLoader from "../Components/AppLoader";

function LoginScreen({ navigation }) {
  const [loading, setLoading] = useState(false);
  const [state, dispatch] = useStateValue();

  useEffect(() => {
    (() => {
      auth.onAuthStateChanged((user) => {
        console.log("User is >>>", user);
        if (user) {
          setLoading(false);
          navigation.navigate("HomeScreen");
        }
      });
    })();
  }, []);

  useEffect(
    () =>
      navigation.addListener("beforeRemove", (e) => {
        // Prevent default behavior of leaving the screen
        e.preventDefault();

        // Prompt the user before leaving the screen
        return;
      }),
    [navigation]
  );

  const setItem = async (key, value) => {
    try {
      await AsyncStorage.setItem(key, value);
      return;
    } catch (error) {}
  };

  const onSignIn = (googleUser) => {
    // console.log("Google Auth Response", googleUser);
    // We need to register an Observer on Firebase Auth to make sure auth is initialized.
    setLoading(true);
    var unsubscribe = firebase.auth().onAuthStateChanged((firebaseUser) => {
      unsubscribe();
      // Check if we are already signed-in Firebase with the correct user.
      if (!isUserEqual(googleUser, firebaseUser)) {
        // Build Firebase credential with the Google ID token.
        var credential = firebase.auth.GoogleAuthProvider.credential(
          googleUser.idToken,
          googleUser.accessToken
        );
        // console.log(`credentials >>> ${credential}`);
        // Sign in with credential from the Google user.
        console.log("Login__db query");
        firebase
          .auth()
          .signInWithCredential(credential)
          .then((result) => {
            // console.log("user signed in", result.additionalUserInfo.isNewUser);
            if (result.additionalUserInfo.isNewUser) {
              db.collection("users").doc(result.user.uid).set({
                gmail: result.user.email,
                profilePicture: result.additionalUserInfo.profile?.picture,
                locale: result.additionalUserInfo.profile.locale,
                firstName: result.additionalUserInfo.profile.given_name,
                lastName: result.additionalUserInfo.profile.family_name,
                createdAt: Date.now(),
              });
              // navigation.navigate("DashboardScreen",);
            } else {
              db.collection("users").doc(result.user.uid).update({
                lastLoggin: Date.now(),
              });
              // navigation.navigate("DashboardScreen", {
              //   displayName: result.user.displayName,
              //   uid: result.user.uid,
              //   email: result.user.email,
              // });
            }
            setItem("uid", result.user.uid);
            dispatch({
              type: "SET_USER",
              user: result.user.uid,
            });

            setLoading(false);
            navigation.navigate("HomeScreen");
            // console.log("LOGIN");
            // navigation.navigate("DashboardScreen", {
            //   displayName: result.user.displayName,
            //   uid: result.user.uid,
            //   email: result.user.email,
            // });
          })
          .catch(function (error) {
            // Handle Errors here.
            var errorCode = error.code;
            var errorMessage = error.message;
            // The email of the user's account used.
            var email = error.email;
            // The firebase.auth.AuthCredential type that was used.
            var credential = error.credential;
            // ...
          });
      } else {
        console.log("User already signed-in Firebase.");
      }
    });
  };

  const isUserEqual = (googleUser, firebaseUser) => {
    if (firebaseUser) {
      var providerData = firebaseUser.providerData;
      for (var i = 0; i < providerData.length; i++) {
        if (
          providerData[i].providerId ===
            firebase.auth.GoogleAuthProvider.PROVIDER_ID &&
          providerData[i].uid === googleUser.getBasicProfile().getId()
        ) {
          // We don't need to reauth the Firebase connection.
          return true;
        }
      }
    }
    return false;
  };

  const signInWithGoogleAsync = async () => {
    // setDisabled(true);
    try {
      const result = await Google.logInAsync({
        androidClientId:
          "682851723875-9h8t0gkc903k89b5mk4887eumghs4n5p.apps.googleusercontent.com",
        // iosClientId: YOUR_CLIENT_ID_HERE,
        scopes: ["profile", "email"],
      });

      if (result.type === "success") {
        // console.log(result);
        onSignIn(result);
        return result.accessToken;
      } else {
        return { cancelled: true };
      }
    } catch (e) {
      return { error: true };
    }
  };

  let [loaded] = useFonts({
    Precious: require("../assets/fonts/Precious.ttf"),
  });
  if (!loaded) {
    return <AppLoader backgroundCOlor={"#FFE28E"} color={"#2B4D59"} />;
  }

  return (
    <>
      <Screen
        style={{
          justifyContent: "center",
          backgroundColor: "#FFE28E",
          alignItems: "center",
          padding: 20,
        }}
      >
        <Text
          style={{
            fontSize: 70,
            fontFamily: "Precious",
            color: "#2B4D59",
            marginBottom: 30,
          }}
        >
          pay-rec
        </Text>
        <AppSignInButton
          title="Signin With Google"
          onPress={signInWithGoogleAsync}
        />
      </Screen>
      {loading && (
        <AppLoader
          backgroundCOlor={"#FFE28E"}
          color={"#2B4D59"}
          opacity={0.8}
        />
      )}
    </>
  );
}

export default LoginScreen;
