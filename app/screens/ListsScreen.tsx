import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const ListsScreen = () => {
  return (
    <View style={styles.container}>
      <Text>Lists Screen</Text>
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
});

export default ListsScreen;
