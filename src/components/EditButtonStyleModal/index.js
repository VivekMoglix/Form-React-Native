import {useState} from 'react';
import {Modal, View, Text, TextInput, TouchableOpacity} from 'react-native';

export default function EditButtonStyleModal(props) {
  const {editButtonStyleModalVisible} = props;
  const {borderColor, textColor, backgroundColor} = props?.buttonData?.editable;
  const [editBorderColor, setEditBorderColor] = useState(borderColor);
  const [editTextColor, setEditTextColor] = useState(textColor);
  const [editBackgroundColor, setEditBackgroundColor] =
    useState(backgroundColor);

  const handleSubmit = () => {
    props?.setButtonData({
      ...props?.buttonData,
      editable: {
        borderColor: editBorderColor,
        textColor: editTextColor,
        backgroundColor: editBackgroundColor,
      },
    });
  };

  const handleModalClose = () => {
    props?.setEditButtonStyleModalVisible(false);
  };
  return (
    <View
      style={{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
      }}>
      <Modal
        visible={editButtonStyleModalVisible}
        transparent={true}
        animationType="slide">
        <View
          style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#fff',
            gap: 20,
          }}>
          <View>
            <Text style={{color: '#1D2226', marginBottom: 5}}>Text Color</Text>
            <TextInput
              style={{borderWidth: 1, borderColor: '#1D2226', width: 250}}
              value={editTextColor}
              onChangeText={setEditTextColor}
            />
          </View>
          <View>
            <Text style={{color: '#1D2226', marginBottom: 5}}>
              Border Color
            </Text>
            <TextInput
              style={{borderWidth: 1, borderColor: '#1D2226', width: 250}}
              value={editBorderColor}
              onChangeText={setEditBorderColor}
            />
          </View>
          <View>
            <Text style={{color: '#1D2226', marginBottom: 5}}>
              Background Color
            </Text>
            <TextInput
              style={{borderWidth: 1, borderColor: '#1D2226', width: 250}}
              value={editBackgroundColor}
              onChangeText={setEditBackgroundColor}
            />
          </View>
          <TouchableOpacity
            style={{marginTop: 10}}
            onPress={() => {
              handleSubmit();
              handleModalClose();
            }}>
            <Text style={{fontSize: 20, color: '#D9232D'}}>Update Style</Text>
          </TouchableOpacity>
          <TouchableOpacity style={{marginTop: 10}} onPress={handleModalClose}>
            <Text style={{fontSize: 20}}>Hide Modal</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
}
