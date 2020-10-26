import React, { useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

import DetailsScreen from "./app/Screen/DetailsScreen";
import LoadingScreen from "./app/Screen/LoadingScreen";
import LoginScreen from "./app/Screen/LoginScreen";
import DashboardScreen from "./app/Screen/DashboardScreen";
import BarcodeScanScreen from "./app/Screen/BarcodeScanScreen";
import PaymentScreen from "./app/Screen/PaymentScreen";
import { Provider } from "react-native-paper";

// Stack Navigator

const Stack = createStackNavigator();

// Stack Navigator

export default function App() {
  const [isSignedIn, setIsSignedIn] = useState(null);
  return (
    <Provider>
      <NavigationContainer>
        <Stack.Navigator mode="modal">
          <>
            <Stack.Screen
              name="LoadingScreen"
              component={LoadingScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="LoginScreen"
              component={LoginScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="DashboardScreen"
              component={DashboardScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="BarcodeScanScreen"
              component={BarcodeScanScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="PaymentScreen"
              component={PaymentScreen}
              options={{ headerShown: false }}
            />
          </>
        </Stack.Navigator>
      </NavigationContainer>
    </Provider>
  );
}

// 682851723875-9h8t0gkc903k89b5mk4887eumghs4n5p.apps.googleusercontent.com
