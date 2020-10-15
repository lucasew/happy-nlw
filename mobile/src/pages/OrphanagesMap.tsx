import React from 'react';
import { StyleSheet, Text, View, Dimensions, TouchableOpacity, Image } from 'react-native';
import MapView, {Marker, Callout, PROVIDER_GOOGLE} from 'react-native-maps'
import {Feather} from '@expo/vector-icons'

import mapMarker from '../../assets/marker.png';
import { useNavigation } from '@react-navigation/native';

export default function OrphanagesMap() {
  const {navigate} = useNavigation()
  function handleNavigateToOrphanageDetails() {
    navigation.navigate('OrphanageDetails')

  }
  return (
    <View style={styles.container}>
      <MapView
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        initialRegion={{
        latitude: -27.20922052,
        longitude: -49.6401092,
        latitudeDelta: 0.008,
        longitudeDelta: 0.008
      }}
      >
        <Marker
          calloutAnchor={{
            x: 2.8,
            y: 0.95
          }}
          coordinate={{
            latitude: -27.20922052,
            longitude: -49.6401092,
          }}
        >
          <Image
            source={mapMarker}
            style={styles.mapMarker}
          />
          <Callout tooltip onPress={() => navigate('OrphanageDetails')}>
            <View style={styles.calloutContainer}>
              <Text style={styles.calloutText}>Outro lugar hehehe</Text>
            </View>
          </Callout>
        </Marker>
      </MapView>
      <View style={styles.footer}>
        <Text style={styles.footerText}>2 orfanatos disponíveis</Text>
        <TouchableOpacity style={styles.createOrphanageButton} onPress={() => navigate('OrphanageCreate')}>
          <Feather name="plus" size={20} color="#FFF"/>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height
  },
  mapMarker: {
    width: 46,
    height: 48
  },
  calloutContainer: {
    width: 160,
    height: 46,
    paddingHorizontal: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 16,
    justifyContent: 'center',
  },
  calloutText: {
    color: '#0089a5',
    fontSize: 14,
    fontFamily: 'Nunito_700Bold',
  },
  footer: {
    position: 'absolute',
    left: 24,
    right: 24,
    bottom: 32,

    backgroundColor: '#FFF',
    borderRadius: 20,
    height: 46,
    paddingLeft: 24,

    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',

    elevation: 3
  },
  footerText: {
    fontFamily: 'Nunito_700Bold',
    color: '#8fa7b3',
  },
  createOrphanageButton: {
    width: 46,
    height: 46,
    backgroundColor: '#15c3d6',
    borderRadius: 20,

    justifyContent: 'center',
    alignItems: 'center',

    elevation: 3
  }
});
