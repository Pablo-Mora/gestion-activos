// frontend/src/services/assetService.js
import axios from 'axios';
import AuthService from './authService'; // To get authHeader

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

// --- Generic CRUD Functions (Optional, can be specialized if needed) ---
// const getAll = (resource) => {
//     return axios.get(`${API_BASE_URL}/${resource}`, { headers: AuthService.authHeader() });
// };
// const getById = (resource, id) => {
//     return axios.get(`${API_BASE_URL}/${resource}/${id}`, { headers: AuthService.authHeader() });
// };
// etc.

// --- Employee Service ---
const getAllEmployees = () => {
    return axios.get(`${API_BASE_URL}/employees`, { headers: AuthService.authHeader() });
};

const getEmployeeById = (id) => {
    return axios.get(`${API_BASE_URL}/employees/${id}`, { headers: AuthService.authHeader() });
};

const createEmployee = (employeeData) => {
    return axios.post(`${API_BASE_URL}/employees`, employeeData, { headers: AuthService.authHeader() });
};

const updateEmployee = (id, employeeData) => {
    return axios.put(`${API_BASE_URL}/employees/${id}`, employeeData, { headers: AuthService.authHeader() });
};

const deleteEmployee = (id) => {
    return axios.delete(`${API_BASE_URL}/employees/${id}`, { headers: AuthService.authHeader() });
};

// --- Hardware Service ---
const getAllHardware = () => {
    return axios.get(`${API_BASE_URL}/hardware`, { headers: AuthService.authHeader() });
};

const getHardwareById = (id) => {
    return axios.get(`${API_BASE_URL}/hardware/${id}`, { headers: AuthService.authHeader() });
};

const createHardware = (hardwareData) => {
    return axios.post(`${API_BASE_URL}/hardware`, hardwareData, { headers: AuthService.authHeader() });
};

const updateHardware = (id, hardwareData) => {
    return axios.put(`${API_BASE_URL}/hardware/${id}`, hardwareData, { headers: AuthService.authHeader() });
};

const deleteHardware = (id) => {
    return axios.delete(`${API_BASE_URL}/hardware/${id}`, { headers: AuthService.authHeader() });
};

// --- License Service ---
const getAllLicenses = () => {
    return axios.get(`${API_BASE_URL}/licenses`, { headers: AuthService.authHeader() });
};

const getLicenseById = (id) => {
    return axios.get(`${API_BASE_URL}/licenses/${id}`, { headers: AuthService.authHeader() });
};

const createLicense = (licenseData) => {
    return axios.post(`${API_BASE_URL}/licenses`, licenseData, { headers: AuthService.authHeader() });
};

const updateLicense = (id, licenseData) => {
    return axios.put(`${API_BASE_URL}/licenses/${id}`, licenseData, { headers: AuthService.authHeader() });
};

const deleteLicense = (id) => {
    return axios.delete(`${API_BASE_URL}/licenses/${id}`, { headers: AuthService.authHeader() });
};

// --- Web Access Service ---
const getAllWebAccesses = () => {
    return axios.get(`${API_BASE_URL}/web-accesses`, { headers: AuthService.authHeader() });
};

const getWebAccessById = (id) => {
    return axios.get(`${API_BASE_URL}/web-accesses/${id}`, { headers: AuthService.authHeader() });
};

const createWebAccess = (webAccessData) => {
    return axios.post(`${API_BASE_URL}/web-accesses`, webAccessData, { headers: AuthService.authHeader() });
};

const updateWebAccess = (id, webAccessData) => {
    return axios.put(`${API_BASE_URL}/web-accesses/${id}`, webAccessData, { headers: AuthService.authHeader() });
};

const deleteWebAccess = (id) => {
    return axios.delete(`${API_BASE_URL}/web-accesses/${id}`, { headers: AuthService.authHeader() });
};


export default {
    getAllEmployees,
    getEmployeeById,
    createEmployee,
    updateEmployee,
    deleteEmployee,
    getAllHardware,
    getHardwareById,
    createHardware,
    updateHardware,
    deleteHardware,
    getAllLicenses,
    getLicenseById,
    createLicense,
    updateLicense,
    deleteLicense,
    getAllWebAccesses,
    getWebAccessById,
    createWebAccess,
    updateWebAccess,
    deleteWebAccess
};
