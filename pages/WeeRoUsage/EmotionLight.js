import React from 'react';
import { View, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient'; // Expo LinearGradient 사용

const emotionColors = {
  행복: ['#FFCA3A', '#FFCA3A80'],   // 밝은 노랑 - 긍정적, 생기
  분노: ['#FF595E', '#FF595E80'],   // 강렬한 빨강
  혐오: ['#8AC926', '#8AC92680'],   // 녹색 - 거부감 표현
  공포: ['#6A4C93', '#6A4C9380'],   // 보라 - 무거운 느낌
  중립: ['#909090', '#90909080'],   // 회색 - 감정 없음
  슬픔: ['#1982C4', '#1982C480'],   // 파랑 - 차분한 느낌
  놀람: ['#D04DBF', '#D04DBF80'],   // 핑크 - 갑작스러운 감정 표현
};

const EmotionLight = ({ emotion }) => {
  const colors = emotionColors[emotion] || ['#FFF8DC', '#FFF8DC80']; // 기본 색상 설정

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={colors}
        style={[styles.gradientCircle, { opacity: 0.7 }]}
      />
      <View style={styles.blurCircle} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 160,
    height: 160,
    borderRadius: 80,
    marginTop: 40,
    marginBottom: 40,
    alignSelf: 'center',
    position: 'relative',
  },
  gradientCircle: {
    width: 160,
    height: 160,
    borderRadius: 80,
    position: 'absolute',
    top: 0,
    left: 0,
    backgroundColor: 'transparent',
    // 애니메이션을 통해 계속해서 변화
    animation: 'pulse 1.5s infinite', 
  },
  blurCircle: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: 'transparent',
    borderWidth: 10,
    borderColor: '#fff', // 네온 느낌
    opacity: 0.4,
    blurRadius: 10, // 원 테두리의 흐림 효과
  }
});

export default EmotionLight;
