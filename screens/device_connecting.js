//importing the required Libraries
import React, { Component } from "react";
import {
  Text,
  View,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
  TextInput,
} from "react-native";
import { globalStyles } from "../styles/globalStyles";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default class Device_Connecting extends Component {
  //defining global variables
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      connecting: false,
      ssid: "",
      pass: "",
    };
  }
  //returns a loading indicator when called
  activityIndicatorDisp() {
    if (this.state.connecting) {
      return <ActivityIndicator size="large" color="#2699a4" />;
    }
    return;
  }
  //functiion that runs on page load
  componentDidMount() {
    //check if the device is avaliable to communicate to. calling the checkDevice function.
    this.checkDevice();
    //if no response is recieved within 10 seconds then go back to the previous page
    setTimeout(() => {
      if (this.state.isLoading) {
        Alert.alert("Failed to connect to device!");
        this.props.navigation.goBack();
      }
    }, 10000);
  }

  //check if the device is responsive send a request and wait for a response
  checkDevice = async () => {
    return fetch("http://192.168.4.1:80/")
      .then((response) => {
        if (response.status === 200) {
          this.setState({ isLoading: false });
        } else {
          this.props.navigation.goBack();
        }
      })
      .catch((error) => {
        Error(error);
      });
  };

  //send the relevant wifi infomation to the device.
  sendWifiCredentials = async () => {
    //construct a data packet to send
    const toSend = {
      SSID: this.state.ssid,
      PASS: this.state.pass,
    };
    //run the request if the rquest is successful then return the response otherwise 
    //go back to the previous page or go to the add page based on the response.
    return fetch(`http://192.168.4.1:80/connect`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(toSend),
    })
      .then((response) => {
        console.log(response.status);
        if (response.status == 201) {
          return response.json();
        } else if (response.status == 400) {
          Alert.alert("Error! Information Incorrect");
          this.props.navigation.goback();
        } else {
          Alert.alert("something Went Wrong");
          this.props.navigation.navigate("Device_Add");
        }
      })
      //add a new device to the device list if there are no devices already in the list
      //then create a new list if there are devices already then append the list and add the new device 
      //then save the data into permanant storage for the applicaiton 
      .then(async (responseJson) => {
        const currDevices = JSON.parse(await AsyncStorage.getItem("@devices"));
        if (currDevices != null) {
          const toStore = {
            deviceId: responseJson.hostname,
            deviceIp: responseJson.ip,
            deviceSsid: responseJson.ssid,
            devicePassword: responseJson.password,
          };
          currDevices.push(toStore);
          await AsyncStorage.setItem("@devices", JSON.stringify(currDevices));
        } else {
          const device = [
            {
              deviceId: responseJson.hostname,
              deviceIp: responseJson.ip,
              deviceSsid: responseJson.ssid,
              devicePassword: responseJson.password,
            },
          ];
          await AsyncStorage.setItem("@devices", JSON.stringify(device));
        }

        Alert.alert("Device Successfully Added");
        this.props.navigation.navigate("Device_List");
      })
      .catch((error) => {
        Alert.alert(error.message);
      });
  };

  render() {
    //if the page is loading show this render function
    if (this.state.isLoading) {
      return (
        <View style={globalStyles.container}>
          <View style={styles.loadingBody}>
            <Text style={styles.text}>Connecting To Device</Text>
            <ActivityIndicator size="large" color="#2699a4" />
          </View>
        </View>
      );
    }
    //main render function for the plage which includes the visual elements
    return (
      <View style={globalStyles.container}>
        <View style={globalStyles.body}>
          <Text style={globalStyles.bodyTitle}>Enter Credentials</Text>
          <View style={globalStyles.line} />
          <View style={styles.textBody}>
            <TextInput
              style={styles.textInput}
              maxLength={50}
              placeholder="SSID"
              onChangeText={(ssid) => this.setState({ ssid })}
            />
            <TextInput
              style={styles.textInput}
              maxLength={50}
              placeholder="Password"
              onChangeText={(pass) => this.setState({ pass })}
            />
          </View>
          <TouchableOpacity
            style={styles.bodyButton}
            onPress={() => {
              this.setState({ connecting: true });
              this.sendWifiCredentials();
            }}
          >
            <Text style={styles.text}>Connect</Text>
            {this.activityIndicatorDisp()}
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  textBody: {
    flex: 1,
    justifyContent: "center",
  },
  text: {
    color: "white",
    fontSize: 20,
    margin: 10,
  },
  loadingBody: {
    flex: 1,
    backgroundColor: "rgba(53, 54, 58,0.5)",
    borderRadius: 10,
    marginVertical: 8,
    width: "95%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  bodyButton: {
    flex: 1,
    backgroundColor: "rgba(255,255,255,0.3)",
    borderRadius: 15,
    padding: 10,
    alignSelf: "center",
    width: "90%",
    marginVertical: 5,
    justifyContent: "center",
    maxHeight: 60,
    flexDirection: "row",
  },
  textInput: {
    flex: 1,
    backgroundColor: "white",
    borderRadius: 15,
    padding: 10,
    alignSelf: "center",
    width: "90%",
    marginVertical: 5,
    justifyContent: "center",
    maxHeight: 60,
  },
});
