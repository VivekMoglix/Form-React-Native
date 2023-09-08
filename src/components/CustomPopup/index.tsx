import {useEffect, useRef, useState} from 'react';
import {
  View,
  Text,
  ViewProps as NativeViewProps,
  StyleProp,
  TextStyle,
  Animated,
  Easing,
  Dimensions,
} from 'react-native';
// import Icon from 'react-native-vector-icons/dist/MaterialIcons';

export interface CustomPopupProps extends NativeViewProps {
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  containerStyle?: NativeViewProps['style'];
  textStyle?: StyleProp<TextStyle>;
  message?: string;
  timer?: number;
  popupColor?: 'success' | 'error' | 'warning' | string;
  loaderColor?: string;
}

const CustomPopup: React.FC<CustomPopupProps> = ({
  position = 'bottom-right',
  containerStyle,
  textStyle,
  message = 'message here yours',
  timer = 3000,
  loaderColor = '#5bc0de',
  popupColor = 'error',
  ...rest
}) => {
  const windowWidth = Dimensions.get('window').width;
  const loadingAnim = useRef(new Animated.Value(100)).current;
  const slideInAnim = useRef(new Animated.Value(-windowWidth)).current;
  useEffect(() => {
    Animated.sequence([
      Animated.timing(slideInAnim, {
        toValue: 0,
        duration: 1500,
        easing: Easing.bounce,
        useNativeDriver: false,
      }),
      Animated.timing(loadingAnim, {
        toValue: 0,
        duration: timer,
        easing: Easing.linear,
        useNativeDriver: false,
      }),
      Animated.timing(slideInAnim, {
        toValue: -windowWidth,
        duration: 1500,
        easing: Easing.bounce,
        useNativeDriver: false,
      }),
    ]).start();
  }, [loadingAnim, slideInAnim]);

  return (
    <Animated.View
      {...rest}
      style={[
        {
          position: 'absolute',
          top: position.includes('top') ? 0 : null,
          right: position.includes('right') ? slideInAnim : null,
          bottom: position.includes('bottom') ? 0 : null,
          left: position.includes('left') ? slideInAnim : null,
          backgroundColor:
            popupColor === 'success'
              ? '#22bb33'
              : popupColor === 'error'
              ? '#bb2124'
              : popupColor === 'warning'
              ? '#f0ad4e'
              : popupColor,
          borderRadius: 8,
          overflow: 'hidden',
        },
        containerStyle,
      ]}>
      <Text
        style={[{textAlign: 'left', color: 'white', padding: 12}, textStyle]}>
        {message}
      </Text>
      <Animated.View
        style={{
          marginTop: 'auto',
          height: 2,
          backgroundColor: loaderColor,
          width: loadingAnim.interpolate({
            inputRange: [0, 100],
            outputRange: ['0%', '100%'],
          }),
        }}
      />
    </Animated.View>
  );
};

export default CustomPopup;
