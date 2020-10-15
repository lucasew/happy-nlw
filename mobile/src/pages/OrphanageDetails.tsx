import React from 'react';
import {View, Text, StyleSheet} from 'react-native';

export default function OrphanageDetails() {
    return (
        <View style={styles.text}>
            <Text>Detalhes do orfanato</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    text: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    }
})