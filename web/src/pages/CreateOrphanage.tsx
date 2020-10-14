import React, { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { Map, Marker, TileLayer } from 'react-leaflet';
import {useHistory} from 'react-router-dom';

import {FiDelete, FiPlus } from "react-icons/fi";

import '../styles/pages/create-orphanage.css';
import Sidebar from "../components/Sidebar";
import mapIcon from "../assets/mapIcon";
import { CommonSettings } from "../common";
import { LatLng, LeafletMouseEvent } from "leaflet";
import backend from "../services/backend";


export default function CreateOrphanage() {
  const history = useHistory()

  const [name, setName] = useState('')
  const [latitude, setLatitude] = useState(0)
  const [longitude, setLongitude] = useState(0)
  const [about, setAbout] = useState('')
  const [instructions, setInstructions] = useState('')
  const [opening_hours, setOpeningHours] = useState('')
  const [open_on_weekends, setOpenOnWeekends] = useState(true)
  const [images, setImages] = useState<File[]>([])

  function handleMapClick(event: LeafletMouseEvent) {
    const {
      latlng
    } = event
    setLatitude(latlng.lat)
    setLongitude(latlng.lng)
  }
  function handleSelectImages(event: ChangeEvent<HTMLInputElement>) {
    if (!event.target.files) return
    const newImageList = [...images, ...Array.from(event.target.files)]
    console.log(newImageList)
    setImages(newImageList)
    
  }
  function handleEvent<T, R>(transformer: (input: React.ChangeEvent<T>) => R) {
    return function(setState: (change: R) => void) {
      return function(event: React.ChangeEvent<T>) {
        const transformedEvent = transformer(event)
        setState(transformedEvent)
      }
    }
  }
  const handleTextInputEvent = handleEvent<HTMLInputElement,string>((ev) => ev.target.value)
  const handleTextareaEvent = handleEvent<HTMLTextAreaElement,string>((ev) => ev.target.value)
  function handleFormSubmit(event: FormEvent) {
    event.preventDefault()

    const paramsThatAreNotImage = {
      name,
      latitude,
      longitude,
      about,
      instructions,
      opening_hours,
      open_on_weekends,
    } as unknown as Record<string, string>
    const data = new FormData();
    Object.keys(paramsThatAreNotImage).forEach(param => {
      data.append(param, String(paramsThatAreNotImage[param]))
    })
    images.forEach(image => {
      data.append('images', image)
    })

    backend.post('/api/orphanages', data)
      .then(() => {
        alert("Cadastro realizado com sucesso!")
        history.push('/app')
      })
      .catch((err) => {
        if (err.response === undefined) {
          return alert("Erro ao comunicar com a API. Ela está rodando?")
        }
        const {
          data,
          status
        } = err.response
        if (status === 400) {
          return alert(`Erro de validação: ${data.error}`)
        }
        if (status === 500) {
          return alert(`Deu ruim: ${data.error}`)
        }
        alert("Erro desconhecido")
      })
    console.log({
      images
    })
  }
  return (
    <div id="page-create-orphanage">
      <Sidebar/>
      <main>
        <form className="create-orphanage-form">
          <fieldset>
            <legend>Dados</legend>

            <Map 
              center={CommonSettings.mapCenter as unknown as LatLng} 
              style={{ width: '100%', height: 280 }}
              zoom={CommonSettings.mapZoom}
              onClick={handleMapClick}
            >
              <TileLayer url="https://a.tile.openstreetmap.org/{z}/{x}/{y}.png" />
              {
                latitude !== 0 && (
                  <Marker 
                    interactive={false} 
                    icon={mapIcon} 
                    position={[latitude, longitude]} 
                  />
                )
              }
            </Map>

            <div className="input-block">
              <label htmlFor="name">Nome</label>
              <input 
                id="name" 
                value={name} 
                onChange={handleTextInputEvent(setName)} 
              />
            </div>

            <div className="input-block">
              <label htmlFor="about">Sobre <span>Máximo de 300 caracteres</span></label>
              <textarea 
                id="name" 
                maxLength={300} 
                value={about} 
                onChange={handleTextareaEvent(setAbout)} 
              />
            </div>

            <div className="input-block">
              <label htmlFor="images">Fotos</label>

              <div className="images-container">
                {images.map(function (image, key) {
                    return (
                        <img 
                          key={key}
                          onClick={() => {
                            const newImages = images.filter((image, index) => index !== key)
                            setImages(newImages)
                          }}
                          src={URL.createObjectURL(image)} 
                          alt="Imagem a ser enviada"
                        />
                    )
                })}
                <label htmlFor="image[]" className="new-image">
                  <FiPlus size={24} color="#15b6d6" />
                </label>
                <input multiple onChange={handleSelectImages} type="file" id="image[]"/>
              </div>
            </div>
          </fieldset>

          <fieldset>
            <legend>Visitação</legend>

            <div className="input-block">
              <label htmlFor="instructions">Instruções</label>
              <textarea 
                id="instructions" 
                value={instructions} 
                onChange={handleTextareaEvent(setInstructions)} 
              />
            </div>

            <div className="input-block">
              <label htmlFor="opening_hours">Horário de atendimento</label>
              <input 
                id="opening_hours" 
                value={opening_hours} 
                onChange={handleTextInputEvent(setOpeningHours)} 
              />
            </div>

            <div className="input-block">
              <label htmlFor="open_on_weekends">Atende fim de semana</label>

              <div className="button-select">
                <button 
                  type="button" 
                  onClick={() => setOpenOnWeekends(true)}
                  className={open_on_weekends ? "active" : ""}
                >
                  Sim
                </button>
                <button 
                  type="button" 
                  onClick={() => setOpenOnWeekends(false)}
                  className={!open_on_weekends ? "active" : ""}
                >
                  Não
                </button>
              </div>
            </div>
          </fieldset>

          <button className="confirm-button" type="button" onClick={handleFormSubmit}>
            Confirmar
          </button>
        </form>
      </main>
    </div>
  );
}

// return `https://a.tile.openstreetmap.org/${z}/${x}/${y}.png`;
