import React from 'react';
import { BrowserRouter, Route } from 'react-router-dom';
import Layout from './layout/index';
import Home from './pages/home/index';
import './index.scss';
import { GlobalContextProvider } from './context/global';
import { setProd } from './common/utils/prod';
import Login from './pages/login';

setProd(false);

const App: React.FC = () => {
  return (
    <div className="App">
      <GlobalContextProvider>
        <BrowserRouter>
          <Route exact path="/" component={Home}/>
          <Route exact path="/login" component={Login}/>
          <Route exact path="/layout" component={Layout}/>
        </BrowserRouter>
      </GlobalContextProvider>
    </div>
  );
}

export default App;
