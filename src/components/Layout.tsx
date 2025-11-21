import React from 'react';
import Sidebar from './Sidebar';
import Explorer from './Explorer';

const Layout: React.FC = () => {
    return (
        <div className="app-container">
            <Sidebar />
            <Explorer />
        </div>
    );
};

export default Layout;
