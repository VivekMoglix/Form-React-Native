import {useState} from 'react';
import {Modal, View, Text, TextInput, TouchableOpacity} from 'react-native';

export default function EditTextStyleModal(props) {
  const {modalVisible} = props;
  const {borderColor, textColor, label, labelColor} =
    props?.textFieldData?.editable;
  const [editLabel, setEditLabel] = useState(label);
  const [editBorderColor, setEditBorderColor] = useState(borderColor);
  const [editTextColor, setEditTextColor] = useState(textColor);
  const [editLabelColor, setEditLabelColor] = useState(labelColor);
  const handleSubmit = () => {
    props?.setTextFieldData({
      ...props?.textFieldData,
      editable: {
        label: editLabel,
        labelColor: editLabelColor,
        textColor: editTextColor,
        borderColor: editBorderColor,
      },
    });
  };

  const handleModalClose = () => {
    props?.setModalVisible(false);
  };
  return (
    <View
      style={{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
      }}>
      <Modal visible={modalVisible} transparent={true} animationType="slide">
        <View
          style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#fff',
            gap: 20,
          }}>
          <View>
            <Text style={{color: '#1D2226', marginBottom: 5}}>Label Color</Text>
            <TextInput
              style={{borderWidth: 1, borderColor: '#1D2226', width: 250}}
              value={editLabel}
              onChangeText={setEditLabel}
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
            <Text style={{color: '#1D2226', marginBottom: 5}}>Text Color</Text>
            <TextInput
              style={{borderWidth: 1, borderColor: '#1D2226', width: 250}}
              value={editTextColor}
              onChangeText={setEditTextColor}
            />
          </View>
          <View>
            <Text style={{color: '#1D2226', marginBottom: 5}}>Label Color</Text>
            <TextInput
              style={{borderWidth: 1, borderColor: '#1D2226', width: 250}}
              value={editLabelColor}
              onChangeText={setEditLabelColor}
            />
          </View>
          <TouchableOpacity
            onPress={() => {
              handleSubmit();
              handleModalClose();
            }}>
            <Text style={{fontSize: 20, color: '#D9232D'}}>Update Style</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleModalClose}>
            <Text style={{fontSize: 20}}>Hide Modal</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
}
