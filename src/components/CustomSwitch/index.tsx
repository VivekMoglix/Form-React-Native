import React from 'react';
import {
  Switch as NativeSwitch,
  SwitchProps as NativeSwitchProps,
  StyleProp,
  Text,
  View,
  ViewStyle,
  TextStyle,
} from 'react-native';
import colors from '../../constants/colors';

export interface SwitchProps extends NativeSwitchProps {
  label?: string;
  labelPosition?: 'leading' | 'trailing';
  style?: NativeSwitchProps['style'];
  containerStyles?: StyleProp<ViewStyle>;
  trackColor?:
  | {
    false?: string | null | undefined;
    true?: string | null | undefined;
  }
  | undefined;
  labelStyles?: StyleProp<ViewStyle>;
}

const Switch: React.FC<SwitchProps> = ({
  label = 'Switch',
  labelPosition = 'leading',
  style,
  containerStyles,
  trackColor = { false: colors.GreenColor, true: colors.RedThemeColor },
  labelStyles,
  ...rest
}) => {
  return (
    <View
      style={[{ flexDirection: 'row', alignItems: 'center' }, containerStyles]}>
      {labelPosition === 'leading' && <Text style={labelStyles}>{label}</Text>}
      <NativeSwitch {...rest} trackColor={trackColor} />
      {labelPosition === 'trailing' && <Text style={labelStyles}>{label}</Text>}
    </View>
  );
};

export default Switch;
