import React, {useRef, useState} from 'react';
import {
  Text,
  TextInput as NativeInput,
  TextInputProps as NativeInputProps,
  View,
  StyleProp,
  ViewStyle,
  TextStyle,
} from 'react-native';
import {colors} from '../../constants/colors';

export interface CustomTextInputProps extends NativeInputProps {
  withLabel?: boolean;
  label?: string;
  variant?: 'standard' | 'outlined' | 'filled';
  labelStyles?: StyleProp<TextStyle>;
  inputContainerStyles?: StyleProp<ViewStyle>;
  leading?: any;
  trailing?: any;
  textStyles?: StyleProp<TextStyle>;
  backgroundColor?: string;
  placeholder?: string;
}

const CustomTextInput: React.FC<CustomTextInputProps> = ({
  label = 'Input',
  labelStyles = {color: colors.DEFAULT_TEXT_LIGHT_GRAY},
  placeholder,
  placeholderTextColor = '#C6C7CC',
  variant = 'outlined',
  backgroundColor = '#fff',
  inputContainerStyles,
  leading,
  trailing,
  textStyles,
  ...rest
}) => {
  const [isFocused, setIsFocused] = useState(false);

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = () => {
    const {value} = {...rest};
    if (value && value.length > 0) {
      return;
    } else {
      setIsFocused(false);
    }
  };

  return (
    <View style={{position: 'relative'}}>
      <Text
        style={[
          labelStyles,
          {
            position: 'absolute',
            top: isFocused ? -5 : 12,
            left: leading ? 30 : 10,
            backgroundColor: isFocused ? '#fff' : 'transparent',
            zIndex: 2,
            paddingLeft: 4,
            paddingRight: 8,
          },
        ]}>
        {label}
      </Text>

      <View
        style={[
          {
            flexDirection: 'row',
            alignItems: 'center',
            paddingHorizontal: 4,
            paddingVertical: 4,
            borderColor: colors.DEFAULT_BUTTON_DARK_GRAY,
            borderRadius:
              variant === 'filled' || variant === 'outlined' ? 4 : 0,
            backgroundColor:
              variant === 'filled' ? backgroundColor : 'transparent',
            marginTop: 5,
            borderWidth: variant === 'outlined' ? 1 : 0,
            borderBottomWidth:
              variant === 'standard' ? 1 : variant === 'outlined' ? 1 : 0,
          },
          inputContainerStyles,
        ]}>
        {leading && <View>{leading()}</View>}
        <NativeInput
          onFocus={handleFocus}
          onBlur={handleBlur}
          {...rest}
          style={[
            {flex: 2, paddingVertical: 0, paddingHorizontal: 4},
            textStyles,
          ]}
        />
        {trailing && <View style={{marginLeft: 'auto'}}>{trailing()}</View>}
      </View>
    </View>
  );
};

export default CustomTextInput;
