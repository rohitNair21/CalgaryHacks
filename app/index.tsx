import { useEffect } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, Pressable } from 'react-native';
import { Link, Redirect } from 'expo-router';
import { useFonts, Lexend_400Regular, Lexend_700Bold } from '@expo-google-fonts/lexend';
import AsyncStorage from '@react-native-async-storage/async-storage';
import useAppContext from '@/hooks/useAppContext';

const LandingPage = () => {
    const [fontsLoaded] = useFonts({ Lexend_400Regular, Lexend_700Bold });

    const { userLanguage, setUserLanguage } = useAppContext();

    useEffect(() => {
        const getUserLanguage = async () => {
            const userLanguage = await AsyncStorage.getItem('userLanguage');
            if (userLanguage)
                setUserLanguage(userLanguage);
            else
                setUserLanguage('');
        };
        getUserLanguage();
    }, []);

    if (!fontsLoaded || userLanguage === null) {
        return <View />;
    }

    if (userLanguage)
        return <Redirect href="/community" />

    return (
        <View style={styles.container}>
            <Text style={styles.welcomeText}>Welcome to</Text>
            <Text style={styles.brandName}>SafeHaven</Text>
            <Text style={styles.description}>
                A secure and supportive space for those seeking help and guidance. Connect with others and find trusted resources
                with real-time translation for seamless communication.
            </Text>
            <TouchableOpacity style={styles.getStartedButton}>
                <Link replace href="/choose_language" asChild>
                    <Pressable>
                        <Text style={styles.getStartedText}>Get started →</Text>
                    </Pressable>
                </Link>
            </TouchableOpacity>
            <Image
                source={require('@/assets/images/hug.png')}
                style={styles.image}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#fff',
        paddingHorizontal: 20,
    },
    welcomeText: {
        fontSize: 25,
        fontFamily: 'Lexend_700Bold',
        color: '#000',
    },
    brandName: {
        fontSize: 28,
        fontFamily: 'Lexend_700Bold',
        color: '#800040',
    },
    description: {
        textAlign: 'center',
        fontSize: 16,
        color: '#666',
        marginVertical: 15,
        paddingHorizontal: 10,
    },
    getStartedButton: {
        backgroundColor: '#800040',
        paddingVertical: 15,
        paddingHorizontal: 30,
        borderRadius: 30,
        marginTop: 20,
    },
    getStartedText: {
        color: '#fff',
        fontSize: 18,
    },
    image: {
        width: 200,
        height: 200,
        resizeMode: 'contain',
        position: 'absolute',
        bottom: 0,
    },
});

export default LandingPage;
