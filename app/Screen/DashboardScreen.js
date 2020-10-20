import React from "react";
import firebase from "firebase";

import { Button, Text } from "react-native";
import Screen from "../Components/Screen";
import AppSignoutButton from "../Components/AppSignoutButton";

function DashboardScreen({ route }) {
  const { displayName, email, uid } = route.params;
  return (
    <Screen>
      {console.log(email)}
      <Text>{email}</Text>
      <AppSignoutButton
        title="Sign Out"
        onPress={() => firebase.auth().signOut()}
      />
    </Screen>
  );
}

export default DashboardScreen;
