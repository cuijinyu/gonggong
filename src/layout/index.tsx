import React from 'react';
import Header from './header/index';
import Content from './content/content';
import LeftBar from './leftBar';
import RightBar from './rightBar';
import Footer from './footer';

const Layout: React.FC<{}> = function () {
    return (
        <div>
            <Header />
            <div>
                <LeftBar />
                    <Content />
                <RightBar />
            </div>
            <Footer></Footer>
        </div>
    );
}

export default Layout;