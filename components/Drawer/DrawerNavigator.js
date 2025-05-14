import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { View, Text, Image } from 'react-native';

import MyPageScreen from '../../pages/DateDetail/DateDetail';
import RobotScreen from '../../pages/WeeRoUsage/index';
import CustomDrawerContent from './CustomDrawerContent';

const Drawer = createDrawerNavigator();

export default function DrawerNavigator() {
  return (
    <Drawer.Navigator

    drawerContent={(props) => <CustomDrawerContent {...props} />}

  screenOptions={{
    headerShown: true,
  headerStyle: {
    height: 100, // 상단바 높이 조절
    backgroundColor: '#fff',
  },
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
      <Drawer.Screen name="My Page" component={MyPageScreen} />
      <Drawer.Screen name="Robot" component={RobotScreen} />
    </Drawer.Navigator>
  );
}