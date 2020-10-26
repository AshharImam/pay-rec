import React, { useEffect } from "react";
import { useFonts } from "expo-font";
import { StyleSheet, TouchableOpacity, View } from "react-native";

import Screen from "../Components/Screen";
import { AppLoading } from "expo";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import Header from "../Components/Header";

function DashboardScreen({ route, navigation }) {
  useEffect(() => {
    navigation.addListener("beforeRemove", (e) => {
      // Prevent default behavior of leaving the screen
      e.preventDefault();

      // Prompt the user before leaving the screen
      return;
    });
  }, [navigation]);
  const { displayName, email, uid } = route.params;
  let [loaded] = useFonts({
    Precious: require("../assets/fonts/Precious.ttf"),
  });

  if (!loaded) {
    return <AppLoading />;
  }

  return (
    <Screen>
      <Header home />
      <View style={styles.container}>
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
});

export default DashboardScreen;
