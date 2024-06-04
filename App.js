import React, {useState} from 'react';
import Button from './src/components/CustomButton';
import {SafeAreaView, TouchableOpacity, View} from 'react-native';
import MatIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import colors from './src/constants/colors';
import Form from './src/container/Form';

export default function App() {
  const [isLoading, setIsLoading] = useState(false);
  return (
    <SafeAreaView style={{flex: 1}}>
      <Form />
    </SafeAreaView>
  );
}
