import {SafeAreaView} from 'react-native';
import Form from './src/container/Form';

export default function App() {
  return (
    <SafeAreaView
      style={{
        padding: 15,
        flex: 1,
        backgroundColor: 'rgb(237, 240, 242)',
      }}>
      <Form />
    </SafeAreaView>
  );
}
