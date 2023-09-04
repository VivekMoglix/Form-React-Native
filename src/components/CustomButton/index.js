import {Button, Text, TouchableOpacity, View} from 'react-native';

export default function CustomButton(props) {
  const {buttonName} = props?.buttonData;
  const {borderColor, textColor, backgroundColor, fontFamily} =
    props?.buttonData?.editable;
  return (
    <View style={{marginTop: 20}}>
      <TouchableOpacity
        onPress={() => props?.setEditButtonStyleModalVisible(true)}
        style={{alignSelf: 'center', marginBottom: 5}}>
        <Text>Edit</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={{backgroundColor, borderColor, borderWidth: 1, padding: 4}}>
        <Text style={{alignSelf: 'center', color: textColor, fontFamily}}>
          {buttonName}
        </Text>
      </TouchableOpacity>
    </View>
  );
}
