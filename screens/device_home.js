import React, { Component } from 'react';
import {Text, View,TouchableOpacity, ActivityIndicator,ScrollView,Dimensions,Image} from 'react-native';
import { globalStyles } from '../styles/globalStyles';


export default class Device_Home extends Component {
  constructor(props) {
    super(props);

    this.state = {
      PostText: [],
      postUser: [],
    };
  }
  
  render() {
    if (this.state.isLoading) {
      return (
        <View style={{ flex: 1, justifyContent: 'center' }}>
          <ActivityIndicator size="large" />
        </View>
      );
    }
    let screenWidth = Dimensions.get("window").width;
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
            <Text style={globalStyles.bodyTitle}>Device 1</Text>
            <View style={globalStyles.line}></View>
            <ScrollView
              horizontal={true}
              pagingEnabled={true}
              
              onMomentumScrollEnd={()=>{console.log("scrollsthick")}}
              onMomentumScrollBegin={()=>{console.log("scrollsthick")}}
            >
                <View style={globalStyles.scrollScreen}>
                  <Text Style={{fontSize:50,padding:15,color:'white',textAlign:'center'}}> 
                    Screen 1
                  </Text>
                </View>

                <View style={globalStyles.scrollScreen}>
                  <Text Style={{fontSize:50,padding:15,color:'white',textAlign:'center'}}> 
                    Screen 2
                  </Text>
                </View>

                <View style={globalStyles.scrollScreen}>
                  <Text Style={{fontSize:50,padding:15,color:'white',textAlign:'center'}}> 
                    Screen 3
                  </Text>

                </View>
            </ScrollView>
          </View>
        </View>























      
        
    );
  }
}