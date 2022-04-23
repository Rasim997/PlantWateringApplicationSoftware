import { StyleSheet } from "react-native";

export const globalStyles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "#fff",
      alignItems: "center",
      justifyContent: "center",
      },
      title: {
        flex: 1,
        backgroundColor:'blue',
        width:390,
        marginHorizontal:25
    },
      title1: {
        flex: 1,
        width:300,
        marginHorizontal:25,
      borderWidth: 4,
      borderColor: "#20232a",
      borderRadius: 6,
      backgroundColor: "#61dafb",
      color: "#20232a",
      textAlign: "center",
      fontSize: 30,
      fontWeight: "bold"
    }
})