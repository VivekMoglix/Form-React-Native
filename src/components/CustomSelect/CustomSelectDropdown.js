import {Modal, Text, TouchableOpacity, View} from 'react-native';
import {colors} from '../../constants/colors';
import CustomTextInput from '../TextInput';
import Icon from 'react-native-vector-icons/dist/MaterialIcons';
import React, {useEffect, useMemo, useState} from 'react';

const CustomSelectDropdown = ({
  values,
  selectedValue,
  setSelectedValue,
  onSelectItem,
  multiple,
  isDropdownVisible,
  setIsDropdownVisible,
  withSearch,
}) => {
  const [searchText, setSearchText] = useState('');

  const filteredData = useMemo(() => {
    return values.filter(v =>
      v.toLowerCase().includes(searchText.toLowerCase().trim()),
    );
  }, [searchText]);

  return (
    <View style={{flex: 1}}>
      {withSearch && (
        <CustomTextInput
          withLabel={false}
          value={searchText}
          leading={props => <Icon name="search" size={18} {...props} />}
          onChangeText={setSearchText}
        />
      )}
      {filteredData &&
        filteredData.map((value, index) => {
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
                  color: selectedValue.includes(value)
                    ? colors.SELECTED_OPTION_COLOR
                    : colors.UNSELECTED_OPTION_COLOR,
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
