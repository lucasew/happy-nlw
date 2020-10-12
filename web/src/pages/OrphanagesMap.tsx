import React from 'react';
import {Link} from 'react-router-dom';
import {FiPlus} from 'react-icons/fi';
import {Map, TileLayer} from 'react-leaflet';

import mapMarker from '../assets/marker.svg';
import '../styles/pages/orphanages-map.css';
import 'leaflet/dist/leaflet.css';

function OrphanagesMap() {
    return (
        <div id="page-map">
            <aside>
                <header>
                    <img src={mapMarker} alt="Marcador de localização"/>
                    <h2>Escolha um orfanato no mapa</h2>
                    <p>Muitas crianças esperando sua visita :)</p>
                </header>
                <footer>
                    <strong>Marechal Cândido Rondon</strong>
                    <br/>
                    <span>Paraná</span>
                </footer>
            </aside>
            <Map
                center={[-24.5650212, -54.1019832]}
                zoom={12}
                style={{
                    width: "100%", height: "100%"
                }}
            >
                <TileLayer url="https://a.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                {/* <TileLayer url={`https://api.mapbox.com/styles/v1/mapbox/light-v10/tiles/256/{z}/{x}/{y}@2x?access_token=${process.env.REACT_APP_MAPBOX_TOKEN}`} /> */}
            </Map>

            <Link to="" className="create-orphanage" >
                <FiPlus size={32} color="#FFF" />                
            </Link>
        </div>
    )
}

export default OrphanagesMap