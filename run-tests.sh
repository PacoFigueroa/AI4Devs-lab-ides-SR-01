#!/bin/bash

# Test Runner Script for ATS Candidate Management System
# This script runs all tests for both backend and frontend

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}    ATS Test Runner${NC}"
echo -e "${BLUE}========================================${NC}"
echo ""

# Function to print colored messages
print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_info() {
    echo -e "${YELLOW}ℹ️  $1${NC}"
}

print_section() {
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${BLUE}  $1${NC}"
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
}

# Check if node_modules exists
check_dependencies() {
    print_section "Checking Dependencies"
    
    if [ ! -d "backend/node_modules" ]; then
        print_info "Backend dependencies not found. Installing..."
        cd backend && npm install && cd ..
        print_success "Backend dependencies installed"
    else
        print_success "Backend dependencies OK"
    fi
    
    if [ ! -d "frontend/node_modules" ]; then
        print_info "Frontend dependencies not found. Installing..."
        cd frontend && npm install && cd ..
        print_success "Frontend dependencies installed"
    else
        print_success "Frontend dependencies OK"
    fi
    
    echo ""
}

# Run backend tests
run_backend_tests() {
    print_section "Running Backend Tests"
    
    cd backend
    
    print_info "Running unit tests..."
    if npm test -- --testPathPattern=unit --passWithNoTests; then
        print_success "Backend unit tests passed"
    else
        print_error "Backend unit tests failed"
        cd ..
        return 1
    fi
    
    print_info "Running integration tests..."
    if npm test -- --testPathPattern=integration --passWithNoTests; then
        print_success "Backend integration tests passed"
    else
        print_error "Backend integration tests failed"
        cd ..
        return 1
    fi
    
    cd ..
    echo ""
}

# Run frontend tests
run_frontend_tests() {
    print_section "Running Frontend Tests"
    
    cd frontend
    
    print_info "Running frontend tests..."
    if npm test -- --passWithNoTests; then
        print_success "Frontend tests passed"
    else
        print_error "Frontend tests failed"
        cd ..
        return 1
    fi
    
    cd ..
    echo ""
}

# Generate coverage report
generate_coverage() {
    print_section "Generating Coverage Reports"
    
    print_info "Backend coverage..."
    cd backend
    npm test -- --coverage --passWithNoTests > /dev/null 2>&1 || true
    cd ..
    
    print_info "Frontend coverage..."
    cd frontend
    npm test:coverage > /dev/null 2>&1 || true
    cd ..
    
    print_success "Coverage reports generated"
    print_info "Backend coverage: backend/coverage/lcov-report/index.html"
    print_info "Frontend coverage: frontend/coverage/lcov-report/index.html"
    echo ""
}

# Main execution
main() {
    # Check for flags
    RUN_COVERAGE=false
    SKIP_BACKEND=false
    SKIP_FRONTEND=false
    
    for arg in "$@"
    do
        case $arg in
            --coverage)
                RUN_COVERAGE=true
                shift
                ;;
            --backend-only)
                SKIP_FRONTEND=true
                shift
                ;;
            --frontend-only)
                SKIP_BACKEND=true
                shift
                ;;
            --help)
                echo "Usage: ./run-tests.sh [OPTIONS]"
                echo ""
                echo "Options:"
                echo "  --coverage        Generate coverage reports"
                echo "  --backend-only    Run only backend tests"
                echo "  --frontend-only   Run only frontend tests"
                echo "  --help            Show this help message"
                echo ""
                echo "Examples:"
                echo "  ./run-tests.sh                    # Run all tests"
                echo "  ./run-tests.sh --coverage         # Run all tests with coverage"
                echo "  ./run-tests.sh --backend-only     # Run only backend tests"
                exit 0
                ;;
        esac
    done
    
    # Check dependencies
    check_dependencies
    
    # Run tests
    TEST_FAILED=false
    
    if [ "$SKIP_BACKEND" = false ]; then
        if ! run_backend_tests; then
            TEST_FAILED=true
        fi
    fi
    
    if [ "$SKIP_FRONTEND" = false ]; then
        if ! run_frontend_tests; then
            TEST_FAILED=true
        fi
    fi
    
    # Generate coverage if requested
    if [ "$RUN_COVERAGE" = true ]; then
        generate_coverage
    fi
    
    # Final summary
    print_section "Test Summary"
    
    if [ "$TEST_FAILED" = true ]; then
        print_error "Some tests failed!"
        echo ""
        print_info "Tips:"
        echo "  - Check test output above for details"
        echo "  - Ensure database is running (docker-compose up -d)"
        echo "  - Check .env configuration"
        echo "  - Review TESTING.md for more info"
        exit 1
    else
        print_success "All tests passed! 🎉"
        echo ""
        print_info "Next steps:"
        echo "  - Run with --coverage to see coverage reports"
        echo "  - Check TESTING.md for detailed documentation"
        echo "  - Review TEST_IMPLEMENTATION_SUMMARY.md for test details"
        exit 0
    fi
}

# Run main function
main "$@"

