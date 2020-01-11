import React from 'react';
import Layout from './layout/index';
import './index.scss';
import { GlobalContextProvider } from './context/global';
import { setProd } from './common/utils/prod';

setProd(false);

const App: React.FC = () => {
  return (
    <div className="App">
      <GlobalContextProvider>
        <Layout />
      </GlobalContextProvider>
    </div>
  );
}

export default App;
