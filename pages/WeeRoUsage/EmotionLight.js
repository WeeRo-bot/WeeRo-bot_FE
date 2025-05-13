import React from 'react';
import { View, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient'; // Expo LinearGradient 사용

const emotionColors = {
  행복: ['#FFEB3B', '#FFEB3B80'],   // 밝은 노랑 - 긍정적, 생기
  분노: ['#F44336', '#F4433680'],   // 강렬한 빨강
  혐오: ['#4CAF50', '#4CAF5080'],   // 녹색 - 거부감 표현
  공포: ['#3F51B5', '#3F51B580'],   // 짙은 파랑 - 무거운 느낌
  중립: ['#BDBDBD', '#BDBDBD80'],   // 회색 - 감정 없음
  슬픔: ['#2196F3', '#2196F380'],   // 파랑 - 차분한 느낌
  놀람: ['#9C27B0', '#9C27B080'],   // 보라 - 갑작스러운 감정 표현
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
