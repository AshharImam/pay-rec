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

const PaymentScreen = ({ route }) => {
  const { data } = route.params; // data from barcode - navigation parameter
  const dataList = data?.split("_"); // Splitting the data
  const [ledgerName, vchNumber] = dataList; // destructuring for name and vch number
  const [checked, setChecked] = useState("Cash"); // Radio button check status
  const [focused, setFocused] = useState(false); //
  const [amount, setAmount] = useState(null); // amount for reciept

  // visible cosnt for modal hide / show
  const [visible, setVisible] = useState(false);
  const showModal = () => setVisible(true);
  const hideModal = () => setVisible(false);

  // handling axios on submit
  const submitHandler = async () => {
    hideModal();
    const dateObj = new Date();
    const dateOfMonth = dateObj.getDate();
    const month = dateObj.getMonth();
    const year = dateObj.getFullYear();
    const date = `${year}${month + 1}${dateOfMonth}`;
    console.log(date);
    const cashReciept = `<ENVELOPE>
    <HEADER>
    <TALLYREQUEST>Import Data</TALLYREQUEST>
    </HEADER>
    <BODY>
    <IMPORTDATA>
    <REQUESTDESC>
    <REPORTNAME>Vouchers</REPORTNAME>
    <STATICVARIABLES>
    <SVCURRENTCOMPANY>Dawood Fiber Mills</SVCURRENTCOMPANY>
    </STATICVARIABLES>
    </REQUESTDESC>
    <REQUESTDATA>
    <TALLYMESSAGE xmlns:UDF="TallyUDF">
    <VOUCHER VCHTYPE="Receipt" ACTION="Create" OBJVIEW="Accounting Voucher View">
    <DATE>${date}</DATE>
    <NARRATION></NARRATION>
    <VOUCHERTYPENAME>Receipt</VOUCHERTYPENAME>
    <VOUCHERNUMBER>1</VOUCHERNUMBER>
    <PARTYLEDGERNAME>${ledgerName}</PARTYLEDGERNAME>
    <PERSISTEDVIEW>Accounting Voucher View</PERSISTEDVIEW>
    <EFFECTIVEDATE>${date}</EFFECTIVEDATE>
    <ALLLEDGERENTRIES.LIST>
    <LEDGERNAME>${ledgerName}</LEDGERNAME>
    <ISDEEMEDPOSITIVE>No</ISDEEMEDPOSITIVE>
    <AMOUNT>${amount}</AMOUNT>
    <BILLALLOCATIONS.LIST>
    <NAME>${vchNumber}</NAME>
    <BILLTYPE>Agst Ref</BILLTYPE>
    <AMOUNT>${amount}</AMOUNT>
    </BILLALLOCATIONS.LIST>
    </ALLLEDGERENTRIES.LIST>
    <ALLLEDGERENTRIES.LIST>
    <LEDGERNAME>Cash Head Office</LEDGERNAME>
    <ISDEEMEDPOSITIVE>Yes</ISDEEMEDPOSITIVE>
    <AMOUNT>-${amount}</AMOUNT>
    </ALLLEDGERENTRIES.LIST>
    </VOUCHER>
    </TALLYMESSAGE>
    </REQUESTDATA>
    </IMPORTDATA>
    </BODY>
    </ENVELOPE>`;

    const bankReciept = `<ENVELOPE>
    <HEADER>
        <TALLYREQUEST>Import Data</TALLYREQUEST>
    </HEADER>
    <BODY>
            <IMPORTDATA>
              <REQUESTDESC>
                <REPORTNAME>Vouchers</REPORTNAME>
                <STATICVARIABLES>
                    <SVCURRENTCOMPANY>Dawood Fiber Mills</SVCURRENTCOMPANY>
                </STATICVARIABLES>
              </REQUESTDESC>
              <REQUESTDATA>
                <TALLYMESSAGE xmlns:UDF="TallyUDF">
                    <VOUCHER VCHTYPE="Receipt" ACTION="Create" OBJVIEW="Accounting Voucher View">
                        <DATE>${date}</DATE>
                        <NARRATION></NARRATION>
                        <VOUCHERTYPENAME>Receipt</VOUCHERTYPENAME>
                        <VOUCHERNUMBER>1</VOUCHERNUMBER>
                        <PARTYLEDGERNAME>${ledgerName}</PARTYLEDGERNAME>
                        <PERSISTEDVIEW>Accounting Voucher View</PERSISTEDVIEW>
                        <EFFECTIVEDATE>${date}</EFFECTIVEDATE>
                        <ALLLEDGERENTRIES.LIST>
                        <LEDGERNAME>${ledgerName}</LEDGERNAME>
                        <ISDEEMEDPOSITIVE>No</ISDEEMEDPOSITIVE>
                        <AMOUNT>${amount}</AMOUNT>
                        <BILLALLOCATIONS.LIST>
                            <NAME>${vchNumber}</NAME>
                            <BILLTYPE>Agst Ref</BILLTYPE>
                            <AMOUNT>${amount}</AMOUNT>
                            </BILLALLOCATIONS.LIST>
                        </ALLLEDGERENTRIES.LIST>
                        <ALLLEDGERENTRIES.LIST>
                        <OLDAUDITENTRYIDS.LIST TYPE="Number">
                        <OLDAUDITENTRYIDS>-1</OLDAUDITENTRYIDS>
                        </OLDAUDITENTRYIDS.LIST>
                        <LEDGERNAME>BAHL</LEDGERNAME>
                        <GSTCLASS/>
                        <ISDEEMEDPOSITIVE>Yes</ISDEEMEDPOSITIVE>
                        <LEDGERFROMITEM>No</LEDGERFROMITEM>
                        <REMOVEZEROENTRIES>No</REMOVEZEROENTRIES>
                        <ISPARTYLEDGER>Yes</ISPARTYLEDGER>
                        <ISLASTDEEMEDPOSITIVE>Yes</ISLASTDEEMEDPOSITIVE>
                        <AMOUNT>-${amount}</AMOUNT>
                        <BANKALLOCATIONS.LIST>
                        <DATE>${date}</DATE>
                        <INSTRUMENTDATE>${date}</INSTRUMENTDATE>
                        <NAME>1</NAME>
                        <TRANSACTIONTYPE>Cheque/DD</TRANSACTIONTYPE>
                        <PAYMENTFAVOURING>${ledgerName}</PAYMENTFAVOURING>
                        <INSTRUMENTNUMBER>test123</INSTRUMENTNUMBER>
                        <UNIQUEREFERENCENUMBER>1</UNIQUEREFERENCENUMBER>
                        <STATUS>No</STATUS>
                        <PAYMENTMODE>Transacted</PAYMENTMODE>
                        <BANKPARTYNAME>${ledgerName}</BANKPARTYNAME>
                        <ISCONNECTEDPAYMENT>No</ISCONNECTEDPAYMENT>
                        <ISSPLIT>No</ISSPLIT>
                        <ISCONTRACTUSED>No</ISCONTRACTUSED>
                        <CHEQUEPRINTED> 1</CHEQUEPRINTED>
                        <AMOUNT>-${amount}</AMOUNT>
                        <CONTRACTDETAILS.LIST> </CONTRACTDETAILS.LIST>
                        </BANKALLOCATIONS.LIST>
                        <BILLALLOCATIONS.LIST> </BILLALLOCATIONS.LIST>
                        <INTERESTCOLLECTION.LIST> </INTERESTCOLLECTION.LIST>
                        <OLDAUDITENTRIES.LIST> </OLDAUDITENTRIES.LIST>
                        <ACCOUNTAUDITENTRIES.LIST> </ACCOUNTAUDITENTRIES.LIST>
                        <AUDITENTRIES.LIST> </AUDITENTRIES.LIST>
                        <TAXBILLALLOCATIONS.LIST> </TAXBILLALLOCATIONS.LIST>
                        <TAXOBJECTALLOCATIONS.LIST> </TAXOBJECTALLOCATIONS.LIST>
                        <TDSEXPENSEALLOCATIONS.LIST> </TDSEXPENSEALLOCATIONS.LIST>
                        <VATSTATUTORYDETAILS.LIST> </VATSTATUTORYDETAILS.LIST>
                        <COSTTRACKALLOCATIONS.LIST> </COSTTRACKALLOCATIONS.LIST>
                      </ALLLEDGERENTRIES.LIST>
                    </VOUCHER>
                </TALLYMESSAGE>
              </REQUESTDATA>
            </IMPORTDATA>
      </BODY>
    </ENVELOPE>`;

    const xmlReciept =
      checked === "Cash"
        ? cashReciept
        : checked === "Cheque"
        ? bankReciept
        : null;

    await axios({
      method: "POST",
      data: cashReciept,
      headers: {
        "Content-Type": "text/xml",
      },
    })
      .then((res) => console.log(res))
      .catch((e) => console.log(e));
  };

  return (
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

          {/* Main Button Container */}
          <View style={styles.doneButton}>
            <Button
              disabled={!amount || !checked ? true : false}
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
    backgroundColor: "#FFE28E",
    color: "#2B4D59",
    fontSize: 20,
  },
  modalContainer: {
    backgroundColor: "#2B4D59",
    position: "absolute",
    height: "40%",
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
