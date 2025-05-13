import { StyleSheet, Text, View, ScrollView } from 'react-native';
import { emotionColors } from "../../data/colors";
import { emotionEmojis } from "../../data/emoji";
 
export default function DateDetailEmotion({ mainEmotion, mainResult, timeEmotions = [] }) {
  const mainEmoji = emotionEmojis[mainResult] || "😐";
  const mainEmotionText = mainEmotion || "결과가 없습니다";
  
  return (
    <View style={styles.container}>
      <View style={styles.mainEmotion}>
        <Text style={{...styles.mainText, color: emotionColors[mainResult] || "black"}}>{mainEmoji} {mainEmotionText} {mainEmoji}</Text>
      </View>
      <View style={styles.timeEmotion}>
        <ScrollView showsVerticalScrollIndicator={false}>
          {!timeEmotions || timeEmotions.length === 0 ?
            <View style={[styles.timeItem, { height: 330, width: 285 }]}>
              <Text style={{...styles.timeText, width: 205}}>분석된 감정이 없습니다</Text>
            </View>
          :
            timeEmotions.map((item, index) =>
              <View key={index}>
                <View style={styles.timeItem}>
                  <Text style={styles.timeText}>{item.time}</Text>
                  <Text style={styles.emojiText}>{emotionEmojis[item.result] || "😐"}</Text>
                  <Text style={{...styles.timeText, color: emotionColors[item.result] || "black"}}>{item.emotion}</Text>
                </View> 
                {index !== timeEmotions.length - 1 && <View style={styles.timebar} />}
              </View>                          
            )     
          }
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 3,
    alignItems: 'center',
    marginBottom: 12
  },
  mainEmotion: {
    backgroundColor: '#E2F6CA',
    padding: 15,
    marginBottom: 20,
    borderRadius: 25,

    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.3,
    shadowRadius: 5,

    elevation: 8,
  },
  mainText: {
    fontSize: 22,
    fontWeight: '700',
  },
  timeEmotion: {
    backgroundColor: '#F8FDCF',
    flex: 1,
    marginBottom: 20,
    paddingVertical: 10,
    paddingHorizontal: 30, 
    borderRadius: 20,

    shadowColor: "#000",
    shadowOffset: {
      width: 1,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,

    elevation: 3,
  },
  timeItem: {
    flexDirection: 'row',
    paddingRight: 5,
    paddingLeft: 20,
    paddingVertical: 8,
    gap: 40,
    justifyContent: 'center', 
    alignItems: 'center',  
  },
  emojiText: {
    width: 60,
    fontSize: 25,
    fontWeight: '500',
    paddingLeft: 10
  },
  timeText: {
    width: 60,
    fontSize: 21,
    fontWeight: '600',
  },
  timebar: {
    borderBottomWidth: 3,
    borderBottomColor: '#E2F6CA',
  }
});