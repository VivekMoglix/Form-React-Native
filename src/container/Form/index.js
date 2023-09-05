import {View} from 'react-native';
import CustomTextInput from '../../components/TextInput';
import React, {useState} from 'react';
import CustomButton from '../../components/CustomButton';
import Icon from 'react-native-vector-icons/dist/MaterialIcons';

export default function Form() {
  const [isLoading, setIsLoading] = useState(false);
  const [text, setText] = useState('');
  return (
    <View>
      <CustomTextInput
        label="Input"
        variant="standard"
        // leading={props => <Icon name={'account-circle'} size={24} {...props} />}
        trailing={props => (
          <Icon name={'account-circle'} size={24} color="red" {...props} />
        )}
        value={text}
        onChangeText={setText}
        textStyles={{color: 'red'}}
        placeholder={'Something'}
        placeholderTextColor={'red'}
        labelStyles={{color: '#000'}}
        keyboardType="default"
        inputMode="text"
      />
      <CustomButton
        label="Button"
        buttonStyle={{marginTop: 20}}
        size="large"
        variant="outlined"
        backgroundColor="yellow"
        withLoader={true}
        isLoading={isLoading}
        loaderColor="red"
        loaderPosition="trailing"
        loaderSize="small"
        textStyles={{color: 'red'}}
        leading={props => <Icon name={'account-circle'} size={24} {...props} />}
        onPress={() => setIsLoading(!isLoading)}
      />
    </View>
  );
}
