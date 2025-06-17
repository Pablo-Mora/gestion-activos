// frontend/src/components/Navbar.jsx
import React from 'react';
import { LinkContainer } from 'react-router-bootstrap';
import { Navbar, Nav, NavDropdown, Container, Button } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';

const AppNavbar = ({ toggleSidebar }) => {
    const { user, logout } = useAuth();

    const handleLogout = () => {
        logout();
    };

    return (
        <Navbar bg="dark" variant="dark" expand="lg" fixed="top" style={{zIndex: 1030}}>
            <Container fluid>
                 <Button
                    variant="outline-light"
                    onClick={toggleSidebar}
                    className="me-2 d-lg-none"
                    aria-label="Toggle sidebar"
                >
                    &#9776; {/* Unicode Menu Icon */}
                </Button>
                <LinkContainer to={user ? "/dashboard" : "/login"}>
                    <Navbar.Brand>ActivosTIC</Navbar.Brand>
                </LinkContainer>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="me-auto">
                        {user && (
                            <LinkContainer to="/dashboard">
                                <Nav.Link>Dashboard</Nav.Link>
                            </LinkContainer>
                        )}
                    </Nav>
                    <Nav>
                        {user ? (
                            <NavDropdown title={user.username || 'User'} id="basic-nav-dropdown" align="end">
                                <NavDropdown.Item onClick={handleLogout}>
                                    Logout
                                </NavDropdown.Item>
                            </NavDropdown>
                        ) : (
                            <LinkContainer to="/login">
                                <Nav.Link>Login</Nav.Link>
                            </LinkContainer>
                        )}
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
};
export default AppNavbar;
