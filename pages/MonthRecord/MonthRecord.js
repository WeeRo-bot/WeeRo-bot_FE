import React, { useEffect, useState } from 'react';
import { SafeAreaView, ScrollView, Text, View, Dimensions, StyleSheet } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { BarChart } from 'react-native-chart-kit';
import { useNavigation } from '@react-navigation/native';
import { Image } from 'react-native';
import { emotionColors } from "../../data/colors"; 
import axios from '../../axios';

const screenWidth = Dimensions.get('window').width;

const MonthRecord = () => {
  const navigation = useNavigation();
  const [emotionByDate, setEmotionByDate] = useState({});
  const [emotionCount, setEmotionCount] = useState([]);
  const [solution, setSolution] = useState('');
  
  // 현재 날짜 계산
  const today = new Date();
  const [selectedYear, setSelectedYear] = useState(today.getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(today.getMonth() + 1);

  const fetchMonthData = (year, month) => {
    setSolution('');

    // 날짜별 대표 감정
    axios.get(`/api/emotions/calendar?year=${year}&month=${month}`)
    .then(response => {
      const data = response.data.data;

      // 마커 생성 형식으로 변경 
      const result = {};
      data.forEach(item => {
        result[item.day] = item.mainEmotion;
      });

      setEmotionByDate(result);
    });

    // 감정별 개수
    axios.get(`/api/emotions/count?year=${year}&month=${month}`)
    .then(response => {
      const data = response.data.data;
      setEmotionCount(data);
    });

    // 솔루션
    axios.get(`/api/emotions/solution?year=${year}&month=${month}`)
    .then(response => {
      const data = response.data.data.solution;
      setSolution(data);
    });
  }

  // 컴포넌트 마운트 시 현재 월 데이터 로드
  useEffect(() => {
    fetchMonthData(selectedYear, selectedMonth);
  }, [selectedYear, selectedMonth]);

  // 달력 월 변경 핸들러
  const handleMonthChange = (month) => {
    const newYear = month.year;
    const newMonth = month.month;
    
    setSelectedYear(newYear);
    setSelectedMonth(newMonth);

  };
  
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

  // 그래프 데이터 정리
  const emotionLabel = {
    HAPPY: '행복',
    ANGRY: '분노',
    DISGUST: '혐오',
    FEAR: '공포',
    NEUTRAL: '중립',
    SAD: '슬픔',
    SURPRISE: '놀람',
  }

  const chartData = {
    labels: emotionCount.map(item => emotionLabel[item.emotionType] || item.emotionType),
    datasets: [{ data: emotionCount.map(item => item.count) }],
  };

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
          onMonthChange={handleMonthChange} // 월 변경 이벤트 핸들러 추가
          // 현재 표시 중인 월 설정
          current={`${selectedYear}-${selectedMonth.toString().padStart(2, '0')}-01`}
        />

        <View style={styles.separator} />
        <Text style={styles.sectionTitle}>🧭솔루션 확인🧭</Text>
        
        {/* 감정 빈도 그래프 */}
        <View style={styles.chartWrapper}>
          <BarChart
            data={chartData}
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
            source={require('../../assets/images/weerobot.png')}
            style={styles.characterImage}
          />
          <View style={styles.bubbleWrapper}>
            <View style={styles.speechBubble}>
              <Text style={styles.solutionTitle}>감정 케어 솔루션</Text>
              <Text style={styles.solutionText}>
                {solution === '' ? "감정분석중.." : solution}
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
    marginTop: 20
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
    top: 10,
    left: -8,
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
    transform: [{ rotate: '0deg' }],
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