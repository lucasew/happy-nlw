import React from 'react';
import { Image, StyleSheet } from 'react-native';
import { LatLng, Marker } from 'react-native-maps';
import mapMarker from '../../assets/marker.png';

interface MapMarkerProps {
  coordinate: LatLng
}

const MapMarker: React.FC<MapMarkerProps> = (props) => {
    return (
        <Marker
          calloutAnchor={{
            x: 2.8,
            y: 0.95
          }}
          coordinate={props.coordinate}
        >
          <Image
            source={mapMarker}
            style={styles.mapMarker}
          />
          {props.children}
        </Marker>
    )
}

const styles = StyleSheet.create({
    mapMarker: {
        width: 46,
        height: 48
    },
})
export default MapMarker