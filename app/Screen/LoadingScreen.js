import React, { useEffect } from "react";
import Screen from "../Components/Screen";
import { auth } from "../../firebase";

import AppLoader from "../Components/AppLoader";

function LoadingScreen({ navigation }) {
  useEffect(() => {
    (() => {
      auth.onAuthStateChanged((user) => {
        console.log("User is >>>", user);
        if (user) {
          navigation.navigate("DashboardScreen", {
            displayName: user.displayName,
            email: user.email,
            uid: user.uid,
          });
        } else {
          navigation.navigate("LoginScreen");
        }
      });
    })();
  }, []);
  return (
    <Screen>
      <AppLoader />
    </Screen>
  );
}

export default LoadingScreen;
