import React, { useState } from 'react';
import { ScrollView, View, Text, TextInput, StyleSheet, Image, TouchableOpacity,KeyboardAvoidingView, Platform,Alert, } from 'react-native';
import EmotionLight from './EmotionLight';
import { emotionTextMap } from '../../data/emotionData';
import axios from 'axios';

// API 기본 URL 설정 (본인 환경에 맞게 수정 필요)
const API_BASE_URL = 'http://192.168.0.8:8080';

export default function WeeRoUsage() {
  const [inputText, setInputText] = useState('');
  const [input, setInput] = useState('');
  const [emotion, setEmotion] = useState('');
  const [advice, setAdvice] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  // 서버 감정 값을 한글 매핑
  const normalizeEmotion = (srvEmotion) => {
  switch (srvEmotion.toLowerCase()) {
    case 'happy':
      return '행복';
    case 'sad':
      return '슬픔';
    case 'angry':
      return '분노';
    case 'surprise':
      return '놀람';
    case 'fear':
      return '공포';
    case 'disgust':
      return '혐오';
    case 'neutral':
      return '중립';
    default:
      return srvEmotion;
    }
  };

// 감정 객체에서 가장 높은 확률의 감정을 찾는 함수
const findDominantEmotion = (emotionObj) => {
    if (!emotionObj) return '';
  
    let maxEmotion = '';
    let maxValue = 0;
  
    Object.entries(emotionObj).forEach(([emotion, value]) => {
      if (value > maxValue) {
        maxValue = value;
        maxEmotion = emotion;
      }
    });
  
    return normalizeEmotion(maxEmotion);
  };

  // 카메라 버튼 눌렀을 때 (Spring Boot → RPi 호출 → 결과 반환)
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
    };
  };

  //마이크 버튼을 누를 때의 처리 (음성 인식 기능 추가 예정)
  const handleMicPress = () => {
    alert('마이크 버튼을 눌렀습니다!');
  };

  // 텍스트 입력 후 분석 버튼 눌렀을 때
  const handleAnalyze = async () => {
    if (!inputText.trim()) return;

    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/emotion/analyze`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: inputText }),
      });

      const json = await response.json();
      const dominantEmotion = findDominantEmotion(json.mappedEmotion);
      setEmotion(dominantEmotion); // response는 { emotion: { ... } } 형식임
      getChatAdvice(dominantEmotion);
    } catch (error) {
      console.error('분석 실패:', error);
    } finally {
      setLoading(false);
    }
  };
  // 표시용 데이터 계산
  const emoji = emotionTextMap[emotion]?.emoji || '';
  const defaultMsg = emotionTextMap[emotion]?.message || '감정을 인식하지 못했어요.\n다시 시도해 주세요.';
  const displayMessage = advice || defaultMsg; // 서버 조언 우선

  const getChatAdvice = async (emotion) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/chat/advice`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ emotion }),
    });

    if (!response.ok) throw new Error("GPT 응답 실패");

    const text = await response.text();
    console.log("GPT 조언:", text);
    setAdvice(text); // ✅ advice 상태에 저장
  } catch (e) {
    console.error("GPT 요청 실패:", e);
    setAdvice(""); // 실패 시 기본 메시지로 fallback
  }
};

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
    >
    <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
      <View style={styles.headerSpace} />

      <Text style={styles.title}>🔮 감정 분석 🔮</Text>

      <View style={styles.sectionContainer}>
        <Text style={styles.subTitle}>📸 얼굴 인식</Text>
      </View>

      <TouchableOpacity style={styles.camButton} onPress={handleCamPress}>
        <Image source={require('../../assets/images/camLeft.png')} />
        <Image source={require('../../assets/images/camicon.png')} style={styles.micIcon} />
        <Image source={require('../../assets/images/micRight.png')} />
      </TouchableOpacity>

      <View style={styles.sectionContainer}>
        <Text style={styles.subTitle}>🎙️ 음성 분석</Text>
      </View>

      <TouchableOpacity style={styles.micButton} onPress={handleMicPress}>
        <Image source={require('../../assets/images/micLeft.png')} />
        <Image source={require('../../assets/images/micicon.png')} style={styles.micIcon} />
        <Image source={require('../../assets/images/micRight.png')} />
      </TouchableOpacity>

      <View style={styles.sectionContainer}>
        <Text style={styles.subTitle}>✍️ 텍스트 분석</Text>
      </View>

      <TextInput
        style={styles.input}
        placeholder="텍스트로 입력하기"
        placeholderTextColor="#999"
        value={inputText}
        onChangeText={setInputText}/>

      <TouchableOpacity style={styles.analyzeButton} onPress={handleAnalyze}>
          <Text style={styles.analyzeButtonText}>
            {loading ? '분석 중...' : '감정 분석하기'}
          </Text>
      </TouchableOpacity>

      <Text style={styles.title}>🍀 감정 분석 결과 🍀</Text>

      <EmotionLight emotion={emotion} />

      <View style={styles.emotionBadge}>
        <Text style={styles.emotionText}>{emoji} {emotion} {emoji}</Text>
      </View>

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
  headerSpace: {
    height: 30,
  },
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
  analyzeButton: {
    backgroundColor: '#6C63FF',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 20,
  },
  analyzeButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
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
    marginBottom:50,
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
    padding:5,
  },
  suggestionText: {
    fontSize: 14,
    fontWeight: 'bold'
  },
  analyzeButton: {
  backgroundColor: '#A1F0DD',
  paddingVertical: 12,
  paddingHorizontal: 24,
  borderRadius: 10,
  marginBottom: 30,
  elevation: 5,
},
analyzeButtonText: {
  color: '#000',
  fontSize: 16,
  fontWeight: 'bold',
},
analyzeButton: {
  backgroundColor: '#A1F0DD',
  paddingVertical: 12,
  paddingHorizontal: 24,
  borderRadius: 10,
  marginBottom: 30,
  elevation: 5,
},
analyzeButtonText: {
  color: '#000',
  fontSize: 16,
  fontWeight: 'bold',
},

});
