import React from 'react';
import {ActivityIndicator, Text, TouchableOpacity, View} from 'react-native';
import PropTypes from 'prop-types';

class CustomButton extends React.Component {
  constructor(props) {
    super(props);
    console.log(props);
  }
  render() {
    const {
      withLoader,
      buttonStyle,
      isLoading,
      variant,
      backgroundColor,
      loaderColor,
      loaderPosition,
      label,
      textStyles,
      leading,
      trailing,
      onPress,
      size,
      loaderSize,
    } = this.props;
    return (
      <TouchableOpacity
        onPress={onPress}
        style={[
          {
            width:
              size === 'small'
                ? 150
                : size === 'medium'
                ? 250
                : size === 'large'
                ? '100%'
                : null,
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 5,
            borderWidth: variant === 'outlined' ? 1 : 0,
            padding: 4,
            flexDirection: 'row',
            borderRadius: 4,
            backgroundColor:
              variant === 'filled' ? backgroundColor : 'transparent',
          },
          buttonStyle,
        ]}>
        {loaderPosition === 'leading' && withLoader ? (
          isLoading ? (
            <ActivityIndicator
              style={{
                position: 'absolute',
                left: 10,
              }}
              size={loaderSize}
              color={loaderColor}
            />
          ) : null
        ) : null}
        {leading && <View>{leading()}</View>}
        <Text style={[{justifyContent: 'center', marginLeft: 8}, textStyles]}>
          {label}
        </Text>
        {trailing && <View>{trailing()}</View>}
        {loaderPosition === 'trailing' && withLoader ? (
          isLoading ? (
            <ActivityIndicator
              style={{
                position: 'absolute',
                right: 10,
              }}
              size={loaderSize}
              color={loaderColor}
            />
          ) : null
        ) : null}
      </TouchableOpacity>
    );
  }
}

CustomButton.propTypes = {
  label: PropTypes.string.isRequired,
  buttonStyle: PropTypes.object,
  withLoader: PropTypes.bool,
  isLoading: PropTypes.bool,
  loaderColor: PropTypes.string,
  loaderPosition: PropTypes.oneOf(['leading', 'trailing']),
  variant: PropTypes.oneOf(['filled', 'standard', 'outlined']),
  backgroundColor: PropTypes.string,
  textStyles: PropTypes.object,
  leading: PropTypes.func,
  trailing: PropTypes.func,
  onPress: PropTypes.func,
  size: PropTypes.string,
  loaderSize: PropTypes.oneOf(['small', 'large']),
};

CustomButton.defaultProps = {
  withLoader: false,
  isLoading: false,
  loaderColor: '#fff',
  variant: 'standard',
  backgroundColor: 'blue',
  loaderPosition: 'leading',
  loaderSize: 'small',
  size: 'small',
};

export default CustomButton;
