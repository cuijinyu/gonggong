import React, { useContext, FC, useState } from 'react';

type GlobalContextType = {
    ast: string,
    setAst: (ast: string) => string
}

const GlobalContext = React.createContext({});

const GlobalContextProvider: FC = ({ children }) => {
    const [ast, setAst] = useState<string>('');
    return (
        <GlobalContext.Provider value={{
            ast,
            setAst
        }}>
            {children}
        </GlobalContext.Provider>
    )
}

const useGlobalContext = function() {
    return useContext<GlobalContextType>(GlobalContext as any as React.Context<GlobalContextType>);
}

export {
    GlobalContext,
    GlobalContextProvider,
    useGlobalContext
}