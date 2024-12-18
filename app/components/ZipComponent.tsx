import React, { useState } from 'react';
import { Modal, View, Text, TextInput, Button, StyleSheet } from 'react-native';

interface ZipCodePopupProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (zipCode: string) => void;
}

const ZipCodePopup: React.FC<ZipCodePopupProps> = ({ visible, onClose, onSubmit }) => {
  const [zipCode, setZipCode] = useState('');
  const [currentTab, setCurrentTab] = useState<'input' | 'confirmation'>('input');

  const handleSubmit = () => {
    onSubmit(zipCode);
    setZipCode('');
    setCurrentTab('confirmation');
  };

  const handleBackToInput = () => {
    setCurrentTab('input');
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          {currentTab === 'input' ? (
            <>
              <Text style={styles.title}>Please Enter your Zip Code</Text>
              <TextInput
                style={styles.input}
                value={zipCode}
                onChangeText={setZipCode}
                placeholder="Zip Code"
                keyboardType="numeric"
              />
              <Button title="Submit" onPress={handleSubmit} />
              <Button title="Cancel" onPress={onClose} color="red" />
            </>
          ) : (
            <>
              <Text style={styles.title}>Zip Code Submitted</Text>
              <Text style={styles.message}>You entered: {zipCode}</Text>
              <Button title="Back" onPress={handleBackToInput} />
              <Button title="Close" onPress={onClose} color="red" />
            </>
          )}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: 300,
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    marginBottom: 10,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    width: '100%',
    paddingHorizontal: 10,
  },
  message: {
    fontSize: 16,
    marginBottom: 10,
  },
});

export default ZipCodePopup;
