import { SearchBarData } from "@/lib/types";
import { createContext, type PropsWithChildren } from "react";
import { FormProvider, useForm } from "react-hook-form";

type contextObject = {
    clearSearchArea: () => void
};
const SearchBarContext = createContext<contextObject | null>(null);

export const SearchBarContextProvider = ({ children }: PropsWithChildren) => {
    const formContents = useForm<SearchBarData>({
        defaultValues: {
            searchTerm: ""
        }
    });

    const { resetField } = formContents;

    const clearSearchArea = () => {
        resetField("searchTerm");
    }

    return (
        <FormProvider {...formContents}>
            <SearchBarContext.Provider value={{ clearSearchArea }}>
                {children}
            </SearchBarContext.Provider>
        </FormProvider>
    );
};

export default SearchBarContext;