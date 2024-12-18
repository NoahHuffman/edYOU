import React, { useEffect, useState } from 'react';
import { SafeAreaView, ActivityIndicator } from 'react-native';
import Map from '../components/Map';
import { fetchStores } from '../../api/radius';

const MapScreen = () => {
    const initialRegion = {
        latitude: 35.151758855559244,
        longitude: -85.24900987179046,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
    };

    const [stores, setStores] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const getStores = async () => {
            const fetchedStores = await fetchStores(initialRegion.latitude, initialRegion.longitude);
            setStores(fetchedStores);
            setLoading(false);
        };

        getStores();
    }, [initialRegion]);

    if (loading) {
        return <ActivityIndicator size="large" color="#0000ff" />;
    }

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <Map initialRegion={initialRegion} stores={stores} />
        </SafeAreaView>
    );
};

export default MapScreen;
