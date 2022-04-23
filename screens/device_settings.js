import React, { Component } from 'react';
import {StyleSheet, Text, View,TouchableOpacity, ActivityIndicator,ScrollView,FlatList ,Dimensions} from 'react-native';
import { globalStyles } from '../styles/globalStyles';

export default class Device_Settings extends Component {
  
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
      <Text style={globalStyles.title}>Hello</Text>
      </View>
        );
    }
    

  
}
