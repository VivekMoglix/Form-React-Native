import React, {useState} from 'react';
import Button from './src/components/CustomButton';
import {View} from 'react-native';
import MatIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import colors from './src/constants/colors';
import TextInput from './src/components/TextInput';
import Icon from 'react-native-vector-icons/Ionicons';
import {DefaultAppColors} from 'mog-react-native-form-fields';

export default function App() {
  const [isLoading, setIsLoading] = useState(false);
  return (
    <View
      style={{
        backgroundColor: 'white',
        padding: 25,
      }}>
      <TextInput label="Enter Value" />
      <TextInput label="Enter Value" value="Moglix" />
      <TextInput label="Enter Value" disabled={true} />
      <TextInput
        label="Enter Value"
        leading={<Icon name={'search'} size={20} />}
      />
      <TextInput
        label="Enter Value"
        trailing={
          <Button
            buttonStyle={{
              backgroundColor: DefaultAppColors.BlueText,
              marginVertical: -10,
              paddingHorizontal: 15,
            }}
            textStyles={{color: DefaultAppColors.white}}
          />
        }
      />

      {/* <Button
        isLoading={isLoading}
        label="Add to Cart"
        isLabelUppercase
        theme="primary"
        disabled={isLoading}
        leftIcon={<MatIcon name="cart" color={colors.white} size={20} />}
        rightIcon={
          <MatIcon name="chevron-right" color={colors.white} size={24} />
        }
      /> */}
      {/* <Button
        isLoading={isLoading}
        withLabel={false}
        isLabelUppercase
        theme="primary"
        disabled={isLoading}
        leftIcon={<MatIcon name="cart" color={colors.white} size={20} />}
        buttonStyle={{marginVertical: 10}}
      />
      <Button
        variant="outlined"
        isLoading={isLoading}
        label="Add to Cart"
        isLabelUppercase
        theme="secondary"
        disabled={isLoading}
        leftIcon={
          <MatIcon name="cart" color={colors.RedThemeColor} size={20} />
        }
        rightIcon={
          <MatIcon
            name="chevron-right"
            color={colors.RedThemeColor}
            size={24}
          />
        }
        buttonStyle={{marginBottom: 10}}
      />
      <Button
        onPress={() => setIsLoading(!isLoading)}
        size="small"
        label="Play Loader"
        isLabelUppercase
        theme="secondary"
      /> */}
    </View>
  );
}
