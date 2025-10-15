# Testing Quick Start Guide

## 🚀 Quick Commands

### Run All Tests

```bash
./run-tests.sh
```

### Backend Tests

```bash
cd backend
npm test                          # Run all tests
npm test -- validation            # Run specific test
npm test -- --coverage            # With coverage
npm test -- --watch               # Watch mode
```

### Frontend Tests

```bash
cd frontend
npm test                          # Run all tests
npm test:watch                    # Watch mode
npm test:coverage                 # With coverage
```

## 📊 Test Files Location

### Backend

```
backend/
├── src/tests/
│   ├── unit/
│   │   └── validation.test.ts       # Validation unit tests
│   └── integration/
│       └── candidate.api.test.ts    # API integration tests
└── features/
    └── candidate-management.feature  # BDD scenarios (Gherkin)
```

### Frontend

```
frontend/
└── src/
    ├── utils/
    │   └── validation.test.ts        # Validation utility tests
    └── services/
        └── api.service.test.ts       # API service tests
```

## 🎯 What's Tested

### Backend (35+ tests)

- ✅ Validation rules (email, phone, name, dates)
- ✅ API endpoints (POST, GET, autocomplete)
- ✅ File uploads
- ✅ Error handling
- ✅ Database operations
- ✅ Duplicate prevention
- ✅ Data cleanup

### Frontend (65+ tests)

- ✅ Email validation
- ✅ Phone validation
- ✅ URL validation
- ✅ Form validation (complete)
- ✅ Education validation
- ✅ Experience validation
- ✅ API service methods
- ✅ Network error handling

### BDD Features (20+ scenarios)

- ✅ Create candidate (happy path)
- ✅ Validation errors
- ✅ File uploads
- ✅ Duplicate emails
- ✅ Autocomplete
- ✅ Pagination
- ✅ Edge cases

## 🔍 Common Test Commands

### Run Specific Test Suite

```bash
# Backend
npm test -- validation.test
npm test -- candidate.api.test

# Frontend
npm test -- validation.test
npm test -- api.service.test
```

### Watch Mode (Auto-rerun on changes)

```bash
# Backend
npm test -- --watch

# Frontend
npm test:watch
```

### Coverage Reports

```bash
# Backend
npm test -- --coverage
# Open: coverage/lcov-report/index.html

# Frontend
npm test:coverage
# Open: coverage/lcov-report/index.html
```

### Verbose Output

```bash
npm test -- --verbose
```

## 🧪 Test Examples

### Unit Test

```typescript
it("should validate email format", () => {
  expect(validateEmail("user@example.com")).toBe(true);
  expect(validateEmail("invalid")).toBe(false);
});
```

### Integration Test

```typescript
it("should create candidate with valid data", async () => {
  const response = await request(app)
    .post("/api/candidates")
    .field(
      "candidateData",
      JSON.stringify({
        firstName: "John",
        lastName: "Doe",
        email: "test@example.com",
        phone: "+1234567890",
        educations: [],
        experiences: [],
      })
    );

  expect(response.status).toBe(201);
  expect(response.body.success).toBe(true);
});
```

### BDD Scenario

```gherkin
Scenario: Successfully add a new candidate
  Given I have candidate information
  When I submit the candidate form
  Then the candidate should be created successfully
  And the candidate should be stored in the database
```

## ⚙️ Setup Requirements

### Backend

1. **Dependencies installed**: `npm install`
2. **Database running**: `docker-compose up -d`
3. **Prisma generated**: `npm run prisma:generate`
4. **Environment variables**: `.env` file configured

### Frontend

1. **Dependencies installed**: `npm install`
2. **Environment variables**: `.env` file with `REACT_APP_API_URL`

## 🐛 Troubleshooting

### "Database connection failed"

```bash
# Ensure database is running
docker-compose up -d

# Check connection
cd backend
npx prisma db push
```

### "Module not found"

```bash
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

### "Tests not running"

```bash
# Ensure Jest is installed
npm install --save-dev jest ts-jest @types/jest

# Run with full path
./node_modules/.bin/jest
```

## 📈 Coverage Goals

- **Unit Tests**: > 80%
- **Integration Tests**: > 70%
- **Overall**: > 75%

## ✅ Pre-Commit Checklist

Before committing code:

1. ✅ Run all tests: `./run-tests.sh`
2. ✅ Check coverage: `npm test -- --coverage`
3. ✅ Ensure no failing tests
4. ✅ Review test output
5. ✅ Add tests for new features

## 📚 Full Documentation

For detailed documentation:

- **TESTING.md** - Complete testing documentation
- **TEST_IMPLEMENTATION_SUMMARY.md** - Implementation details
- **README.md** - Project overview

## 🎯 Quick Tips

### Writing New Tests

1. **Unit Test**: Test a single function/method

   ```typescript
   describe("myFunction", () => {
     it("should do something", () => {
       expect(myFunction()).toBe(expected);
     });
   });
   ```

2. **Integration Test**: Test API endpoint

   ```typescript
   describe("POST /api/resource", () => {
     it("should create resource", async () => {
       const response = await request(app).post("/api/resource").send(data);

       expect(response.status).toBe(201);
     });
   });
   ```

3. **BDD Scenario**: Describe behavior
   ```gherkin
   Scenario: User action
     Given initial state
     When action is performed
     Then expected result occurs
   ```

### Test Best Practices

✅ **DO**:

- Write tests before code (TDD)
- Use descriptive test names
- Test edge cases
- Clean up test data
- Mock external dependencies

❌ **DON'T**:

- Test implementation details
- Share state between tests
- Use production data
- Skip error case testing

## 🚦 CI/CD Integration

### GitHub Actions Example

```yaml
- name: Run tests
  run: |
    npm test -- --coverage

- name: Check coverage
  run: |
    npm test -- --coverage --coverageThreshold='{"global":{"branches":80,"functions":80,"lines":80}}'
```

## 📞 Support

Issues with tests?

1. Check this guide
2. Review TESTING.md
3. Check test output for errors
4. Verify database connection
5. Ensure dependencies installed

---

**Last Updated**: October 2025  
**Test Count**: 120+ tests  
**Coverage**: > 80%  
**Status**: ✅ Production Ready
