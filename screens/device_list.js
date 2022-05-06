import React, { Component } from 'react';
import {Text, View,TouchableOpacity,Image,Button,FlatList,ScrollView,StyleSheet,Alert} from 'react-native';
import { globalStyles } from '../styles/globalStyles';
import AsyncStorage from '@react-native-async-storage/async-storage';
const axios = require('axios')




export default class Device_List extends Component {
  
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      devices:[],
      devicesData:[{
        deviceTemprature:0,
        deviceHumidity:0,
        deviceMoisture:0,
      }],
      deviceTemprature:null,
      deviceHumidity:null,
      deviceMoisture:null,
    };
  }

  componentDidMount(){
    this.refresh=this.props.navigation.addListener('focus',()=>{
      this.getData();

      console.log('focus');

      this.interval= setInterval(() => {
        this.getdevicesData();
      }, 5000);

    });

    this.props.navigation.addListener('blur', () => {
      console.log('blur');
      clearInterval(this.interval);
    });

    this.getData();

    
    
  }
  componentWillUnmount(){
    this.refresh();
  }


  getData = async()=>{
    const data = JSON.parse(await AsyncStorage.getItem('@devices'));
    this.setState({devices:data});
  }

   getDeviceSensors =async(Deviceip)=>{
    axios.get(`http://${Deviceip}:80/sensors`)
    .then((response) => {
      if (response.status == 200) {
        return response.data;
      } else {
        Alert.alert('Something Went Wrong');
      }
    })
    .then((responseJson) => {
      this.setState({
        deviceTemprature:responseJson.Temprature,
        deviceHumidity:responseJson.Humidity,
        deviceMoisture:responseJson.Soil_Moisture,
      })
    })
    .catch((error) => {
      console.log(error)
    });

  };

  getdevicesData(){
    const devices=this.state.devices;
    let deviceData = [];
    if(devices!=null){
      for(let i=0;i<devices.length;i++){
        this.getDeviceSensors(devices[i].deviceIp);
        const toAdd={
          deviceTemprature:this.state.deviceTemprature,
          deviceHumidity:this.state.deviceHumidity,
          deviceMoisture:this.state.deviceMoisture,
        }
        deviceData.push(toAdd);
      }
      this.setState({devicesData:deviceData});
    }
    
  }
  
  displayDevices(deviceInfo,index){
    let humidity=Math.round(parseFloat(this.state.devicesData[index].deviceHumidity))
    
    
    
    return(
      //main box=>2 boxes inside=> 1. empty 2. 3 more boxes
      <TouchableOpacity style={styles.DeviceOpacity} onPress={async()=>{this.props.navigation.navigate("Device_Home");await AsyncStorage.setItem('@currentDevice',JSON.stringify(deviceInfo)) } }>


        <View style={styles.DeviceImageView}>
          <Image style={{width:'100%',height:'100%'}} source={require('../assets/Plant.png')}/>
        </View>
        <View style={{flex:3}}>
          <Text style={globalStyles.bodyButtonText}>{deviceInfo.deviceId}</Text>
          <View style={styles.InfoSectionView}>
            <View style={styles.InfoView}>
              <Image style={styles.InfoImage} source={require('../assets/Temperature.png')}/>
              <Text style={styles.InfoText}>{this.state.devicesData[index].deviceTemprature}°C</Text>
            </View>

            <View style={styles.InfoView}>
              <Image style={styles.InfoImage} source={require('../assets/Humidity.png')}/>
              <Text style={styles.InfoText}>{humidity}%</Text>
            </View>

            <View style={styles.InfoView}>
              <Image style={styles.InfoImage} source={require('../assets/Moisture.png')}/>
              <Text style={styles.InfoText}>{this.state.devicesData[index].deviceMoisture}%</Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  }

  render(){
    return (
        
      <View style={globalStyles.container}>
          
        <View style={globalStyles.header}>
          <TouchableOpacity style={globalStyles.navButton} onPress={() => {this.props.navigation.goBack();}}>
          <Image style={globalStyles.navButtonText} source={require('../assets/Back.png')}/>
        </TouchableOpacity>

        <Text style={globalStyles.title}>PLANT CARE</Text>

        <TouchableOpacity style={globalStyles.navButton} onPress={() => {this.props.navigation.navigate('Device_Settings');}}>
          <Image style={globalStyles.navButtonText} source={require('../assets/Settings.png')}/>
        </TouchableOpacity>
        </View>
        <View style={globalStyles.body}>
          <Text style={globalStyles.bodyTitle}>📱 Devices</Text>
          <View style={globalStyles.line}/>
            <FlatList
              data={this.state.devices}
              renderItem={({item,index})=>(this.displayDevices(item,index))}
              keyExtractor={(item)=>(item.deviceId.toString())}
            />
            
            <TouchableOpacity style={globalStyles.bodyButton} onPress={()=>this.props.navigation.navigate("Device_Add")}>
              <Text style={globalStyles.bodyButtonText} onPress={()=>this.props.navigation.navigate("Device_Add")}>➕ Add a Device</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={globalStyles.bodyButton}>
              <Text style={globalStyles.bodyButtonText} onPress={()=>this.props.navigation.navigate("Device_Settings")}>⚙ Settings</Text>
            </TouchableOpacity>

          </View>
        </View>
      );
    }
}
const styles = StyleSheet.create({
  DeviceOpacity:{
    flex:1,
    justifyContent:'center',
    flexDirection:'row',
    borderRadius:10,
    borderWidth:3,
    borderColor:'black',
    height:200,
    backgroundColor:'rgba(255,255,255,0.3)'
  },
  DeviceImageView:{
    flex:1,
    margin:10
  },
  InfoSectionView:{
    flex:3,
    flexDirection:'row',
    justifyContent:'space-evenly',
    margin:10,
  },
  InfoView:{
    flex:1,
    justifyContent:'space-evenly',
     margin:5,
  },
  InfoImage:{
    width:'70%',
    height:'70%',
    resizeMode:'center',
    alignSelf:'center'
  },
  InfoText:{
    alignSelf:'center',
    borderRadius:5,
    backgroundColor:'rgba(255,255,255,0.3)',
    padding:10
  },
});