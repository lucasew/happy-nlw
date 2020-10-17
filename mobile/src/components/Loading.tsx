import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';

import mapMarker from '../../assets/marker.png';

interface LoadingProps {
    text: string
}

const Loading: React.FC<LoadingProps> = (props) => {
    return (
        <View style={styles.loadingContainer}>
            <Image source={mapMarker} />
            <Text style={styles.loadingText}>{props.text}</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
    },
    loadingText: {
        fontFamily: 'Nunito_600SemiBold',
        fontSize: 24,
        padding: 20,
        textAlign: "center",
        marginHorizontal: 20
    }
})

export default Loading