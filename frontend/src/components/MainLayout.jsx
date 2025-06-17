// frontend/src/components/MainLayout.jsx
import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import AppNavbar from './Navbar';
import Sidebar from './Sidebar';
import { Container } from 'react-bootstrap';

const MainLayout = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth >= 992);

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < 992) {
                setIsSidebarOpen(false);
            } else {
                setIsSidebarOpen(true);
            }
        };
        window.addEventListener('resize', handleResize);
        if (window.innerWidth < 992) { // Initial check
            setIsSidebarOpen(false);
        }
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return (
        <div>
            <AppNavbar toggleSidebar={toggleSidebar} />
            <Sidebar isOpen={isSidebarOpen} />
            <main
                className="main-layout-content"
                style={{
                    paddingLeft: (isSidebarOpen && window.innerWidth >= 992) ? '270px' : '20px'
                }}
            >
                <Container fluid className="pt-3">
                    <Outlet />
                </Container>
            </main>
        </div>
    );
};
export default MainLayout;
