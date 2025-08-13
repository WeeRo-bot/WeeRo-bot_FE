import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Alert } from 'react-native';
import { DrawerContentScrollView } from '@react-navigation/drawer';
import { Feather } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function CustomDrawerContent(props) {

  // 로그아웃 핸들러
  const handleLogout = async () => {
    Alert.alert(
      '로그아웃',
      '정말 로그아웃 하시겠습니까?',
      [
        { text: '취소', style: 'cancel' },
        {
          text: '로그아웃',
          style: 'destructive',
          onPress: async () => {
            await AsyncStorage.removeItem('authToken'); // 저장된 토큰 삭제
            props.navigation.reset({
              index: 0,
              routes: [{ name: 'Login' }], // 스택을 초기화하고 로그인 화면으로 이동
            });
          },
        },
      ]
    );
  };

  return (
    <View style={{ flex: 1 }}>
      <DrawerContentScrollView {...props} contentContainerStyle={{ paddingTop: 0 }}>
        {/* 프로필 */}
        <View style={styles.profileSection}>
          <Image source={require('../../assets/images/profile.png')} style={styles.profileimg} />
          <Text style={styles.nickname}>닉네임</Text>
        </View>

        <View style={{ height: 15 }} />

        {/* 메뉴 */}
        <View style={{ flex: 1, paddingHorizontal: 20 }}>
          <TouchableOpacity onPress={() => props.navigation.navigate('My Page')} style={styles.menuItem}>
            <Image source={require('../../assets/images/mypage.png')} style={styles.avatar} />
            <Text style={styles.menuText}>마이페이지</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => props.navigation.navigate('Robot')} style={styles.menuItem}>
            <Image source={require('../../assets/images/robot.png')} style={styles.avatar} />
            <Text style={styles.menuText}>위로봇</Text>
          </TouchableOpacity>
        </View>
      </DrawerContentScrollView>

      {/* 하단 */}
      <View style={styles.footer}>
        {/* 로그아웃 버튼 */}
        <TouchableOpacity style={styles.menuItem} onPress={handleLogout}>
          <Feather name="log-out" size={20} color="#ccc" />
          <Text style={styles.footerText}>로그아웃</Text>
        </TouchableOpacity>

        {/* 탈퇴하기 버튼 */}
        <TouchableOpacity style={styles.menuItem}>
          <Feather name="user-x" size={20} color="#ccc" />
          <Text style={styles.footerText}>탈퇴하기</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  profileSection: {
    alignItems: 'center',
    paddingVertical: 40,
    backgroundColor: '#fff',
    marginTop: 50,
  },
  profileimg: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#fff',
  },
  logo: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F8FDCF',
    marginRight: 10,
  },
  avatar: {
    width: 30,
    height: 30,
    borderRadius: 40,
    backgroundColor: '#fff',
  },
  nickname: {
    marginTop: 20,
    fontWeight: 'bold',
    fontSize: 25,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 30,
  },
  menuText: {
    fontSize: 20,
    marginLeft: 15,
    fontWeight: '500',
  },
  footer: {
    padding: 20,
    borderTopWidth: 1,
    borderColor: '#eee',
  },
  footerText: {
    marginLeft: 10,
    color: '#888',
  },
});
