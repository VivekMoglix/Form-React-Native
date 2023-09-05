import {View} from 'react-native';
import CustomTextInput from '../../components/TextInput';
import {useState} from 'react';
import CustomButton from '../../components/CustomButton';
import Icon from 'react-native-vector-icons/dist/MaterialIcons';

export default function Form() {
  const [isLoading, setIsLoading] = useState(false);
  return (
    <View>
      <CustomTextInput
        label="Input"
        variant="filled"
        leading={props => <Icon name={'account-circle'} size={24} {...props} />}
        trailing={props => (
          <Icon name={'account-circle'} size={24} color="red" {...props} />
        )}
        onChangeText={text => console.log(text)}
        textStyles={{fontSize: 20, color: 'red'}}
      />
      <CustomButton
        buttonStyle={{marginTop: 20}}
        size="small"
        label="Button"
        variant="filled"
        backgroundColor="yellow"
        withLoader={true}
        isLoading={isLoading}
        loaderColor="#000000"
        loaderPosition="trailing"
        loaderSize="small"
        textStyles={{fontSize: 18, color: 'red'}}
        leading={props => <Icon name={'account-circle'} size={24} {...props} />}
        onPress={() => setIsLoading(!isLoading)}
      />
    </View>
  );
}
