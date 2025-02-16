import { createContext, type PropsWithChildren } from "react";
import * as SecureStore from 'expo-secure-store'
import { Platform } from 'react-native'
import { TokenCache } from '@clerk/clerk-expo/dist/cache'
import { ClerkLoaded, ClerkProvider, useUser } from "@clerk/clerk-expo";
import { AuthenticatedUser } from "@/lib/types/user";

const createTokenCache = (): TokenCache => {
    return {
        getToken: async (key: string) => {
            try {
                const item = await SecureStore.getItemAsync(key)
                if (item) {
                    console.log(`${key} was used 🔐 \n`)
                } else {
                    console.log('No values stored under key: ' + key)
                }
                return item
            } catch (error) {
                console.error('secure store get item error: ', error)
                await SecureStore.deleteItemAsync(key)
                return null
            }
        },
        saveToken: (key: string, token: string) => {
            return SecureStore.setItemAsync(key, token)
        },
    }
}

// SecureStore is not supported on the web
export const tokenCache = Platform.OS !== 'web' ? createTokenCache() : undefined

type authContext = {
    user: AuthenticatedUser | null
}
const AuthContext = createContext<authContext | null>(null);

function Provider({ children }: PropsWithChildren) {
    const { user: clerkUser } = useUser();

    const user = clerkUser ? {
        id: clerkUser.id,
        email: clerkUser.emailAddresses[0].emailAddress,
        name: clerkUser.fullName!,
        username: clerkUser.username!
    } : null;

    return (
        <AuthContext.Provider value={{ user }}>
            {children}
        </AuthContext.Provider>
    )
}

export function AuthContextProvider({ children }: PropsWithChildren) {
    return (
        <ClerkProvider
            tokenCache={tokenCache}
            publishableKey={process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY!}
        >
            <ClerkLoaded>
                <Provider>
                    {children}
                </Provider>
            </ClerkLoaded>
        </ClerkProvider>
    )
}

export default AuthContext;