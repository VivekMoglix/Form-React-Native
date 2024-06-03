import React, { useEffect, useState } from 'react';
import {
  Text,
  TextInput as NativeInput,
  TextInputProps as NativeInputProps,
  View,
  StyleProp,
  ViewStyle,
  TextStyle,
} from 'react-native';
import DefaultAppColors from '../../constants/colors';
import Dimension from '../../constants/dimensions';
import colors from '../../constants/colors';

export interface TextInputProps extends NativeInputProps {
  withLabel?: boolean;
  label?: string;
  variant?: 'standard' | 'outlined';
  labelStyles?: StyleProp<TextStyle>;
  containerStyles?: StyleProp<ViewStyle>;
  leading?:
  | React.ReactNode
  | ((props: { color: string; size: number }) => React.ReactNode | null)
  | null;
  trailing?:
  | React.ReactNode
  | ((props: { color: string; size: number }) => React.ReactNode | null)
  | null;
  textStyles?: StyleProp<TextStyle>;
  backgroundColor?: string;
  placeholder?: string;
  focusColor?: string;
  errorState?: boolean;
  errorText?: string;
  disabled?: boolean;
}

const TextInput: React.FC<TextInputProps> = ({
  withLabel = true,
  label = 'Input',
  labelStyles,
  placeholder,
  placeholderTextColor = '#C6C7CC',
  variant = 'outlined',
  backgroundColor = '#fff',
  containerStyles,
  leading,
  trailing,
  textStyles,
  focusColor = DefaultAppColors.lightGrayText,
  errorState = false,
  errorText = '',
  disabled = false,
  ...rest
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [labelActive, setLabelActive] = useState(false);
  const props = { ...rest };
  let { value } = props;

  const leadingNode =
    typeof leading === 'function'
      ? leading({ color: '#f00', size: 24 })
      : leading;

  const trailingNode =
    typeof trailing === 'function'
      ? trailing({
        color: '#f00',
        size: 24,
      })
      : trailing;

  useEffect(() => {
    if (!labelActive && value && value?.length > 0) {
      setLabelActive(true);
    }
  }, [value]);

  const handleFocus = () => {
    setLabelActive(true);
    setIsFocused(true);
  };

  const handleBlur = () => {
    setIsFocused(false);
    if (!value) {
      setLabelActive(false);
    }
  };

  return (
    <>
      <View
        style={[
          {
            flexDirection: 'row',
            alignItems: 'center',
            paddingLeft: 6,
            paddingVertical: 8,
            borderRadius: variant === 'outlined' ? 8 : 0,
            backgroundColor: disabled ? DefaultAppColors.ProductBorderColor : 'transparent',
            borderWidth: variant === 'outlined' ? 1 : 0,
            borderBottomWidth:
              variant === 'standard' ? 1 : variant === 'outlined' ? 1 : 0,
            paddingRight: trailing ? 12 : 8,
            borderColor: errorState
              ? colors.RedThemeColor
              : isFocused
                ? focusColor
                : DefaultAppColors.gray2,
            width: '100%',
            marginTop: Dimension.margin20,
            height: Dimension.height40,
            marginRight: Dimension.margin10,
          },
          containerStyles,
        ]}>
        {withLabel && (
          <View
            pointerEvents="none"
            style={{
              backgroundColor: labelActive ? backgroundColor : 'transparent',
              position: 'absolute',
              top:
                variant === 'standard'
                  ? labelActive
                    ? -8
                    : 15
                  : labelActive
                    ? -10
                    : 14,
              left: leading ? 26 : 12,
              zIndex: 2,
              paddingLeft: 4,
              paddingRight: 8,
              paddingBottom: 0,
            }}>
            <Text
              style={[
                {
                  fontFamily: Dimension.CustomSemiBoldFont,
                  fontSize: Dimension.font12,
                  color: errorState ? colors.RedThemeColor : '#6F6F6F',
                },
                labelStyles,
              ]}>
              {label}
            </Text>
          </View>
        )}
        {leadingNode && <View>{leadingNode}</View>}
        <NativeInput
          editable={!disabled}
          onFocus={handleFocus}
          onBlur={handleBlur}
          {...rest}
          style={[
            {
              flex: 2,
              paddingVertical: 0,
              paddingHorizontal: 10,
              fontFamily: Dimension.CustomRegularFont,
              fontSize: Dimension.font12,
              textAlignVertical: 'center',
              color: DefaultAppColors.PrimaryTextColor,
            },
            textStyles,
          ]}
          placeholder={isFocused ? placeholder : ''}
        />
        {trailingNode && (
          <View style={{ marginLeft: 'auto' }}>{trailingNode}</View>
        )}
      </View>
      {errorState && (
        <Text
          style={{
            fontSize: Dimension.font12,
            paddingLeft: Dimension.padding6,
            color: colors.RedThemeColor,
          }}>
          {errorText}
        </Text>
      )}
    </>
  );
};

export default TextInput;
