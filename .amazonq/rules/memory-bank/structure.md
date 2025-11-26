# PocketLedger - Project Structure

## Architecture Overview
PocketLedger follows a client-server architecture with a React Native mobile frontend and Node.js/Express backend. The application uses Prisma ORM with MySQL for data persistence and implements RESTful API patterns for client-server communication.

## Directory Structure

### Root Level
```
MAD_Project_POCKETLEDGER/
├── backend/                 # Node.js/Express API server
├── pocketledger-frontend/   # React Native mobile application
└── Idea.md                  # Project proposal and planning document
```

## Backend Structure (`/backend`)

### Core Directories

#### `/config`
- **Purpose**: Database configuration and connection management
- **Key Files**: `db.js` - Prisma client initialization and connection handlers

#### `/controllers`
- **Purpose**: Business logic and request handling
- **Files**:
  - `authController.js` - User registration, login, authentication logic
  - `transactionController.js` - Transaction CRUD operations
  - `categoryController.js` - Category management
  - `invoiceController.js` - Invoice creation and management
  - `reportController.js` - Financial report generation

#### `/routes`
- **Purpose**: API endpoint definitions and routing
- **Files**:
  - `authRoutes.js` - Authentication endpoints (/api/auth)
  - `transactionRoutes.js` - Transaction endpoints (/api/transactions)
  - `categoryRoutes.js` - Category endpoints (/api/categories)
  - `invoiceRoutes.js` - Invoice endpoints (/api/invoices)
  - `reportRoutes.js` - Report endpoints (/api/reports)

#### `/middleware`
- **Purpose**: Request processing and authentication
- **Key Files**: `authMiddleware.js` - JWT token verification and user authentication

#### `/prisma`
- **Purpose**: Database schema and migrations
- **Key Files**: 
  - `schema.prisma` - Database models and relationships
  - `/migrations` - Database migration history

#### `/models`
- **Purpose**: Data model documentation
- **Key Files**: `README.md` - Model structure documentation

#### `/utils`
- **Purpose**: Shared utility functions
- **Key Files**: `response.js` - Standardized API response formatting

#### `/tests`
- **Purpose**: Unit and integration tests
- **Key Files**: `authRoutes.test.js` - Authentication endpoint tests

#### `/scripts`
- **Purpose**: Database seeding and maintenance scripts
- **Key Files**: `seed.js` - Sample data population

#### `/data`
- **Purpose**: Sample and seed data
- **Key Files**: `sampleData.js` - Default categories and sample transactions

### Backend Entry Point
- **`server.js`**: Main application entry point, middleware setup, route registration

## Frontend Structure (`/pocketledger-frontend`)

### Core Directories

#### `/src/components`
- **Purpose**: Reusable UI components
- **Structure**: Shared components used across multiple screens

#### `/src/context`
- **Purpose**: React Context API for global state management
- **Files**:
  - `AuthContext.js` - User authentication state and methods
  - `TransactionsContext.js` - Transaction data and operations

#### `/src/navigation`
- **Purpose**: React Navigation configuration
- **Files**:
  - `RootStack.js` - Root navigation container
  - `AppNavigator.js` - Main app navigation structure
  - `FinanceStack.js` - Finance-related screen navigation
  - `TransactionsStack.js` - Transaction screen navigation

#### `/src/screens`
- **Purpose**: Application screens organized by feature
- **Structure**:
  - `/Auth` - Login and authentication screens
  - `/Dashboard` - Main dashboard with financial overview
  - `/Finance` - Finance home and management screens
  - `/Transactions` - Transaction list and add transaction screens
  - `/Scanner` - Receipt scanning functionality
  - `/Invoices` - Invoice creation and management
  - `/Reports` - Financial report generation and viewing
  - `/Settings` - User settings and preferences

#### `/src/services`
- **Purpose**: External service integrations and API communication
- **Files**:
  - `api.js` - Backend API client with axios
  - `firebase.js` - Firebase configuration and services

#### `/assets`
- **Purpose**: Static assets (images, icons, fonts)
- **Files**: App icons, splash screens, adaptive icons

### Frontend Entry Points
- **`App.js`**: Main application component
- **`index.js`**: Application registration and initialization
- **`app.json`**: Expo configuration

## Data Models

### User Model
- Stores user credentials and profile information
- Relationships: One-to-many with Transactions, Categories, Invoices

### Transaction Model
- Records income and expense transactions
- Fields: title, amount, type, category, date, notes
- Indexed by userId and date for performance

### Category Model
- Manages transaction categories
- Types: income, expense, general
- Supports default and custom user categories

### Invoice Model
- Manages client invoices
- Fields: invoiceNumber, clientName, status, totalAmount, date
- Relationships: One-to-many with InvoiceItems

### InvoiceItem Model
- Individual line items in invoices
- Fields: name, quantity, price

## Architectural Patterns

### Backend Patterns
- **MVC Architecture**: Separation of routes, controllers, and models
- **Middleware Chain**: Request processing through authentication and validation layers
- **Repository Pattern**: Prisma ORM abstracts database operations
- **RESTful API Design**: Standard HTTP methods and resource-based endpoints
- **JWT Authentication**: Stateless token-based authentication

### Frontend Patterns
- **Context API**: Global state management for auth and transactions
- **Component-Based Architecture**: Reusable UI components
- **Stack Navigation**: Screen navigation with React Navigation
- **Service Layer**: Abstracted API communication
- **Async Storage**: Local data persistence

## Component Relationships

### Authentication Flow
1. User submits credentials → LoginScreen
2. API call via api.js service → /api/auth/login
3. authController validates → JWT token generated
4. Token stored in AuthContext → AsyncStorage
5. Protected routes accessible via authMiddleware

### Transaction Flow
1. User adds transaction → AddTransaction screen
2. Data sent via TransactionsContext → api.js
3. API call to /api/transactions → transactionController
4. Prisma saves to database → Response returned
5. TransactionsContext updates → UI refreshes

### Receipt Scanning Flow
1. User captures receipt → ReceiptScanner screen
2. ML Kit processes image → Text extracted
3. Parsed data → AddTransaction screen (pre-filled)
4. User confirms → Transaction saved via normal flow

## Configuration Files

### Backend
- **package.json**: Dependencies and scripts
- **jest.config.js**: Testing configuration
- **.env**: Environment variables (DATABASE_URL, JWT_SECRET, PORT)

### Frontend
- **package.json**: Dependencies and scripts
- **app.json**: Expo configuration
- **babel.config.js**: Babel transpilation settings
- **.env**: Environment variables (API_URL, Firebase config)
