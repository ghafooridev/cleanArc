# Customer Management CRUD Application

A TypeScript React application for managing customer information with validation and local storage persistence.

## Features

- Create, Read, Update, and Delete customer records
- Form validation for:
  - Phone numbers (using Google's libphonenumber)
  - Email addresses
  - Bank account numbers
- Unique customer validation (by first name, last name, and date of birth)
- Unique email validation
- Local storage persistence
- Responsive Material-UI design
- Comprehensive test coverage

## Project Structure

The project follows a clean architecture pattern:

```
src/
├── domain/           # Business logic and entities
├── application/      # Use cases and application logic
├── infrastructure/   # External services and implementations
├── presentation/     # UI components
└── __tests__/       # Test files
    ├── unit/        # Unit tests
    ├── integration/ # Integration tests
    └── e2e/         # End-to-end tests
```

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

### Development

To start the development server:

```bash
npm run dev
```

### Testing

Run tests:

```bash
npm test
```

Run tests in watch mode:

```bash
npm run test:watch
```

Generate test coverage:

```bash
npm run test:coverage
```

### Building for Production

```bash
npm run build
```

## Technology Stack

- React 18
- TypeScript
- Material-UI
- React Hook Form
- Jest & Testing Library
- libphonenumber-js
- Yup (validation)

## Development Guidelines

### Code Style

- Follow TypeScript best practices
- Use functional components with hooks
- Implement proper error handling
- Write comprehensive tests
- Follow the clean architecture pattern

### Testing

- Write unit tests for all business logic
- Test components with React Testing Library
- Maintain high test coverage
- Follow the Arrange-Act-Assert pattern

### Git Workflow

1. Create feature branches from main
2. Write meaningful commit messages
3. Create pull requests for code review
4. Ensure all tests pass before merging

## License

This project is licensed under the MIT License.
