import {Text, TouchableOpacity, View} from 'react-native';
import CustomTextInput from '../../components/TextInput';
import React, {useState} from 'react';
import CustomButton from '../../components/CustomButton';
import Icon from 'react-native-vector-icons/dist/MaterialIcons';
import CustomSwitch from '../../components/CustomSwitch';
import CustomPopup from '../../components/CustomPopup';
import CustomRadioButton from '../../components/CustomRadioButton';
import {colors} from '../../constants/colors';
import CustomSelect from '../../components/CustomSelect';

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
  const [textValue, setTextValue] = useState('');

  return (
    <View style={{flex: 1}}>
      <CustomTextInput
        inputContainerStyles={{marginBottom: 30}}
        value={textValue}
        onChangeText={setTextValue}
      />
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
      <CustomSelect
        withSearch={true}
        containerStyles={{marginTop: 20}}
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
