import React, { useEffect, useState } from 'react';
import { BrowserRouter, Route } from 'react-router-dom';
import Layout from './layout/index';
import Home from './pages/home/index';
import './index.scss';
import { GlobalContextProvider } from './context/global';
import { setProd } from './common/utils/prod';
import Login from './pages/login';
import { DndProvider, DropTarget } from 'react-dnd';
import Backend from 'react-dnd-html5-backend';
import EventManager from './eventManager';
import ProjectPage from './pages/project';
import { Dropdown, Menu } from 'antd';

setProd(false);

document.oncontextmenu = function(e) {
  return false;
};

type Position = {
  x: number;
  y: number;
};

const App: React.FC = () => {
  const [position, setPosition] = useState<Position>({
    x: 0,
    y: 0,
  });
  const [showRenderContextMenu, setShowRenderContextMenu] = useState<boolean>(false);
  useEffect(() => {
    EventManager.listen('render-content-contextMenu', (info: { position: Position; item: any }) => {
      setPosition({
        ...info.position,
      });
      setShowRenderContextMenu(true);
    });

    document.addEventListener('click', () => {
      setShowRenderContextMenu(false);
    });
  }, []);

  return (
    <DndProvider backend={Backend}>
      <div className="App">
        <GlobalContextProvider>
          <BrowserRouter>
            <Route exact path="/" component={Home} />
            <Route exact path="/login" component={Login} />
            <Route exact path="/layout" component={Layout} />
            <Route exact path="/project" component={ProjectPage} />
          </BrowserRouter>
        </GlobalContextProvider>
        <Dropdown
          visible={showRenderContextMenu}
          overlay={
            <Menu>
              <Menu.Item key="1">编辑物料</Menu.Item>
              <Menu.Item key="2">复制物料</Menu.Item>
              <Menu.Item key="3">删除物料</Menu.Item>
            </Menu>
          }>
          <div
            style={{
              position: 'absolute',
              top: position.y,
              left: position.x,
            }}
          />
        </Dropdown>
      </div>
    </DndProvider>
  );
};

export default App;
