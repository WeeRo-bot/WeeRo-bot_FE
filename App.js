import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import LoginScreen from './pages/UserAccount/Login';
import Signup from './pages/UserAccount/Signup';
import DrawerNavigator from './components/Drawer/DrawerNavigator';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Signup" component={Signup} />
        <Stack.Screen name="MainDrawer" component={DrawerNavigator} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}


// <Drawer 메뉴 테스트 코드>
// import React from 'react';
// import { SafeAreaProvider } from 'react-native-safe-area-context';
// import { NavigationContainer } from '@react-navigation/native';
// import DrawerNavigator from './components/Drawer/DrawerNavigator';

// export default function App() {
//   return (
//     <SafeAreaProvider>
//       <NavigationContainer>
//         <DrawerNavigator />
//       </NavigationContainer>
//     </SafeAreaProvider>
//   );
// }