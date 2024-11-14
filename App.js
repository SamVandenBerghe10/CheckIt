import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View } from 'react-native';
import Navigator from './src/components/Navigator.js';

export default function App() {
  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <Navigator/>
    </View>
  );
}

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
