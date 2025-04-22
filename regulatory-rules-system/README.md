# Regulatory Rules Maintenance System

A comprehensive system for managing and maintaining regulatory rules with role-based access control.

## Project Structure

```
regulatory-rules-system/
├── backend/                 # Spring Boot backend
│   ├── src/
│   │   └── main/
│   │       ├── java/       # Java source files
│   │       └── resources/  # Application properties
│   └── pom.xml            # Maven configuration
└── frontend/              # React frontend
    ├── public/           # Static files
    ├── src/
    │   ├── components/   # React components
    │   ├── context/      # React context providers
    │   ├── pages/        # Page components
    │   └── services/     # API services
    └── package.json      # NPM configuration
```

## Features

- Dynamic field configuration for regulatory rules
- Role-based access control (READ_ONLY, WRITE_ACCESS)
- Filtering and pagination support
- CSV export functionality
- Real-time validation
- Responsive Material-UI design

## Technology Stack

### Backend
- Spring Boot 2.7.0
- Spring Security
- MongoDB
- Maven

### Frontend
- React 18
- Material-UI
- React Query
- React Router
- Axios

## Setup Instructions

### Backend Setup

1. Ensure you have Java 11 and Maven installed
2. Navigate to the backend directory:
   ```bash
   cd regulatory-rules-system/backend
   ```
3. Install dependencies and build:
   ```bash
   mvn clean install
   ```
4. Run the application:
   ```bash
   mvn spring-boot:run
   ```
   The backend will start on http://localhost:8080

### Frontend Setup

1. Ensure you have Node.js and npm installed
2. Navigate to the frontend directory:
   ```bash
   cd regulatory-rules-system/frontend
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Start the development server:
   ```bash
   npm start
   ```
   The frontend will start on http://localhost:3000

## Available Scripts

### Backend
- `mvn clean install` - Build the project
- `mvn spring-boot:run` - Run the application
- `mvn test` - Run tests

### Frontend
- `npm start` - Start development server
- `npm build` - Build for production
- `npm test` - Run tests
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint errors

## API Endpoints

### Field Metadata
- `GET /api/fields` - Get field configuration

### Rules
- `GET /api/rules` - Get rules list (with filters and pagination)
- `POST /api/rules` - Create new rule
- `PUT /api/rules/{id}` - Update existing rule
- `GET /api/rules/extract` - Download filtered data as CSV

### Access Control
- `GET /api/user/access` - Get user role and access rights

## Environment Variables

### Backend
```properties
# MongoDB Configuration
spring.data.mongodb.host=localhost
spring.data.mongodb.port=27017
spring.data.mongodb.database=regulatory_rules

# Server Configuration
server.port=8080
server.servlet.context-path=/api
```

### Frontend
```env
# API Configuration (in .env file)
REACT_APP_API_URL=http://localhost:8080/api
```

## Security

- Role-based access control (RBAC) implementation
- Spring Security integration
- Protected API endpoints
- CORS configuration
- XSS protection
- CSRF protection

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
