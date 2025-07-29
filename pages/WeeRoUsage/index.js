import React, { useState, useRef } from 'react';
import {
  ScrollView, View, Text, TextInput, StyleSheet, Image,
  TouchableOpacity, KeyboardAvoidingView, Platform, Alert
} from 'react-native';
import { Audio } from 'expo-av';
import * as FileSystem from 'expo-file-system';
import EmotionLight from './EmotionLight';
import { emotionTextMap } from '../../data/emotionData';
import axios from 'axios';

const API_BASE_URL = 'http://192.168.0.8';
const GOOGLE_API_KEY = 'AIzaSyBKeQC3NN4K61Ehpdq44uWO6MygE0w6Jew';

export default function WeeRoUsage() {
  const [input, setInput] = useState('');
  const [emotion, setEmotion] = useState('');
  const [advice, setAdvice] = useState('');
  const [loading, setLoading] = useState(false);
  const recordingRef = useRef(null);

  const normalizeEmotion = (srvEmotion) => {
    switch (srvEmotion) {
      case 'HAPPY': return '행복';
      case 'SAD': return '슬픔';
      case 'ANGRY': return '분노';
      case 'SURPRISE': return '놀람';
      case 'FEAR': return '공포';
      case 'DISGUST': return '혐오';
      case 'NEUTRAL': return '중립';
      default: return srvEmotion;
    }
  };

  const recordingSettings = {
    android: {
      extension: '.wav',
      outputFormat: Audio.RECORDING_OPTION_ANDROID_OUTPUT_FORMAT_PCM_16BIT,
      audioEncoder: Audio.RECORDING_OPTION_ANDROID_AUDIO_ENCODER_PCM_16BIT,
      sampleRate: 44100,
      numberOfChannels: 1,
      bitRate: 128000,
    },
    ios: {
      extension: '.wav',
      audioQuality: Audio.RECORDING_OPTION_IOS_AUDIO_QUALITY_HIGH,
      sampleRate: 44100,
      numberOfChannels: 1,
      linearPCMBitDepth: 16,
      linearPCMIsBigEndian: false,
      linearPCMIsFloat: false,
    },
  };

  // 🎤 음성 녹음 시작
  const startRecording = async () => {
    try {
      const { status } = await Audio.requestPermissionsAsync();
      if (status !== 'granted') {
        alert('마이크 권한이 필요합니다.');
        return;
      }

      await Audio.setAudioModeAsync({ allowsRecordingIOS: true, playsInSilentModeIOS: true });
      const { recording } = await Audio.Recording.createAsync(recordingSettings);
      recordingRef.current = recording;
    } catch (error) {
      console.error('녹음 시작 실패:', error);
    }
  };

  // ⏹️ 음성 녹음 종료 + STT
  const stopRecording = async () => {
    try {
      const recording = recordingRef.current;
      if (!recording) return;

      await recording.stopAndUnloadAsync();
      const uri = recording.getURI();

      const base64 = await FileSystem.readAsStringAsync(uri, {
        encoding: FileSystem.EncodingType.Base64,
      });

      const response = await fetch(
        `https://speech.googleapis.com/v1/speech:recognize?key=${GOOGLE_API_KEY}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            config: {
              encoding: 'LINEAR16',
              sampleRateHertz: 44100,
              languageCode: 'ko-KR',
            },
            audio: { content: base64 },
          }),
        }
      );

      const data = await response.json();
      const transcript = data.results?.[0]?.alternatives?.[0]?.transcript;

      if (transcript) {
        setInput(transcript); // 텍스트로 표시
      } else {
        alert('음성을 인식하지 못했어요.');
      }
    } catch (error) {
      console.error('녹음 종료 실패:', error);
    }
  };

  // 📸 카메라 버튼 감정 분석 요청
  const handleCamPress = async () => {
    try {
      setLoading(true);
      const { data } = await axios.post(`${API_BASE_URL}/api/emotions/analyze`);
      const result = data.data;
      setEmotion(normalizeEmotion(result.emotion));
      setAdvice(result.advice);
    } catch (e) {
      console.error(e);
      Alert.alert('오류', '감정 분석 요청에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const emoji = emotionTextMap[emotion]?.emoji || '';
  const defaultMsg = emotionTextMap[emotion]?.message || '감정을 인식하지 못했어요.\n다시 시도해 주세요.';
  const displayMessage = advice || defaultMsg;

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'} keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}>
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <View style={styles.headerSpace} />
        <Text style={styles.title}>🔮 감정 분석 🔮</Text>

        <View style={styles.sectionContainer}><Text style={styles.subTitle}>📸 얼굴 인식</Text></View>
        <TouchableOpacity style={styles.camButton} onPress={handleCamPress}>
          <Image source={require('../../assets/images/camLeft.png')} />
          <Image source={require('../../assets/images/camicon.png')} style={styles.micIcon} />
          <Image source={require('../../assets/images/micRight.png')} />
        </TouchableOpacity>

        <View style={styles.sectionContainer}><Text style={styles.subTitle}>🎙️ 음성 분석</Text></View>
        <TouchableOpacity style={styles.micButton} onPressIn={startRecording} onPressOut={stopRecording}>
          <Image source={require('../../assets/images/micLeft.png')} />
          <Image source={require('../../assets/images/micicon.png')} style={styles.micIcon} />
          <Image source={require('../../assets/images/micRight.png')} />
        </TouchableOpacity>

        <View style={styles.sectionContainer}><Text style={styles.subTitle}>✍️ 텍스트 분석</Text></View>
        <TextInput
          style={styles.input}
          placeholder="텍스트로 입력하기"
          placeholderTextColor="#999"
          value={input}
          onChangeText={setInput}
        />

        <Text style={styles.title}>🍀 감정 분석 결과 🍀</Text>
        <EmotionLight emotion={emotion} />

        <View style={styles.emotionBadge}><Text style={styles.emotionText}>{emoji} {emotion} {emoji}</Text></View>

        <View style={styles.botIconContainer}>
          <Image source={require('../../assets/images/bot_icon.png')} style={styles.botIcon} />
        </View>

        <View style={styles.suggestionBox}>
          <Text style={styles.suggestionText}>{displayMessage}</Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  headerSpace: { height: 30 },
  camButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 20,
  },
  micButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 20,
  },
  micIcon: {
    width: 73,
    height: 73,
  },
  input: {
    borderWidth: 3,
    borderColor: '#A1F0DD',
    backgroundColor: '#FFFFCC',
    borderRadius: 10,
    width: '90%',
    padding: 12,
    marginBottom: 50,
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    marginVertical: 20,
    textAlign: 'center',
    alignSelf: 'center'
  },
  sectionContainer: {
    alignSelf: 'flex-start',
    marginLeft: 24,
  },
  subTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  emotionBadge: {
    backgroundColor: '#E2F6CA',
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginBottom: 30,
    elevation: 5,
  },
  emotionText: {
    fontSize: 20,
    fontWeight: 'bold'
  },
  suggestionBox: {
    backgroundColor: '#D4EEFF',
    borderRadius: 10,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 50,
    elevation: 5,
  },
  botIconContainer: {
    flexDirection: 'row',
    alignSelf: 'flex-start',
    marginLeft: 24,
    marginBottom: 10,
  },
  botIcon: {
    width: 45,
    height: 50,
    padding: 5,
  },
  suggestionText: {
    fontSize: 14,
    fontWeight: 'bold'
  },
});
