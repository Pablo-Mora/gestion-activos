# Frontend - ActivosTIC Management System

This frontend application is built with React 18 (using Vite) and provides the user interface for the ActivosTIC Management System.

## Features

*   User authentication (Login/Logout) with JWT.
*   Role-based views and functionalities (Admin, User).
*   Dashboard displaying role-specific information.
*   **Admin**:
    *   CRUD (Create, Read, Update, Delete) management for Employees, Hardware, Licenses, and Web Accesses.
    *   Interactive tables and modal forms for data entry.
*   **User**:
    *   View assigned IT assets.
    *   Download an "Acta de Asignación" (asset report) in PDF format.
*   Responsive design using React-Bootstrap.
*   Client-side routing with React Router.
*   Forms managed with React Hook Form.

## Prerequisites

*   Node.js (v18.x or v20.x recommended, as per `react-router-dom` warning, though v18 works)
*   NPM (usually comes with Node.js)
*   A running instance of the [ActivosTIC Backend API](<link-to-backend-repo-or-docs-if-separate>). By default, it expects the backend at `http://localhost:8080/api`.

## Setup and Running

1.  **Navigate to the frontend directory**:
    ```bash
    cd frontend
    ```

2.  **Install dependencies**:
    ```bash
    npm install
    ```

3.  **Configure Backend API URL (Optional)**:
    Create a `.env.development.local` file in the `frontend/` directory if it doesn't exist:
    ```env
    VITE_API_URL=http://localhost:8080/api
    ```
    Replace the URL if your backend runs elsewhere.

4.  **Run the development server**:
    ```bash
    npm run dev
    ```
    The application will typically be available at `http://localhost:5173` (Vite's default port).

## Building for Production

1.  **Build the application**:
    ```bash
    npm run build
    ```
    This will create a `dist/` folder with the optimized static assets.

2.  **Preview the production build (optional)**:
    ```bash
    npm run preview
    ```

## Key Technologies & Libraries

*   React 18 (via Vite)
*   React Router DOM v6
*   Axios
*   React-Bootstrap & Bootstrap 5.3+
*   React Hook Form
*   html2pdf.js
*   Vite (build tool)

## Project Structure

*   `src/components/`: Reusable UI components.
*   `src/pages/`: Top-level page components.
*   `src/services/`: API interaction services.
*   `src/context/`: React Context for global state (e.g., AuthContext).
*   `src/utils/`: Utility functions.
*   `src/assets/`: Static assets.
*   `src/App.css`: Custom global styles.
