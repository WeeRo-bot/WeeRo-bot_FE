import { ScrollView, StyleSheet, Text, View } from 'react-native';
import DateDetailTitle from './DateDetailTitle';
import DateDetailGraph from './DateDetailGraph';
import DateDetailEmotion from './DateDetailEmotion';
import { useEffect, useState } from 'react';
import axios from '../../axios';

export default function DateDetail({ route }) {
  const { date } = route.params;
  const [emotionData, setEmotionData] = useState(null);
  const [error, setError] = useState(null);

  // 날짜 형식 변경
  function formatDateToKorean(dateString) {
    const [year, month, day] = dateString.split('-');
    return `${parseInt(month)}월 ${parseInt(day)}일`;
  }

  useEffect(() => {
    const [year, month, day] = date.split('-').map(Number);

    const dayEmotions = async () => {
      try {
        const response = await axios.get("/api/emotions/day", {
          params: { year, month, day }
        });

        setEmotionData(response.data.data)
      }catch (err) {
        setError(err);
        console.log("데이터 불러오는데 오류 발생 ", err);
      }
    };

    dayEmotions();
  }, [date])

    if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text>데이터를 불러오는 데 실패했습니다.</Text>
      </View>
    );
  }

  // 데이터 확인
  const currentDateData = emotionData && emotionData.length > 0 ? emotionData[0] : null;
  console.log("대아토 확인 ", currentDateData);

  if (currentDateData) {
    return (
      
      <View style={styles.container}>
        <DateDetailTitle date={formatDateToKorean(date)} />
        {currentDateData?.timeEmotions && (
          <DateDetailGraph timeEmotionData={currentDateData.timeEmotions} />
        )}
        <DateDetailEmotion 
          mainEmotion={currentDateData.mainEmotion} 
          timeEmotions={currentDateData.timeEmotions} 
        />
      </View>
    );
  }

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff'
  },
});
  