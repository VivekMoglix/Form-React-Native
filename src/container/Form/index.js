import {Text, TouchableOpacity, View} from 'react-native';
import CustomTextInput from '../../components/TextInput';
import React, {useEffect, useState} from 'react';
import CustomButton from '../../components/CustomButton';
import Icon from 'react-native-vector-icons/dist/MaterialIcons';
import CustomSwitch from '../../components/CustomSwitch';
import CustomPopup from '../../components/CustomPopup';
import CustomRadioButton from '../../components/CustomRadioButton';
import CustomSelectModal from '../../components/CustomSelect';
import {colors} from '../../constants/colors';

const dummyArr = [
  'one',
  'two',
  'three',
  'four',
  'five',
  'six',
  'seven',
  'eight',
  'nine',
  'ten',
];

export default function Form() {
  const [isLoading, setIsLoading] = useState(false);
  const [isSwitchActive, setIsSwitchActive] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const [selectedValue, setSelectedValue] = useState('');

  return (
    <View style={{flex: 1}}>
      <CustomTextInput inputContainerStyles={{marginBottom: 30}} />
      <CustomButton />
      <CustomSwitch
        containerStyle={{marginTop: 20}}
        value={isSwitchActive}
        thumbColor={
          isSwitchActive
            ? colors.SELECTED_OPTION_COLOR
            : colors.UNSELECTED_OPTION_COLOR
        }
        onValueChange={() => setIsSwitchActive(!isSwitchActive)}
      />
      <CustomRadioButton
        isChecked={isChecked}
        onPress={() => setIsChecked(!isChecked)}
      />
      <CustomPopup
        position="bottom-right"
        message="your custom message is here"
        timer={3000}
      />
      <CustomSelectModal
        multiple={false}
        label="Custom Select"
        data={dummyArr}
        onSelectItem={(selectedItem, index) => {
          setSelectedValue(selectedItem);
        }}
      />
    </View>
  );
}
