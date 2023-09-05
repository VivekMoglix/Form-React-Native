import React from 'react';
import {
  ActivityIndicator,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import PropTypes from 'prop-types';

class CustomTextField extends React.Component {
  constructor(props) {
    super(props);
    console.log(props);
  }
  render() {
    const {
      label,
      variant,
      backgroundColor,
      leading,
      trailing,
      labelStyles,
      onChangeText,
      inputContainerStyles,
      textStyles,
    } = this.props;
    return (
      <View>
        <Text style={labelStyles}>{label}</Text>
        <View
          style={[
            {
              flexDirection: 'row',
              alignItems: 'center',
              paddingLeft: leading ? 4 : 0,
              paddingRight: trailing ? 4 : 0,
              borderRadius: variant === 'filled' ? 4 : 0,
              backgroundColor:
                variant === 'filled' ? backgroundColor : 'transparent',
              marginTop: 5,
              paddingVertical: 0,
              borderWidth: variant === 'outlined' ? 1 : 0,
              borderBottomWidth:
                variant === 'standard' ? 1 : variant === 'outlined' ? 1 : 0,
            },
            inputContainerStyles,
          ]}>
          {leading && <View>{leading()}</View>}
          <TextInput
            style={[{flex: 2}, textStyles]}
            onChangeText={onChangeText}
          />
          {trailing && <View style={{marginLeft: 'auto'}}>{trailing()}</View>}
        </View>
      </View>
    );
  }
}

CustomTextField.propTypes = {
  label: PropTypes.string.isRequired,
  size: PropTypes.string,
  variant: PropTypes.oneOf(['filled', 'standard', 'outlined']),
  backgroundColor: PropTypes.string,
  leading: PropTypes.func,
  trailing: PropTypes.func,
  labelStyles: PropTypes.object,
  onChangeText: PropTypes.func,
  inputContainerStyles: PropTypes.object,
  textStyles: PropTypes.object,
};

CustomTextField.defaultProps = {
  variant: 'filled',
  backgroundColor: '#dedede',
};

export default CustomTextField;
