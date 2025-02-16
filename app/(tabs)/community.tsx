import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const Community = () => {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Welcome to the Community Page</Text>
            <Text style={styles.description}>This is a basic homepage for the community posts.</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    description: {
        fontSize: 16,
        textAlign: 'center',
        paddingHorizontal: 20,
    },
});

export default Community;