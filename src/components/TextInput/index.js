import React from 'react';
import {Text, TextInput, View} from 'react-native';
import PropTypes from 'prop-types';

function CustomTextField(props) {
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
    placeholder,
    placeholderTextColor,
    value,
    keyboardType,
    inputMode,
  } = props;
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
        <TextInput
          style={[
            {flex: 2, paddingVertical: 0, paddingHorizontal: 4},
            textStyles,
          ]}
          placeholder={placeholder}
          placeholderTextColor={placeholderTextColor}
          onChangeText={onChangeText}
          value={value}
          keyboardType={keyboardType}
          inputMode={inputMode}
        />
        {trailing && <View style={{marginLeft: 'auto'}}>{trailing()}</View>}
      </View>
    </View>
  );
}

CustomTextField.propTypes = {
  label: PropTypes.string.isRequired,
  placeholder: PropTypes.string,
  placeholderTextColor: PropTypes.string,
  variant: PropTypes.oneOf(['filled', 'standard', 'outlined']),
  backgroundColor: PropTypes.string,
  leading: PropTypes.func,
  trailing: PropTypes.func,
  labelStyles: PropTypes.object,
  onChangeText: PropTypes.func,
  inputContainerStyles: PropTypes.object,
  textStyles: PropTypes.object,
  value: PropTypes.string,
  keyboardType: PropTypes.oneOf([
    'default',
    'number-pad',
    'decimal-pad',
    'numeric',
    'email-address',
    'phone-pad',
    'url',
    'ascii-capable',
    'numbers-and-punctuation',
    'name-phone-pad',
    'twitter',
    'web-search',
  ]),
  inputMode: PropTypes.oneOf([
    'none',
    'text',
    'decimal',
    'numeric',
    'tel',
    'search',
    'email',
    'url',
  ]),
};

CustomTextField.defaultProps = {
  variant: 'standard',
  backgroundColor: '#dedede',
  keyboardType: 'default',
  inputMode: 'text',
};

export default CustomTextField;
