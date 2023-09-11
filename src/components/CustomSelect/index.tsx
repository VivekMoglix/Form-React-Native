import React, {useState, useRef, useEffect} from 'react';
import {Text, View, TouchableOpacity, Animated, Dimensions} from 'react-native';
// import CustomSelectModal from './CustomSelectModal';
import CustomSelectDropdown from './CustomSelectDropdown';
import Icon from 'react-native-vector-icons/dist/MaterialIcons';
import {ScrollView} from 'react-native-gesture-handler';
import {colors} from '../../constants/colors';

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
  const [dropdownPosition, setDropdownPosition] = useState(0);
  const [selectedValue, setSelectedValue] = useState(!multiple ? '' : []);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);

  const dropdownAnim = useRef(new Animated.Value(0)).current;

  const calculateDropdownHeight = () => {
    const {height} = Dimensions.get('window');
    return data.length <= 7 ? 36.5 * data.length : height * 0.3;
  };

  useEffect(() => {
    isDropdownVisible
      ? Animated.timing(dropdownAnim, {
          toValue: calculateDropdownHeight(),
          duration: 1000,
          useNativeDriver: false,
        }).start()
      : Animated.timing(dropdownAnim, {
          toValue: 0,
          duration: 500,
          useNativeDriver: false,
        }).start();
  }, [isDropdownVisible]);

  return (
    <View style={{marginTop: 20}}>
      <Text style={{marginBottom: 5}}>{label}</Text>
      <View style={{position: 'relative'}}>
        <TouchableOpacity
          style={{
            flexDirection: 'row',
            borderWidth: 1,
            borderColor: colors.DEFAULT_BUTTON_DARK_GRAY,
            padding: 12,
            borderRadius: 4,
          }}
          onLayout={event => {
            const {height} = event.nativeEvent.layout;
            setDropdownPosition(height);
          }}
          onPress={() => setIsDropdownVisible(!isDropdownVisible)}>
          {multiple === true ? (
            selectedValue &&
            selectedValue.map((value, index) => {
              return (
                <Text
                  style={{color: colors.SELECTED_OPTION_COLOR}}
                  key={value + index}>{`${value}${
                  index !== selectedValue.length - 1 ? ', ' : ''
                }`}</Text>
              );
            })
          ) : (
            <Text style={{color: colors.SELECTED_OPTION_COLOR}}>
              {selectedValue}
            </Text>
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
          <Animated.ScrollView
            showsVerticalScrollIndicator={false}
            style={{
              height: dropdownAnim,
              backgroundColor: colors.APP_BACKGROUND_COLOR,
              width: '100%',
              position: 'absolute',
              top: dropdownPosition && dropdownPosition,
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
          </Animated.ScrollView>
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
