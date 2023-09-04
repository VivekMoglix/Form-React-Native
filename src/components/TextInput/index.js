import {Button, Text, TextInput, TouchableOpacity, View} from 'react-native';

export default function CustomTextInput(props) {
  const {value, label, textColor, borderColor, labelColor} =
    props?.textFieldData?.editable;

  const handleTextChange = text => {
    props.setTextFieldData({...props?.textFieldData, value: text});
  };

  return (
    <View>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 5,
        }}>
        <Text style={{color: labelColor}}>{label}</Text>
        <TouchableOpacity>
          <Text onPress={() => props?.setModalVisible(true)}>Edit</Text>
        </TouchableOpacity>
      </View>
      <TextInput
        style={{
          borderWidth: 1,
          borderColor,
          paddingHorizontal: 8,
          paddingVertical: 4,
          color: textColor,
        }}
        value={value}
        onChangeText={text => handleTextChange(text)}
        placeholder="Text Input"
        placeholderTextColor={textColor}
      />
    </View>
  );
}
