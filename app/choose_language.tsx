import React, { useState } from 'react';
import { View, Text, TouchableOpacity, FlatList, Image, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import useAppContext from '@/hooks/useAppContext';

const languages = [
  { name: 'English', code: 'en', flag: require('@/assets/flags/uk.png') },
  { name: 'Spanish', code: 'es', flag: require('@/assets/flags/spain.png') },
  { name: 'French', code: 'fr', flag: require('@/assets/flags/france.png') },
  { name: 'Chinese', code: 'zh', flag: require('@/assets/flags/china.png') },
  { name: 'Hindi', code: 'hi', flag: require('@/assets/flags/india.png') },
  { name: 'German', code: 'de', flag: require('@/assets/flags/germany.png') },
  { name: 'Urdu', code: 'ur', flag: require('@/assets/flags/pakistan.png') },
  { name: 'Russian', code: 'ru', flag: require('@/assets/flags/russia.png') },
  { name: 'Filipino', code: 'tl', flag: require('@/assets/flags/philippines.png') },
  { name: 'Arabic', code: 'ar', flag: require('@/assets/flags/uae.png') },
];

const ChooseLanguage = () => {
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const router = useRouter();

  const { setUserLanguage } = useAppContext();

  const handleLanguageSelection = async () => {
    try {
      await AsyncStorage.setItem('userLanguage', selectedLanguage);
      setUserLanguage(selectedLanguage);
      router.push('/login');
    } catch (error) {
      console.error('Error saving language:', error);
    }
  };

  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingVertical: insets.top + 10 }]}>
      <Text style={styles.title}>Choose your language</Text>
      <FlatList
        data={languages}
        keyExtractor={(item) => item.code}
        numColumns={2}
        contentContainerStyle={styles.gridContainer}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[styles.languageButton, selectedLanguage === item.code && styles.selected]}
            onPress={() => setSelectedLanguage(item.code)}
          >
            <Image source={item.flag} style={styles.flag} />
            <Text style={styles.languageText}>{item.name}</Text>
          </TouchableOpacity>
        )}
      />
      <TouchableOpacity
        style={styles.nextButton}
        onPress={handleLanguageSelection}
      >
        <Text style={styles.nextText}>Next</Text>
      </TouchableOpacity>
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
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    fontFamily: 'Lexend_700Bold',
    marginBottom: 20,
  },
  gridContainer: {
    alignItems: 'center',
  },
  languageButton: {
    width: 130,
    height: 80,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    margin: 10,
  },
  selected: {
    borderColor: 'purple',
    borderWidth: 2,
  },
  flag: {
    width: 40,
    height: 25,
    marginBottom: 5,
    resizeMode: 'contain',
  },
  languageText: {
    fontSize: 14,
  },
  nextButton: {
    backgroundColor: '#800040',
    padding: 15,
    borderRadius: 30,
    marginTop: 20,
    width: '80%',
    alignItems: 'center',
  },
  nextText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    fontFamily: 'Lexend_700Bold',
  },
});

export default ChooseLanguage;
