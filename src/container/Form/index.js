import {View} from 'react-native';
import CustomTextInput from '../../components/TextInput';
import {useState} from 'react';
import CustomButton from '../../components/CustomButton';
import EditButtonStyleModal from '../../components/EditButtonStyleModal';
import EditTextStyleModal from '../../components/EditTextStyleModal';

export default function Form() {
  const [modalVisible, setModalVisible] = useState(false);
  const [editButtonStyleModalVisible, setEditButtonStyleModalVisible] =
    useState(false);
  const [textFieldData, setTextFieldData] = useState({
    value: '',
    editable: {
      label: 'Some label',
      labelColor: '#1D2226',
      textColor: '#1D2226',
      borderColor: '#D9232D',
      fontFamily: 'Poppins-Regular',
    },
  });
  const [buttonData, setButtonData] = useState({
    buttonName: 'Custom button',
    editable: {
      borderColor: '#D9232D',
      textColor: '#fff',
      backgroundColor: '#D9232D',
      fontFamily: 'Poppins-Regular',
    },
  });
  return (
    <View style={{flex: 1}}>
      <CustomTextInput
        textFieldData={textFieldData}
        setTextFieldData={setTextFieldData}
        setModalVisible={setModalVisible}
      />
      <CustomButton
        buttonData={buttonData}
        setButtonData={setButtonData}
        setEditButtonStyleModalVisible={setEditButtonStyleModalVisible}
      />
      {modalVisible && (
        <EditTextStyleModal
          textFieldData={textFieldData}
          modalVisible={modalVisible}
          setModalVisible={setModalVisible}
          setTextFieldData={setTextFieldData}
        />
      )}
      {editButtonStyleModalVisible && (
        <EditButtonStyleModal
          buttonData={buttonData}
          setButtonData={setButtonData}
          editButtonStyleModalVisible={editButtonStyleModalVisible}
          setEditButtonStyleModalVisible={setEditButtonStyleModalVisible}
        />
      )}
    </View>
  );
}
