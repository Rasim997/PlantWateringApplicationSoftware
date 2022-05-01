import React, { Component } from 'react';
import {Text, View,TouchableOpacity,Image,StyleSheet,ActivityIndicator,Alert,TextInput} from 'react-native';
import { globalStyles } from '../styles/globalStyles';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default class Device_Connecting extends Component {
  
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      connecting: false,
      ssid:"",
      pass:"",
    };
  }

    activityIndicatorDisp(){
        if(this.state.connecting){
            return(
            
                <ActivityIndicator size="large" color="#2699a4"/>
            );
        }
        return
        
    }

    componentDidMount() {
        
        this.checkDevice();
        console.log("working");
        setTimeout(() => {
            if(this.state.isLoading){
                Alert.alert('Failed to connect to device!');
                this.props.navigation.goBack();             
            }
        }, 10000);
    }
    checkDevice = async()=>{
        return fetch('http://192.168.4.1:80/')
        .then((response) => {
            if (response.status === 200) {
                this.setState({isLoading: false,});
            } 
            else {
                this.props.navigation.goBack();
            }
        })
        .catch((error) => {
            Error(error);
        });
   }
   sendWifiCredentials= async()=>{
    const toSend = {
        SSID: this.state.ssid,
        PASS: this.state.pass,
      };
  
      return fetch(
        `http://192.168.4.1:80/connect`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(toSend),
        },
      )
        .then((response) => {
          console.log(response.status)
          if (response.status == 201) {
            return response.json();
          } else if (response.status == 400) {
            Alert.alert("Error! Information Incorrect");
            this.props.navigation.goback();
          } else {
            Alert.alert('something Went Wrong');
            this.props.navigation.navigate("Device_Add");
          }
        }).then(async(responseJson) => {

          const currDevices = JSON.parse(await AsyncStorage.getItem('@devices'));
          if(currDevices != null){
            const toStore={
              deviceId:responseJson.hostname,
              deviceIp:responseJson.ip,
              deviceSsid:responseJson.ssid,
              devicePassword:responseJson.password

            };
            currDevices.push(toStore);
            await AsyncStorage.setItem('@devices',JSON.stringify(currDevices));
          }else{
            const device=[{
              deviceId:responseJson.hostname,
              deviceIp:responseJson.ip,
              deviceSsid:responseJson.ssid,
              devicePassword:responseJson.password
            }]
            await AsyncStorage.setItem('@devices',JSON.stringify(device));
          }
          
          Alert.alert("Device Successfully Added")
          this.props.navigation.navigate('Device_List');
        })
        .catch((error) => {
          Alert.alert(error.message);
        });
   };

    render(){
        if(this.state.isLoading){
            return(
                <View style={globalStyles.container}>
                    <View style={styles.loadingBody}>
                        <Text style={styles.text}>Connecting To Device</Text>
                        <ActivityIndicator size="large" color="#2699a4"/> 
                    </View>
                </View>
            );
        }
        return (
            <View style={globalStyles.container}>
            <View style={globalStyles.body}>
                <Text style={globalStyles.bodyTitle}>Enter Credentials</Text>
                <View style={globalStyles.line}/>
                <View style={styles.textBody}>
                    
                    <TextInput style={styles.textInput} maxLength={50} placeholder="SSID" onChangeText={(ssid) => this.setState({ssid})} />
                    <TextInput style={styles.textInput} maxLength={50} placeholder="Password" onChangeText={(pass) => this.setState({ pass })} />

                </View>  
                <TouchableOpacity style={styles.bodyButton} onPress={()=>{this.setState({connecting:true});this.sendWifiCredentials();}}>
                    <Text style={styles.text}>Connect</Text>
                    {this.activityIndicatorDisp()}
                </TouchableOpacity>   
                        
            </View>
            </View>
            );
    }
    
    
  
}
const styles = StyleSheet.create({
    textBody:{
        flex:1,
        justifyContent:'center',
    },
    text:{
        color:'white',
        fontSize:20,
        margin:10
    },
    loadingBody:{
        flex:1,
        backgroundColor:'rgba(53, 54, 58,0.5)',
        borderRadius:10,
        marginVertical:8,
        width:'95%',
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'center',

    },
    bodyButton:{
        flex:1,
        backgroundColor:'rgba(255,255,255,0.3)',
        borderRadius:15,
        padding:10,
        alignSelf:'center',
        width:'90%',
        marginVertical:5,
        justifyContent:'center',
        maxHeight:60,
        flexDirection:'row',
      },
      textInput:{
        flex:1,
        backgroundColor:'white',
        borderRadius:15,
        padding:10,
        alignSelf:'center',
        width:'90%',
        marginVertical:5,
        justifyContent:'center',
        maxHeight:60,
      },
});
