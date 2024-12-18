import React from 'react';
import { View, StyleSheet } from 'react-native';
import MapView, { Marker } from 'react-native-maps';

const Map = ({ initialRegion, stores }) => {
    return (
        <View style={styles.container}>
            <MapView style={styles.map} initialRegion={initialRegion}>
                {stores.map((store) => (
                    <Marker
                        key={store.id}
                        coordinate={{
                            latitude: store.geometry.location.lat,
                            longitude: store.geometry.location.lng,
                        }}
                        title={store.name}
                    />
                ))}
            </MapView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        ...StyleSheet.absoluteFillObject,
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
    map: {
        ...StyleSheet.absoluteFillObject,
    },
});

export default Map;
