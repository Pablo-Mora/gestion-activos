// frontend/src/components/ActaHTMLDisplay.jsx
import React from 'react';
import { Table, Container, Row, Col } from 'react-bootstrap';

const ActaHTMLDisplay = React.forwardRef(({ user, hardware, licenses, webAccesses, dateGenerated }, ref) => {

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString();
    };

    const sectionStyle = {
        marginBottom: '30px',
        pageBreakInside: 'avoid',
    };

    const headerStyle = {
        textAlign: 'center',
        marginBottom: '40px',
        borderBottom: '2px solid #333',
        paddingBottom: '10px'
    };

    const footerStyle = {
        textAlign: 'center',
        marginTop: '50px',
        paddingTop: '20px',
        borderTop: '1px solid #eee',
        fontSize: '0.9em',
        color: '#777'
    };

    return (
        <Container ref={ref} className="p-4" style={{ border: '1px solid #ccc', backgroundColor: '#fff' }}>
            <Row>
                <Col style={headerStyle}>
                    <h1>Acta de Asignación de Activos TIC</h1>
                </Col>
            </Row>

            <Row className="mb-4">
                <Col>
                    <h4>Información del Usuario</h4>
                    <p><strong>Nombre de Usuario:</strong> {user?.username || 'N/A'}</p>
                    <p><strong>Email:</strong> {user?.email || 'N/A'}</p>
                    {/* Placeholder for Employee Name/Department if available via user object */}
                    {/* <p><strong>Nombre Completo Empleado:</strong> {user?.employeeFullName || 'N/A'}</p> */}
                    {/* <p><strong>Departamento:</strong> {user?.employeeDepartment || 'N/A'}</p> */}
                    <p><strong>Fecha de Generación:</strong> {formatDate(dateGenerated)}</p>
                </Col>
            </Row>

            {/* Hardware Section */}
            <div style={sectionStyle}>
                <h5>Equipos de Hardware Asignados</h5>
                {hardware && hardware.length > 0 ? (
                    <Table bordered striped size="sm">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Tipo</th>
                                <th>Marca</th>
                                <th>Serial</th>
                                <th>Ubicación</th>
                            </tr>
                        </thead>
                        <tbody>
                            {hardware.map(item => (
                                <tr key={`hw-${item.id}`}>
                                    <td>{item.id}</td>
                                    <td>{item.type}</td>
                                    <td>{item.brand}</td>
                                    <td>{item.serialNumber}</td>
                                    <td>{item.location}</td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                ) : <p>No hay equipos de hardware asignados.</p>}
            </div>

            {/* Licenses Section */}
            <div style={sectionStyle}>
                <h5>Licencias de Software Asignadas</h5>
                {licenses && licenses.length > 0 ? (
                    <Table bordered striped size="sm">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Software</th>
                                <th>Clave</th>
                                <th>Expiración</th>
                            </tr>
                        </thead>
                        <tbody>
                            {licenses.map(item => (
                                <tr key={`lic-${item.id}`}>
                                    <td>{item.id}</td>
                                    <td>{item.softwareName}</td>
                                    <td>{item.licenseKey}</td>
                                    <td>{formatDate(item.expirationDate)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                ) : <p>No hay licencias de software asignadas.</p>}
            </div>

            {/* Web Accesses Section */}
            <div style={sectionStyle}>
                <h5>Accesos Web Asignados</h5>
                {webAccesses && webAccesses.length > 0 ? (
                    <Table bordered striped size="sm">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Servicio</th>
                                <th>URL</th>
                                <th>Usuario</th>
                            </tr>
                        </thead>
                        <tbody>
                            {webAccesses.map(item => (
                                <tr key={`wa-${item.id}`}>
                                    <td>{item.id}</td>
                                    <td>{item.serviceName}</td>
                                    <td>{item.url}</td>
                                    <td>{item.accessUsername}</td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                ) : <p>No hay accesos web asignados.</p>}
            </div>

            <Row style={{ marginTop: '60px', pageBreakBefore: 'always' }}>
                <Col md={6} style={{textAlign: 'center'}}>
                    <p>_________________________</p>
                    <p>Firma del Empleado</p>
                    <p>{user?.username || 'N/A'}</p>
                </Col>
                <Col md={6} style={{textAlign: 'center'}}>
                    <p>_________________________</p>
                    <p>Firma del Responsable (Admin)</p>
                </Col>
            </Row>
            <div style={footerStyle}>
                <p>Este documento es generado automáticamente por el Sistema de Gestión de Activos TIC.</p>
            </div>
        </Container>
    );
});

export default ActaHTMLDisplay;
