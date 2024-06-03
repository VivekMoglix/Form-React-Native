import React, {useState} from 'react';
import {
  ActivityIndicator,
  Text,
  TouchableOpacity as NativeTouchable,
  TouchableOpacityProps as NativeTouchableProps,
  View,
  StyleProp,
  TextStyle,
  ViewStyle,
} from 'react-native';
import DefaultAppColors from '../../constants/colors';
import Dimension from '../../constants/dimensions';

export interface ButtonProps extends NativeTouchableProps {
  label?: string;
  withLoader?: boolean;
  labelFontSize?: 'font12' | 'font14';
  variant?: 'outlined' | 'filled';
  size?: 'small' | 'full';
  loaderSize?: 'small' | 'large';
  isLoading?: boolean;
  textStyles: StyleProp<TextStyle>;
  loaderPosition?: 'leading' | 'trailing';
  loaderColor?: string;
  leading?:
    | React.ReactNode
    | ((props: {color: string; size: number}) => React.ReactNode | null)
    | null;
  trailing?:
    | React.ReactNode
    | ((props: {color: string; size: number}) => React.ReactNode | null)
    | null;
  buttonStyle?: StyleProp<ViewStyle>;
  isLabelUppercase?: boolean;
  theme?: 'light-red' | 'dark-red' | 'black-white';
}

const Button: React.FC<ButtonProps> = ({
  label = 'Button',
  withLoader = false,
  labelFontSize = 'font14',
  variant = 'filled',
  size = 'full',
  loaderSize = 'small',
  isLoading,
  textStyles,
  loaderPosition = 'leading',
  loaderColor = variant === 'filled' ? 'white' : 'black',
  leading,
  trailing,
  buttonStyle,
  isLabelUppercase = false,
  theme = 'dark-red',
  ...rest
}) => {
  const [textWidth, setTextWidth] = useState(0);
  const [buttonWidth, setButtonWidth] = useState(0);

  const calculateLoaderPosition = (buttonWidth: number, textWidth: number) => {
    const position = ((buttonWidth - textWidth) * 3) / 8;
    return position;
  };

  const leadingNode =
    typeof leading === 'function'
      ? leading({color: '#f00', size: 24})
      : leading;

  const trailingNode =
    typeof trailing === 'function'
      ? trailing({
          color: '#f00',
          size: 24,
        })
      : trailing;
  return (
    <NativeTouchable
      {...rest}
      style={[
        {
          width: size === 'small' ? 150 : size === 'full' ? '100%' : null,
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: 5,
          borderWidth: variant === 'outlined' ? 1 : 0,
          padding: 8,
          flexDirection: 'row',
          borderRadius: 4,
          backgroundColor:
            variant === 'filled'
              ? theme === 'dark-red'
                ? DefaultAppColors.RedThemeColor
                : theme === 'light-red'
                ? DefaultAppColors.LightRedThemeColor
                : DefaultAppColors.PrimaryTextColor
              : 'transparent',
        },
        buttonStyle,
      ]}>
      {leadingNode && <View>{leadingNode}</View>}
      <View
        style={{
          flexDirection: 'row',
          position: 'relative',
          alignItems: 'center',
          width: '100%',
          justifyContent: 'center',
        }}
        onLayout={event => {
          const {width} = event.nativeEvent.layout;
          setButtonWidth(width);
        }}>
        {loaderPosition === 'leading' && withLoader ? (
          isLoading ? (
            <ActivityIndicator
              style={{
                position: 'absolute',
                left:
                  size === 'small'
                    ? 2
                    : calculateLoaderPosition(buttonWidth, textWidth),
                alignSelf: 'center',
              }}
              size={loaderSize}
              color={loaderColor}
            />
          ) : null
        ) : null}
        <Text
          onLayout={event => {
            const {width} = event.nativeEvent.layout;
            setTextWidth(width);
          }}
          style={[
            {
              justifyContent: 'center',
              color:
                variant === 'filled'
                  ? theme === 'light-red'
                    ? DefaultAppColors.RedThemeColor
                    : DefaultAppColors.white
                  : 'black',
              fontSize:
                labelFontSize === 'font12'
                  ? Dimension.font12
                  : Dimension.font14,
              fontFamily: Dimension.CustomBoldFont,
            },
            textStyles,
          ]}>
          {isLabelUppercase ? label.toUpperCase() : label}
        </Text>
        {loaderPosition === 'trailing' && withLoader ? (
          isLoading ? (
            <ActivityIndicator
              style={{
                position: 'absolute',
                right:
                  size === 'small'
                    ? 2
                    : calculateLoaderPosition(buttonWidth, textWidth),
                alignSelf: 'center',
              }}
              size={loaderSize}
              color={loaderColor}
            />
          ) : null
        ) : null}
      </View>
      {trailingNode && <View style={{marginLeft: 'auto'}}>{trailingNode}</View>}
    </NativeTouchable>
  );
};

export default Button;
