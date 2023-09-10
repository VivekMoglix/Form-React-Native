import React, {useState} from 'react';
import {Text, View, TouchableOpacity} from 'react-native';
import CustomSelectModal from './CustomSelectModal';

export interface CustomSelectProps {
  data?: [];
  label?: string;
  multiple?: boolean;
  selectedValue?: any;
  onSelectItem?: any;
}

const CustomSelect: any = ({
  multiple = false,
  label = 'Label',
  data = [],
  onSelectItem = null,
}) => {
  const [selectedValue, setSelectedValue] = useState(!multiple ? '' : []);
  const [isModalVisible, setIsModalVisible] = useState(false);

  return (
    <>
      <View style={{marginTop: 20}}>
        <Text style={{marginBottom: 5}}>{label}</Text>
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
          multiple={multiple}
          selectedValue={selectedValue}
          setSelectedValue={setSelectedValue}
          isModalVisible={isModalVisible}
          values={data}
          onSelectItem={onSelectItem}
          setIsModalVisible={setIsModalVisible}
        />
      )}
    </>
  );
};

export default CustomSelect;
