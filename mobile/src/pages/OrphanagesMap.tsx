import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, Dimensions } from 'react-native';
import MapView, {PROVIDER_GOOGLE} from 'react-native-maps'
import {Feather} from '@expo/vector-icons'
import { CommonActions, useNavigation, useRoute } from '@react-navigation/native';
import { RectButton } from 'react-native-gesture-handler';

import MapMarker from '../components/MapMarker';
import MapCallout from '../components/MapCallout';
import Orphanage from '../../models/Orphanage';
import ApiResult from '../../models/ApiResult';
import backend from '../../services/backend';
import { CommonSettings } from '../common';
import Loading from '../components/Loading';

export default function OrphanagesMap() {
  const params = useRoute().params
  const {navigate} = useNavigation()
  const [orphanages, setOrphanages] = useState<Orphanage[]>()

  useEffect(() => {
    backend.get<ApiResult<Orphanage[]>>('/api/orphanages').then((result) => {
      setOrphanages(result.data.data)      
    })
  }, [params])

  if (!orphanages) {
    return (
      <Loading text="Carregando lista de locais..."/>
    )
  }
  return (
    <View style={styles.container}>
      <MapView
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        initialRegion={{
        latitude: CommonSettings.mapCenter[0],
        longitude: CommonSettings.mapCenter[1],
        latitudeDelta: 0.008,
        longitudeDelta: 0.008
      }}
      >
        {orphanages.map(orphanage => {
          const {latitude, longitude, name, id} = orphanage
          return (
            <MapMarker key={id} coordinate={{latitude, longitude}}>
              <MapCallout onPress={() => navigate('OrphanageDetails', {id})} text={name} />
            </MapMarker>
          )
        })}
      </MapView>
      <View style={styles.footer}>
        <Text style={styles.footerText}>{orphanages.length} orfanatos disponíveis</Text>
        <RectButton style={styles.createOrphanageButton} onPress={() => navigate('SelectMapPosition')}>
          <Feather name="plus" size={20} color="#FFF"/>
        </RectButton>
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
