import React, { Component } from 'react';
import {StyleSheet, Text, View,TouchableOpacity, ActivityIndicator,ScrollView,FlatList ,Dimensions} from 'react-native';
import { globalStyles } from '../styles/globalStyles';


export default class Device_Home extends Component {
  constructor(props) {
    super(props);

    this.state = {
      PostText: [],
      postUser: [],
      items:[ {
                id: "1",
                name: "GeeksforGeeks View 1",
            },
            {
                id: "2",
                name: "GeeksforGeeks View 2",
            },
            {
                id: "3",
                name: "GeeksforGeeks View 3",
            },
            {
                id: "4",
                name: "GeeksforGeeks View 4",
            },
          ],
    };
  }

  render_cards(name){
    return (
      <View style={globalStyles.container}>
          <Text style={globalStyles.title}>{name.name}</Text>
      </View>
   );
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
    let screenHeight = Dimensions.get("window").height;
    return (
      
        <ScrollView
        horizontal={true}
        pagingEnabled={true}
        onMomentumScrollEnd={()=>{console.log("scrollsthick")}}
        onMomentumScrollBegin={()=>{console.log("scrollsthick")}}
        >
          <View style={{ backgroundColor:"blue",flex: 1,marginTop:20,width:screenWidth,justifyContent:'center',alignItems:'center'}}>
            <Text Style={{fontSize:20,padding:15,color:'white',textAlign:'center'}}> 
              Screen 1
            </Text>
          </View>

          <View style={{ backgroundColor:"orange",flex: 1,marginTop:20,width:screenWidth,justifyContent:'center',alignItems:'center'}}>
            <Text Style={{fontSize:20,padding:15,color:'white',textAlign:'center'}}> 
              Screen 2
            </Text>
          </View>

          <View style={{ backgroundColor:"tomato",flex: 1,marginTop:20,width:screenWidth,justifyContent:'center',alignItems:'center'}}>
            <Text Style={{fontSize:20,padding:15,color:'white',textAlign:'center'}}> 
              Screen 3
            </Text>

          </View>

        </ScrollView>
    );
  }
}