// frontend/src/pages/MyAssetsPage.jsx
import React, { useState, useEffect, useCallback, useRef } from 'react';
import AssetService from '../services/assetService';
import { useAuth } from '../context/AuthContext';
import { Container, Row, Col, Card, Table, Alert, Spinner, Button } from 'react-bootstrap';
import html2pdf from 'html2pdf.js';
import ActaHTMLDisplay from '../components/ActaHTMLDisplay';

const MyAssetsPage = () => {
    const { user } = useAuth();
    const [assignedHardware, setAssignedHardware] = useState([]);
    const [assignedLicenses, setAssignedLicenses] = useState([]);
    const [assignedWebAccesses, setAssignedWebAccesses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const actaContentRef = useRef(); // Ref for the ActaHTMLDisplay component

    const employeeIdToFilterBy = user?.id;

    const fetchData = useCallback(async () => {
        if (!employeeIdToFilterBy) {
            setError("User employee ID not found. Cannot fetch assigned assets.");
            setLoading(false);
            return;
        }
        setLoading(true);
        setError('');
        try {
            const [hardwareRes, licensesRes, webAccessesRes] = await Promise.all([
                AssetService.getAllHardware(),
                AssetService.getAllLicenses(),
                AssetService.getAllWebAccesses()
            ]);
            setAssignedHardware(hardwareRes.data.filter(item => item.assignedEmployeeId === employeeIdToFilterBy));
            setAssignedLicenses(licensesRes.data.filter(item => item.assignedEmployeeId === employeeIdToFilterBy));
            setAssignedWebAccesses(webAccessesRes.data.filter(item => item.assignedEmployeeId === employeeIdToFilterBy));
        } catch (err) {
            setError('Failed to fetch assigned assets. ' + (err.response?.data?.message || err.message));
            // console.error(err); // Already logged in assetService or caught globally
        } finally {
            setLoading(false);
        }
    }, [employeeIdToFilterBy]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString();
    };

    const handleDownloadPDF = () => {
        const element = actaContentRef.current;
        if (!element) {
            console.error("Acta content element not found.");
            setError("Could not generate PDF: Content missing."); // User-facing error
            return;
        }
        const opt = {
            margin:       0.5,
            filename:     `Acta_Asignacion_${user?.username || 'usuario'}_${new Date().toISOString().split('T')[0]}.pdf`,
            image:        { type: 'jpeg', quality: 0.98 },
            html2canvas:  { scale: 2, useCORS: true, logging: false }, // Added logging: false
            jsPDF:        { unit: 'in', format: 'letter', orientation: 'portrait' }
        };
        html2pdf().from(element).set(opt).save()
            .catch(err => {
                console.error("PDF generation error:", err);
                setError("An error occurred while generating the PDF.");
            });
    };

    if (loading) {
        return (
            <Container className="text-center mt-5">
                <Spinner animation="border" role="status"><span className="visually-hidden">Loading...</span></Spinner>
                <p>Loading your assets...</p>
            </Container>
        );
    }
    if (error && !assignedHardware.length && !assignedLicenses.length && !assignedWebAccesses.length) {
        // Show general error only if no data is available to display
        return <Container><Alert variant="danger" className="mt-3">{error}</Alert></Container>;
    }
    if (!employeeIdToFilterBy && !loading) {
         return <Container><Alert variant="warning" className="mt-3">Could not determine your Employee ID to fetch assets. Please contact support.</Alert></Container>;
    }

    return (
        <Container fluid>
            <Row className="my-3 align-items-center">
                <Col>
                    <h2>My Assigned Assets</h2>
                    <p>Overview of IT assets currently assigned to you, {user?.username}.</p>
                </Col>
                <Col xs="auto">
                    <Button variant="success" onClick={handleDownloadPDF} disabled={loading}>
                        Download Acta as PDF
                    </Button>
                </Col>
            </Row>
            {error && <Alert variant="danger" className="mt-3">{error}</Alert>} {/* Show error here even if some data is displayed */}
            <Alert variant="warning">
                <strong>Note:</strong> Asset filtering is currently based on matching your User ID ({user?.id}) with 'Assigned Employee ID'. This may not be accurate.
            </Alert>

            {/* ActaHTMLDisplay component - rendered for PDF generation, can be hidden visually if desired */}
            <div style={{ position: 'absolute', left: '-9999px', top: '-9999px', zIndex: -100, opacity: 0 }}>
                <ActaHTMLDisplay
                    ref={actaContentRef}
                    user={user}
                    hardware={assignedHardware}
                    licenses={assignedLicenses}
                    webAccesses={assignedWebAccesses}
                    dateGenerated={new Date()}
                />
            </div>

            <Row>
                <Col md={12} className="mb-4">
                    <Card>
                        <Card.Header as="h5">Hardware</Card.Header>
                        <Card.Body>
                            {assignedHardware.length === 0 ? (<p>No hardware items assigned to you.</p>) : (
                                <Table striped bordered hover responsive size="sm">
                                    <thead><tr><th>ID</th><th>Type</th><th>Brand</th><th>Serial #</th><th>Location</th></tr></thead>
                                    <tbody>{assignedHardware.map(item => (<tr key={`hw-${item.id}`}><td>{item.id}</td><td>{item.type}</td><td>{item.brand}</td><td>{item.serialNumber}</td><td>{item.location}</td></tr>))}</tbody>
                                </Table>
                            )}
                        </Card.Body>
                    </Card>
                </Col>

                <Col md={12} className="mb-4">
                    <Card>
                        <Card.Header as="h5">Software Licenses</Card.Header>
                        <Card.Body>
                            {assignedLicenses.length === 0 ? (<p>No software licenses assigned to you.</p>) : (
                                <Table striped bordered hover responsive size="sm">
                                    <thead><tr><th>ID</th><th>Software Name</th><th>License Key</th><th>Purchase Date</th><th>Expiration Date</th></tr></thead>
                                    <tbody>{assignedLicenses.map(item => (<tr key={`lic-${item.id}`}><td>{item.id}</td><td>{item.softwareName}</td><td>{item.licenseKey}</td><td>{formatDate(item.purchaseDate)}</td><td>{formatDate(item.expirationDate)}</td></tr>))}</tbody>
                                </Table>
                            )}
                        </Card.Body>
                    </Card>
                </Col>

                <Col md={12} className="mb-4">
                    <Card>
                        <Card.Header as="h5">Web Accesses</Card.Header>
                        <Card.Body>
                            {assignedWebAccesses.length === 0 ? (<p>No web accesses assigned to you.</p>) : (
                                <Table striped bordered hover responsive size="sm">
                                    <thead><tr><th>ID</th><th>Service Name</th><th>URL</th><th>Username</th></tr></thead>
                                    <tbody>{assignedWebAccesses.map(item => (<tr key={`wa-${item.id}`}><td>{item.id}</td><td>{item.serviceName}</td><td><a href={item.url} target="_blank" rel="noopener noreferrer">{item.url}</a></td><td>{item.accessUsername}</td></tr>))}</tbody>
                                </Table>
                            )}
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default MyAssetsPage;
