import React from 'react';
import Button from './src/components/CustomButton';
import LottieView from 'lottie-react-native';
import {View} from 'react-native';

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
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: 'blue',
      }}>
      <Button />
      <View
        style={{
          zIndex: 999,
          marginTop: 30,
          backgroundColor: 'yellow',
          flex: 1,
        }}>
        <LottieView
          style={{
            width: 200,
            height: 200,
          }}
          source={require('./src/assets/hindi3.json')}
          autoPlay={true}
          loop={false}
        />
        <LottieView
          style={{
            width: 200,
            height: 200,
          }}
          source={require('./src/assets/hindi2.json')}
          autoPlay
          loop={false}
        />
      </View>
    </View>
  );
}
