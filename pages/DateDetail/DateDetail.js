import { ScrollView, StyleSheet, Text, View } from 'react-native';
import DateDetailTitle from './DateDetailTitle';
import DateDetailGraph from './DateDetailGraph';
import DateDetailEmotion from './DateDetailEmotion';

export default function DateDetail() {

  const data = [{
    id: 1,
    date: "3월 3일",
    mainEmotion: "슬픔",
    mainResult: "sadness",
    timeEmotion: [
      {
        time: "08:15",
        emotion: "슬픔",
        result: "sadness"
      },
      {
        time: "09:15",
        emotion: "슬픔",
        result: "sadness"
      },
      {
        time: "10:15",
        emotion: "기쁨",
        result: "happiness"
      },
      {
        time: "11:15",
        emotion: "슬픔",
        result: "sadness"
      },
      {
        time: "12:15",
        emotion: "기쁨",
        result: "happiness"
      },
      {
        time: "18:15",
        emotion: "슬픔",
        result: "sadness"
      },
      {
        time: "20:15",
        emotion: "슬픔",
        result: "sadness"
      },
      {
        time: "21:15",
        emotion: "분노",
        result: "angry"
      },
      {
        time: "22:15",
        emotion: "슬픔",
        result: "sadness"
      },
    ]
  }]

  const currentDateData = data && data.length > 0 ? data[0] : null;
  
  if (!currentDateData) {
    return (
      <View style={styles.container}>
        <Text>데이터가 없습니다</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <DateDetailTitle date={currentDateData.date} />
      <DateDetailGraph timeEmotionData={currentDateData.timeEmotion} />
      <DateDetailEmotion 
        mainEmotion={currentDateData.mainEmotion} 
        mainResult={currentDateData.mainResult}
        timeEmotions={currentDateData.timeEmotion} 
      />
    </View>
  );
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      marginTop: 90
    },
  });
  