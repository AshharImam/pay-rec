import React from "react";
import firebase from "firebase";

import { Button, Text } from "react-native";
import { Screen } from "react-native-screens";

function DashboardScreen() {
  return (
    <Screen>
      <Button title="Sign Out" onPress={firebase.auth().signOut()} />
    </Screen>
  );
}

export default DashboardScreen;
