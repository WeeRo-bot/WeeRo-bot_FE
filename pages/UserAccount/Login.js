import React from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function LoginScreen() {
  const navigation = useNavigation();
  
  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
    <View style={styles.introduction}>
      <Image source={require('../../assets/images/logo.png')} style={styles.logo} />

      <Text style={styles.helloText}>안녕하세요.{'\n'}<Text style={styles.boldText}>“WeeRo_bot”</Text>입니다.{'\n'}{'\n'}
      <Text style={styles.boldText}>작은 로봇과 함께{'\n'}나만의 감정 기록을 시작해보세요!</Text>
      </Text> 
    </View>

    <View style={styles.container}>
      <TextInput style={styles.input} placeholder="아이디" placeholderTextColor="#999" />
      <TextInput style={styles.input} placeholder="비밀번호" placeholderTextColor="#999" secureTextEntry />

      <View style={{ height: 25 }} />

      <TouchableOpacity style={styles.loginButton}>
        <Text style={styles.loginButtonText}>로그인</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('Signup')} style={styles.signupButton}>
        <Text style={styles.signupButtonText}>회원가입</Text>
      </TouchableOpacity>


    </View>
    </View>
  );
}

const styles = StyleSheet.create({
  introduction: {
    marginTop: 150,
    marginBottom: 40,
    alignItems: 'flex-start',
    paddingLeft: 40,
  },
  container: {
    alignItems: 'center',
  },  
  logo: {
    width: 100,
    height: 100,
    marginBottom: 30,
    resizeMode: 'contain',
  },
  helloText: {
    fontSize: 16,
    color: '#000',
    textAlign: 'left',
    marginBottom: 10,
  },
  boldText: {
    fontWeight: 'bold',
  },
  input: {
    width: '80%',
    borderBottomWidth: 1,
    borderBottomColor: '#78C1F3',
    paddingVertical: 10,
    marginBottom: 20,
    fontSize: 14,
  },
  loginButton: {
    backgroundColor: '#78C1F3',
    width: '80%',
    paddingVertical: 12,
    borderRadius: 20,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  loginButtonText: {
    textAlign: 'center',
    color: '#fff',
    fontWeight: 'bold',
  },
  signupButton: {
    borderWidth: 1,
    borderColor: '#78C1F3',
    width: '80%',
    paddingVertical: 12,
    borderRadius: 20,
  },
  signupButtonText: {
    textAlign: 'center',
    color: '#000',
    fontWeight: 'bold',
  },
});
