// frontend/src/pages/LicensePage.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import AssetService from '../services/assetService';
import { Table, Button, Modal, Form, Container, Row, Col, Alert } from 'react-bootstrap';

const LicensePage = () => {
    const [licenses, setLicenses] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [editingLicense, setEditingLicense] = useState(null);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    // const [employees, setEmployees] = useState([]); // For employee dropdown

    const { register, handleSubmit, reset, setValue, formState: { errors: formErrors } } = useForm();

    const fetchLicenses = useCallback(async () => {
        setLoading(true);
        setError('');
        try {
            const response = await AssetService.getAllLicenses();
            setLicenses(response.data);
        } catch (err) {
            setError('Failed to fetch licenses. ' + (err.response?.data?.message || err.message));
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, []);

    // const fetchEmployeesForDropdown = useCallback(async () => { /* ... similar to HardwarePage ... */ }, []);

    useEffect(() => {
        fetchLicenses();
        // fetchEmployeesForDropdown();
    }, [fetchLicenses/*, fetchEmployeesForDropdown*/]);

    const handleCloseModal = () => {
        setShowModal(false);
        setEditingLicense(null);
        reset();
        setError('');
    };

    const handleShowCreateModal = () => {
        setEditingLicense(null);
        reset({ softwareName: '', licenseKey: '', purchaseDate: '', expirationDate: '', assignedEmployeeId: '' });
        setShowModal(true);
    };

    const handleShowEditModal = (license) => {
        setEditingLicense(license);
        setValue('softwareName', license.softwareName);
        setValue('licenseKey', license.licenseKey);
        // Dates need to be in 'yyyy-MM-dd' format for date input
        setValue('purchaseDate', license.purchaseDate ? new Date(license.purchaseDate).toISOString().split('T')[0] : '');
        setValue('expirationDate', license.expirationDate ? new Date(license.expirationDate).toISOString().split('T')[0] : '');
        setValue('assignedEmployeeId', license.assignedEmployeeId || '');
        setShowModal(true);
    };

    const onSubmit = async (data) => {
        setError('');
        const payload = {
            ...data,
            assignedEmployeeId: data.assignedEmployeeId ? parseInt(data.assignedEmployeeId, 10) : null,
            // Ensure dates are not empty strings if not provided, or backend handles it
            purchaseDate: data.purchaseDate || null,
            expirationDate: data.expirationDate || null,
        };
        try {
            if (editingLicense) {
                await AssetService.updateLicense(editingLicense.id, payload);
            } else {
                await AssetService.createLicense(payload);
            }
            fetchLicenses();
            handleCloseModal();
        } catch (err) {
            setError('Failed to save license. ' + (err.response?.data?.message || err.message));
            console.error(err);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this license?')) {
            setError('');
            try {
                await AssetService.deleteLicense(id);
                fetchLicenses();
            } catch (err) {
                setError('Failed to delete license. ' + (err.response?.data?.message || err.message));
                console.error(err);
            }
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        // Assuming dateString from backend is already in a good format or just display as is
        // For display, new Date().toLocaleDateString() is often fine if the input is a valid date string/object
        return new Date(dateString).toLocaleDateString();
    };


    return (
        <Container fluid>
            <Row className="my-3">
                <Col>
                    <h2>Manage Licenses</h2>
                </Col>
                <Col className="text-end">
                    <Button variant="primary" onClick={handleShowCreateModal}>
                        Add New License
                    </Button>
                </Col>
            </Row>

            {loading && <Alert variant="info">Loading licenses...</Alert>}
            {!loading && error && <Alert variant="danger">{error}</Alert>}
            {!loading && !error && licenses.length === 0 && (
                <Alert variant="light">No licenses found.</Alert>
            )}

            {!loading && licenses.length > 0 && (
                <Table striped bordered hover responsive>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Software Name</th>
                            <th>License Key</th>
                            <th>Purchase Date</th>
                            <th>Expiration Date</th>
                            <th>Assigned To (Name)</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {licenses.map((license) => (
                            <tr key={license.id}>
                                <td>{license.id}</td>
                                <td>{license.softwareName}</td>
                                <td>{license.licenseKey}</td>
                                <td>{formatDate(license.purchaseDate)}</td>
                                <td>{formatDate(license.expirationDate)}</td>
                                <td>{license.assignedEmployeeName || 'N/A'}</td>
                                <td>
                                    <Button variant="outline-secondary" size="sm" className="me-2" onClick={() => handleShowEditModal(license)}>
                                        Edit
                                    </Button>
                                    <Button variant="outline-danger" size="sm" onClick={() => handleDelete(license.id)}>
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
                    <Modal.Title>{editingLicense ? 'Edit License' : 'Add New License'}</Modal.Title>
                </Modal.Header>
                <Form onSubmit={handleSubmit(onSubmit)}>
                    <Modal.Body>
                        {error && <Alert variant="danger">{error}</Alert>}
                        <Form.Group className="mb-3" controlId="licenseSoftwareName">
                            <Form.Label>Software Name</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="e.g., Microsoft Office, Adobe Photoshop"
                                {...register("softwareName", { required: "Software name is required" })}
                                isInvalid={!!formErrors.softwareName}
                            />
                            <Form.Control.Feedback type="invalid">
                                {formErrors.softwareName?.message}
                            </Form.Control.Feedback>
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="licenseKey">
                            <Form.Label>License Key</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter license key"
                                {...register("licenseKey", { required: "License key is required" })}
                                isInvalid={!!formErrors.licenseKey}
                            />
                            <Form.Control.Feedback type="invalid">
                                {formErrors.licenseKey?.message}
                            </Form.Control.Feedback>
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="licensePurchaseDate">
                            <Form.Label>Purchase Date</Form.Label>
                            <Form.Control
                                type="date"
                                {...register("purchaseDate")}
                            />
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="licenseExpirationDate">
                            <Form.Label>Expiration Date</Form.Label>
                            <Form.Control
                                type="date"
                                {...register("expirationDate")}
                            />
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
                            {/* <Form.Select {...register("assignedEmployeeId")}>
                                <option value="">None</option>
                                {employees.map(emp => (
                                    <option key={emp.id} value={emp.id}>{emp.name} (ID: {emp.id})</option>
                                ))}
                            </Form.Select> */}
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
                            {editingLicense ? 'Save Changes' : 'Create License'}
                        </Button>
                    </Modal.Footer>
                </Form>
            </Modal>
        </Container>
    );
};

// Ensure LicensePage is imported in App.jsx and used for the /licenses route.
// The route was already set up as:
// <Route path="/licenses" element={<LicensePage />} />
// This will replace the placeholder.

export default LicensePage;
