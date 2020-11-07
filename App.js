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
import { StateProvider } from "./StateProvider";
import reducer, { initialState } from "./reducer";

// Stack Navigator

const Stack = createStackNavigator();

const HomeStack = () => (
  <Stack.Navigator>
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
  </Stack.Navigator>
);

const LoginStack = () => (
  <Stack.Navigator>
    <Stack.Screen
      name="LoginScreen"
      component={LoginScreen}
      options={{ headerShown: false }}
    />
    <Stack.Screen
      name="HomeScreen"
      component={HomeStack}
      options={{ headerShown: false }}
    />
  </Stack.Navigator>
);

// Stack Navigator

export default function App() {
  const [user, setUser] = useState(null);

  return (
    <StateProvider initialState={initialState} reducer={reducer}>
      <Provider>
        <NavigationContainer>
          <LoginStack />
        </NavigationContainer>
      </Provider>
    </StateProvider>
  );
}

// 682851723875-9h8t0gkc903k89b5mk4887eumghs4n5p.apps.googleusercontent.com
