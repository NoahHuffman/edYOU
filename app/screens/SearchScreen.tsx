import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, Button, FlatList } from 'react-native';
import { fetchStores } from '@/api/radius';
import { Store } from '@/api/constants';

const SearchScreen = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [stores, setStores] = useState([]);

  const handleSearch = async () => {
    const latitude = 35.151758855559244;
    const longitude = -85.24900987179046;
    const stores = await fetchStores(latitude, longitude);
    setStores(stores);

    for (let i = 0; i < stores.length; i++) {
      
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.searchInput}
        placeholder="Search..."
        value={searchTerm}
        onChangeText={setSearchTerm}
      />
      <Button title="Submit" onPress={handleSearch} />
      <FlatList
        data={stores}
        keyExtractor={(item) => item}
        renderItem={({ item }) => (
          <View style={styles.storeItem}>
            <Text>{item}</Text>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fae3d9',
    flex: 1,
    padding: 16,
  },
  searchInput: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 8,
  },
  storeItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
});

export default SearchScreen;
