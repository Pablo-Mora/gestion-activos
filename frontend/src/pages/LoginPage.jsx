// frontend/src/pages/LoginPage.jsx
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { Form, Button, Container, Row, Col, Card, Alert } from 'react-bootstrap';

const LoginPage = () => {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const { login } = useAuth();
    const navigate = useNavigate();
    const [loginError, setLoginError] = useState('');

    const onSubmit = async (data) => {
        setLoginError(''); // Clear previous errors
        try {
            await login(data.username, data.password);
            navigate('/dashboard'); // Navigate to dashboard on successful login
        } catch (error) {
            const errorMsg = error.response?.data?.message || error.message || 'Login failed. Please check your credentials.';
            setLoginError(errorMsg);
            console.error("Login error:", error);
        }
    };

    // Basic inline styles for centering the login card
    const pageStyle = {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh', // Full viewport height
        backgroundColor: '#f0f2f5' // A light background color
    };

    const cardStyle = {
        width: '100%',
        maxWidth: '400px'
    };


    return (
        <div style={pageStyle}>
            <Container>
                <Row className="justify-content-md-center align-items-center" style={{ minHeight: '80vh' }}>
                    <Col md={6} lg={5} xl={4}>
                        <Card className="shadow-sm p-4">
                            <Card.Body>
                                <h2 className="text-center mb-4">ActivosTIC Login</h2>
                                {loginError && <Alert variant="danger">{loginError}</Alert>}
                                <Form onSubmit={handleSubmit(onSubmit)}>
                                    <Form.Group className="mb-3" controlId="username">
                                        <Form.Label>Username</Form.Label>
                                        <Form.Control
                                            type="text"
                                            placeholder="Enter username"
                                            {...register("username", { required: "Username is required" })}
                                            isInvalid={!!errors.username}
                                        />
                                        <Form.Control.Feedback type="invalid">
                                            {errors.username?.message}
                                        </Form.Control.Feedback>
                                    </Form.Group>

                                    <Form.Group className="mb-3" controlId="password">
                                        <Form.Label>Password</Form.Label>
                                        <Form.Control
                                            type="password"
                                            placeholder="Password"
                                            {...register("password", { required: "Password is required" })}
                                            isInvalid={!!errors.password}
                                        />
                                        <Form.Control.Feedback type="invalid">
                                            {errors.password?.message}
                                        </Form.Control.Feedback>
                                    </Form.Group>

                                    <div className="d-grid">
                                        <Button variant="primary" type="submit" size="lg">
                                            Login
                                        </Button>
                                    </div>
                                </Form>
                                {/* Optional: Add links for password reset or registration if applicable
                                <div className="mt-3 text-center">
                                    <Link to="/forgot-password">Forgot Password?</Link>
                                </div>
                                */}
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </div>
    );
};

export default LoginPage;
