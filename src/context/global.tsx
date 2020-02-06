import React, { useContext, FC, useState } from 'react';
import AstParser, { AstNodeType } from '../common/utils/ast';

type GlobalContextType = {
  ast: string;
  astTool: AstParser;
  setAst: (ast: string) => void;
};

const GlobalContext = React.createContext<GlobalContextType>({} as any);

const GlobalContextProvider: FC = ({ children }) => {
  const [ast, setAst] = useState<string>('{}');
  const [astTool, setAstTool] = useState<AstParser>(new AstParser(ast, setAst, at => setAstTool(at)));

  return (
    <GlobalContext.Provider
      value={{
        ast,
        astTool,
        setAst,
      }}>
      {children}
    </GlobalContext.Provider>
  );
};

const useGlobalContext = function() {
  return useContext<GlobalContextType>((GlobalContext as any) as React.Context<GlobalContextType>);
};

export { GlobalContext, GlobalContextProvider, useGlobalContext };
