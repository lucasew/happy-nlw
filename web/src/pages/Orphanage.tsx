import React, { useEffect, useState } from "react";
import { FaWhatsapp } from "react-icons/fa";
import { FiClock, FiInfo} from "react-icons/fi";
import { Map, Marker, TileLayer } from "react-leaflet";
import {useParams} from 'react-router-dom';

import '../styles/pages/orphanage.css';
import Sidebar from "../components/Sidebar";
import mapIcon from "../assets/mapIcon";
import { CommonSettings } from "../common";
import backend, { appendToBackendBaseURL } from "../services/backend";
import ApiResult from "../models/ApiResult";
import OrphanageModel from "../models/Orphanage";

export default function Orphanage() {
  const {id} = useParams<{id: string}>()
  const [orphanage, setOrphanage] = useState<OrphanageModel>({
    name: "Carregando...",
    about: "Carregando...",
    id: Number(id),
    images: [],
    instructions: "Carregando...",
    latitude: CommonSettings.mapCenter[0],
    longitude: CommonSettings.mapCenter[1],
    open_on_weekends: false,
    opening_hours: "Carregando..."
  })
  const [selectedImage, setSelectedImage] = useState(0)

  useEffect(() => {
    backend.get<ApiResult<OrphanageModel>>(`/api/orphanages/${id}`)
      .then(result => {
        setOrphanage(result.data.data)
      }).catch((err) => {
        console.log(err)
        if (err.response === undefined) {
          // API fora
          return setOrphanage({
            name: "Não foi possível conectar ao servidor",
            about: ":(",
            id: Number(id),
            instructions: "",
            images: [],
            latitude: CommonSettings.mapCenter[0],
            longitude: CommonSettings.mapCenter[1],
            open_on_weekends: false,
            opening_hours: "Não consigo consultar"
          })
        }
        const {
          data,
          status
        } = err.response
        if (status === 404) {
          setOrphanage({
            name: "Local não encontrado",
            about: ":(",
            id: Number(id),
            instructions: "",
            images: [],
            latitude: CommonSettings.mapCenter[0],
            longitude: CommonSettings.mapCenter[1],
            open_on_weekends: false,
            opening_hours: "Sem horários de atendimento"
          })
        } else {
          setOrphanage({
            name: "Erro de servidor",
            about: `Houve um erro de servidor ao obter os dados: ${status} ${data.error as string}`,
            id: Number(id),
            instructions: "",
            images: [],
            latitude: CommonSettings.mapCenter[0],
            longitude: CommonSettings.mapCenter[1],
            open_on_weekends: false,
            opening_hours: ""
          })
        }
      })
  }, [id])
  return (
    <div id="page-orphanage">
      <Sidebar />
      <main>
        <div className="orphanage-details">
          <img src={(() => {
            if (selectedImage >= orphanage.images.length) {
              return "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAf8AAABjCAMAAACi/PkAAAAAA1BMVEX///+nxBvIAAAASElEQVR4nO3BMQEAAADCoPVPbQwfoAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA+BsYAAAF7hZJ0AAAAAElFTkSuQmCC"
            }
            return appendToBackendBaseURL(orphanage.images[selectedImage].url)
          })()} alt={orphanage.name}/>

          <div className="images">
            {
              orphanage.images.map((image, index) => {
                return (
                  <button 
                    key={index} 
                    className={index === selectedImage ? "active" : ""}
                    onClick={() => {
                      setSelectedImage(index)
                    }}
                  >
                    <img src={appendToBackendBaseURL(image.url)} alt={orphanage.name}/>
                  </button>
                )
              })
            }
          </div>
          
          <div className="orphanage-details-content">
            <h1>{orphanage.name}</h1>
            <p>{orphanage.about}</p>

            <div className="map-container">
              <Map 
                center={[orphanage.latitude, orphanage.longitude]} 
                zoom={17} 
                style={{ width: '100%', height: 280 }}
                dragging={false}
                touchZoom={false}
                zoomControl={false}
                scrollWheelZoom={false}
                doubleClickZoom={false}
              >
                <TileLayer url="https://a.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                <Marker interactive={false} icon={mapIcon} position={[orphanage.latitude, orphanage.longitude]} />
              </Map>

              <footer>
                <a target="_blank" rel="noopener noreferrer" href={`https://www.google.com/maps/dir/?api=1&destination=${orphanage.latitude},${orphanage.longitude}`}>Ver rotas no Google Maps</a>
              </footer>
            </div>

            <hr />

            <h2>Instruções para visita</h2>
            <p>{orphanage.instructions}</p>

            <div className="open-details">
              <div className="hour">
                <FiClock size={32} color="#15B6D6" />
                {orphanage.opening_hours}
              </div>
                {
                orphanage.open_on_weekends
                  ? (
                    <div className="open-on-weekends">
                      <FiInfo size={32} color="#39CC83" />
                      Atendemos fim de semana
                    </div>
                  ) : (
                    <div className="open-on-weekends dont-open">
                      <FiInfo size={32} color="#FF669D" />
                      Não atendemos fim de semana
                    </div>
                  )
                }
            </div>

            {/* <button type="button" className="contact-button">
              <FaWhatsapp size={20} color="#FFF" />
              Entrar em contato
            </button> */}
          </div>
        </div>
      </main>
    </div>
  );
}