// frontend/src/pages/DashboardPage.jsx
import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Container, Row, Col, Card, Button, Alert } from 'react-bootstrap'; // Added Alert
import { Link } from 'react-router-dom';

const DashboardPage = () => {
    const { user } = useAuth();

    // Determine user role
    const isAdmin = user?.roles?.includes('ROLE_ADMIN');
    const isUser = user?.roles?.includes('ROLE_USER'); // General user role

    return (
        <Container fluid>
            <Row className="mb-4">
                <Col>
                    <h1>Dashboard</h1>
                    {user && <p className="lead">Welcome, {user.username}!</p>}
                </Col>
            </Row>

            {/* Admin Specific Content */}
            {isAdmin && (
                <Row className="mb-4">
                    <Col>
                        <Card>
                            <Card.Header as="h5">Admin Overview</Card.Header>
                            <Card.Body>
                                <Card.Text>
                                    As an administrator, you have full access to manage all IT assets, users, and system settings.
                                </Card.Text>
                                <Row>
                                    <Col md={3} className="mb-2">
                                        <Link to="/employees" className="d-grid text-decoration-none">
                                            <Button variant="primary">Manage Employees</Button>
                                        </Link>
                                    </Col>
                                    <Col md={3} className="mb-2">
                                        <Link to="/hardware" className="d-grid text-decoration-none">
                                            <Button variant="primary">Manage Hardware</Button>
                                        </Link>
                                    </Col>
                                    <Col md={3} className="mb-2">
                                        <Link to="/licenses" className="d-grid text-decoration-none">
                                            <Button variant="primary">Manage Licenses</Button>
                                        </Link>
                                    </Col>
                                    <Col md={3} className="mb-2">
                                        <Link to="/web-accesses" className="d-grid text-decoration-none">
                                            <Button variant="primary">Manage Web Accesses</Button>
                                        </Link>
                                    </Col>
                                    {/* Add more admin links or quick stats here */}
                                </Row>
                                <Card.Text className="mt-3">
                                    {/* Placeholder for future stats */}
                                    {/* Example: Total Employees: X, Total Hardware: Y */}
                                </Card.Text>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            )}

            {/* Regular User Specific Content (if not also an admin, or if specific user content is different) */}
            {isUser && !isAdmin && ( // Show this only if user is USER but not ADMIN (or adjust logic as needed)
                <Row className="mb-4">
                    <Col>
                        <Card>
                            <Card.Header as="h5">User Overview</Card.Header>
                            <Card.Body>
                                <Card.Text>
                                    Here you can view your assigned IT assets and manage your profile.
                                </Card.Text>
                                {/* Placeholder for user-specific actions/info */}
                                {/* Example:
                                <Link to="/my-assets">
                                    <Button variant="info">View My Assigned Assets</Button>
                                </Link>
                                <Link to="/my-acta" className="ms-2">
                                    <Button variant="secondary">Download My Acta</Button>
                                </Link>
                                */}
                                <Alert variant="info">
                                    Your specific asset information will be displayed here soon.
                                </Alert>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            )}

            {/* Content for users who might have both roles or a generic message */}
            {isUser && isAdmin && (
                 <Row className="mb-4">
                    <Col>
                        <Alert variant="light">
                            You are logged in as an Administrator. You have access to all system functionalities.
                        </Alert>
                    </Col>
                </Row>
            )}


            {/* General Information or other widgets can go here */}
            <Row>
                <Col>
                    <Card>
                        <Card.Body>
                            <Card.Title>System Status</Card.Title>
                            <Card.Text>
                                All systems are currently operational.
                                {/* This is a placeholder. Real status might come from an API. */}
                            </Card.Text>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default DashboardPage;
