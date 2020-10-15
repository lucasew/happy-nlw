import React from 'react';
import {View, Text, StyleSheet} from 'react-native';

export default function OrphanageCreate() {
    return (
        <View style={styles.text}>
            <Text>Criar orfanato</Text>
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