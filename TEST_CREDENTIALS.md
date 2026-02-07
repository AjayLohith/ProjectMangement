# Test Credentials

This document contains test credentials for the PixelForge Nexus system.

## Default Test Accounts

After running the seeder script (`node server/seeder.js`), the following accounts will be available:

### Admin Account
- **Username**: `admin`
- **Password**: `password123`
- **Role**: Admin
- **Permissions**: Full system access

### Project Lead Account
- **Username**: `lead`
- **Password**: `password123`
- **Role**: Project Lead
- **Permissions**: Can manage assigned projects and assign developers

### Developer Accounts

#### Developer 1
- **Username**: `dev1`
- **Password**: `password123`
- **Role**: Developer
- **Permissions**: Can view assigned projects and documents

#### Developer 2
- **Username**: `dev2`
- **Password**: `password123`
- **Role**: Developer
- **Permissions**: Can view assigned projects and documents

## Security Warning

⚠️ **IMPORTANT**: These are default test credentials for development and testing purposes only.

**Before deploying to production:**
1. Change all default passwords
2. Remove or disable default accounts
3. Implement strong password policies
4. Enable MFA for all admin accounts
5. Review and update user roles as needed

## Testing MFA

To test Multi-Factor Authentication:

1. Login with any account
2. Navigate to Settings → Multi-Factor Authentication
3. Click "Setup MFA"
4. Scan the QR code with an authenticator app (Google Authenticator, Authy, etc.)
5. Enter the 6-digit code to verify and enable MFA
6. Logout and login again - you'll be prompted for the MFA code

## Testing Workflow

### As Admin:
1. Login with `admin` / `password123`
2. Create a new project
3. Assign a Project Lead to the project
4. Create new users or edit existing user roles
5. Upload documents to any project

### As Project Lead:
1. Login with `lead` / `password123`
2. View projects you lead
3. Assign developers to your projects
4. Upload documents to your projects

### As Developer:
1. Login with `dev1` / `password123`
2. View assigned projects
3. Access project documents
4. Update account settings (password, MFA)

## Notes

- All passwords are hashed using bcrypt before storage
- MFA is optional but highly recommended for enhanced security
- Users can update their passwords from the Account Settings page
- Only admins can create new users and edit user roles

