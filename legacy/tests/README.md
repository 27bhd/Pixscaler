# Pixscaler Testing Suite

This directory contains all testing files and scripts for the Pixscaler application.

## Test Files

### API Tests
- `auth-api-test.js` - Tests authentication endpoints (register, login, profile)
- `image-processing-test.js` - Tests image resize endpoint with various scenarios
- `rate-limiting-test.js` - Tests rate limiting for free vs premium users

### Frontend Tests
- `ui-interaction-test.html` - Manual UI testing page
- `mobile-test.html` - Comprehensive mobile testing suite
- `auth-flow-test.html` - Tests authentication flow in browser
- `image-upload-test.html` - Tests drag/drop and file upload functionality

### Performance Tests
- `load-test.js` - Tests server performance under load
- `memory-test.js` - Tests memory usage during image processing

## Running Tests

### API Tests
```bash
node tests/auth-api-test.js
node tests/image-processing-test.js
node tests/rate-limiting-test.js
```

### Load Tests
```bash
node tests/load-test.js
```

### Manual UI Tests
Open the HTML files in your browser and follow the test scenarios.

#### Mobile Testing
```bash
npm run test:mobile
```
Then open `tests/mobile-test.html` on your mobile device to test:
- Touch interactions and responsiveness
- File upload and camera access
- Visual effects and animations
- Form usability on mobile

## Test Data
- Test images are stored in `tests/images/`
- Test user credentials are documented in each test file
- Database is automatically cleaned up after tests

## Coverage
- ✅ Authentication system
- ✅ Image processing
- ✅ Rate limiting
- ✅ File upload validation
- ✅ Error handling
- ✅ UI interactions

## Adding New Tests
1. Create test file in appropriate category
2. Follow naming convention: `feature-test.js`
3. Add documentation to this README
4. Include cleanup procedures 