import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Device_Home from './screens/device_home';
import Device_Settings from './screens/device_settings';
import Device_List from './screens/device_list';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Device_List"
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen name="Device_Home" component={Device_Home} />
        <Stack.Screen name="Device_Settings" component={Device_Settings} />
        <Stack.Screen name="Device_List" component={Device_List} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}