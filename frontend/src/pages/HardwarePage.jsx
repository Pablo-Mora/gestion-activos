// frontend/src/pages/HardwarePage.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import AssetService from '../services/assetService';
import { Table, Button, Modal, Form, Container, Row, Col, Alert } from 'react-bootstrap';

const HardwarePage = () => {
    const [hardwareList, setHardwareList] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [editingHardware, setEditingHardware] = useState(null);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    // TODO: For future enhancement: Fetch employees for a dropdown
    // const [employees, setEmployees] = useState([]);

    const { register, handleSubmit, reset, setValue, formState: { errors: formErrors } } = useForm();

    const fetchHardwareItems = useCallback(async () => {
        setLoading(true);
        setError('');
        try {
            const response = await AssetService.getAllHardware();
            setHardwareList(response.data);
        } catch (err) {
            setError('Failed to fetch hardware items. ' + (err.response?.data?.message || err.message));
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, []);

    // TODO: Fetch employees for dropdown
    // const fetchEmployeesForDropdown = useCallback(async () => {
    //     try {
    //         const response = await AssetService.getAllEmployees(); // Assuming this exists
    //         setEmployees(response.data);
    //     } catch (err) {
    //         console.error("Failed to fetch employees for dropdown", err);
    //     }
    // }, []);


    useEffect(() => {
        fetchHardwareItems();
        // fetchEmployeesForDropdown(); // Call if implementing employee dropdown
    }, [fetchHardwareItems/*, fetchEmployeesForDropdown*/]);

    const handleCloseModal = () => {
        setShowModal(false);
        setEditingHardware(null);
        reset();
        setError('');
    };

    const handleShowCreateModal = () => {
        setEditingHardware(null);
        reset({ type: '', brand: '', serialNumber: '', location: '', assignedEmployeeId: '' });
        setShowModal(true);
    };

    const handleShowEditModal = (hardware) => {
        setEditingHardware(hardware);
        setValue('type', hardware.type);
        setValue('brand', hardware.brand);
        setValue('serialNumber', hardware.serialNumber);
        setValue('location', hardware.location);
        setValue('assignedEmployeeId', hardware.assignedEmployeeId || ''); // Handle null
        setShowModal(true);
    };

    const onSubmit = async (data) => {
        setError('');
        // Ensure assignedEmployeeId is a number or null
        const payload = {
            ...data,
            assignedEmployeeId: data.assignedEmployeeId ? parseInt(data.assignedEmployeeId, 10) : null
        };

        try {
            if (editingHardware) {
                await AssetService.updateHardware(editingHardware.id, payload);
            } else {
                await AssetService.createHardware(payload);
            }
            fetchHardwareItems();
            handleCloseModal();
        } catch (err) {
            setError('Failed to save hardware item. ' + (err.response?.data?.message || err.message));
            console.error(err);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this hardware item?')) {
            setError('');
            try {
                await AssetService.deleteHardware(id);
                fetchHardwareItems();
            } catch (err) { // Added opening curly brace for catch block
                setError('Failed to delete hardware item. ' + (err.response?.data?.message || err.message));
                console.error(err);
            }
        }
    };

    return (
        <Container fluid>
            <Row className="my-3">
                <Col>
                    <h2>Manage Hardware</h2>
                </Col>
                <Col className="text-end">
                    <Button variant="primary" onClick={handleShowCreateModal}>
                        Add New Hardware
                    </Button>
                </Col>
            </Row>

            {loading && <Alert variant="info">Loading hardware items...</Alert>}
            {!loading && error && <Alert variant="danger">{error}</Alert>}

            {!loading && !error && hardwareList.length === 0 && (
                <Alert variant="light">No hardware items found.</Alert>
            )}

            {!loading && hardwareList.length > 0 && (
                <Table striped bordered hover responsive>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Type</th>
                            <th>Brand</th>
                            <th>Serial #</th>
                            <th>Location</th>
                            <th>Assigned To (Name)</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {hardwareList.map((item) => (
                            <tr key={item.id}>
                                <td>{item.id}</td>
                                <td>{item.type}</td>
                                <td>{item.brand}</td>
                                <td>{item.serialNumber}</td>
                                <td>{item.location}</td>
                                <td>{item.assignedEmployeeName || 'N/A'}</td>
                                <td>
                                    <Button variant="outline-secondary" size="sm" className="me-2" onClick={() => handleShowEditModal(item)}>
                                        Edit
                                    </Button>
                                    <Button variant="outline-danger" size="sm" onClick={() => handleDelete(item.id)}>
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
                    <Modal.Title>{editingHardware ? 'Edit Hardware' : 'Add New Hardware'}</Modal.Title>
                </Modal.Header>
                <Form onSubmit={handleSubmit(onSubmit)}>
                    <Modal.Body>
                        {error && <Alert variant="danger">{error}</Alert>}
                        <Form.Group className="mb-3" controlId="hardwareType">
                            <Form.Label>Type</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="e.g., Laptop, Monitor, Keyboard"
                                {...register("type", { required: "Type is required" })}
                                isInvalid={!!formErrors.type}
                            />
                            <Form.Control.Feedback type="invalid">
                                {formErrors.type?.message}
                            </Form.Control.Feedback>
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="hardwareBrand">
                            <Form.Label>Brand</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="e.g., Dell, HP, Logitech"
                                {...register("brand")}
                            />
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="hardwareSerial">
                            <Form.Label>Serial Number</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter serial number"
                                {...register("serialNumber", { required: "Serial number is required" })}
                                isInvalid={!!formErrors.serialNumber}
                            />
                            <Form.Control.Feedback type="invalid">
                                {formErrors.serialNumber?.message}
                            </Form.Control.Feedback>
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="hardwareLocation">
                            <Form.Label>Location</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="e.g., Office A1, Remote WFH"
                                {...register("location")}
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
                            {/* TODO: Replace with a searchable dropdown of employees */}
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
                            {editingHardware ? 'Save Changes' : 'Create Hardware'}
                        </Button>
                    </Modal.Footer>
                </Form>
            </Modal>
        </Container>
    );
};

// Ensure HardwarePage is imported in App.jsx and used for the /hardware route.
// The route was already set up as:
// <Route path="/hardware" element={<HardwarePage />} />
// This will replace the placeholder.

export default HardwarePage;
