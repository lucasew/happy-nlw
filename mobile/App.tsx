
import React from 'react';

import { useFonts } from 'expo-font';
import {
    Nunito_600SemiBold, 
    Nunito_700Bold, 
    Nunito_800ExtraBold
} from '@expo-google-fonts/nunito'
import Routes from './src/routes';
import Loading from './src/components/Loading';

export default function App() {
    const [fontsLoaded] =  useFonts({
        Nunito_600SemiBold, 
        Nunito_700Bold, 
        Nunito_800ExtraBold
    })
    if (!fontsLoaded) {
        return <Loading text="Happy"/>
    } else {
        return <Routes />
    }
}