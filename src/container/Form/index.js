import {View} from 'react-native';
import CustomTextInput from '../../components/TextInput';
import React, {useState} from 'react';
import CustomButton from '../../components/CustomButton';
import Icon from 'react-native-vector-icons/dist/MaterialIcons';
import CustomSwitch from '../../components/CustomSwitch';

export default function Form() {
  const [isLoading, setIsLoading] = useState(false);
  const [text, setText] = useState('');
  const [isSwitchActive, setIsSwitchActive] = useState(false);
  return (
    <View>
      <CustomTextInput
        variant="filled"
        inputContainerStyles={{marginBottom: 30}}
        leading={props => <Icon name={'account-circle'} size={24} {...props} />}
      />
      <CustomButton
        variant="filled"
        withLoader={true}
        isLoading={isLoading}
        trailing={props => (
          <Icon name={'account-circle'} size={24} {...props} />
        )}
      />
      <CustomSwitch
        value={isSwitchActive}
        thumbColor={isSwitchActive ? 'red' : 'blue'}
        trackColor={{false: 'red', true: 'green'}}
        onValueChange={() => setIsSwitchActive(!isSwitchActive)}
        label={'Switch'}
        labelPosition={'leading'}
      />
    </View>
  );
}
