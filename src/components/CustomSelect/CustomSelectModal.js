import {Modal, Text, TouchableOpacity, View} from 'react-native';

const CustomSelectModal = ({
  isModalVisible,
  values,
  selectedValue,
  onChangeValue,
}) => {
  return (
    <View
      style={{
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
      }}>
      <Modal visible={isModalVisible}>
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'blue',
          }}>
          <Text>Please select a value</Text>
          {values.map((value, index) => {
            return (
              <TouchableOpacity
                key={value + index}
                style={{
                  marginVertical: 10,
                  borderWidth: 1,
                  padding: 12,
                  width: 200,
                  borderColor: selectedValue.includes(value)
                    ? 'red'
                    : '#979797',
                }}
                onPress={() => onChangeValue(value)}>
                <Text
                  style={{
                    color: selectedValue.includes(value) ? 'red' : '#979797',
                  }}>
                  {value}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </Modal>
    </View>
  );
};

export default CustomSelectModal;
