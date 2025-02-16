import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useColorScheme } from '@/hooks/useColorScheme';
import ReactQueryProvider from '@/context/queryContext';
import { AuthContextProvider } from '@/contexts/authContext';
import { ChatsContextProvider } from '@/contexts/chatsContext';
import { AppContextProvider } from '@/contexts/appContext';

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <ReactQueryProvider>
        <AppContextProvider>
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
        </AppContextProvider>
      </ReactQueryProvider>
    </ThemeProvider>
  );
}