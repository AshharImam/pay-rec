import React, { useState, useEffect } from "react";
import { Text, View, StyleSheet, Button } from "react-native";
import { BarCodeScanner } from "expo-barcode-scanner";
import { NavigationContainer } from "@react-navigation/native";
import Header from "../Components/Header";
import Screen from "../Components/Screen";

export default function BarcodeScanScreen({ navigation }) {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false); //To open camera

  useEffect(() => {
    (async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === "granted");
    })();
  }, []);

  const handleBarCodeScanned = ({ type, data }) => {
    navigation.navigate("PaymentScreen", { data: data }); //Bar Code Data

    // navigation.navigate("PaymentScreen", { data: "Abdul Rafay-S-286-2019" }); //Test Data
    // alert(`Bar code with type ${type} and data ${data} has been scanned!`);
  };

  if (hasPermission === null) {
    return <Text>Requesting for camera permission</Text>;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  return (
    <Screen
      style={{
        flexDirection: "column",
      }}
    >
      <Header />
      {/* <BarCodeScanner
        onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
        style={styles.wrapper}
      /> */}

      <Button
        title={"Tap to Scan Again"}
        onPress={() =>
          navigation.navigate("PaymentScreen", {
            data: "Test Holder 1_S-416-2019",
          })
        }
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    ...StyleSheet.absoluteFillObject,
    flex: 1,
  },
});
