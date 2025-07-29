import React, { useState } from 'react';
import { ScrollView, View, Text, TextInput, StyleSheet, Image, TouchableOpacity,KeyboardAvoidingView, Platform, } from 'react-native';
import EmotionLight from './EmotionLight';
import { emotionTextMap } from '../../data/emotionData';

export default function WeeRoUsage() {
  const [input, setInput] = useState('');
  const [emotion, setEmotion] = useState('행복');  
  const [loading, setLoading] = useState(false);

  const emotionData = emotionTextMap[emotion] || {
    emoji: '',
    message: '감정을 인식하지 못했어요.\n다시 시도해 주세요.',
  };

    //마이크 버튼을 누를 때의 처리 (음성 인식 기능 추가 예정)
  const handleMicPress = () => {
    alert('마이크 버튼을 눌렀습니다!');
  };

  const handleAnalyze = async () => {
    if (!input.trim()) {
      Alert.alert('입력 오류', '분석할 텍스트를 입력해주세요.');
      return;
    }

    try {
      setLoading(true);
      const response = await fetch('http://127.0.0.1:8001/predict', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: input }),
      });

      if (!response.ok) {
        throw new Error('서버 응답 오류');
      }

      const data = await response.json();
      setEmotion(data.emotion); // 예: '행복', '분노', 등
    } catch (error) {
      console.error(error);
      Alert.alert('에러', '감정 분석 중 오류가 발생했어요.');
    } finally {
      setLoading(false);
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
      <EmotionLight emotion={emotion} />
      <TouchableOpacity style={styles.micButton} onPress={handleMicPress}>
        <Image source={require('../../assets/images/micLeft.png')}/>
        <Image source={require('../../assets/images/micicon.png')} style={styles.micIcon} />
        <Image source={require('../../assets/images/micRight.png')}/>
      </TouchableOpacity>
      <TextInput
        style={styles.input}
        placeholder="텍스트로 입력하기"
        placeholderTextColor="#999"
        value={input}
        onChangeText={setInput}
      />
      <TouchableOpacity style={styles.analyzeButton} onPress={handleAnalyze}>
          <Text style={styles.analyzeButtonText}>
            {loading ? '분석 중...' : '감정 분석하기'}
          </Text>
      </TouchableOpacity>
      <View style={{ alignSelf: 'flex-start', marginLeft: 24 }}>
        <Text style={styles.analysisTitle}>👀 감정 분석 결과</Text>
      </View>
      <View style={styles.emotionBadge}>
        <Text style={styles.emotionText}>
          {emotionData.emoji} {emotion} {emotionData.emoji}
        </Text>
      </View>
      <View style={styles.botIconContainer}>
        <Image source={require('../../assets/images/bot_icon.png')} style={styles.botIcon} />
      </View>
      <View style={styles.suggestionBox}>
        <Text style={styles.suggestionText}>
          {emotionData.message}
        </Text>
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
  micButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 40,
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
  analysisTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
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
