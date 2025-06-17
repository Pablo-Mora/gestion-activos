// frontend/src/components/MainLayout.jsx
import React from 'react';
import { Outlet } from 'react-router-dom';
import AppNavbar from './Navbar';
import Sidebar from './Sidebar';
import { Container } from 'react-bootstrap';

const MainLayout = () => {
    // Basic styling for the main content area
    const mainContentStyle = {
        paddingTop: '76px', // Navbar height + some padding
        paddingLeft: '270px', // Sidebar width + some padding
        paddingRight: '20px',
        paddingBottom: '20px',
        width: '100%'
    };

    return (
        <div>
            <AppNavbar />
            <Sidebar />
            <main style={mainContentStyle}>
                <Container fluid>
                    <Outlet /> {/* Child routes will render here */}
                </Container>
            </main>
        </div>
    );
};

export default MainLayout;
