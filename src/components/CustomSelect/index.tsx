import React, {useState, useRef, useEffect} from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  Animated,
  Dimensions,
  StyleProp,
  ViewStyle,
} from 'react-native';
import CustomSelectDropdown from './CustomSelectDropdown';
import Icon from 'react-native-vector-icons/dist/MaterialIcons';
import {colors} from '../../constants/colors';

export interface CustomSelectProps {
  data?: [];
  label?: string;
  withSearch?: boolean;
  multiple?: boolean;
  selectedValue?: any;
  onSelectItem?: any;
  containerStyles?: StyleProp<ViewStyle>;
  customSelectStyles?: StyleProp<ViewStyle>;
  dropdownIconSize?: number;
}

const CustomSelect: React.FC<CustomSelectProps> = ({
  multiple = false,
  label = 'Label',
  withSearch = false,
  data = [],
  selectedValue = multiple ? [] : '',
  onSelectItem = null,
  containerStyles = {},
  customSelectStyles = {},
  dropdownIconSize = 18,
}) => {
  const [dropdownPosition, setDropdownPosition] = useState(0);
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
          duration: 250,
          useNativeDriver: false,
        }).start()
      : Animated.timing(dropdownAnim, {
          toValue: 0,
          duration: 0,
          useNativeDriver: false,
        }).start();
  }, [isDropdownVisible]);

  return (
    <View style={containerStyles}>
      <Text style={{marginBottom: 5}}>{label}</Text>
      <View style={{position: 'relative'}}>
        <TouchableOpacity
          style={[
            {
              flexDirection: 'row',
              borderWidth: 1,
              borderColor: colors.DEFAULT_BUTTON_DARK_GRAY,
              padding: 12,
              borderRadius: 4,
            },
            customSelectStyles,
          ]}
          onLayout={event => {
            const {height} = event.nativeEvent.layout;
            setDropdownPosition(height);
          }}
          onPress={() => setIsDropdownVisible(!isDropdownVisible)}>
          {multiple === true ? (
            selectedValue &&
            selectedValue.map((value: any, index: number) => {
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
              size={dropdownIconSize}
            />
          ) : (
            <Icon
              style={{marginLeft: 'auto'}}
              name="keyboard-arrow-down"
              size={dropdownIconSize}
            />
          )}
        </TouchableOpacity>
        {isDropdownVisible && (
          <Animated.ScrollView
            showsVerticalScrollIndicator={false}
            style={{
              height: dropdownAnim,
              backgroundColor: '#909090',
              width: '100%',
              position: 'absolute',
              top: dropdownPosition && dropdownPosition,
              flex: 1,
              zIndex: 999,
            }}>
            <CustomSelectDropdown
              values={data}
              selectedValue={selectedValue}
              onSelectItem={onSelectItem}
              setIsDropdownVisible={setIsDropdownVisible}
              multiple={multiple}
              withSearch={withSearch}
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
