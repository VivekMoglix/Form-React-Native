import React, {useState, useRef, useEffect} from 'react';
import {Text, View, TouchableOpacity, Animated, Dimensions} from 'react-native';
// import CustomSelectModal from './CustomSelectModal';
import CustomSelectDropdown from './CustomSelectDropdown';
import Icon from 'react-native-vector-icons/dist/MaterialIcons';
import {ScrollView} from 'react-native-gesture-handler';

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
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);

  const dropdownAnim = useRef(new Animated.Value(0)).current;

  const calculateDropdownHeight = () => {
    const {height} = Dimensions.get('window');
    return data.length <= 7 ? 36.5 * data.length : height * 0.3;
  };

  return (
    <View style={{marginTop: 20}}>
      <Text style={{marginBottom: 5}}>{label}</Text>
      <View style={{position: 'relative'}}>
        <TouchableOpacity
          style={{
            flexDirection: 'row',
            borderWidth: 1,
            borderColor: '#979797',
            paddingHorizontal: 8,
            paddingVertical: 4,
          }}
          onPress={() => setIsDropdownVisible(!isDropdownVisible)}>
          {multiple === true ? (
            selectedValue &&
            selectedValue.map((value, index) => {
              return (
                <Text key={value + index}>{`${value}${
                  index !== selectedValue.length - 1 ? ', ' : ''
                }`}</Text>
              );
            })
          ) : (
            <Text>{selectedValue}</Text>
          )}
          {isDropdownVisible ? (
            <Icon
              style={{marginLeft: 'auto'}}
              name="keyboard-arrow-up"
              size={18}
            />
          ) : (
            <Icon
              style={{marginLeft: 'auto'}}
              name="keyboard-arrow-down"
              size={18}
            />
          )}
        </TouchableOpacity>
        {isDropdownVisible && (
          <ScrollView
            showsVerticalScrollIndicator={false}
            style={{
              height: calculateDropdownHeight(),
              backgroundColor: 'white',
              width: '100%',
              position: 'absolute',
              top: 30,
              flex: 1,
              zIndex: 999,
            }}>
            <CustomSelectDropdown
              values={data}
              selectedValue={selectedValue}
              setSelectedValue={setSelectedValue}
              onSelectItem={onSelectItem}
              isDropdownVisible={isDropdownVisible}
              setIsDropdownVisible={setIsDropdownVisible}
              multiple={multiple}
            />
          </ScrollView>
        )}
      </View>
    </View>
  );
};

export default CustomSelect;

{
  /* {isModalVisible && (
        <CustomSelectModal
          multiple={multiple}
          selectedValue={selectedValue}
          setSelectedValue={setSelectedValue}
          isModalVisible={isModalVisible}
          values={data}
          onSelectItem={onSelectItem}
          setIsModalVisible={setIsModalVisible}
        />
      )} */
}
