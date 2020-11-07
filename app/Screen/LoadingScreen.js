import React, { useEffect, useState } from "react";
import Screen from "../Components/Screen";
import { auth } from "../../firebase";

import AppLoader from "../Components/AppLoader";
import DashboardScreen from "./DashboardScreen";
import LoginScreen from "./LoginScreen";

function LoadingScreen({ navigation }) {
  const [user, setUser] = useState(null);
  useEffect(() => {
    (() => {
      auth.onAuthStateChanged((user) => {
        console.log("User is >>>", user);
        if (user) {
          navigation.navigate("DashboardScreen");
        } else {
          navigation.navigate("LoginScreen");
        }
      });
    })();
  }, []);

  return (
    <Screen>
      <AppLoader backgroundCOlor={"#FFE28E"} color={"#2B4D59"} />
    </Screen>
  );
}

export default LoadingScreen;
