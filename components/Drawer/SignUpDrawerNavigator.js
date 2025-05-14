import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { View, Text, Image } from 'react-native';

import SignupScreen from '../../pages/UserAccount/Signup';

const Drawer = createDrawerNavigator();

export default function DrawerNavigator() {
  return (
    <Drawer.Navigator
      screenOptions={{
        headerShown: true,
        headerStyle: {
          height: 100, // 상단바 높이
          backgroundColor: '#fff',
        },
        headerLeft: () => null, // 햄버거 버튼 제거
        headerTitle: () => (
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Image
              source={require('../../assets/images/logo.png')}
              style={{ width: 30, height: 30, borderRadius: 15, marginRight: 10 }}
            />
            <Text style={{ fontSize: 18, color: '#78C1F3', fontWeight: 'bold' }}>WeeRo_bot</Text>
          </View>
        ),
        headerTintColor: '#000000',
      }}
    >
      <Drawer.Screen
        name="SignupScreen"
        component={SignupScreen}
        options={{ gestureEnabled: false }} // 드로어 제스처 차단
      />
    </Drawer.Navigator>
  );
}
