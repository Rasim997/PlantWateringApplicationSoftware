import { StyleSheet,Dimensions } from "react-native";

let screenWidth = Dimensions.get("window").width;
let screenHeight = Dimensions.get("window").height;
export const globalStyles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "#fff",
      alignItems: "center",
      justifyContent: "center",
      backgroundColor:'#202023',
      },
      header:{
        flex:1,
        flexDirection:'row',
        justifyContent:'space-between',
        backgroundColor:'rgba(0, 188, 242,0.3)',
        borderBottomLeftRadius:8,
        borderBottomRightRadius:8,
        width:screenWidth-10,
      },
      body:{
        flex:10,
        backgroundColor:'rgba(53, 54, 58,0.5)',
        borderRadius:10,
        marginVertical:8,
        width:screenWidth-10,

      },

      navButton:{
        minWidth:40,
        minHeight:40,
        maxHeight: 300,
        maxWidth: 300,
        margin:10,
        borderRadius:15,
        borderWidth:1,
        backgroundColor:'rgba(255, 255, 255, 0.5)'

      },
      navButtonText:{
        resizeMode:'cover',
        width:'100%',
        height:'100%',
        aspectRatio:1*1,
      },

      title: {
        fontSize:40,
        alignSelf:'center',
        borderRadius:15,
        paddingHorizontal:10,
        paddingVertical:2,
        backgroundColor:'rgba(255, 255, 255, 0.2)'
      },
      bodyTitle:{
        color:'white',
        fontSize:40,
        marginLeft:20
      },
      line:{
        borderColor:'white',
        borderRadius:100,
        borderWidth:2,
        alignSelf:'center',
        width:screenWidth-40,
      },
      bodyButtonText:{
        fontSize:30,
        color:'white',
      },
      bodyButton:{
        flex:1,
        backgroundColor:'rgba(255,255,255,0.3)',
        borderRadius:15,
        padding:10,
        alignSelf:'center',
        width:screenWidth-20,
        marginVertical:5,
        justifyContent:'center',
        
      },
      scrollScreen:{
        backgroundColor:'tomato',
        flex: 1,
        marginVertical:20,
        width:screenWidth-30,
        justifyContent:'center',
        alignItems:'center',
        marginHorizontal:10,
        borderRadius:15,
      },
      
})