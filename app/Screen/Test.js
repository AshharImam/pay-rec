import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { Button, StyleSheet, Text, View } from 'react-native';
import Screen from "../Components/Screen";
import AppTextInput from "../Components/AppTextInput";
import Axios from 'axios';
import { parse, convertToJson } from 'fast-xml-parser'

import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';


const stack = createStackNavigator();
export default function Home() {
  const [xmlText, setXmlText] = useState(`<ENVELOPE>
  <HEADER>
  <VERSION>1</VERSION>
  <TALLYREQUEST>EXPORT</TALLYREQUEST>
  <TYPE>data</TYPE>
  <ID>voucher register</ID>
  </HEADER>
  <BODY>
  <DESC>
  <STATICVARIABLES>
  <SVCURRENTCOMPANY>Dawood Fiber Mills</SVCURRENTCOMPANY>
  <VoucherTypeName>Sales</VoucherTypeName>
  <VoucherNumber>S-116-2019</VoucherNumber>
  <SVEXPORTFORMAT>$$SysName:XML</SVEXPORTFORMAT>
  </STATICVARIABLES>
  </DESC>
  </BODY>
  </ENVELOPE>`);
  const [loading, setLoading] = useState(false)

  const handleXmlRequest = async () => {
    const config = {
      headers: { "Content-Type": "text/xml" }
    };

    setLoading(true);

    await Axios({
      method: "POST",
      url: "http://192.168.0.116:9000",
      data: xmlText,
      headers: {
        "Content-Type": "text/xml"
      }
    }).then((res) => {

      let obj = parse(res.data);
      // console.log(`${obj.ENVELOPE.BODY["DATA"]}`)
      // for (let key of Object.keys(obj.ENVELOPE.BODY.DATA.TALLYMESSAGE["0"].VOUCHER.DATE)){
      //   console.log(key)
      // }
      console.log(obj.ENVELOPE.BODY.DATA.TALLYMESSAGE["0"].VOUCHER.DATE)
      setLoading(false)
    }).catch(err => {
      setLoading(false)
      console.warn(`error >>>> ${err}`)
    })


  }


  return (
    <Screen style={styles.container}>
      <AppTextInput style={{ color: "white" }} placeholder="Enter Voucher Number" />
      <Button title="fetch xml" onPress={handleXmlRequest} />
      {loading && <Text>Fetching Data</Text>}
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },
});
