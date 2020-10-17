import React, { useState } from 'react';
import { View, StyleSheet, Dimensions, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { RectButton } from 'react-native-gesture-handler';
import MapView, { LatLng } from 'react-native-maps';

import MapMarker from '../../components/MapMarker';
import { CommonSettings } from '../../common';
import Header from '../../components/Header';

export default function SelectMapPosition() {
  const {navigate} = useNavigation()
  const [position, setPosition] = useState<LatLng>({latitude: 0, longitude: 0})
  const isPositionSetup = () => position.latitude != 0

  return (
    <>
      <Header title="Selecione o local no mapa"/>
      <View style={styles.container}>
        <MapView 
          initialRegion={{
            latitude: CommonSettings.mapCenter[0],
            longitude: CommonSettings.mapCenter[1],
            latitudeDelta: 0.008,
            longitudeDelta: 0.008,
          }}
          style={styles.mapStyle}
          onPress={(ev) => {
            setPosition(ev.nativeEvent.coordinate)
          }}
        >
          {
            isPositionSetup() && 
            <MapMarker coordinate={position} />
          }
          
        </MapView>

          {
            isPositionSetup() &&
            <RectButton style={styles.nextButton} onPress={() => navigate("OrphanageData", {position})}>
              <Text style={styles.nextButtonText}>Próximo</Text>
            </RectButton>
          }
      </View>
    </>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative'
  },

  mapStyle: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },

  nextButton: {
    backgroundColor: '#15c3d6',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    height: 56,

    position: 'absolute',
    left: 24,
    right: 24,
    bottom: 40,
  },

  nextButtonText: {
    fontFamily: 'Nunito_800ExtraBold',
    fontSize: 16,
    color: '#FFF',
  }
})