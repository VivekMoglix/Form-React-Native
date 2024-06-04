import {Text, TouchableOpacity, View} from 'react-native';
import CustomTextInput from '../../components/TextInput';
import React, {useState} from 'react';
import CustomSwitch from '../../components/CustomSwitch';
import CustomPopup from '../../components/CustomPopup';
import CustomRadioButton from '../../components/CustomRadioButton';
import colors from '../../constants/colors';
import CustomSelect from '../../components/CustomSelect';
import Button from '../../components/CustomButton';
import MatIcon from 'react-native-vector-icons/MaterialCommunityIcons';

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
    <View style={{flex: 1, marginHorizontal: 30, marginVertical: 20}}>
      <Text style={{fontWeight: 'bold', fontSize: 14, color: colors.black}}>
        Primary Small Buttons
      </Text>
      <View
        style={{flexDirection: 'row', alignItems: 'center', marginBottom: 30}}>
        <Button
          isLoading={isLoading}
          disabled={isLoading}
          withLabel={false}
          isLabelUppercase
          leftIcon={<MatIcon name="cart" size={24} color={colors.white} />}
          buttonStyle={{marginVertical: 20}}
        />
        <Button
          onPress={() => setIsLoading(!isLoading)}
          isLabelUppercase
          leftIcon={<MatIcon name="cart" size={24} color={colors.white} />}
          buttonStyle={{marginVertical: 20, marginHorizontal: 15}}
        />
        <Button
          disabled={true}
          onPress={() => setIsLoading(!isLoading)}
          isLabelUppercase
          leftIcon={<MatIcon name="cart" size={24} color={colors.white} />}
          buttonStyle={{marginVertical: 20}}
        />
      </View>
      <Text style={{fontWeight: 'bold', fontSize: 14, color: colors.black}}>
        Primary Medium Buttons
      </Text>
      <View
        style={{flexDirection: 'row', alignItems: 'center', marginBottom: 30}}>
        <Button
          buttonSize="medium"
          isLoading={isLoading}
          withLabel={false}
          isLabelUppercase
          leftIcon={<MatIcon name="cart" size={24} color={colors.white} />}
          buttonStyle={{marginVertical: 20}}
        />
        <Button
          buttonSize="medium"
          onPress={() => setIsLoading(!isLoading)}
          isLabelUppercase
          leftIcon={<MatIcon name="cart" size={24} color={colors.white} />}
          buttonStyle={{marginVertical: 20, marginHorizontal: 15}}
        />
        <Button
          disabled={true}
          buttonSize="medium"
          onPress={() => setIsLoading(!isLoading)}
          isLabelUppercase
          leftIcon={<MatIcon name="cart" size={24} color={colors.white} />}
          buttonStyle={{marginVertical: 20}}
        />
      </View>
      <Text style={{fontWeight: 'bold', fontSize: 14, color: colors.black}}>
        Secondary Small Buttons
      </Text>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          marginBottom: 30,
        }}>
        <Button
          theme="secondary"
          withLabel={false}
          isLabelUppercase
          leftIcon={
            <MatIcon name="cart" size={24} color={colors.RedThemeColor} />
          }
          buttonStyle={{marginVertical: 20}}
        />
        <Button
          theme="secondary"
          isLabelUppercase
          leftIcon={
            <MatIcon name="cart" size={24} color={colors.RedThemeColor} />
          }
          buttonStyle={{marginVertical: 20, marginHorizontal: 15}}
        />
        <Button
          disabled={true}
          isLabelUppercase
          leftIcon={<MatIcon name="cart" size={24} color={colors.white} />}
          buttonStyle={{marginVertical: 20}}
        />
      </View>
      <Text style={{fontWeight: 'bold', fontSize: 14, color: colors.black}}>
        Secondary Medium Buttons
      </Text>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          marginBottom: 30,
        }}>
        <Button
          buttonSize="medium"
          theme="secondary"
          withLabel={false}
          isLabelUppercase
          leftIcon={
            <MatIcon name="cart" size={24} color={colors.RedThemeColor} />
          }
          buttonStyle={{marginVertical: 20}}
        />
        <Button
          buttonSize="medium"
          theme="secondary"
          isLabelUppercase
          leftIcon={
            <MatIcon name="cart" size={24} color={colors.RedThemeColor} />
          }
          buttonStyle={{marginVertical: 20, marginHorizontal: 15}}
        />
        <Button
          buttonSize="medium"
          disabled={true}
          isLabelUppercase
          leftIcon={<MatIcon name="cart" size={24} color={colors.white} />}
          buttonStyle={{marginVertical: 20}}
        />
      </View>
    </View>
  );
}
