// frontend/src/components/Sidebar.jsx
import React from 'react';
import { Nav } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { useAuth } from '../context/AuthContext';

const Sidebar = () => {
    const { user } = useAuth(); // Get user to conditionally render links based on role

    // Basic styling for the sidebar, can be moved to a CSS file
    const sidebarStyle = {
        position: 'fixed',
        top: '56px', // Adjust based on Navbar height
        left: 0,
        bottom: 0,
        width: '250px', // Or use Bootstrap's col classes
        padding: '20px',
        backgroundColor: '#f8f9fa', // Light grey background
        borderRight: '1px solid #dee2e6'
    };

    // A more dynamic way to handle roles, assuming user.roles is an array of strings like ["ROLE_ADMIN"]
    const isAdmin = user?.roles?.includes('ROLE_ADMIN');
    const isUser = user?.roles?.includes('ROLE_USER');


    return (
        <div style={sidebarStyle}>
            <Nav className="flex-column">
                <LinkContainer to="/dashboard">
                    <Nav.Link>Dashboard</Nav.Link>
                </LinkContainer>

                {/* Links for all authenticated users */}
                {isUser && (
                    <>
                       {/* Example: <LinkContainer to="/my-assets">
                            <Nav.Link>My Assets</Nav.Link>
                        </LinkContainer> */}
                    </>
                )}

                {/* Links for ADMIN only */}
                {isAdmin && (
                    <>
                        <hr/>
                        <Nav.Item><small className="text-muted">Admin Menu</small></Nav.Item>
                        <LinkContainer to="/employees">
                            <Nav.Link>Employees</Nav.Link>
                        </LinkContainer>
                        <LinkContainer to="/hardware">
                            <Nav.Link>Hardware</Nav.Link>
                        </LinkContainer>
                        <LinkContainer to="/licenses">
                            <Nav.Link>Licenses</Nav.Link>
                        </LinkContainer>
                        <LinkContainer to="/web-accesses">
                            <Nav.Link>Web Accesses</Nav.Link>
                        </LinkContainer>
                        {/* <LinkContainer to="/users-management">
                            <Nav.Link>User Management</Nav.Link>
                        </LinkContainer> */}
                    </>
                )}
            </Nav>
        </div>
    );
};

export default Sidebar;
