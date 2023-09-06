import React from 'react';
import {
  Switch as NativeSwitch,
  SwitchProps as NativeSwitchProps,
  Text,
  View,
} from 'react-native';

export interface CustomSwitchProps extends NativeSwitchProps {
  label?: string;
  labelPosition?: 'leading' | 'trailing';
  style?: NativeSwitchProps['style'];
}

const CustomSwitch: React.FC<CustomSwitchProps> = ({
  label,
  labelPosition,
  style,
  ...rest
}) => {
  return (
    <View style={{flexDirection: 'row'}}>
      {labelPosition === 'leading' && <Text>{label}</Text>}
      <NativeSwitch {...rest} />
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
