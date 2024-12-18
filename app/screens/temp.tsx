import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Button } from 'react-native';
import ZipCodePopup from '../components/ZipComponent';
import Icon from 'react-native-vector-icons/FontAwesome';

const temp = () => {
  const [isPopupVisible, setPopupVisible] = useState(false);

  const handleOpenPopup = () => {
    setPopupVisible(true);
  };

  const handleClosePopup = () => {
    setPopupVisible(false);
  };

  const handleZipCodeSubmit = (zipCode: string) => {
    console.log('Zip Code submitted:', zipCode);
  };

  return (
    <View style={styles.container}>
      <Text>Home</Text>
      <TouchableOpacity style={styles.button} onPress={handleOpenPopup}>
        <Icon name="plus" size={20} color="#fff" />
      </TouchableOpacity>
      <ZipCodePopup
        visible={isPopupVisible}
        onClose={handleClosePopup}
        onSubmit={handleZipCodeSubmit}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fae3d9',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#007BFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default temp;
