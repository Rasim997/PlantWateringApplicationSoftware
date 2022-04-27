import React, { Component } from 'react';
import {Text, View,TouchableOpacity,Image,Button,FlatList} from 'react-native';
import { globalStyles } from '../styles/globalStyles';




export default class Device_List extends Component {
  
  constructor(props) {
    super(props);
    this.state = {
      Ofr: [],
      friend_list: [],
      isLoading: true,
    };
  }

  viewDevice(DeviceInfo){

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
            <FlatList style={{flex:9, marginTop:20}}>

            </FlatList>

            <Button title={"gellp"}onPress={()=> this.props.navigation.navigate("Device_Home")}/>

            <TouchableOpacity style={globalStyles.bodyButton} onPress={()=>this.props.navigation.navigate("Device_Add")}>
              <Text style={globalStyles.bodyButtonText} onPress={()=>this.props.navigation.navigate("Device_Add")}>➕ Add a Device</Text>
            </TouchableOpacity>

            <TouchableOpacity style={globalStyles.bodyButton}>
              <Text style={globalStyles.bodyButtonText}>⚙ Settings</Text>
            </TouchableOpacity>

          </View>
        </View>
      );
    }
}
