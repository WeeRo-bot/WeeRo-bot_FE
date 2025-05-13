import React from 'react';
import { SafeAreaView, ScrollView, Text, View, Dimensions, StyleSheet } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { BarChart } from 'react-native-chart-kit';
import { useNavigation } from '@react-navigation/native';
import { Image } from 'react-native';

const screenWidth = Dimensions.get('window').width;

// 감정 → 색상 매핑 (임시 색상상)
const emotionColors = {
  행복: '#FFB95A',
  분노: '#EF4444',
  혐오: '#264653',
  공포: '#864FD3',
  중립: '#A9A9A9',
  슬픔: '#3B82F6',
  놀람: '#52C24C',
};

// 예시: 날짜별 대표 감정 (실제론 백엔드에서 받아오겠지만 지금은 하드코딩)
const emotionByDate = {
  '2025-05-01': '행복',
  '2025-05-02': '놀람',
  '2025-05-03': '슬픔',
  '2025-05-04': '공포',
  '2025-05-05': '분노',
  '2025-05-06': '혐오',
  '2025-05-07': '분노',
  '2025-05-12': '중립',
};

const MonthRecord = () => {
   const navigation = useNavigation();

  // 달력에 표시할 마커 생성
  const markedDates = {};
  for (const date in emotionByDate) {
    markedDates[date] = {
      customStyles: {
        container: {
          backgroundColor: emotionColors[emotionByDate[date]],
          borderRadius: 8,
        },
        text: {
          color: '#fff',
        },
      },
    };
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <Text style={styles.header}>🍀감정 기록 확인🍀</Text>

        {/* 달력 */}
        <Calendar
          markingType={'custom'}
          markedDates={markedDates}
          style={styles.calendar}
          onDayPress={(day) => {
            navigation.navigate('EmotionDetail', { date: day.dateString }); //세부 기록 페이지로 연결 
          }}
        />

        <View style={styles.separator} />
        <Text style={styles.sectionTitle}>🧭솔루션 확인🧭</Text>
        
        {/* 감정 빈도 그래프 */}
        <View style={styles.chartWrapper}>
          <BarChart
            data={{
              labels: ['행복', '분노', '혐오', '공포', '중립', '슬픔', '놀람'],
              datasets: [{ data: [6, 3, 1, 2, 8, 4, 3] }],
            }}
            width={screenWidth - 64}
            height={220}
            fromZero={true}
            withInnerLines={true}
            chartConfig={{
              backgroundColor: '#fff',
              backgroundGradientFrom: '#fff',
              backgroundGradientTo: '#fff',
              decimalPlaces: 0,
              color: (opacity = 1) => `rgba(0, 122, 255, ${opacity})`,
              labelColor: () => '#333',
              barPercentage: 0.6, // bar 간격 조절
            }}
            style={styles.chart}
          />
        </View>


        {/* 케어 솔루션 */}
        <View style={styles.solutionContainer}>
          <Image
            source={require('./assets/images/weerobot.png')}
            style={styles.characterImage}
          />
          <View style={styles.bubbleWrapper}>
            <View style={styles.speechBubble}>
              <Text style={styles.solutionTitle}>감정 케어 솔루션</Text>
              <Text style={styles.solutionText}>
                최근 감정 기록을 바탕으로, 나만의 루틴을 만들어보는 건 어때요? 🌿{"\n"}
                아침마다 5분 스트레칭과 감정 일기를 써보세요!
              </Text>
            <View style={styles.bubbleTail} />
          </View>
        </View>

        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff', // 배경 흰색으로 변경
    padding: 16,
  },
  header: {
    fontSize: 26,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  calendar: {
    borderRadius: 10,
    marginBottom: 16,
    //backgroundColor: '#F0FCF9',
  },
  separator: {
    height: 1,
    backgroundColor: '#ccc',
    marginVertical: 12,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 16,
  },
  chartWrapper: {
    alignItems: 'center',
    marginBottom: 32,
  },
  chart: {
    borderRadius: 10,
    alignSelf: 'center', 
  },
  solutionContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    marginBottom: 40,
    shadowColor: '#ccc',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  characterImage: {
    width: 60,
    height: 60,
    resizeMode: 'contain',
    marginRight: 12,
  },
  bubbleWrapper: {
    flex: 1,
    alignItems: 'flex-start',
    position: 'relative'
  },
  speechBubble: {
    backgroundColor: '#D7EDFC',
    borderRadius: 16,
    padding: 12,
    position: 'relative'
  },
  bubbleTail: {
    position: 'absolute',
    top: -8,
    left: 20,
    width: 0,
    height: 0,
    borderTopWidth: 10,
    borderRightWidth: 10,
    borderBottomWidth: 10,
    borderLeftWidth: 0,
    borderTopColor: 'transparent',
    borderRightColor: '#D7EDFC',
    borderBottomColor: 'transparent',
    borderLeftColor: 'transparent',
    transform: [{ rotate: '45deg' }],
  },
  solutionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 6,
  },
  solutionText: {
    fontSize: 16,
    lineHeight: 22,
  },
});


export default MonthRecord;