# ATS Candidate Management System - Setup Guide

This guide will help you set up and run the Applicant Tracking System (ATS) with the candidate addition workflow.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Installation](#installation)
3. [Database Setup](#database-setup)
4. [Running the Application](#running-the-application)
5. [Testing the System](#testing-the-system)
6. [API Documentation](#api-documentation)
7. [Troubleshooting](#troubleshooting)

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v16 or higher)
- **npm** (v8 or higher)
- **PostgreSQL** (v13 or higher)
- **Git**

## Installation

### 1. Clone the Repository

```bash
git clone <repository-url>
cd AI4Devs-lab-ides-SR-01
```

### 2. Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Create .env file
cp .env.example .env
```

Edit the `backend/.env` file with your database credentials:

```env
DATABASE_URL="postgresql://username:password@localhost:5432/ats_db?schema=public"
FRONTEND_URL="http://localhost:3000"
NODE_ENV="development"
```

### 3. Frontend Setup

```bash
cd ../frontend

# Install dependencies
npm install

# Create .env file
echo "REACT_APP_API_URL=http://localhost:3010" > .env
```

## Database Setup

### 1. Create the Database

```bash
# Connect to PostgreSQL
psql -U postgres

# Create the database
CREATE DATABASE ats_db;

# Exit psql
\q
```

### 2. Run Prisma Migrations

```bash
cd backend

# Generate Prisma Client
npm run prisma:generate

# Push the schema to the database
npx prisma db push

# (Optional) Open Prisma Studio to view the database
npx prisma studio
```

## Running the Application

You'll need to run both the backend and frontend servers.

### Terminal 1 - Backend Server

```bash
cd backend
npm run dev
```

The backend server will start on `http://localhost:3010`

### Terminal 2 - Frontend Server

```bash
cd frontend
npm start
```

The frontend will start on `http://localhost:3000` and should automatically open in your browser.

## Testing the System

### 1. Access the Application

Open your browser and navigate to `http://localhost:3000`

### 2. Fill Out the Candidate Form

The form includes the following sections:

- **Personal Information**: First name, last name, email, phone, address, LinkedIn, portfolio
- **Education**: Add multiple education entries with autocomplete for institutions
- **Work Experience**: Add multiple work experiences with autocomplete for companies
- **Documents**: Upload CV/Resume (PDF or DOCX, max 5MB)

### 3. Test Validation

Try the following to see validation in action:

- Leave required fields empty
- Enter an invalid email format
- Enter an invalid phone number
- Try to upload a file larger than 5MB
- Try to upload an unsupported file type

### 4. Submit a Candidate

Fill out the form completely and click "Submit Candidate". You should see:

- A loading spinner while submitting
- A success message upon successful submission
- The form automatically resets

### 5. Verify in Database

You can use Prisma Studio to verify the data was saved:

```bash
cd backend
npx prisma studio
```

## API Documentation

### Base URL

```
http://localhost:3010/api
```

### Endpoints

#### 1. Create Candidate

**POST** `/api/candidates`

Creates a new candidate with education, experience, and document uploads.

**Request:**

- Content-Type: `multipart/form-data`
- Body:
  - `candidateData`: JSON string containing candidate information
  - `documents`: File uploads (max 3, PDF/DOCX only, 5MB each)

**Example candidateData:**

```json
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john.doe@example.com",
  "phone": "+1234567890",
  "address": "123 Main St, City, State",
  "linkedIn": "https://linkedin.com/in/johndoe",
  "portfolio": "https://johndoe.com",
  "educations": [
    {
      "institution": "University Name",
      "degree": "Bachelor's Degree",
      "fieldOfStudy": "Computer Science",
      "startDate": "2015-09-01",
      "endDate": "2019-06-01",
      "current": false,
      "description": "Focus on software engineering"
    }
  ],
  "experiences": [
    {
      "company": "Tech Company Inc.",
      "position": "Software Engineer",
      "description": "Developed web applications",
      "startDate": "2019-07-01",
      "endDate": "2023-12-01",
      "current": false
    }
  ]
}
```

**Response (Success):**

```json
{
  "success": true,
  "data": {
    "id": 1,
    "firstName": "John",
    "lastName": "Doe"
    // ... full candidate data
  }
}
```

**Response (Error):**

```json
{
  "success": false,
  "error": "Error message",
  "errors": [
    {
      "field": "email",
      "message": "Please provide a valid email address"
    }
  ]
}
```

#### 2. Get All Candidates

**GET** `/api/candidates?page=1&limit=10`

Retrieves all candidates with pagination.

**Query Parameters:**

- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10)

**Response:**

```json
{
  "success": true,
  "data": {
    "candidates": [...],
    "pagination": {
      "total": 50,
      "page": 1,
      "limit": 10,
      "totalPages": 5
    }
  }
}
```

#### 3. Get Candidate by ID

**GET** `/api/candidates/:id`

Retrieves a single candidate by ID.

**Response:**

```json
{
  "success": true,
  "data": {
    "id": 1,
    "firstName": "John",
    "lastName": "Doe",
    "educations": [...],
    "experiences": [...],
    "documents": [...]
  }
}
```

#### 4. Get Institution Suggestions

**GET** `/api/candidates/autocomplete/institutions?query=harvard`

Get autocomplete suggestions for educational institutions.

**Query Parameters:**

- `query` (required): Search query (minimum 2 characters)

**Response:**

```json
{
  "success": true,
  "data": ["Harvard University", "Harvard Business School"]
}
```

#### 5. Get Company Suggestions

**GET** `/api/candidates/autocomplete/companies?query=google`

Get autocomplete suggestions for companies.

**Query Parameters:**

- `query` (required): Search query (minimum 2 characters)

**Response:**

```json
{
  "success": true,
  "data": ["Google Inc.", "Google Cloud"]
}
```

## Features

### ✅ Form Validation

- **Client-side validation**: Real-time validation with immediate feedback
- **Server-side validation**: Comprehensive validation using express-validator
- **Field requirements**: Clear indication of required fields
- **Format validation**: Email, phone, URL validation
- **Date validation**: Start/end date logic validation

### ✅ File Upload

- **Supported formats**: PDF, DOC, DOCX
- **File size limit**: 5MB per file
- **Multiple files**: Up to 3 files per candidate
- **Drag & drop**: Intuitive file upload interface
- **File preview**: Shows uploaded file names and sizes

### ✅ Autocomplete

- **Institution autocomplete**: Suggests previously entered institutions
- **Company autocomplete**: Suggests previously entered companies
- **Minimum query length**: 2 characters to trigger suggestions
- **Debounced requests**: Optimized API calls

### ✅ Responsive Design

- **Mobile-friendly**: Fully responsive layout
- **Tablet support**: Optimized for all screen sizes
- **Touch-friendly**: Large tap targets for mobile devices

### ✅ Accessibility

- **ARIA labels**: Proper accessibility labels
- **Keyboard navigation**: Full keyboard support
- **Screen reader support**: Compatible with screen readers
- **Focus management**: Clear focus indicators
- **Error announcements**: Accessible error messages

### ✅ User Experience

- **Loading states**: Clear loading indicators during submission
- **Success messages**: Confirmation after successful submission
- **Error handling**: Clear, actionable error messages
- **Form reset**: Easy form reset functionality
- **Auto-scroll**: Scrolls to errors automatically

### ✅ Security & Privacy

- **Input sanitization**: All inputs are sanitized
- **SQL injection protection**: Prisma ORM prevents SQL injection
- **CORS configuration**: Proper CORS setup
- **File type validation**: Server-side file type checking
- **GDPR ready**: Data structure supports GDPR compliance

## Troubleshooting

### Port Already in Use

If you get a "port already in use" error:

```bash
# For backend (port 3010)
lsof -ti:3010 | xargs kill -9

# For frontend (port 3000)
lsof -ti:3000 | xargs kill -9
```

### Database Connection Error

1. Verify PostgreSQL is running:

```bash
pg_isready
```

2. Check your `DATABASE_URL` in `backend/.env`

3. Ensure the database exists:

```bash
psql -U postgres -l
```

### Prisma Client Not Generated

```bash
cd backend
npm run prisma:generate
```

### Module Not Found Errors

```bash
# Backend
cd backend
rm -rf node_modules package-lock.json
npm install

# Frontend
cd frontend
rm -rf node_modules package-lock.json
npm install
```

### File Upload Not Working

1. Check that the `uploads` directory exists:

```bash
mkdir -p backend/uploads
```

2. Verify file permissions:

```bash
chmod 755 backend/uploads
```

### CORS Errors

1. Verify `FRONTEND_URL` in `backend/.env` matches your frontend URL
2. Restart the backend server after changing the .env file

## Development Tips

### Hot Reload

Both servers support hot reload:

- Backend: Changes to TypeScript files automatically restart the server
- Frontend: Changes to React files automatically refresh the browser

### Database Management

```bash
# View the database in Prisma Studio
cd backend
npx prisma studio

# Reset the database (⚠️ This will delete all data)
npx prisma db push --force-reset
```

### Testing API Endpoints

Use tools like:

- **Postman**: Import the API endpoints
- **cURL**: Command-line testing
- **Insomnia**: REST client

Example cURL command:

```bash
curl -X POST http://localhost:3010/api/candidates \
  -F 'candidateData={"firstName":"John","lastName":"Doe","email":"john@example.com","phone":"+1234567890","educations":[],"experiences":[]}' \
  -F 'documents=@/path/to/resume.pdf'
```

## Production Deployment

For production deployment, consider:

1. **Environment Variables**: Use production database and frontend URLs
2. **File Storage**: Use cloud storage (AWS S3, Google Cloud Storage) instead of local filesystem
3. **Security**: Enable HTTPS, add rate limiting, implement authentication
4. **Monitoring**: Add logging and monitoring tools
5. **Optimization**: Enable React production build, implement caching

## Support

For issues or questions:

1. Check the troubleshooting section above
2. Review the API documentation
3. Check the browser console for errors
4. Check the backend terminal for server errors
5. Review Prisma logs for database issues

## License

See LICENSE.md for license information.
