import { useEffect, useMemo, useState } from 'react';
import { StyleSheet, Text, View, Dimensions  } from 'react-native';
import { BarChart } from "react-native-chart-kit";

const screenWidth = Dimensions.get('window').width - 40;
const emotionLables = ["HAPPY", "ANGRY", "DISGUST", "FEAR", "NEUTRAL", "SAD", "SURPRISE"];

export default function DateDetailGraph({ timeEmotionData }) {
  const [chartData, setChartData] = useState([]);
  console.log("전달확인 : ", timeEmotionData);

  // 감정 개수 계산
  const countEmotion = (timeEmotionData) => {
    if (!Array.isArray(timeEmotionData)) return Array(emotionLables.length).fill(0);

    const emotionCounts = timeEmotionData.reduce((acc, curr) => {
      const emotion = curr.emotion?.toUpperCase().trim();
      acc[emotion] = (acc[emotion] || 0) + 1;
      return acc;
    }, {});

    return emotionLables.map((label) => emotionCounts[label] || 0);
  };

  // 데이터 변경 시 차트 데이터 업데이트
  useEffect(() => {
    if (Array.isArray(timeEmotionData) && timeEmotionData.length > 0) {
      setChartData(countEmotion(timeEmotionData));
    } else {
      setChartData(Array(emotionLables.length).fill(0));
    }
  }, [timeEmotionData]);

  // 차트 데이터 메모이제이션
  const data = useMemo(() => ({
    labels: ['행복', '분노', '혐오', '공포', '중립', '슬픔', '놀람'],
    datasets: [
      {
        data: chartData,
      },
    ],
  }), [chartData]);

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
      {chartData.length > 0 && (
        <BarChart
          key={chartData.join('-')} // 데이터 변경 시 강제 리렌더
          data={data}
          width={screenWidth}
          height={220}
          chartConfig={chartConfig}
          fromZero={true}
        />
      )}
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