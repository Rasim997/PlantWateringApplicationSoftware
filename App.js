import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'react-native';
import Device_Home from './screens/device_home';
import Device_Settings from './screens/device_settings';
import Device_List from './screens/device_list';
import Device_Add from './screens/device_add';
import Device_Connecting from './screens/device_connecting';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <StatusBar hidden />
      <Stack.Navigator
        initialRouteName="Device_List"
        screenOptions={{ headerShown: false }}
        
      >
        <Stack.Screen name="Device_Home" component={Device_Home} />
        <Stack.Screen name="Device_Settings" component={Device_Settings} />
        <Stack.Screen name="Device_List" component={Device_List} />
        <Stack.Screen name="Device_Add" component={Device_Add} />
        <Stack.Screen name="Device_Connecting" component={Device_Connecting} />

      </Stack.Navigator>
    </NavigationContainer>
  );
}