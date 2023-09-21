import Form from './src/container/Form';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {useState} from 'react';
import TextInput from './src/components/TextInput/index';
import {TextInput as PackageInput} from 'mog-react-native-form-fields';
import Dimension from './src/constants/dimensions';
const dummyArr = [
  'one',
  'two',
  'three',
  'four',
  'five',
  'six',
  'seven',
  'eight',
  'nine',
  'ten',
];

export default function App() {
  const [isLoading, setIsLoading] = useState(false);
  const [textValue, setTextValue] = useState('');
  const [selectedValue, setSelectedValue] = useState('');
  return (
    <GestureHandlerRootView
      style={{
        padding: 15,
        flex: 1,
        backgroundColor: '#fff',
      }}>
      <TextInput
        label="Full Name"
        value={textValue}
        onChangeText={setTextValue}
      />
      <PackageInput
        focusColor="#979797"
        label="Phone"
        value={textValue}
        onChangeText={setTextValue}
      />
    </GestureHandlerRootView>
  );
}
