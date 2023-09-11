import React from 'react';
import {
  Switch as NativeSwitch,
  SwitchProps as NativeSwitchProps,
  StyleProp,
  Text,
  View,
  ViewStyle,
} from 'react-native';
import {colors} from '../../constants/colors';

export interface CustomSwitchProps extends NativeSwitchProps {
  label?: string;
  labelPosition?: 'leading' | 'trailing';
  style?: NativeSwitchProps['style'];
  containerStyle?: StyleProp<ViewStyle>;
}

const CustomSwitch: React.FC<CustomSwitchProps> = ({
  label = 'Switch',
  labelPosition = 'leading',
  style,
  containerStyle,
  ...rest
}) => {
  return (
    <View
      style={[{flexDirection: 'row', alignItems: 'center'}, containerStyle]}>
      {labelPosition === 'leading' && <Text>{label}</Text>}
      <NativeSwitch
        {...rest}
        trackColor={{
          false: colors.DEFAULT_BUTTON_DARK_GRAY,
          true: colors.DEFAULT_BUTTON_DARK_GRAY,
        }}
      />
      {labelPosition === 'trailing' && <Text>{label}</Text>}
    </View>
  );
};

export default CustomSwitch;

// CustomSwitch.propTypes = {
//   value: PropTypes.bool,
//   onValueChange: PropTypes.func,
//   ios_backgroundColor: PropTypes.string,
//   thumbColor: PropTypes.string,
//   trackColor: PropTypes.object,
//   disabled: PropTypes.bool,
//   onChange: PropTypes.func,
//   label: PropTypes.string,
//   labelPosition: PropTypes.string,
//   style: PropTypes.object,
//   size: PropTypes.oneOf(['small', 'medium']),
// };
// CustomSwitch.defaultProps = {
//   thumbColor: '#767577',
//   trackColor: {false: '#767577', true: '#81b0ff'},
//   disabled: false,
//   size: 'small',
// };
