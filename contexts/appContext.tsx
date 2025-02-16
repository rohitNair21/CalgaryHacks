import { createContext, useState, type PropsWithChildren } from 'react';

type appContext = {
    userLanguage: string;
    setUserLanguage: (language: string) => void;
}
const AppContext = createContext<appContext | null>(null);

export const AppContextProvider = ({ children }: PropsWithChildren) => {
    const [userLanguage, setUserLanguage] = useState('');

    return (
        <AppContext.Provider value={{ userLanguage, setUserLanguage }}>
            {children}
        </AppContext.Provider>
    );
};

export default AppContext;