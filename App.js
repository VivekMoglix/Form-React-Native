import Form from './src/container/Form';
import {GestureHandlerRootView} from 'react-native-gesture-handler';

export default function App() {
  return (
    <GestureHandlerRootView
      style={{
        padding: 15,
        flex: 1,
        backgroundColor: '#fff',
      }}>
      <Form />
    </GestureHandlerRootView>
  );
}
