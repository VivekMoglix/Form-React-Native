import {Text, TouchableOpacity, View} from 'react-native';
import CustomTextInput from '../../components/TextInput';
import React, {useEffect, useState} from 'react';
import CustomButton from '../../components/CustomButton';
import Icon from 'react-native-vector-icons/dist/MaterialIcons';
import CustomSwitch from '../../components/CustomSwitch';
import CustomPopup from '../../components/CustomPopup';
import CustomRadioButton from '../../components/CustomRadioButton';
import CustomSelectModal from '../../components/CustomSelect';

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
      <CustomTextInput
        label="My Input"
        variant="standard"
        inputContainerStyles={{marginBottom: 30}}
        leading={props => <Icon name={'account-circle'} size={24} {...props} />}
      />
      <CustomButton
        variant="filled"
        withLoader={true}
        isLoading={isLoading}
        onPress={() => setIsLoading(!isLoading)}
        trailing={props => (
          <Icon name={'account-circle'} size={24} {...props} />
        )}
      />
      <CustomSwitch
        containerStyle={{marginTop: 20}}
        value={isSwitchActive}
        thumbColor={isSwitchActive ? 'red' : 'blue'}
        trackColor={{false: 'red', true: 'green'}}
        onValueChange={() => setIsSwitchActive(!isSwitchActive)}
        label={'Switch'}
        labelPosition={'leading'}
      />
      <CustomRadioButton
        isChecked={isChecked}
        onPress={() => setIsChecked(!isChecked)}
      />
      <CustomPopup
        popupColor="error"
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
      <TouchableOpacity
        style={{marginTop: 20, borderWidth: 1}}
        onPress={() => console.log(selectedValue, 'asdnsad')}>
        <Text>Click to get Value</Text>
      </TouchableOpacity>
    </View>
  );
}
