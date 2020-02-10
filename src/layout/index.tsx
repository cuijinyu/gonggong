import React from 'react';
import Header from './header/index';
import Content from './content/content';
import LeftBar from './leftBar';
import RightBar from './rightBar';
import Footer from './footer';
import './index.scss';
import { BEM } from '../common/utils/bem';
import ErrorBoundary from '../components/errorBoundary/errorBoundary';
import { DndProvider } from 'react-dnd';
import Backend from 'react-dnd-html5-backend';

const Layout: React.FC<{}> = function() {
  return (
    <DndProvider backend={Backend}>
      <div className={BEM('layout', 'wrapper')}>
        <Header />
        <div className={BEM('layout', 'middle')}>
          <LeftBar />
          <div className={BEM('layout', 'middleContent')}>
            <ErrorBoundary>
              <Content />
            </ErrorBoundary>
            <Footer />
          </div>
          <RightBar />
        </div>
      </div>
    </DndProvider>
  );
};

export default Layout;
