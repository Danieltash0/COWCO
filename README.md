# CowCo Dairy Farm Management Application

CowCo is a full-stack web application for managing day-to-day dairy farm operations. It supports role-based workflows for admins, managers, workers, and veterinary staff to streamline cattle tracking, farm tasks, and operational reporting.

## Core Features
- Role-based authentication and protected routes for different user types.
- Cattle management (add, edit, list, and profile views).
- QR code generation and scanning for cattle identification and lookup.
- Task and checklist management for daily farm activities.
- Veterinary modules for appointments and health records.
- Milking, reporting, and analytics dashboards for operational insights.
- Admin tools for user management, settings, and activity logs.

## Technologies Used
- Frontend: React 18, React Router, React Scripts (CRA).
- UI/Client utilities: `html5-qrcode`, `qrcode.react`, `jspdf`, `jspdf-autotable`.
- Backend: Node.js, Express, CORS middleware.
- Authentication/Security: JWT (`jsonwebtoken`) and password hashing (`bcryptjs`).
- Database: MySQL using `mysql2` with pooled connections.
- Development tooling: Nodemon for backend development and React Testing Library on the client.
