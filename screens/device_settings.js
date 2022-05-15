import React, { Component } from 'react';
import {Text, View,TouchableOpacity,Image,Button} from 'react-native';
import { globalStyles } from '../styles/globalStyles';
import AsyncStorage from '@react-native-async-storage/async-storage';


export default class Device_Settings extends Component {
  
  constructor(props) {
    super(props);
    this.state = {
      Ofr: [],
      friend_list: [],
      isLoading: true,
    };
  }
  //reset the whole application
  reset = async()=>{
    await AsyncStorage.clear();
  }
  //backdoor to add a test device
  addDevice = async()=>{
    const currDevices = JSON.parse(await AsyncStorage.getItem('@devices'));
          if(currDevices != null){
            const toStore={
              deviceId:'fa7eb994',
              deviceIp:'192.168.0.78',
              deviceSsid:'VM2884618',
              devicePassword:'yvscrdDN78sk'

            }
            currDevices.push(toStore);
            await AsyncStorage.setItem('@devices',JSON.stringify(currDevices));
          }else{
            const device=[{
              deviceId:'fa7eb994',
              deviceIp:'192.168.0.78',
              deviceSsid:'VM2884618',
              devicePassword:'yvscrdDN78sk'
            }]
            await AsyncStorage.setItem('@devices',JSON.stringify(device));
          }
  };
    //main render function for the page 
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
          <Text style={globalStyles.bodyTitle} >Settings</Text>
          <View style={globalStyles.line}/>
          <TouchableOpacity style={globalStyles.bodyButton} onPress={()=>this.reset()}>
            <Text style={globalStyles.bodyButtonText}>Reset Application</Text>
          </TouchableOpacity>
        </View>
      </View>
        );
    }
    

  
}
