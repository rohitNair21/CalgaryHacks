import { createContext, useState, type PropsWithChildren } from 'react';

type appContext = {
    userLanguage: string | null;
    setUserLanguage: (language: string) => void;
}
const AppContext = createContext<appContext | null>(null);

export const AppContextProvider = ({ children }: PropsWithChildren) => {
    const [userLanguage, setUserLanguage] = useState<string | null>(null);

    return (
        <AppContext.Provider value={{ userLanguage, setUserLanguage }}>
            {children}
        </AppContext.Provider>
    );
};

export default AppContext;