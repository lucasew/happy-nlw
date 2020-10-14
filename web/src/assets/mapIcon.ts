import Leaflet from 'leaflet';

import mapMarker from './marker.svg';
const mapIcon = Leaflet.icon({
    iconUrl: mapMarker,
    iconSize: [58, 68],
    iconAnchor: [29, 68],
    popupAnchor: [170, 2],
})

export default mapIcon