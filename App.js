import { StatusBar } from 'expo-status-bar';
import { StyleSheet } from 'react-native';
import Navigator from './src/components/Navigator.js';
import { SafeAreaView } from 'react-native';

export default function App() {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="auto" />
      <Navigator/>
    </SafeAreaView>
  );
}

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
