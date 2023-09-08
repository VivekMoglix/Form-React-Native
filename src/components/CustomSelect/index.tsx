import React, {useState} from 'react';
import {Text, View, TouchableOpacity} from 'react-native';
import CustomSelectModal from './CustomSelectModal';

const dummyArr = ['one', 'two', 'three', 'four'];

export interface CustomSelectProps {
  multiple?: boolean;
  selectedValue?: any;
}

const CustomSelect: any = ({multiple = false}) => {
  const [selectedValue, setSelectedValue] = useState(
    multiple === true ? ['one', 'two', 'three'] : 'one',
  );
  const [isModalVisible, setIsModalVisible] = useState(false);

  const onChangeValue = (value: any) => {
    if (multiple === true) {
      let arr = [...selectedValue];
      let newArr = [...arr, value];
      if (selectedValue.includes(value)) {
        newArr = newArr.filter(el => el != value);
      }
      console.log(newArr);
      setSelectedValue([...newArr]);
    } else {
      setSelectedValue(value);
    }
    setIsModalVisible(false);
  };

  return (
    <>
      <View style={{marginTop: 20}}>
        <Text style={{marginBottom: 5}}>Label</Text>
        <TouchableOpacity
          style={{
            borderWidth: 1,
            borderColor: '#979797',
            paddingHorizontal: 8,
            paddingVertical: 4,
          }}
          onPress={() => setIsModalVisible(true)}>
          <Text>{selectedValue}</Text>
        </TouchableOpacity>
      </View>
      {isModalVisible && (
        <CustomSelectModal
          selectedValue={selectedValue}
          isModalVisible={isModalVisible}
          onChangeValue={onChangeValue}
          values={dummyArr}
        />
      )}
    </>
  );
};

export default CustomSelect;
