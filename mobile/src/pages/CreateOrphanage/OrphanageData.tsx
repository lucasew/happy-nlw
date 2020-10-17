import React, { useEffect, useState } from 'react';
import { ScrollView, View, StyleSheet, Switch, Text, TextInput, TouchableOpacity, NativeSyntheticEvent, TextInputChangeEventData, Image } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { RectButton } from 'react-native-gesture-handler';
import { useNavigation, useRoute } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';

import backend from '../../../services/backend';
import { LatLng } from 'react-native-maps';
import Header from '../../components/Header';

interface RouteParams {
  position: LatLng
}

export default function OrphanageData() {
  const {goBack, navigate} = useNavigation()
  const params = useRoute().params as RouteParams
  if (params.position === undefined) {
    goBack()
  }

  const [name, setName] = useState('')
  const [about, setAbout] = useState('')
  const [instructions, setInstructions] = useState('')
  const [opening_hours, setOpeningHours] = useState('')
  const [open_on_weekends, setOpenOnWeekends] = useState(true)
  const [images, setImages] = useState<string[]>([])

  async function handleSelectImages() {
    const {status} = await ImagePicker.requestCameraRollPermissionsAsync();
    if (status !== 'granted') {
      alert('Acesso a galeria de fotos negado')
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      quality: 1,
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
    })
    if (result.cancelled) return

    const {uri} = result
    setImages([...images, uri])
  }

  async function handleCreateOrphanage() {
    const values = {
      latitude: params.position.latitude,
      longitude: params.position.longitude,
      name, about, instructions, opening_hours, 
      open_on_weekends, images
    } as unknown as Record<string, string>

    const data = new FormData();
    Object.keys(values).forEach((key) => {
      data.append(key, String(values[key]))
    })

    images.forEach((image) => {
      const extension = image.split('.').pop()
      const name = image.split('/').pop()
      // Espero nunca cair nesses cases xD
      if (extension === undefined) {
        throw "Imagem recebida não tem extensão"
      }
      if (name === undefined) {
        throw "Imagem recebida não tem nome"
      }
      const type = `image/${extension}`
      const uri = image
      const file = {
        name,
        uri,
        type
      } as any
      console.log(file)
      data.append('images', file)
      // Diego diz que esse problema de tipagem é conhecido
      // Então tá, né
    })

    const result = await backend.post('/api/orphanages', data)
    console.log(result)
    navigate('OrphanagesMap', {update: true})
  }

  return (
    <>
      <Header title="Informe os dados"/>
      <ScrollView style={styles.container} contentContainerStyle={{ padding: 24 }}>
        <Text style={styles.title}>Dados</Text>

        <Text style={styles.label}>Nome</Text>
        <TextInput
          value={name}
          onChangeText={setName}
          style={styles.input}
        />

        <Text style={styles.label}>Sobre</Text>
        <TextInput
          value={about}
          onChangeText={setAbout}
          style={[styles.input, { height: 110 }]}
          multiline
        />

        {/* <Text style={styles.label}>Whatsapp</Text>
        <TextInput
          style={styles.input}
        /> */}

        <Text style={styles.label}>Fotos</Text>
        <View style={styles.uploadedImagesContainer}>
          {images.map((image) => {
            return (
              <Image
                key={image}
                source={{uri: image}}
                style={styles.uploadedImage}
              />
            )
          })}
        </View>
        <TouchableOpacity style={styles.imagesInput} onPress={handleSelectImages}>
          <Feather name="plus" size={24} color="#15B6D6" />
        </TouchableOpacity>

        <Text style={styles.title}>Visitação</Text>

        <Text style={styles.label}>Instruções</Text>
        <TextInput
          value={instructions}
          onChangeText={setInstructions}
          style={[styles.input, { height: 110 }]}
          multiline
        />

        <Text style={styles.label}>Horario de visitas</Text>
        <TextInput
          value={opening_hours}
          onChangeText={setOpeningHours}
          style={styles.input}
        />

        <View style={styles.switchContainer}>
          <Text style={styles.label}>Atende final de semana?</Text>
          <Switch 
            thumbColor="#fff" 
            trackColor={{ false: '#ccc', true: '#39CC83' }}
            value={open_on_weekends}
            onValueChange={setOpenOnWeekends}
          />
        </View>

        <RectButton style={styles.nextButton} onPress={handleCreateOrphanage}>
          <Text style={styles.nextButtonText}>Cadastrar</Text>
        </RectButton>
      </ScrollView>
    </>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  title: {
    color: '#5c8599',
    fontSize: 24,
    fontFamily: 'Nunito_700Bold',
    marginBottom: 32,
    paddingBottom: 24,
    borderBottomWidth: 0.8,
    borderBottomColor: '#D3E2E6'
  },

  label: {
    color: '#8fa7b3',
    fontFamily: 'Nunito_600SemiBold',
    marginBottom: 8,
  },

  comment: {
    fontSize: 11,
    color: '#8fa7b3',
  },

  input: {
    backgroundColor: '#fff',
    borderWidth: 1.4,
    borderColor: '#d3e2e6',
    borderRadius: 20,
    height: 56,
    paddingVertical: 18,
    paddingHorizontal: 24,
    marginBottom: 16,
    textAlignVertical: 'top',
  },
  uploadedImagesContainer: {
    flexDirection: 'row'
  },
  uploadedImage: {
    width: 64,
    height: 64,
    borderRadius: 20,
    marginBottom: 32,
    marginRight: 8,
  },
  imagesInput: {
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    borderStyle: 'dashed',
    borderColor: '#96D2F0',
    borderWidth: 1.4,
    borderRadius: 20,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 32,
  },

  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 16,
  },

  nextButton: {
    backgroundColor: '#15c3d6',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    height: 56,
    marginTop: 32,
  },

  nextButtonText: {
    fontFamily: 'Nunito_800ExtraBold',
    fontSize: 16,
    color: '#FFF',
  }
})