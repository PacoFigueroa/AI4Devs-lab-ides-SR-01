# Getting Started - Your First 5 Minutes

Welcome! This guide will get you up and running in 5 minutes.

## ⚡ Quick Start (Copy & Paste)

### Step 1: Setup Backend (2 minutes)

```bash
# Navigate to backend
cd backend

# Install dependencies
npm install

# Setup environment variable
echo 'DATABASE_URL="postgresql://postgres:password@localhost:5432/ats_db?schema=public"' > .env
echo 'FRONTEND_URL="http://localhost:3000"' >> .env

# Generate Prisma client
npm run prisma:generate
```

### Step 2: Setup Database (1 minute)

**Option A - Using Docker (Recommended)**

```bash
# From project root
docker-compose up -d
```

**Option B - Manual PostgreSQL**

```bash
# Create database
psql -U postgres -c "CREATE DATABASE ats_db;"
```

Then push the schema:

```bash
# From backend directory
npx prisma db push
```

### Step 3: Setup Frontend (1 minute)

```bash
# Navigate to frontend
cd ../frontend

# Install dependencies
npm install

# Setup environment variable
echo 'REACT_APP_API_URL=http://localhost:3010' > .env
```

### Step 4: Run the Application (1 minute)

**Terminal 1 - Backend:**

```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**

```bash
cd frontend
npm start
```

Your browser should automatically open to `http://localhost:3000`! 🎉

---

## 📝 Try It Out

1. **Fill in Personal Information:**

   - First Name: John
   - Last Name: Doe
   - Email: john.doe@example.com
   - Phone: +1234567890

2. **Add Education:**

   - Click "+ Add Education"
   - Institution: Harvard University (try typing "harv" to see autocomplete)
   - Degree: Bachelor's Degree
   - Field of Study: Computer Science
   - Start Date: 2015-09-01
   - End Date: 2019-06-01

3. **Add Experience:**

   - Click "+ Add Experience"
   - Company: Google (try typing "goo" for autocomplete after adding one)
   - Position: Software Engineer
   - Start Date: 2019-07-01
   - Check "Currently working here"

4. **Upload Resume:**

   - Drag and drop a PDF file, or click to browse
   - Try uploading a file (PDF or DOCX only, max 5MB)

5. **Submit:**

   - Click "Submit Candidate"
   - See the success message! ✅

6. **Verify in Database:**

```bash
cd backend
npx prisma studio
```

Open http://localhost:5555 to see your data!

---

## 🎯 What You Just Built

A complete **Candidate Management System** with:

✅ Full candidate profile form  
✅ Real-time validation  
✅ Education & experience tracking  
✅ Document upload (PDF, DOCX)  
✅ Smart autocomplete  
✅ Mobile responsive design  
✅ Accessibility compliant

---

## 📚 Next Steps

### Explore the Features:

- Try adding multiple education entries
- Test the validation (leave required fields empty)
- Try uploading different file types
- Test the autocomplete (needs data first)
- Try the responsive design (resize your browser)

### View the Documentation:

- **[SETUP.md](SETUP.md)** - Detailed setup and troubleshooting
- **[CANDIDATE_WORKFLOW.md](CANDIDATE_WORKFLOW.md)** - Complete feature guide
- **[QUICK_REFERENCE.md](QUICK_REFERENCE.md)** - Commands and shortcuts
- **[PROJECT_SUMMARY.md](PROJECT_SUMMARY.md)** - Architecture overview

### Customize:

- Add new fields to the form
- Modify validation rules
- Change the styling
- Add new API endpoints

---

## 🐛 Quick Troubleshooting

### "Port 3000/3010 already in use"

```bash
# Kill the process
lsof -ti:3000 | xargs kill -9
lsof -ti:3010 | xargs kill -9
```

### "Database connection failed"

```bash
# Check if PostgreSQL is running
pg_isready

# Or restart Docker
docker-compose restart
```

### "Module not found"

```bash
# Reinstall dependencies
cd backend && npm install
cd ../frontend && npm install
```

### "Prisma Client errors"

```bash
cd backend
npm run prisma:generate
npx prisma db push
```

---

## 💡 Pro Tips

1. **Keep both terminals visible** to see logs
2. **Use Prisma Studio** to view data: `npx prisma studio`
3. **Check browser console** for frontend errors
4. **Check terminal** for backend errors
5. **Read error messages carefully** - they're helpful!

---

## 🎓 Learning Resources

### Understand the Stack:

- **React**: https://react.dev
- **TypeScript**: https://typescriptlang.org
- **Prisma**: https://prisma.io
- **Express**: https://expressjs.com

### Key Concepts Used:

- React Hooks (useState, useEffect, useRef)
- TypeScript Interfaces
- RESTful APIs
- Form Validation
- File Uploads
- Database Relations

---

## 🎉 Congratulations!

You now have a fully functional ATS candidate management system!

### What You Can Do Now:

- ✅ Add candidates with complete information
- ✅ Track education and work history
- ✅ Upload resumes and documents
- ✅ Search with autocomplete
- ✅ View all data in the database

### What's Next:

- Add more features (see CANDIDATE_WORKFLOW.md)
- Deploy to production
- Add authentication
- Integrate with other systems
- Build a dashboard

---

**Need Help?** Check [SETUP.md](SETUP.md) for detailed troubleshooting!

**Ready to Dive Deeper?** Read [PROJECT_SUMMARY.md](PROJECT_SUMMARY.md) for architecture details!

---

**Happy Coding! 🚀**
