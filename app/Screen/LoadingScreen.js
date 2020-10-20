import React, { useEffect, useSel } from "react";
import {} from "react-red";
import Screen from "../Components/Screen";
import { auth } from "../../firebase";

import AppLoader from "../Components/AppLoader";
import { login, logout, selectUser } from "../user/userSlice";
import { useDispatch, useSelector } from "react-redux";

function LoadingScreen({ navigation }) {
  const user = useSelector(selectUser);
  const dispatch = useDispatchatch();

  useEffect(() => {
    (() => {
      auth.onAuthStateChanged((user) => {
        console.log(user);
        if (user) {
          dispatch(login(user));
        } else {
          dispatch(logout());
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
