import { StyleSheet, Text, View } from 'react-native';

export default function DateDetailTitle({date}) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>🔍 {date}의 내 감정 🔍</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 0.5,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 5,
  },
  title: {
    fontSize: 30,
    fontWeight: '900'
  }
});
