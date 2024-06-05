import React from 'react';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {
  TouchableOpacity as NativeTouchableOpacity,
  TouchableOpacityProps as NativeTouchableOpacityprops,
  StyleProp,
  Text,
  View,
  ViewStyle,
} from 'react-native';
import DefaultAppColors from '../../constants/colors';

export interface CustomRadioButtonProps extends NativeTouchableOpacityprops {
  isChecked?: boolean;
  label?: string;
  labelPosition?: 'top' | 'right' | 'bottom' | 'left';
  checkedColor?: string;
  uncheckedColor?: string;
  radioButtonShape?: 'circle' | 'square';
  radioButtonType?: 'icon' | 'color';
  containerStyles?: StyleProp<ViewStyle>;
}

const CustomRadioButton: React.FC<CustomRadioButtonProps> = ({
  isChecked = false,
  label = 'Label',
  uncheckedColor = DefaultAppColors.lightGrayshade,
  checkedColor = DefaultAppColors.RedThemeColor,
  labelPosition = 'left',
  radioButtonShape = 'square',
  radioButtonType = 'color',
  containerStyles = {},
  ...rest
}) => {
  return (
    <View
      style={[
        {
          flexDirection:
            labelPosition === 'left' || labelPosition === 'right'
              ? 'row'
              : 'column',
          gap: labelPosition === 'left' || labelPosition === 'right' ? 8 : 4,
        },
        containerStyles,
      ]}>
      {labelPosition === 'top' && <Text>{label}</Text>}
      {labelPosition === 'left' && <Text>{label}</Text>}
      <NativeTouchableOpacity
        {...rest}
        // style={{
        //   width: 24,
        //   height: 24,
        //   borderRadius: radioButtonShape === 'circle' ? 50 : 5,
        //   borderWidth: 1,
        //   borderColor: isChecked ? checkedColor : uncheckedColor,
        //   alignItems: 'center',
        //   justifyContent: 'center',
        // }}
      >
        {radioButtonType === 'color' && isChecked === true && (
          <View
          // style={{
          //   width: 18,
          //   height: 18,
          //   borderRadius: 5,
          //   backgroundColor: checkedColor,
          // }}
          />
        )}
        {radioButtonType === 'icon' && isChecked === true ? (
          <Icon name={'checkbox-marked'} color={checkedColor} size={24} />
        ) : radioButtonType === 'icon' && isChecked === false ? (
          <Icon
            name={'checkbox-blank-outline'}
            color={uncheckedColor}
            size={24}
          />
        ) : radioButtonType === 'color' && isChecked === false ? (
          <Icon
            name={'checkbox-blank-circle-outline'}
            color={uncheckedColor}
            size={24}
          />
        ) : (
          <Icon name={'circle-slice-8'} color={checkedColor} size={24} />
        )}
      </NativeTouchableOpacity>
      {labelPosition === 'right' && <Text>{label}</Text>}
      {labelPosition === 'bottom' && <Text>{label}</Text>}
    </View>
  );
};

export default CustomRadioButton;
