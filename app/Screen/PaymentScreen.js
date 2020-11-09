import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Button,
  Keyboard,
} from "react-native";
import {
  DataTable,
  Headline,
  Modal,
  Portal,
  RadioButton,
  Button as ButtonPaper,
} from "react-native-paper";
import { FontAwesome5 } from "@expo/vector-icons";

import Header from "../Components/Header";
import Screen from "../Components/Screen";
import AppTextInput from "../Components/AppTextInput";
import axios from "../../axios/axios";
import { useStateValue } from "../../StateProvider";
import AsyncStorage from "@react-native-async-storage/async-storage";
import db from "../../firebase";
import AppLoader from "../Components/AppLoader";

const PaymentScreen = ({ route, navigation }) => {
  const [state, dispatch] = useStateValue();
  const getItem = async (key) => {
    try {
      const item = await AsyncStorage.getItem(key);
      return item;
    } catch (error) {}
  };

  const setItem = async (key, value) => {
    try {
      await AsyncStorage.setItem(key, value);
    } catch (error) {}
  };

  getItem("uid").then((item) => console.log(item)),
    getItem("token").then((item) => console.log(item));

  const [loading, setLoading] = useState(false);
  const { data } = route.params; // data from barcode - navigation parameter
  const dataList = data?.split("_"); // Splitting the data
  const [ledgerName, vchNumber] = dataList; // destructuring for name and vch number
  const [checked, setChecked] = useState("Cash"); // Radio button check status
  const [focused, setFocused] = useState(false); //
  const [amount, setAmount] = useState(null); // amount for reciept
  const [chequeNumber, setChequeNumber] = useState(null); // amount for reciept

  // visible cosnt for modal hide / show
  const [visible, setVisible] = useState(false);
  const showModal = () => setVisible(true);
  const hideModal = () => setVisible(false);

  // handling axios on submit
  const submitHandler = async () => {
    hideModal();
    getItem("uid").then((item) => {
      postRequestToServer(item);
    });

    // checked === "Cash"
    //   ? addRecieptInDb(uid, ledgerName, vchNumber, amount, checked)
    //   : checked === "Cheque"
    //   ? addRecieptInDb(uid, ledgerName, vchNumber, amount, checked, null)
    //   : null;
    // addRecieptInDb(uid, ledgerName, vchNumber, amount, checked);
  };

  const postRequestToServer = async (uid) => {
    setLoading(true);
    const dateObj = new Date();
    let dateOfMonth = dateObj.getDate();
    dateOfMonth = dateOfMonth < 10 ? `${"0" + dateOfMonth}` : dateOfMonth;
    const month = dateObj.getMonth();
    const year = dateObj.getFullYear();
    const date = `${year}${month + 1}${dateOfMonth}`;
    const formData = new FormData();
    console.log(`Date>>>>>>>>>>>>>${typeof date} --- ${date}`);
    formData.append("uid", uid);
    formData.append("amount", amount);
    formData.append("ledgerName", ledgerName);
    formData.append("vchNumber", vchNumber);
    formData.append("checked", checked);
    formData.append("date", date);
    checked === "Cheque" && formData.append("chequeNumber", chequeNumber);
    // navigation.navigate("DashboardScreen");

    // use axios to POST
    await axios("/post", {
      method: "POST",
      params: formData,
      headers: {
        Accept: "application/json",
        "Content-Type": "multipart/form-data",
      },
    })
      .then((res) => {
        navigation.navigate("DashboardScreen");
        console.log(res);
      })
      .catch((e) => console.log(e));
    setLoading(false);
  };

  return (
    <>
      {loading ? (
        <AppLoader backgroundCOlor={"#FFE28E"} color={"#2B4D59"} />
      ) : (
        <Portal>
          {/* Portal Provider for Modal */}
          <Screen style={{ backgroundColor: "#FFE28E" }}>
            {/* Header Component */}
            <Header />
            {/* Main Container */}
            <View style={styles.container} onPress={() => setFocused(true)}>
              {/* Payment Selection Container */}
              <View style={styles.payMethodContainer}>
                {/* Radio Button for Cash */}
                <TouchableOpacity
                  style={styles.radioContainer}
                  onPress={() => setChecked("Cash")}
                >
                  <Text style={styles.radioText}>Cash</Text>
                  <RadioButton
                    value="Cash"
                    status={checked === "Cash" ? "checked" : "unchecked"}
                    onPress={() => setChecked("Cash")}
                    color="#2B4D59"
                    uncheckedColor="#2B4D59"
                  />
                </TouchableOpacity>

                {/* Radio Button for Cheque */}

                <TouchableOpacity
                  style={styles.radioContainer}
                  onPress={() => setChecked("Cheque")}
                >
                  <Text style={styles.radioText}>Cheque</Text>
                  <RadioButton
                    value="Cheque"
                    status={checked === "Cheque" ? "checked" : "unchecked"}
                    onPress={() => setChecked("Cheque")}
                    color="#2B4D59"
                    uncheckedColor="#2B4D59"
                  />
                </TouchableOpacity>
              </View>

              {/* Amount Input Box Component */}
              <AppTextInput
                onKeyPress={() => setFocused(true)}
                isFocused={focused}
                mode="outlined"
                keyboardType="number-pad"
                dense
                label="Amount"
                placeholder="Enter Amount"
                style={styles.textInput}
                value={amount}
                onChangeText={(text) => setAmount(text)}
              />
              {checked === "Cheque" && (
                <AppTextInput
                  onKeyPress={() => setFocused(true)}
                  isFocused={focused}
                  mode="outlined"
                  keyboardType="default"
                  dense
                  label="Cheque Number"
                  placeholder="Enter Cheque Number"
                  style={styles.textInput}
                  value={chequeNumber}
                  onChangeText={(text) => setChequeNumber(text)}
                />
              )}

              {/* Main Button Container */}
              <View style={styles.doneButton}>
                <Button
                  disabled={
                    !amount ||
                    !checked ||
                    (checked === "Cheque" && !chequeNumber)
                      ? true
                      : false
                  }
                  title="Done"
                  color="#2B4D59"
                  onPress={() => {
                    Keyboard.dismiss();
                    showModal();
                  }}
                />
              </View>
            </View>
          </Screen>
          {/* Modal */}
          <Modal
            contentContainerStyle={styles.modalContainer}
            visible={visible}
            onDismiss={hideModal}
          >
            {/* Modal Title Container "Heade" */}
            <View style={styles.modalTitleContainer}>
              {/*   Heading */}
              <Headline style={styles.modalTitle}>Reciept</Headline>
              {/*  Reciept */}
              <FontAwesome5 name="receipt" size={24} color="white" />
            </View>

            {/* Table */}
            <View>
              <DataTable>
                <DataTable.Row>
                  <DataTable.Cell>
                    <Text style={{ color: "#FFF" }}>Voucher Number</Text>
                  </DataTable.Cell>
                  <DataTable.Cell>
                    <Text style={{ color: "#FFF" }}>{vchNumber}</Text>
                  </DataTable.Cell>
                </DataTable.Row>
                <DataTable.Row>
                  <DataTable.Cell>
                    <Text style={{ color: "#FFF" }}>Ledger Name</Text>
                  </DataTable.Cell>
                  <DataTable.Cell>
                    <Text style={{ color: "#FFF" }}>{ledgerName}</Text>
                  </DataTable.Cell>
                </DataTable.Row>
                <DataTable.Row>
                  <DataTable.Cell>
                    <Text style={{ color: "#FFF" }}>Payment Method</Text>
                  </DataTable.Cell>
                  <DataTable.Cell>
                    <Text style={{ color: "#FFF" }}>{checked}</Text>
                  </DataTable.Cell>
                </DataTable.Row>
                {chequeNumber && checked === "Cheque" && (
                  <DataTable.Row>
                    <DataTable.Cell>
                      <Text style={{ color: "#FFF" }}>Cheuqe Number</Text>
                    </DataTable.Cell>
                    <DataTable.Cell>
                      <Text style={{ color: "#FFF" }}>{chequeNumber}</Text>
                    </DataTable.Cell>
                  </DataTable.Row>
                )}
                <DataTable.Row>
                  <DataTable.Cell>
                    <Text style={{ color: "#FFF" }}>Amount</Text>
                  </DataTable.Cell>
                  <DataTable.Cell>
                    <Text style={{ color: "#FFF" }}>{amount}</Text>
                  </DataTable.Cell>
                </DataTable.Row>
              </DataTable>
            </View>

            {/* Modal */}
            <View style={styles.modalButtonContainer}>
              <ButtonPaper
                color="#FFE28E"
                mode="outlined"
                style={{ borderColor: "#FFE28E" }}
                labelStyle={{ color: "#FFE28E" }}
                onPress={hideModal}
                compact
              >
                Cancel
              </ButtonPaper>
              <ButtonPaper
                style={{ marginLeft: 10 }}
                color="#FFE28E"
                mode="contained"
                labelStyle={{ color: "#2B4D59" }}
                onPress={submitHandler}
              >
                Submit
              </ButtonPaper>
            </View>
          </Modal>
        </Portal>
      )}
    </>
  );
};

export default PaymentScreen;

const styles = StyleSheet.create({
  radioContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    // borderBottomWidth: 1,
    // borderBottomColor: "#2B4D59",
    marginTop: 12,
    flex: 1,
    padding: 10,
  },
  radioText: {
    fontSize: 20,
    color: "#2B4D59",
  },
  container: {
    margin: 10,
    paddingTop: "30%",
    flex: 1,
  },
  payMethodContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  doneButton: {
    marginVertical: 40,
    width: "30%",
    alignSelf: "flex-end",
  },
  textInput: {
    borderColor: "#2B4D59",
    backgroundColor: "#FFE28E",
    color: "#2B4D59",
    fontSize: 20,
    marginTop: 10,
  },
  modalContainer: {
    backgroundColor: "#2B4D59",
    position: "absolute",
    height: "50%",
    width: "100%",
    alignSelf: "center",
    bottom: 0,
    borderRadius: 10,
    padding: 20,
    justifyContent: "space-around",
  },
  modalTitleContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  modalTitle: {
    color: "#FFF",
  },
  modalButtonContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    paddingVertical: 20,
  },
});
