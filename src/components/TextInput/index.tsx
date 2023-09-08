import React from 'react';
import {
  Text,
  TextInput as NativeInput,
  TextInputProps as NativeInputProps,
  View,
  StyleProp,
  ViewStyle,
  TextStyle,
} from 'react-native';

export interface CustomTextInputProps extends NativeInputProps {
  label?: string;
  variant?: 'standard' | 'outlined' | 'filled';
  labelStyles?: StyleProp<TextStyle>;
  inputContainerStyles?: StyleProp<ViewStyle>;
  leading?: any;
  trailing?: any;
  textStyles?: StyleProp<TextStyle>;
  backgroundColor?: string;
}

const CustomTextInput: React.FC<CustomTextInputProps> = ({
  label = 'Input',
  labelStyles,
  variant = 'standard',
  backgroundColor = '#fff',
  inputContainerStyles,
  leading,
  trailing,
  textStyles,
  ...rest
}) => {
  return (
    <View>
      <Text style={labelStyles}>{label}</Text>
      <View
        style={[
          {
            flexDirection: 'row',
            alignItems: 'center',
            paddingHorizontal: 4,
            paddingVertical: 4,
            borderRadius: variant === 'filled' ? 4 : 0,
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
