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
  reset = async()=>{
    await AsyncStorage.clear();
  }
 
    render(){
      return (
        <View style={globalStyles.container}>
        <View style={globalStyles.header}>
          <TouchableOpacity style={globalStyles.navButton} onPress={() => {this.props.navigation.goBack();}}>
            <Image style={globalStyles.navButtonText} source={require('../assets/Back.png')}/>
          </TouchableOpacity>

          <Text style={globalStyles.title}>𝓟𝓦𝓢</Text>

          <TouchableOpacity style={globalStyles.navButton} onPress={() => {this.props.navigation.navigate('Device_Settings');}}>
            <Image style={globalStyles.navButtonText} source={require('../assets/Settings.png')}/>
          </TouchableOpacity>
        </View>
        <View style={globalStyles.body}>
          <Text >Settings Page</Text>
          <Button title={"asdasd"} onPress={()=>this.reset()}/>
        </View>
      </View>
        );
    }
    

  
}
