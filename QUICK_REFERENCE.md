# Quick Reference Card

## 🚀 Commands Cheat Sheet

### Development

```bash
# Start Backend (from /backend)
npm run dev                    # Start development server with hot reload
npm run build                  # Compile TypeScript to JavaScript
npm start                      # Start production server

# Start Frontend (from /frontend)
npm start                      # Start development server (port 3000)
npm run build                  # Create production build
npm test                       # Run tests

# Database (from /backend)
npx prisma studio              # Open Prisma Studio (database GUI)
npx prisma db push             # Push schema changes to database
npm run prisma:generate        # Generate Prisma Client
npx prisma db push --force-reset  # Reset database (⚠️ deletes all data)
```

### Useful Commands

```bash
# Check if ports are free
lsof -ti:3000                  # Check if port 3000 is in use
lsof -ti:3010                  # Check if port 3010 is in use

# Kill processes on ports
lsof -ti:3000 | xargs kill -9
lsof -ti:3010 | xargs kill -9

# Check PostgreSQL
pg_isready                     # Check if PostgreSQL is running
psql -U postgres -l            # List all databases

# Docker
docker-compose up -d           # Start PostgreSQL container
docker-compose down            # Stop PostgreSQL container
docker-compose logs            # View container logs
```

## 📁 Project Structure

```
AI4Devs-lab-ides-SR-01/
├── backend/
│   ├── src/
│   │   ├── index.ts                    # Server entry point
│   │   ├── types/candidate.types.ts    # TypeScript types
│   │   ├── middleware/
│   │   │   ├── upload.middleware.ts    # File upload (Multer)
│   │   │   └── validation.middleware.ts # Validation rules
│   │   ├── controllers/
│   │   │   └── candidate.controller.ts # Business logic
│   │   └── routes/
│   │       └── candidate.routes.ts     # API routes
│   ├── prisma/
│   │   └── schema.prisma              # Database schema
│   ├── uploads/                        # Uploaded files (gitignored)
│   ├── .env                           # Environment variables (gitignored)
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── App.tsx                    # Main app component
│   │   ├── components/
│   │   │   ├── CandidateForm.tsx      # Main form component
│   │   │   └── CandidateForm.css      # Form styles
│   │   ├── types/
│   │   │   └── candidate.types.ts     # TypeScript types
│   │   ├── services/
│   │   │   └── api.service.ts         # API calls
│   │   └── utils/
│   │       └── validation.ts          # Validation logic
│   ├── .env                           # Environment variables (gitignored)
│   └── package.json
│
├── SETUP.md                           # Setup guide
├── CANDIDATE_WORKFLOW.md              # Feature documentation
├── PROJECT_SUMMARY.md                 # Project overview
└── README.md                          # Main readme
```

## 🔌 API Endpoints

### Base URL: `http://localhost:3010/api`

| Method | Endpoint                                | Description                    |
| ------ | --------------------------------------- | ------------------------------ |
| POST   | `/candidates`                           | Create new candidate           |
| GET    | `/candidates`                           | Get all candidates (paginated) |
| GET    | `/candidates/:id`                       | Get candidate by ID            |
| GET    | `/candidates/autocomplete/institutions` | Get institution suggestions    |
| GET    | `/candidates/autocomplete/companies`    | Get company suggestions        |

### Example API Call (curl)

```bash
# Create candidate
curl -X POST http://localhost:3010/api/candidates \
  -F 'candidateData={
    "firstName":"John",
    "lastName":"Doe",
    "email":"john@example.com",
    "phone":"+1234567890",
    "educations":[],
    "experiences":[]
  }' \
  -F 'documents=@/path/to/resume.pdf'

# Get all candidates
curl http://localhost:3010/api/candidates?page=1&limit=10

# Get institution suggestions
curl http://localhost:3010/api/candidates/autocomplete/institutions?query=harvard
```

## 🗃️ Database Schema

### Candidate

```typescript
{
  id: number
  firstName: string
  lastName: string
  email: string (unique)
  phone: string
  address?: string
  linkedIn?: string
  portfolio?: string
  createdAt: DateTime
  updatedAt: DateTime
}
```

### Education

```typescript
{
  id: number
  candidateId: number
  institution: string
  degree: string
  fieldOfStudy: string
  startDate: DateTime
  endDate?: DateTime
  current: boolean
  description?: string
}
```

### Experience

```typescript
{
  id: number
  candidateId: number
  company: string
  position: string
  description?: string
  startDate: DateTime
  endDate?: DateTime
  current: boolean
}
```

### Document

```typescript
{
  id: number;
  candidateId: number;
  fileName: string;
  originalName: string;
  fileType: string;
  fileSize: number;
  filePath: string;
  documentType: string;
}
```

## ✅ Validation Rules

### Personal Information

- **firstName/lastName**: Required, 2-50 chars, alphabetic
- **email**: Required, valid email format, unique
- **phone**: Required, international format
- **address**: Optional, max 200 chars
- **linkedIn/portfolio**: Optional, valid URL

### Education/Experience

- **institution/company**: Required
- **degree/position**: Required
- **startDate**: Required, valid date
- **endDate**: Required if not current, must be after startDate
- **current**: Boolean, disables endDate when true

### Files

- **Types**: PDF, DOC, DOCX only
- **Size**: Max 5MB per file
- **Count**: Max 3 files per candidate

## 🎨 Form Sections

1. **Personal Information**

   - First Name _, Last Name _, Email _, Phone _
   - Address, LinkedIn, Portfolio

2. **Education** (Dynamic - Add Multiple)

   - Institution _, Degree _, Field of Study \*
   - Start Date \*, End Date, Current checkbox
   - Description

3. **Work Experience** (Dynamic - Add Multiple)

   - Company _, Position _
   - Start Date \*, End Date, Current checkbox
   - Description

4. **Documents** (Upload)
   - Click or drag-drop
   - PDF or DOCX
   - Max 5MB, up to 3 files

## 🐛 Troubleshooting

### Backend won't start

```bash
# Check if port is in use
lsof -ti:3010 | xargs kill -9

# Check database connection
psql -U postgres

# Regenerate Prisma Client
cd backend
npm run prisma:generate
```

### Frontend won't start

```bash
# Check if port is in use
lsof -ti:3000 | xargs kill -9

# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Database connection error

```bash
# Check PostgreSQL is running
pg_isready

# Verify DATABASE_URL in backend/.env
# Format: postgresql://user:password@localhost:5432/database_name

# Push schema again
cd backend
npx prisma db push
```

### File upload not working

```bash
# Create uploads directory
mkdir -p backend/uploads

# Set permissions
chmod 755 backend/uploads
```

### CORS errors

```bash
# Verify FRONTEND_URL in backend/.env matches frontend URL
# Default: http://localhost:3000

# Restart backend after changing .env
```

## 🔒 Environment Variables

### Backend (.env)

```env
DATABASE_URL="postgresql://user:password@localhost:5432/ats_db?schema=public"
FRONTEND_URL="http://localhost:3000"
NODE_ENV="development"
```

### Frontend (.env)

```env
REACT_APP_API_URL=http://localhost:3010
```

## 📝 Testing Checklist

- [ ] Backend starts without errors
- [ ] Frontend starts without errors
- [ ] Database connection works
- [ ] Form loads correctly
- [ ] Personal info validation works
- [ ] Can add/remove education entries
- [ ] Can add/remove experience entries
- [ ] Institution autocomplete works
- [ ] Company autocomplete works
- [ ] File upload works (valid files)
- [ ] File upload rejects invalid files
- [ ] Form submission succeeds
- [ ] Success message appears
- [ ] Form resets after submission
- [ ] Data appears in database (Prisma Studio)

## 🎯 Common Tasks

### View Database

```bash
cd backend
npx prisma studio
# Opens at http://localhost:5555
```

### Reset Database

```bash
cd backend
npx prisma db push --force-reset
# ⚠️ This deletes all data!
```

### Check Backend Status

```bash
curl http://localhost:3010
# Should return: {"message":"ATS API Server",...}
```

### Test API

```bash
# Using curl
curl http://localhost:3010/api/candidates

# Using browser
# Open: http://localhost:3010/api/candidates
```

### Add New Field to Database

```bash
1. Edit backend/prisma/schema.prisma
2. cd backend
3. npx prisma db push
4. npm run prisma:generate
5. Restart backend
```

## 📚 Key Files to Edit

### Add new validation rule

- `backend/src/middleware/validation.middleware.ts`
- `frontend/src/utils/validation.ts`

### Add new API endpoint

1. `backend/src/routes/candidate.routes.ts` (define route)
2. `backend/src/controllers/candidate.controller.ts` (add method)
3. `frontend/src/services/api.service.ts` (add API call)

### Modify form UI

- `frontend/src/components/CandidateForm.tsx`
- `frontend/src/components/CandidateForm.css`

### Change database schema

1. `backend/prisma/schema.prisma`
2. Run `npx prisma db push`
3. Run `npm run prisma:generate`

## 🔗 Useful URLs

- Frontend: http://localhost:3000
- Backend API: http://localhost:3010
- API Root: http://localhost:3010/api
- Candidates API: http://localhost:3010/api/candidates
- Prisma Studio: http://localhost:5555 (after running `npx prisma studio`)

## 💡 Tips

- **Always validate on both client AND server**
- **Use TypeScript types consistently**
- **Test file uploads with various file types**
- **Check browser console for frontend errors**
- **Check terminal for backend errors**
- **Use Prisma Studio to verify database changes**
- **Keep .env files out of version control**
- **Restart backend after changing .env**

## 📞 Getting Help

1. Check console/terminal for error messages
2. Review [SETUP.md](SETUP.md) troubleshooting section
3. Verify all dependencies are installed
4. Check that both frontend and backend are running
5. Verify database connection
6. Try clearing browser cache
7. Try restarting both servers

---

**Quick tip**: Keep this file open in a separate window while developing!
