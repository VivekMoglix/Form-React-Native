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
  withLabel?: boolean;
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
  leftIcon?:
    | React.ReactNode
    | ((props: {color: string; size: number}) => React.ReactNode | null)
    | null;
  rightIcon?:
    | React.ReactNode
    | ((props: {color: string; size: number}) => React.ReactNode | null)
    | null;
  buttonStyle?: StyleProp<ViewStyle>;
  isLabelUppercase?: boolean;
  theme?: 'primary' | 'secondary' | 'black-white';
  alignRightIconEnd?: boolean;
  disabledColor?: string;
  buttonSize?: 'small' | 'medium';
}

const Button: React.FC<ButtonProps> = ({
  withLabel = true,
  label = 'Button',
  withLoader = false,
  labelFontSize = 'font14',
  variant = 'filled',
  size = 'full',
  loaderSize = 'small',
  isLoading,
  textStyles,
  loaderPosition = 'leading',
  disabled = false,
  disabledColor = DefaultAppColors.lightGrayText,
  loaderColor = variant == 'filled'
    ? DefaultAppColors.white
    : disabled
    ? disabledColor
    : DefaultAppColors.RedThemeColor,
  leftIcon,
  rightIcon,
  buttonStyle,
  isLabelUppercase = false,
  theme = 'primary',
  alignRightIconEnd = false,
  buttonSize = 'small',
  ...rest
}) => {
  const [textWidth, setTextWidth] = useState(0);
  const [buttonWidth, setButtonWidth] = useState(0);

  const calculateLoaderPosition = (buttonWidth: number, textWidth: number) => {
    const position = ((buttonWidth - textWidth) * 3) / 8;
    return position;
  };

  const LeftIcon =
    typeof leftIcon === 'function'
      ? leftIcon({color: '#f00', size: 24})
      : leftIcon;

  const RightIcon =
    typeof rightIcon === 'function'
      ? rightIcon({
          color: '#f00',
          size: 24,
        })
      : rightIcon;
  return (
    <NativeTouchable
      {...rest}
      disabled={disabled}
      style={[
        {
          height: buttonSize == 'small' ? 40 : buttonSize == 'medium' ? 50 : 40,
          alignItems: 'center',
          justifyContent: 'center',
          borderWidth: variant === 'outlined' ? 1 : 0,
          borderColor:
            theme == 'primary'
              ? DefaultAppColors.LightRedThemeColor
              : theme == 'secondary'
              ? disabled
                ? disabledColor
                : DefaultAppColors.RedThemeColor
              : DefaultAppColors.PrimaryTextColor,
          paddingHorizontal: 10,
          flexDirection: 'row',
          borderRadius: 4,
          backgroundColor:
            variant == 'filled'
              ? theme == 'primary'
                ? disabled
                  ? disabledColor
                  : DefaultAppColors.RedThemeColor
                : theme == 'secondary'
                ? DefaultAppColors.LightRedThemeColor
                : DefaultAppColors.PrimaryTextColor
              : 'transparent',
        },
        buttonStyle,
      ]}>
      {isLoading
        ? null
        : LeftIcon && (
            <View style={{marginRight: withLabel ? 5 : 0}}>{LeftIcon}</View>
          )}
      {isLoading ? (
        <ActivityIndicator
          style={{
            alignSelf: 'center',
          }}
          size={loaderSize}
          color={loaderColor}
        />
      ) : withLabel ? (
        <Text
          onLayout={event => {
            const {width} = event.nativeEvent.layout;
            setTextWidth(width);
          }}
          style={[
            {
              justifyContent: 'center',
              color:
                theme === 'primary'
                  ? DefaultAppColors.white
                  : DefaultAppColors.RedThemeColor,
              textTransform: isLabelUppercase ? 'uppercase' : 'none',
              fontSize:
                labelFontSize === 'font12'
                  ? Dimension.font12
                  : Dimension.font14,
              fontFamily: Dimension.CustomBoldFont,
            },
            textStyles,
          ]}>
          {label}
        </Text>
      ) : null}
      {isLoading
        ? null
        : RightIcon && (
            <View style={{marginLeft: withLabel ? 5 : 0}}>{RightIcon}</View>
          )}
    </NativeTouchable>
  );
};

export default Button;
