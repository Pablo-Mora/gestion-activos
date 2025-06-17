// frontend/src/pages/EmployeePage.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import AssetService from '../services/assetService';
import { Table, Button, Modal, Form, Container, Row, Col, Alert } from 'react-bootstrap';

const EmployeePage = () => {
    const [employees, setEmployees] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [editingEmployee, setEditingEmployee] = useState(null); // null for new, employee object for editing
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const { register, handleSubmit, reset, setValue, formState: { errors: formErrors } } = useForm();

    const fetchEmployees = useCallback(async () => {
        setLoading(true);
        setError('');
        try {
            const response = await AssetService.getAllEmployees();
            setEmployees(response.data);
        } catch (err) {
            setError('Failed to fetch employees. ' + (err.response?.data?.message || err.message));
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchEmployees();
    }, [fetchEmployees]);

    const handleCloseModal = () => {
        setShowModal(false);
        setEditingEmployee(null);
        reset(); // Reset form fields
        setError(''); // Clear form-specific errors
    };

    const handleShowCreateModal = () => {
        setEditingEmployee(null);
        reset({ name: '', department: '', position: '' }); // Default values for new
        setShowModal(true);
    };

    const handleShowEditModal = (employee) => {
        setEditingEmployee(employee);
        setValue('name', employee.name);
        setValue('department', employee.department);
        setValue('position', employee.position);
        setShowModal(true);
    };

    const onSubmit = async (data) => {
        setError('');
        try {
            if (editingEmployee) {
                await AssetService.updateEmployee(editingEmployee.id, data);
            } else {
                await AssetService.createEmployee(data);
            }
            fetchEmployees(); // Refresh the list
            handleCloseModal();
        } catch (err) {
            setError('Failed to save employee. ' + (err.response?.data?.message || err.message));
            console.error(err);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this employee?')) {
            setError('');
            try {
                await AssetService.deleteEmployee(id);
                fetchEmployees(); // Refresh the list
            } catch (err) {
                setError('Failed to delete employee. ' + (err.response?.data?.message || err.message));
                console.error(err);
            }
        }
    };

    return (
        <Container fluid>
            <Row className="my-3">
                <Col>
                    <h2>Manage Employees</h2>
                </Col>
                <Col className="text-end">
                    <Button variant="primary" onClick={handleShowCreateModal}>
                        Add New Employee
                    </Button>
                </Col>
            </Row>

            {loading && <Alert variant="info">Loading employees...</Alert>}
            {!loading && error && <Alert variant="danger">{error}</Alert>}

            {!loading && !error && employees.length === 0 && (
                <Alert variant="light">No employees found. Add some!</Alert>
            )}

            {!loading && employees.length > 0 && (
                <Table striped bordered hover responsive>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Name</th>
                            <th>Department</th>
                            <th>Position</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {employees.map((employee) => (
                            <tr key={employee.id}>
                                <td>{employee.id}</td>
                                <td>{employee.name}</td>
                                <td>{employee.department}</td>
                                <td>{employee.position}</td>
                                <td>
                                    <Button variant="outline-secondary" size="sm" className="me-2" onClick={() => handleShowEditModal(employee)}>
                                        Edit
                                    </Button>
                                    <Button variant="outline-danger" size="sm" onClick={() => handleDelete(employee.id)}>
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
                    <Modal.Title>{editingEmployee ? 'Edit Employee' : 'Add New Employee'}</Modal.Title>
                </Modal.Header>
                <Form onSubmit={handleSubmit(onSubmit)}>
                    <Modal.Body>
                        {error && <Alert variant="danger">{error}</Alert>} {/* Display error inside modal too */}
                        <Form.Group className="mb-3" controlId="employeeName">
                            <Form.Label>Name</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter employee name"
                                {...register("name", { required: "Name is required" })}
                                isInvalid={!!formErrors.name}
                            />
                            <Form.Control.Feedback type="invalid">
                                {formErrors.name?.message}
                            </Form.Control.Feedback>
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="employeeDepartment">
                            <Form.Label>Department</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter department"
                                {...register("department")}
                            />
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="employeePosition">
                            <Form.Label>Position</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter position"
                                {...register("position")}
                            />
                        </Form.Group>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleCloseModal}>
                            Close
                        </Button>
                        <Button variant="primary" type="submit">
                            {editingEmployee ? 'Save Changes' : 'Create Employee'}
                        </Button>
                    </Modal.Footer>
                </Form>
            </Modal>
        </Container>
    );
};

// Replace the placeholder in App.jsx
// Ensure EmployeePage is imported in App.jsx and used for the /employees route.
// The route was already set up as:
// <Route path="/employees" element={<EmployeePage />} />
// but EmployeePage was a placeholder. This will replace it.

export default EmployeePage;
