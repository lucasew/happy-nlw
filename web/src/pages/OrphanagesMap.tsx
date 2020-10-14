import React, {useEffect, useState} from 'react';
import {Link} from 'react-router-dom';
import {FiArrowRight, FiArrowRightCircle, FiPlus} from 'react-icons/fi';
import {Map, TileLayer, Marker, Popup} from 'react-leaflet';

import mapMarker from '../assets/marker.svg';
import '../styles/pages/orphanages-map.css';
import mapIcon from '../assets/mapIcon';
import backend from '../services/backend';
import OrphanageModel from '../models/Orphanage'
import ApiResult from '../models/ApiResult';
import { CommonSettings } from '../common';
import { LatLng } from 'leaflet';

function OrphanagesMap() {
    const [orphanages, setOrphanages] = useState<OrphanageModel[]>([])
    useEffect(() => {
       backend.get<ApiResult<OrphanageModel[]>>('/api/orphanages').then(response => {
           setOrphanages(response.data.data)
       }) 
    }, [])

    return (
        <div id="page-map">
            <aside>
                <header>
                    <Link to="/">
                        <img src={mapMarker} alt="Marcador de localização"/>
                    </Link>
                    <h2>Escolha um orfanato no mapa</h2>
                    <p>Muitas crianças esperando sua visita :)</p>
                </header>
                <footer>
                    <strong>{CommonSettings.city}</strong>
                    <br/>
                    <span>{CommonSettings.uf}</span>
                </footer>
            </aside>
            <Map
                center={CommonSettings.mapCenter as unknown as LatLng}
                zoom={CommonSettings.mapZoom}
                style={{
                    width: "100%", height: "100%"
                }}
            >
                <TileLayer url="https://a.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                {/* <TileLayer url={`https://api.mapbox.com/styles/v1/mapbox/light-v10/tiles/256/{z}/{x}/{y}@2x?access_token=${process.env.REACT_APP_MAPBOX_TOKEN}`} /> */}

                {orphanages.map(function (orphanage) {
                    const {
                        id,
                        latitude,
                        longitude,
                        name,
                    } = orphanage
                    return (
                        <Marker
                            position={[latitude, longitude]}
                            icon={mapIcon}
                            key={id}
                        >
                            <Popup closeButton={false} minWidth={240} maxWidth={240} className="map-popup">
                                <h1>{name}</h1>
                                <Link to={`/orphanages/${id}`}>
                                    <FiArrowRight size={32} color="#FFF" />
                                </Link>
                            </Popup>
                        </Marker>
                    )
                })}
            </Map>

            <Link to="/orphanages/create" className="create-orphanage" >
                <FiPlus size={32} color="#FFF" />                
            </Link>
        </div>
    )
}

export default OrphanagesMap