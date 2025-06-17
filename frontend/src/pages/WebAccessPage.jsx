// frontend/src/pages/WebAccessPage.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import AssetService from '../services/assetService';
import { Table, Button, Modal, Form, Container, Row, Col, Alert } from 'react-bootstrap';

const WebAccessPage = () => {
    const [webAccesses, setWebAccesses] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [editingWebAccess, setEditingWebAccess] = useState(null);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    // const [employees, setEmployees] = useState([]); // For employee dropdown

    const { register, handleSubmit, reset, setValue, formState: { errors: formErrors } } = useForm();

    const fetchWebAccesses = useCallback(async () => {
        setLoading(true);
        setError('');
        try {
            const response = await AssetService.getAllWebAccesses();
            setWebAccesses(response.data);
        } catch (err) {
            setError('Failed to fetch web accesses. ' + (err.response?.data?.message || err.message));
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, []);

    // const fetchEmployeesForDropdown = useCallback(async () => { /* ... */ }, []);

    useEffect(() => {
        fetchWebAccesses();
        // fetchEmployeesForDropdown();
    }, [fetchWebAccesses/*, fetchEmployeesForDropdown*/]);

    const handleCloseModal = () => {
        setShowModal(false);
        setEditingWebAccess(null);
        reset();
        setError('');
    };

    const handleShowCreateModal = () => {
        setEditingWebAccess(null);
        reset({ serviceName: '', url: '', accessUsername: '', accessPassword: '', assignedEmployeeId: '' });
        setShowModal(true);
    };

    const handleShowEditModal = (webAccess) => {
        setEditingWebAccess(webAccess);
        setValue('serviceName', webAccess.serviceName);
        setValue('url', webAccess.url);
        setValue('accessUsername', webAccess.accessUsername);
        // Password field: For editing, it's often best to require re-entry or have a separate "change password" flow.
        // For this implementation, we'll clear it and make it required if they want to set/change it.
        // Or, make it optional on edit: "Leave blank to keep current password" - but DTO expects it.
        // Let's assume for now if they edit, they must provide the password again (or a new one).
        setValue('accessPassword', ''); // Or prefill if that's desired and backend handles it well
        setValue('assignedEmployeeId', webAccess.assignedEmployeeId || '');
        setShowModal(true);
    };

    const onSubmit = async (data) => {
        setError('');
        const payload = {
            ...data,
            assignedEmployeeId: data.assignedEmployeeId ? parseInt(data.assignedEmployeeId, 10) : null,
        };

        // If editing and password is blank, we might not want to send it.
        // However, the DTO on backend likely expects 'accessPassword'.
        // For simplicity now, it will be sent. A real app might need more complex logic
        // if (editingWebAccess && !payload.accessPassword) {
        //     delete payload.accessPassword; // Don't send if blank during edit
        // }


        try {
            if (editingWebAccess) {
                await AssetService.updateWebAccess(editingWebAccess.id, payload);
            } else {
                await AssetService.createWebAccess(payload);
            }
            fetchWebAccesses();
            handleCloseModal();
        } catch (err) {
            setError('Failed to save web access. ' + (err.response?.data?.message || err.message));
            console.error(err);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this web access?')) {
            setError('');
            try {
                await AssetService.deleteWebAccess(id);
                fetchWebAccesses();
            } catch (err) {
                setError('Failed to delete web access. ' + (err.response?.data?.message || err.message));
                console.error(err);
            }
        }
    };

    return (
        <Container fluid>
            <Row className="my-3">
                <Col>
                    <h2>Manage Web Accesses</h2>
                </Col>
                <Col className="text-end">
                    <Button variant="primary" onClick={handleShowCreateModal}>
                        Add New Web Access
                    </Button>
                </Col>
            </Row>

            {loading && <Alert variant="info">Loading web accesses...</Alert>}
            {!loading && error && <Alert variant="danger">{error}</Alert>}
            {!loading && !error && webAccesses.length === 0 && (
                <Alert variant="light">No web accesses found.</Alert>
            )}

            {!loading && webAccesses.length > 0 && (
                <Table striped bordered hover responsive>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Service Name</th>
                            <th>URL</th>
                            <th>Username</th>
                            {/* Password column intentionally omitted for security */}
                            <th>Assigned To (Name)</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {webAccesses.map((wa) => (
                            <tr key={wa.id}>
                                <td>{wa.id}</td>
                                <td>{wa.serviceName}</td>
                                <td><a href={wa.url} target="_blank" rel="noopener noreferrer">{wa.url}</a></td>
                                <td>{wa.accessUsername}</td>
                                <td>{wa.assignedEmployeeName || 'N/A'}</td>
                                <td>
                                    <Button variant="outline-secondary" size="sm" className="me-2" onClick={() => handleShowEditModal(wa)}>
                                        Edit
                                    </Button>
                                    <Button variant="outline-danger" size="sm" onClick={() => handleDelete(wa.id)}>
                                        Delete
                                    </Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            )}

            <Modal show={showModal} onHide={handleCloseModal} backdrop="static" keyboard={false}>
                <Modal.Header closeButton>
                    <Modal.Title>{editingWebAccess ? 'Edit Web Access' : 'Add New Web Access'}</Modal.Title>
                </Modal.Header>
                <Form onSubmit={handleSubmit(onSubmit)}>
                    <Modal.Body>
                        {error && <Alert variant="danger">{error}</Alert>}
                        <Form.Group className="mb-3" controlId="waServiceName">
                            <Form.Label>Service Name</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="e.g., Company VPN, Cloud Storage"
                                {...register("serviceName", { required: "Service name is required" })}
                                isInvalid={!!formErrors.serviceName}
                            />
                            <Form.Control.Feedback type="invalid">
                                {formErrors.serviceName?.message}
                            </Form.Control.Feedback>
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="waUrl">
                            <Form.Label>URL</Form.Label>
                            <Form.Control
                                type="url"
                                placeholder="https://example.com"
                                {...register("url", { required: "URL is required" })}
                                isInvalid={!!formErrors.url}
                            />
                            <Form.Control.Feedback type="invalid">
                                {formErrors.url?.message}
                            </Form.Control.Feedback>
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="waAccessUsername">
                            <Form.Label>Username</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter access username"
                                {...register("accessUsername", { required: "Username is required" })}
                                isInvalid={!!formErrors.accessUsername}
                            />
                            <Form.Control.Feedback type="invalid">
                                {formErrors.accessUsername?.message}
                            </Form.Control.Feedback>
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="waAccessPassword">
                            <Form.Label>Password</Form.Label>
                            <Form.Control
                                type="password"
                                placeholder={editingWebAccess ? "Enter new password (leave blank if no change needed - check logic)" : "Enter password"}
                                {...register("accessPassword", {
                                    required: !editingWebAccess ? "Password is required for new entries" : false
                                })} // Required for new, optional for edit (actual logic might need refinement based on backend DTO)
                                isInvalid={!!formErrors.accessPassword}
                            />
                            <Form.Control.Feedback type="invalid">
                                {formErrors.accessPassword?.message}
                            </Form.Control.Feedback>
                            {editingWebAccess && <Form.Text className="text-muted">Backend expects password on update. Provide current or new.</Form.Text>}
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="assignedEmployeeId">
                            <Form.Label>Assigned Employee ID (Optional)</Form.Label>
                            <Form.Control
                                type="number"
                                placeholder="Enter ID of employee to assign"
                                {...register("assignedEmployeeId", {
                                    valueAsNumber: true,
                                    validate: value => (!value || Number.isInteger(value)) || "Must be a valid number"
                                })}
                                isInvalid={!!formErrors.assignedEmployeeId}
                            />
                            <Form.Control.Feedback type="invalid">
                                {formErrors.assignedEmployeeId?.message}
                            </Form.Control.Feedback>
                        </Form.Group>

                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleCloseModal}>
                            Close
                        </Button>
                        <Button variant="primary" type="submit">
                            {editingWebAccess ? 'Save Changes' : 'Create Web Access'}
                        </Button>
                    </Modal.Footer>
                </Form>
            </Modal>
        </Container>
    );
};

// Ensure WebAccessPage is imported in App.jsx and used for the /web-accesses route.
// The route was already set up as:
// <Route path="/web-accesses" element={<WebAccessPage />} />
// This will replace the placeholder.

export default WebAccessPage;
