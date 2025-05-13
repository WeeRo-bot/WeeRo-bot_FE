import { StyleSheet, Text, View, Dimensions  } from 'react-native';
import { BarChart } from "react-native-chart-kit";

const screenWidth = Dimensions.get('window').width - 40;
const emotionLables = ['happiness', 'angry', 'disgust', 'fear', 'neutral', 'sadness', 'surprise'];

export default function DateDetailGraph({ timeEmotionData }) {
  // 감정 개수
  const countEmotion = (timeEmotionData) => {
    const emotionCounts = timeEmotionData.reduce((acc, curr) => {
      const emotion = curr.result;
      acc[emotion] = (acc[emotion] || 0) + 1;
      return acc;
    }, {});

    const chartData = emotionLables.map((label) => emotionCounts[label] || 0);

    return chartData;
  }


  const data = {
    labels: ['행복', '분노', '혐오', '공포', '중립', '슬픔', '놀람'],
    datasets: [
      {
        data: countEmotion(timeEmotionData),
      },
    ],
  };

  const chartConfig = {
    backgroundGradientFrom: '#ffffff',
    backgroundGradientTo: '#ffffff',
    color: (opacity = 1) => `rgba(73, 142, 253, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    fillShadowGradient: '#498EFD',
    barPercentage: 0.9,
    propsForHorizontalLabels: {
      dx: -8, 
    },
    formatYLabel: (yValue) => parseInt(yValue).toString(), 
  };


  return (
    <View style={styles.container}>
      <BarChart
        data={data}
        width={screenWidth}
        height={220}
        chartConfig={chartConfig}
        fromZero={true}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
});