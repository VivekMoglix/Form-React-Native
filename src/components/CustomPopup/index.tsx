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
  TouchableOpacity,
} from 'react-native';
import colors from '../../constants/colors';
import Dimension from '../../constants/dimensions';

export interface CustomPopupProps extends NativeViewProps {
  position?: 'top' | 'bottom';
  containerStyle?: NativeViewProps['style'];
  textStyle?: StyleProp<TextStyle>;
  message?: string;
  visibilityTime?: number;
  popupColor?: 'success' | 'error' | string;
  loaderColor?: string;
  hasButton?: boolean;
  buttonLabel?: string;
  onPress?: () => {};
}

const CustomPopup: React.FC<CustomPopupProps> = ({
  position = 'bottom-right',
  containerStyle,
  textStyle,
  message = 'your message here',
  visibilityTime = 2000,
  loaderColor = colors.lightGrayText,
  popupColor = colors.LightTextColor,
  hasButton = false,
  buttonLabel = 'Button',
  onPress = () => {},
  ...rest
}) => {
  const windowHeight = Dimensions.get('window').height;
  const loadingAnim = useRef(new Animated.Value(100)).current;
  const slideInAnim = useRef(new Animated.Value(-windowHeight)).current;
  useEffect(() => {
    Animated.sequence([
      Animated.timing(slideInAnim, {
        toValue: 30,
        duration: 1500,
        easing: Easing.linear,
        useNativeDriver: false,
      }),
      Animated.timing(loadingAnim, {
        toValue: 0,
        duration: visibilityTime,
        easing: Easing.linear,
        useNativeDriver: false,
      }),
      Animated.timing(slideInAnim, {
        toValue: -windowHeight,
        duration: 1500,
        easing: Easing.linear,
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
          top: position.includes('top') ? slideInAnim : null,
          bottom: position.includes('bottom') ? slideInAnim : null,
          backgroundColor:
            popupColor === 'success'
              ? colors.LightTextColor
              : popupColor === 'error'
              ? colors.error
              : popupColor,
          borderRadius: 8,
          overflow: 'hidden',
          width: '100%',
          alignSelf: 'center',
        },
        containerStyle,
      ]}>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          padding: hasButton ? 8 : 12,
        }}>
        <Text
          style={[
            {
              textAlign: 'left',
              color: '#fff',
              fontSize: Dimension.font12,
              fontFamily: Dimension.CustomMediumFont,
            },
            textStyle,
          ]}>
          {message}
        </Text>
        {hasButton ? (
          <TouchableOpacity
            onPress={onPress}
            style={{
              marginLeft: 'auto',
              backgroundColor: colors.lightGrayText,
              padding: 8,
              borderRadius: 4,
            }}>
            <Text style={{color: 'white'}}>{buttonLabel}</Text>
          </TouchableOpacity>
        ) : null}
      </View>
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

const ToastMessage = (props: any) => {
  <CustomPopup {...props} />;
};

export default CustomPopup;
