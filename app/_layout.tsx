import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Redirect, Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/useColorScheme';
import { AuthContextProvider } from '@/contexts/authContext';
import { ChatsContextProvider } from '@/contexts/chatsContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import useAppContext from '@/hooks/useAppContext';
import { AppContextProvider } from '@/contexts/appContext';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);


  const { userLanguage, setUserLanguage } = useAppContext();

  useEffect(() => {
    const getUserLanguage = async () => {
      const userLanguage = await AsyncStorage.getItem('userLanguage');
      if (userLanguage) {
        setUserLanguage(userLanguage);
      }
    };
    getUserLanguage();
  }, []);

  if (!loaded) {
    return null;
  }

  if (userLanguage)
    return <Redirect href="/community" />

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <AuthContextProvider>
        <ChatsContextProvider>
          <Stack>
            <Stack.Screen name="index" options={{ headerShown: false }} />
            <Stack.Screen name="choose_language" options={{ headerShown: false }} />
            <Stack.Screen name="login" options={{ headerShown: false }} />
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="chat" options={{ headerShown: false }} />
            <Stack.Screen name="+not-found" />
          </Stack>
          <StatusBar style="auto" />
        </ChatsContextProvider>
      </AuthContextProvider>
    </ThemeProvider>
  );
}

export default function Layout() {
  return (
    <AppContextProvider>
      <RootLayout />
    </AppContextProvider>
  )
}