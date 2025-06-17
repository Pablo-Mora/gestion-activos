// frontend/src/components/Sidebar.jsx
import React from 'react';
import { Nav } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { useAuth } from '../context/AuthContext';

const Sidebar = ({ isOpen }) => {
    const { user } = useAuth();
    const isAdmin = user?.roles?.includes('ROLE_ADMIN');
    const isUser = user?.roles?.includes('ROLE_USER');

    return (
        <div className={`app-sidebar ${isOpen ? '' : 'collapsed'}`}>
            <Nav className="flex-column">
                <LinkContainer to="/dashboard">
                    <Nav.Link>Dashboard</Nav.Link>
                </LinkContainer>

                {isUser && (
                    <LinkContainer to="/my-assets">
                        <Nav.Link>My Assigned Assets</Nav.Link>
                    </LinkContainer>
                )}

                {isAdmin && (
                    <>
                        <hr/>
                        <Nav.Item><small className="text-muted ps-2">Admin Menu</small></Nav.Item>
                        <LinkContainer to="/employees"><Nav.Link>Employees</Nav.Link></LinkContainer>
                        <LinkContainer to="/hardware"><Nav.Link>Hardware</Nav.Link></LinkContainer>
                        <LinkContainer to="/licenses"><Nav.Link>Licenses</Nav.Link></LinkContainer>
                        <LinkContainer to="/web-accesses"><Nav.Link>Web Accesses</Nav.Link></LinkContainer>
                    </>
                )}
            </Nav>
        </div>
    );
};
export default Sidebar;
