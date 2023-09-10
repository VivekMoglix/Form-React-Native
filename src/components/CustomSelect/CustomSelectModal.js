import {Modal, Text, TouchableOpacity, View} from 'react-native';

const CustomSelectModal = ({
  isModalVisible,
  values,
  selectedValue,
  setSelectedValue,
  onSelectItem,
  setIsModalVisible,
  multiple,
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
                onPress={() => {
                  if (multiple === true) {
                    if (selectedValue.includes(value)) {
                      const newArr = selectedValue.filter(el => el != value);
                      setSelectedValue([...newArr]);
                      onSelectItem([...newArr], index);
                    } else {
                      const newArr = [...selectedValue, value];
                      console.log('New Arr', newArr);
                      setSelectedValue([...newArr]);
                      onSelectItem([...newArr], index);
                    }
                  } else {
                    setSelectedValue(value);
                    onSelectItem(value, index);
                  }
                  setIsModalVisible(false);
                }}>
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
