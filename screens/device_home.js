import React, { Component } from "react";
import {
  Text,
  View,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  Dimensions,
  Image,
  StyleSheet,
  Modal,
  TextInput,
  Alert,
} from "react-native";
import { globalStyles } from "../styles/globalStyles";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LineChart, Grid } from "react-native-svg-charts";
import * as shape from "d3-shape";
//import Slider from '@react-native-community/slider';
import Slider from "react-native-sliders";
const axios = require("axios");

export default class Device_Home extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: true,
      data: null,
      moisture: null,
      deviceTemprature: 0,
      deviceHumidity: 0,
      deviceMoisture: 0,
      tempratureGraph: [0, 0],
      humidityGraph: [0, 0],
      moistureGraph: [0, 0],
      wateringOptions: {
        activateSystem: false,
        timeInterval: 10000,
        moisture: 15,
      },
      deepSleepTime: 0,

      wateringOptionsToStore: {
        activateSystem: null,
        timeInterval: null,
        moisture: null,
      },
      deepSleepTimeToStore: null,
      deviceSettings: false,
    };
  }

  componentDidMount() {
    this.refresh = this.props.navigation.addListener("focus", () => {
      this.getData();

      console.log("focus");

      this.interval = setInterval(() => {
        this.getDeviceSensors();
      }, 2000);
    });

    this.props.navigation.addListener("blur", () => {
      console.log("blur");
      clearInterval(this.interval);
    });

    this.getData();
    //this.deepSleep(30000000);
  }

  componentWillUnmount() {
    this.refresh();
  }

  getData = async () => {
    this.setState({
      data: JSON.parse(await AsyncStorage.getItem("@currentDevice")),
      isLoading: false,
    });
  };

  getDeviceSensors = async () => {
    const deviceIp = this.state.data.deviceIp;
    axios
      .get(`http://${deviceIp}:80/sensors`)
      .then((response) => {
        if (response.status == 200) {
          return response.data;
        } else {
          Alert.alert("Something Went Wrong");
        }
      })
      .then((responseJson) => {
        let mGraph = this.state.moistureGraph;
        let tGraph = this.state.tempratureGraph;
        let hGraph = this.state.humidityGraph;
        if (mGraph.length >= 30) {
          mGraph.shift();
          tGraph.shift();
          hGraph.shift();
          mGraph.push(responseJson.Soil_Moisture);
          tGraph.push(responseJson.Temprature);
          hGraph.push(responseJson.Humidity);
        } else {
          mGraph.push(responseJson.Soil_Moisture);
          tGraph.push(responseJson.Temprature);
          hGraph.push(responseJson.Humidity);
        }
        this.setState({
          deviceTemprature: responseJson.Temprature,
          deviceHumidity: responseJson.Humidity,
          deviceMoisture: responseJson.Soil_Moisture,
          tempratureGraph: tGraph,
          humidityGraph: hGraph,
          moistureGraph: mGraph,
        });
      })
      .catch((error) => {
        console.log(error);
      });
  };

  setTimeInterval(newTime) {
    let curr = this.state.wateringOptions;
    const toSet = {
      activateSystem: curr.activateSystem,
      timeInterval: newTime,
      moisture: curr.moisture,
    };
    this.setState({ wateringOptionsToStore: toSet });
    //console.log(this.state.wateringOptions.timeInterval)
  }

  setMoisture(Level) {
    let curr = this.state.wateringOptions;
    const toSet = {
      activateSystem: curr.activateSystem,
      timeInterval: curr.timeInterval,
      moisture: Level,
    };
    this.setState({ wateringOptionsToStore: toSet });
    //console.log(this.state.wateringOptionsToStore.moisture)
    //console.log(Level)
  }
  setDeepSleep(num) {
    this.setState({ deepSleepTimeToStore: num });
    //console.log(this.state.deepSleepTime)
  }

  deepSleep=async()=> {
    const num = this.state.deepSleepTime;
    let decimalNumber = "1";
    const temp = num.toString();
    const deviceIp = this.state.data.deviceIp;

    for (let i = 0; i < temp.length - 1; i++) {
      decimalNumber += "0";
    }
    let calculation = num / parseInt(decimalNumber);
    let notation = calculation.toString() + "e" + (temp.length - 1).toString();
    console.log(notation);

    const toSend = {
      "interval_time":notation
    }
    console.log(toSend);
    return fetch(`http://${deviceIp}:80/sleep`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(toSend),
    })
      .then((response) => {
        console.log(response.status);
        if (response.status == 200) {
          return response.json();
        } else if (response.status == 400) {
          Alert.alert("Error! Information Incorrect");
        } else {
          Alert.alert("something Went Wrong");
        }
      })
      .then(async (responseJson) => {
        console.log(responseJson)
      })
      .catch((error) => {
        Alert.alert(error.message);
      });
  }


  wateingRequest= async()=> {
    const deviceIp = this.state.data.deviceIp;
    const toSend = this.state.wateringOptions
    console.log(toSend);
    return fetch(`http://${deviceIp}:80/startSystem`, {
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
        } else {
          Alert.alert("something Went Wrong");
        }
      })
      .then(async (responseJson) => {
        console.log(responseJson)
      })
      .catch((error) => {
        Alert.alert(error.message);
      });
  }


  startStopWatering() {
    let curr = this.state.wateringOptions;

    if (this.state.wateringOptions.activateSystem == true) {
      const toSet = {
        activateSystem: false,
        timeInterval: curr.timeInterval,
        moisture: curr.moisture,
      };
      this.setState({ wateringOptions: toSet });
      this.wateingRequest();
    } else if (this.state.wateringOptions.activateSystem == false) {
      const toSet = {
        activateSystem: true,
        timeInterval: curr.timeInterval,
        moisture: curr.moisture,
      };
      this.setState({ wateringOptions: toSet });
      this.wateingRequest();
    }
    console.log(this.state.wateringOptions.activateSystem);
  }

  getStoredSettings = async () => {
    let data = await AsyncStorage.getItem("@DeviceSettings");
    //console.log(data)
    if (data == null) {
      const toSet = {
        activateSystem: false,
        timeInterval: 3600000,
        moisture: 60,
      };
      this.setState({
        wateringOptions: toSet,
        deepSleepTime: 1740000000,
      });
    } else {
      const currdata = JSON.parse(data);
      this.setState({
        wateringOptions: currdata.wateringOptions,
        deepSleepTime: currdata.deepSleepTime,
      });
    }
    //console.log(this.state.wateringOptions)
    this.setState({ wateringOptionsToStore: this.state.wateringOptions });
    //console.log(this.state.wateringOptionsToStore)
    console.log("getStoredSettings");
  };

  saveSettings = async () => {
    const toset = {
      wateringOptions: this.state.wateringOptionsToStore,
      deepSleepTime: this.state.deepSleepTimeToStore,
    };
    await AsyncStorage.setItem("@DeviceSettings", JSON.stringify(toset));
    console.log("Save Settings");
  };

  removeDevice=async()=>{
    const data = JSON.parse(await AsyncStorage.getItem('@devices'));
    const newData = [];
    for (let i = 0; i < data.length; i += 1) {
      const DeviceId = data[i].deviceId;
      const DeviceIp = data[i].deviceIp;
      const DeviceSsid = data[i].deviceSsid;
      const DevicePassword = data[i].devicePassword;

      if (DeviceId !== this.state.data.deviceId) {
        newData.push({
          deviceId:DeviceId,
          deviceIp:DeviceIp,
          deviceSsid:DeviceSsid,
          devicePassword:DevicePassword
        });
      }
    }
    await AsyncStorage.setItem('@devices', JSON.stringify(newData));
    console.log(await AsyncStorage.getItem('@devices'))
    this.props.navigation.navigate('Device_List')
  }

  renderModal() {
    if (this.state.deviceSettings) {
      let wateringTime = this.state.wateringOptions.timeInterval / 60000;
      let moisture = this.state.wateringOptions.moisture;
      let deepSleepTime = this.state.deepSleepTime / 60000000;
      return (
        <Modal animationType="slide" transparent={true}>
          <View style={{ flex: 1, justifyContent: "center" }}>
            <View
              style={{
                borderRadius: 20,
                width: "95%",
                height: "80%",
                backgroundColor: "rgb(150, 150, 150)",
                alignSelf: "center",
              }}
            >
              <View style={{ flex: 2, justifyContent: "center" }}>
                <Text style={styles.text1}>Watering Interval</Text>
                <View
                  style={{
                    flex: 1,
                    justifyContent: "center",
                    flexDirection: "row",
                  }}
                >
                  <Slider
                    style={{ width: "75%" }}
                    minimumValue={1}
                    maximumValue={120}
                    minimumTrackTintColor="#FFFFFF"
                    maximumTrackTintColor="#000000"
                    step={5}
                    value={wateringTime}
                    onValueChange={(value) => {
                      this.setTimeInterval(value * 60000);
                    }}
                  />
                  <Text
                    style={{
                      color: "white",
                      fontSize: 12,
                      alignSelf: "center",
                    }}
                  >
                    {this.state.wateringOptionsToStore.timeInterval / 60000}{" "}
                    Minutes
                  </Text>
                </View>
              </View>

              <View style={{ flex: 2, justifyContent: "center" }}>
                <Text style={styles.text1}>Deep Sleep Time</Text>
                <View
                  style={{
                    flex: 1,
                    justifyContent: "center",
                    flexDirection: "row",
                  }}
                >
                  <Slider
                    style={{ width: "75%" }}
                    minimumValue={1}
                    maximumValue={60}
                    minimumTrackTintColor="#FFFFFF"
                    maximumTrackTintColor="#000000"
                    step={1}
                    value={deepSleepTime}
                    onValueChange={async (value) => {
                      this.setDeepSleep(value * 60000000);
                    }}
                  />
                  <Text
                    style={{
                      color: "white",
                      fontSize: 12,
                      alignSelf: "center",
                    }}
                  >
                    {this.state.deepSleepTimeToStore / 60000000} Minutes
                  </Text>
                </View>
              </View>

              <View style={{ flex: 2, justifyContent: "center" }}>
                <Text style={styles.text1}>Required Moisture Level</Text>
                <View
                  style={{
                    flex: 1,
                    justifyContent: "center",
                    flexDirection: "row",
                  }}
                >
                  <Slider
                    style={{ width: "75%" }}
                    minimumValue={1}
                    maximumValue={100}
                    minimumTrackTintColor="#FFFFFF"
                    maximumTrackTintColor="#000000"
                    step={1}
                    value={moisture}
                    onValueChange={async (value) => this.setMoisture(value)}
                  />
                  <Text
                    style={{
                      color: "white",
                      fontSize: 12,
                      alignSelf: "center",
                    }}
                  >
                    {this.state.wateringOptionsToStore.moisture}%
                  </Text>
                </View>
              </View>

              <TouchableOpacity
                style={styles.screen3InfoBoxes}
                onPress={async () => {
                  this.saveSettings(), this.setState({ deviceSettings: false });
                }}
              >
                <Text style={styles.text}>Save Settings</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.screen3InfoBoxes}
                onPress={() => this.setState({ deviceSettings: false })}
              >
                <Text style={styles.text}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      );
    }
  }

  screen1() {
    return (
      <View style={styles.screen1}>
        <View
          style={{
            flex: 1,
            margin: 10,
            width: "100%",
            justifyContent: "flex-end",
            borderRadius: 5,
          }}
        >
          <Image
            style={{
              flex: 1,
              width: "100%",
              height: "100%",
              resizeMode: "cover",
            }}
            source={require("../assets/plantsSoil.png")}
          />
          <Image
            style={{
              flex: 1,
              width: "100%",
              height: "100%",
              resizeMode: "cover",
            }}
            source={require("../assets/Soil.jpg")}
          />
          <View
            style={{
              height: parseInt(this.state.deviceMoisture) / 2 + "%",
              width: "100%",
              position: "absolute",
              backgroundColor: "rgba(26, 54, 97,0.5)",
            }}
          />
        </View>
        <View
          style={{
            flex: 1,
            flexDirection: "column",
            justifyContent: "space-evenly",
          }}
        >
          <View style={styles.screen1InfoBoxes}>
            <Image
              style={styles.screen1Images}
              source={require("../assets/Temperature.png")}
            />
            <Text style={styles.text}>{this.state.deviceTemprature}°C</Text>
          </View>

          <View style={styles.screen1InfoBoxes}>
            <Image
              style={styles.screen1Images}
              source={require("../assets/Humidity.png")}
            />
            <Text style={styles.text}>
              {Math.round(parseFloat(this.state.deviceHumidity))}%
            </Text>
          </View>

          <View style={styles.screen1InfoBoxes}>
            <Image
              style={styles.screen1Images}
              source={require("../assets/Moisture.png")}
            />
            <Text style={styles.text}>{this.state.deviceMoisture}%</Text>
          </View>
        </View>
      </View>
    );
  }
  screen2() {
    const data = this.state.moistureGraph;
    return (
      <View style={globalStyles.scrollScreen}>
        <Text style={styles.text1}>Temperature °C</Text>
        <View style={styles.screen2Objects}>
          <LineChart
            style={{ flex: 1, width: "100%", height: "100%" }}
            data={this.state.tempratureGraph}
            contentInset={{ top: 30, bottom: 30 }}
            curve={shape.curveNatural}
            svg={{ stroke: "green" }}
            gridMin={0}
            gridMax={100}
          >
            <Grid />
          </LineChart>
        </View>

        <Text style={styles.text1}>Humidity %</Text>
        <View style={styles.screen2Objects}>
          <LineChart
            style={{ flex: 1, width: "100%", height: "100%" }}
            data={this.state.humidityGraph}
            contentInset={{ top: 30, bottom: 30 }}
            svg={{ stroke: "tomato" }}
            curve={shape.curveNatural}
            gridMin={0}
            gridMax={100}
          >
            <Grid />
          </LineChart>
        </View>

        <Text style={styles.text1}>Soil Moisture %</Text>
        <View style={styles.screen2Objects}>
          <LineChart
            style={{ flex: 1, width: "100%", height: "100%" }}
            data={this.state.moistureGraph}
            contentInset={{ top: 30, bottom: 30 }}
            curve={shape.curveNatural}
            svg={{ stroke: "red" }}
            gridMin={0}
            gridMax={100}
          >
            <Grid />
          </LineChart>
        </View>
      </View>
    );
  }
  screen3() {
    return (
      <View style={globalStyles.scrollScreen}>
        <TouchableOpacity
          style={styles.screen3InfoBoxes}
          onPress={() => this.startStopWatering()}
        >
          <Text
            style={[
              styles.text,
              {
                color: this.state.wateringOptions.activateSystem
                  ? "red"
                  : "green",
              },
            ]}
          >
            Enable Watering
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.screen3InfoBoxes}
          onPress={() => {
            this.getStoredSettings(), this.setState({ deviceSettings: true });
          }}
        >
          <Text style={styles.text}>Device Settings</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.screen3InfoBoxes}
          onPress={() => this.deepSleep()}
        >
          <Text style={styles.text}>Enable Deep Sleep</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.screen3InfoBoxes,
            { backgroundColor: "rgba(219, 106, 106,0.7)" },
          ]} onPress={() => this.removeDevice()}
        >
          <Text style={styles.text}>Remove Device</Text>
        </TouchableOpacity>
        {this.renderModal()}
      </View>
    );
  }

  render() {
    if (this.state.isLoading) {
      return (
        <View style={{ flex: 1, justifyContent: "center" }}>
          <ActivityIndicator size="large" />
        </View>
      );
    }
    return (
      <View style={globalStyles.container}>
        <View style={globalStyles.header}>
          <TouchableOpacity
            style={globalStyles.navButton}
            onPress={() => {
              this.props.navigation.goBack();
            }}
          >
            <Image
              style={globalStyles.navButtonText}
              source={require("../assets/Back.png")}
            />
          </TouchableOpacity>

          <Text style={globalStyles.title}>Plant Care</Text>

          <TouchableOpacity
            style={globalStyles.navButton}
            onPress={() => {
              this.props.navigation.navigate("Device_Settings");
            }}
          >
            <Image
              style={globalStyles.navButtonText}
              source={require("../assets/Settings.png")}
            />
          </TouchableOpacity>
        </View>
        <View style={globalStyles.body}>
          <Text style={globalStyles.bodyTitle}>{this.state.data.deviceId}</Text>
          <View style={globalStyles.line}></View>
          <ScrollView
            horizontal={true}
            pagingEnabled={true}
            persistentScrollbar={true}
            scrollEnabled={!this.state.sliderActive}
          >
            {this.screen1()}

            {this.screen2()}

            {this.screen3()}
          </ScrollView>
        </View>
      </View>
    );
  }
}
const screenWidth = Dimensions.get("window").width;
const screenHeight = Dimensions.get("window").height;
const styles = StyleSheet.create({
  screen1: {
    flex: 1,
    marginVertical: 20,
    width: screenWidth - 30,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 10,
    borderRadius: 15,
    backgroundColor: "rgba(255,255,255,0.3)",
    flexDirection: "row",
  },
  screen1InfoBoxes: {
    flex: 1,
    margin: 20,
    backgroundColor: "rgba(0, 188, 242,0.5)",
    borderRadius: 15,
    justifyContent: "center",
    padding: 10,
  },
  screen1Images: {
    flex: 1,
    width: "100%",
    height: "100%",
    resizeMode: "contain",
  },
  screen2Objects: {
    flex: 1,
    width: "95%",
    height: "100%",
    borderWidth: 2,
    borderColor: "black",
    borderRadius: 5,
    margin: 5,
    backgroundColor: "white",
  },
  screen3InfoBoxes: {
    flex: 1,
    margin: 20,
    backgroundColor: "rgba(0, 188, 242,0.5)",
    borderRadius: 15,
    justifyContent: "center",
    width: "95%",
    alignSelf: "center",
  },
  text: {
    color: "white",
    fontSize: 35,
    alignSelf: "center",
    textAlign: "center",
  },
  text1: {
    color: "white",
    fontSize: 16,
    alignSelf: "center",
  },
});
