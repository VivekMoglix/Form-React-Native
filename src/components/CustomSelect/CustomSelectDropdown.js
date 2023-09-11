import {Modal, Text, TouchableOpacity, View} from 'react-native';

const CustomSelectDropdown = ({
  values,
  selectedValue,
  setSelectedValue,
  onSelectItem,
  multiple,
  isDropdownVisible,
  setIsDropdownVisible,
}) => {
  return (
    <View style={{flex: 1}}>
      {values &&
        values.map((value, index) => {
          return (
            <TouchableOpacity
              key={value + index}
              onPress={() => {
                if (multiple === true) {
                  if (selectedValue.includes(value)) {
                    const newArr = selectedValue.filter(el => el != value);
                    setSelectedValue([...newArr]);
                    onSelectItem([...newArr], index);
                  } else {
                    const newArr = [...selectedValue, value];
                    setSelectedValue([...newArr]);
                    onSelectItem([...newArr], index);
                  }
                } else {
                  setSelectedValue(value);
                  onSelectItem(value, index);
                }
                setIsDropdownVisible(false);
              }}
              style={{
                paddingVertical: 8,
                borderBottomWidth: index === values.length - 1 ? 0 : 1,
                borderBottomColor: '#979797',
                alignItems: 'center',
              }}>
              <Text
                style={{
                  color: selectedValue.includes(value) ? '#000' : '#979797',
                }}>
                {value}
              </Text>
            </TouchableOpacity>
          );
        })}
    </View>
  );
};

export default CustomSelectDropdown;
