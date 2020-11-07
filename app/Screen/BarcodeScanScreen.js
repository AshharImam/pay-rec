import React, { useState, useEffect } from "react";
import {
  Text,
  View,
  StyleSheet,
  Button,
  Dimensions,
  Image,
} from "react-native";
import { BarCodeScanner } from "expo-barcode-scanner";
import { NavigationContainer } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import Header from "../Components/Header";
import Screen from "../Components/Screen";
import { useStateValue } from "../../StateProvider";

const { width } = Dimensions.get("window");
const qrSize = width * 0.7;

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
        backgroundColor: "#000",
      }}
    >
      {/* <Header /> */}

      <BarCodeScanner
        onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
        style={[StyleSheet.absoluteFillObject, styles.container]}
      >
        <Image
          style={styles.qr}
          source={require("../assets/images/scanner.png")}
        />
        <Button
          title={"Tap to Scan Again"}
          onPress={() =>
            navigation.navigate("PaymentScreen", {
              data: "Test Holder 1_S-416-2019",
            })
          }
        />
      </BarCodeScanner>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 8,
  },
  qr: {
    marginTop: "20%",
    marginBottom: "20%",
    width: qrSize,
    height: qrSize,
    overlayColor: "#fff",
  },
  description: {
    fontSize: width * 0.09,
    marginTop: "10%",
    textAlign: "center",
    width: "70%",
    color: "white",
  },
  cancel: {
    fontSize: width * 0.05,
    textAlign: "center",
    width: "70%",
    color: "white",
  },
});
