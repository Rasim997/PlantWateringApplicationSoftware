import React, { Component } from 'react';
import {Text, View,TouchableOpacity,Image,StyleSheet} from 'react-native';
import { Button } from 'react-native-web';
import { globalStyles } from '../styles/globalStyles';

export default class Device_Add extends Component {
  
  constructor(props) {
    super(props);
    this.state = {
      Ofr: [],
      friend_list: [],
      isLoading: true,
    };
  }
   
    render(){
      return (
        <View style={globalStyles.container}>
        <View style={globalStyles.header}>
          <TouchableOpacity style={globalStyles.navButton} onPress={() => {this.props.navigation.goBack();}}>
            <Image style={globalStyles.navButtonText} source={require('../assets/Back.png')}/>
          </TouchableOpacity>
        </View>
        <View style={globalStyles.body}>
            <Text style={globalStyles.bodyTitle}>Add a Device</Text>
            <View style={globalStyles.line}/>

            <View style={globalStyles.bodyContainer}>
                <Image style={styles.imageGraphics} source={require('../assets/Device.png')}/>
            </View>
            <View style={globalStyles.bodyContainer}>
                <Text style={styles.text} >1. Go to your phone's WiFi settings and connect to the device's WiFi hotspot</Text>
                
                <Text style={styles.text} >2. Hit the Already Connected button below.</Text>
            </View>    
            <TouchableOpacity style={globalStyles.bodyButton} onPress={() => this.props.navigation.navigate("Device_Connecting")}>
                <Text style={styles.text}>Already Connected</Text>
            </TouchableOpacity>   
                      
        </View>
      </View>
        );
    }
    
    
  
}
const styles = StyleSheet.create({
    imageGraphics:{
        width:'100%',
        height:'100%',
        minWidth:5,
        minHeight:5,
        maxHeight: 300, 
        maxWidth: 300,
        alignSelf:'center',
        padding:5,
    },
    text:{
        color:'white',
        fontSize:20,
        marginLeft:20,
        marginVertical:10
    },
});
