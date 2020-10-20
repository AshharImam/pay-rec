import React, { useEffect } from "react";
import * as Google from "expo-google-app-auth";
import firebase from "firebase";
import Screen from "../Components/Screen";
import AppSignInButton from "../Components/AppSignInButton";
import db from "../../firebase";

function LoginScreen() {
  const onSignIn = (googleUser) => {
    // console.log("Google Auth Response", googleUser);
    // We need to register an Observer on Firebase Auth to make sure auth is initialized.
    var unsubscribe = firebase.auth().onAuthStateChanged((firebaseUser) => {
      unsubscribe();
      // Check if we are already signed-in Firebase with the correct user.
      if (!isUserEqual(googleUser, firebaseUser)) {
        // Build Firebase credential with the Google ID token.
        var credential = firebase.auth.GoogleAuthProvider.credential(
          googleUser.idToken,
          googleUser.accessToken
        );
        // Sign in with credential from the Google user.
        firebase
          .auth()
          .signInWithCredential(credential)
          .then((result) => {
            // console.log("user signed in", result);

            if (result.additionalUserInfo.isNewUser) {
              db.collection("users").doc(result.user.uid).set({
                gmail: result.user.email,
                profilePicture: result.additionalUserInfo.profile?.picture,
                locale: result.additionalUserInfo.profile.locale,
                firstName: result.additionalUserInfo.profile.given_name,
                lastName: result.additionalUserInfo.profile.family_name,
                createdAt: Date.now(),
              });
            } else {
              db.collection("users").doc(result.user.uid).update({
                lastLoggin: Date.now(),
              });
            }
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
    try {
      const result = await Google.logInAsync({
        androidClientId:
          "682851723875-9h8t0gkc903k89b5mk4887eumghs4n5p.apps.googleusercontent.com",
        // iosClientId: YOUR_CLIENT_ID_HERE,
        scopes: ["profile", "email"],
      });

      if (result.type === "success") {
        onSignIn(result);
        return result.accessToken;
      } else {
        return { cancelled: true };
      }
    } catch (e) {
      return { error: true };
    }
  };

  return (
    <Screen style={{ justifyContent: "center" }}>
      <AppSignInButton
        title="Signin With Google"
        onPress={signInWithGoogleAsync}
      />
    </Screen>
  );
}

export default LoginScreen;
