# PixelForge Nexus

A secure online project management system for game development teams, built with React and Node.js.

## Overview

PixelForge Nexus is a comprehensive project management system designed for Creative SkillZ LLC. It provides secure project management, team assignment, and document management capabilities with role-based access control and multi-factor authentication.

## Features

### Core Functionality

1. **Project Management**
   - Add/Remove Projects (Admin only)
   - View Active Projects (All users)
   - Mark Projects as Completed (Admin only)
   - Project details with deadline tracking

2. **Team Assignment**
   - Assign developers to projects (Project Leads & Admins)
   - View assigned projects (Developers)
   - Role-based project access

3. **Asset & Resource Management**
   - Upload project documents (Admins & Project Leads)
   - View and download documents (All assigned users)
   - Secure file storage with access control

### Security Features

- **Robust Authentication**: Bcrypt password hashing
- **Multi-Factor Authentication (MFA)**: TOTP-based 2FA using authenticator apps
- **Role-Based Access Control**: Admin, Project Lead, and Developer roles
- **Rate Limiting**: Protection against brute force attacks
- **Input Validation**: Server-side validation for all inputs
- **Secure Cookies**: HTTP-only, secure cookies for session management
- **Helmet.js**: Security headers protection
- **CORS**: Configured cross-origin resource sharing

### User Roles

- **Admin**: Full system access
  - Create/manage projects
  - Manage all user accounts
  - Upload documents for any project
  - Edit user roles

- **Project Lead**: Project management
  - Assign developers to their projects
  - Upload documents for their projects
  - View project details

- **Developer**: Limited access
  - View assigned projects
  - Access project documents
  - Update account settings

## Technology Stack

### Backend
- **Node.js** with Express.js
- **MongoDB** with Mongoose
- **JWT** for authentication
- **Bcrypt** for password hashing
- **Speakeasy** for MFA/TOTP
- **Multer** for file uploads
- **Helmet** for security headers
- **Express Rate Limit** for rate limiting
- **Express Validator** for input validation

### Frontend
- **React** with React Router
- **Axios** for API calls
- **Tailwind CSS** for styling
- **Vite** as build tool

## Installation

### Prerequisites

- Node.js (v16 or higher)
- MongoDB (local or Atlas)
- npm or yarn

### Setup Steps

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd PixelForgeNexus
   ```

2. **Install dependencies**
   ```bash
   # Install root dependencies
   npm install
   
   # Install server dependencies
   cd server
   npm install
   
   # Install client dependencies
   cd ../client
   npm install
   ```

3. **Configure environment variables**
   ```bash
   # Copy .env.example to .env in the server directory
   cd ../server
   cp .env.example .env
   
   # Edit .env with your configuration
   # Set MONGODB_URI, JWT_SECRET, etc.
   ```

4. **Seed initial data (optional)**
   ```bash
   cd server
   node seeder.js
   ```

5. **Start the application**
   ```bash
   # From root directory
   npm start
   
   # Or run separately:
   # Terminal 1: Server
   cd server
   npm start
   
   # Terminal 2: Client
   cd client
   npm run dev
   ```

6. **Access the application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:5000

## Test Credentials

After running the seeder, you can use these test accounts:

### Admin Account
- **Username**: `admin`
- **Password**: `password123`
- **Role**: Admin

### Project Lead Account
- **Username**: `lead`
- **Password**: `password123`
- **Role**: Project Lead

### Developer Accounts
- **Username**: `dev1`
- **Password**: `password123`
- **Role**: Developer

- **Username**: `dev2`
- **Password**: `password123`
- **Role**: Developer

**⚠️ Security Note**: These are default test credentials. Change all passwords immediately in production environments.

## API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `POST /api/auth/register` - Register new user (Admin only)
- `GET /api/auth/me` - Get current user profile
- `GET /api/auth/mfa/setup` - Setup MFA
- `POST /api/auth/mfa/enable` - Enable MFA
- `POST /api/auth/mfa/disable` - Disable MFA
- `POST /api/auth/password/update` - Update password
- `GET /api/auth/users` - Get all users (Admin only)
- `PATCH /api/auth/users/:userId/role` - Update user role (Admin only)

### Projects
- `GET /api/projects` - Get all active projects
- `GET /api/projects/:id` - Get single project
- `POST /api/projects` - Create project (Admin only)
- `PATCH /api/projects/:id/complete` - Mark project complete (Admin only)
- `POST /api/projects/:id/assign` - Assign developers (Project Lead/Admin)
- `GET /api/projects/my-assignments` - Get assigned projects (Developer)

### Documents
- `POST /api/documents/upload` - Upload document
- `GET /api/documents/project/:projectId` - Get project documents
- `GET /api/documents/:id/download` - Download document

## Security Considerations

### Implemented Security Measures

1. **Password Security**
   - Bcrypt hashing with salt rounds
   - Minimum 8 character requirement
   - Password update requires current password verification

2. **Authentication**
   - JWT tokens stored in HTTP-only cookies
   - Token expiration (30 days)
   - Secure cookie flags in production

3. **Multi-Factor Authentication**
   - TOTP-based 2FA
   - QR code generation for easy setup
   - Time-based one-time passwords

4. **Rate Limiting**
   - 5 attempts per 15 minutes for auth endpoints
   - 100 requests per 15 minutes for general API

5. **Input Validation**
   - Server-side validation using express-validator
   - Sanitization of user inputs
   - File type and size restrictions

6. **Access Control**
   - Role-based authorization middleware
   - Project-level access control
   - Document access verification

7. **Security Headers**
   - Helmet.js for security headers
   - Content Security Policy
   - CORS configuration

## Development Notes

### Code Structure

```
PixelForgeNexus/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/    # Reusable components
│   │   ├── context/        # React context (Auth)
│   │   ├── pages/          # Page components
│   │   └── utils/          # Utility functions
│   └── package.json
├── server/                 # Node.js backend
│   ├── controllers/        # Route controllers
│   ├── middleware/         # Custom middleware
│   ├── models/             # Mongoose models
│   ├── routes/             # API routes
│   ├── uploads/            # File uploads directory
│   └── package.json
└── package.json            # Root package.json
```

### Key Files

- `server/server.js` - Main server file
- `server/models/` - Database models (User, Project, Document)
- `server/middleware/authMiddleware.js` - Authentication middleware
- `client/src/context/AuthContext.jsx` - Authentication context
- `client/src/pages/` - Main page components

## Testing

### Manual Testing Checklist

1. **Authentication**
   - [ ] Login with valid credentials
   - [ ] Login with invalid credentials
   - [ ] MFA setup and verification
   - [ ] Password update
   - [ ] Logout functionality

2. **Project Management**
   - [ ] Create project (Admin)
   - [ ] View projects (All roles)
   - [ ] Mark project complete (Admin)
   - [ ] Assign developers (Project Lead/Admin)
   - [ ] View assigned projects (Developer)

3. **Document Management**
   - [ ] Upload document (Admin/Lead)
   - [ ] View documents (Assigned users)
   - [ ] Download documents
   - [ ] Access control verification

4. **User Management**
   - [ ] Create user (Admin)
   - [ ] Edit user role (Admin)
   - [ ] View all users (Admin)

## Production Deployment

### Important Steps

1. **Environment Variables**
   - Set `NODE_ENV=production`
   - Use strong `JWT_SECRET`
   - Configure production MongoDB URI
   - Set secure `CLIENT_URL`

2. **Security**
   - Enable HTTPS
   - Use secure cookies
   - Review and update CORS settings
   - Set up proper firewall rules

3. **Database**
   - Use MongoDB Atlas or secure MongoDB instance
   - Enable authentication
   - Regular backups

4. **Monitoring**
   - Set up error logging
   - Monitor rate limiting
   - Track authentication attempts

## License

This project is developed for educational purposes as part of a Secure Design and Development assignment.

## Author

Developed with the assistance of Large Language Models (LLM) as per assignment requirements.

## Acknowledgments

- Express.js community
- React community
- MongoDB and Mongoose documentation

