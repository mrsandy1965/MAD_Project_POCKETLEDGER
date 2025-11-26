# PocketLedger - Technology Stack

## Programming Languages
- **JavaScript (ES6+)**: Primary language for both frontend and backend
- **SQL**: Database queries via Prisma ORM

## Frontend Technologies

### Mobile Framework
- **React Native 0.81.4**: Cross-platform mobile development
- **React 19.1.0**: UI component library
- **Expo ~54.0.10**: Development platform and build tooling

### Navigation
- **@react-navigation/native 7.1.17**: Navigation framework
- **@react-navigation/native-stack 7.3.26**: Stack-based navigation
- **@react-navigation/bottom-tabs 7.4.7**: Bottom tab navigation
- **@react-navigation/drawer 7.5.8**: Drawer navigation
- **react-native-screens 4.16.0**: Native screen optimization
- **react-native-gesture-handler 2.28.0**: Touch gesture handling
- **react-native-reanimated 4.1.0**: Animation library

### State Management & Storage
- **React Context API**: Global state management
- **@react-native-async-storage/async-storage 1.23.1**: Local data persistence

### AI/ML & Camera
- **@react-native-ml-kit/text-recognition 2.0.0**: OCR for receipt scanning
- **expo-camera 17.0.8**: Camera access and control
- **expo-image-picker 17.0.8**: Image selection from gallery

### Data Visualization
- **react-native-chart-kit 6.12.0**: Charts and graphs for financial dashboards

### Utilities
- **react-native-get-random-values 1.11.0**: Cryptographic random values
- **react-native-safe-area-context 5.6.0**: Safe area handling
- **react-native-worklets 0.5.1**: High-performance worklets
- **expo-status-bar 3.0.8**: Status bar configuration

### Web Support
- **react-dom 19.1.0**: React DOM rendering
- **react-native-web 0.21.0**: Web platform support

## Backend Technologies

### Runtime & Framework
- **Node.js**: JavaScript runtime environment
- **Express.js 4.19.2**: Web application framework
- **dotenv 16.4.5**: Environment variable management

### Database & ORM
- **Prisma 6.1.0**: Next-generation ORM
- **@prisma/client 6.1.0**: Prisma database client
- **MySQL**: Relational database management system

### Authentication & Security
- **jsonwebtoken 9.0.2**: JWT token generation and verification
- **bcryptjs 2.4.3**: Password hashing and comparison

### Middleware & Utilities
- **cors 2.8.5**: Cross-Origin Resource Sharing
- **morgan 1.10.0**: HTTP request logger

### Development Tools
- **nodemon 3.1.4**: Auto-restart development server

### Testing
- **jest 29.7.0**: JavaScript testing framework
- **supertest 6.3.4**: HTTP assertion library

## Build Systems & Tools

### Frontend Build Tools
- **Expo CLI**: Development and build management
- **Babel**: JavaScript transpilation
- **babel-preset-expo 54.0.3**: Expo-specific Babel preset
- **@babel/preset-react 7.27.1**: React JSX transformation

### Backend Build Tools
- **npm**: Package management
- **Prisma CLI**: Database migrations and schema management

## Development Commands

### Backend Commands
```bash
npm start              # Start production server
npm run dev            # Start development server with nodemon
npm run seed           # Populate database with sample data
npm test               # Run Jest tests
npm run prisma:generate    # Generate Prisma client
npm run prisma:migrate     # Run database migrations
```

### Frontend Commands
```bash
npm start              # Start Expo development server
npm run android        # Start on Android emulator/device
npm run ios            # Start on iOS simulator/device
npm run web            # Start web version
```

## Database Schema

### Prisma Configuration
- **Provider**: MySQL
- **Client Generator**: prisma-client-js
- **Connection**: Environment variable DATABASE_URL

### Enums
- **TransactionType**: income, expense
- **CategoryType**: income, expense, general
- **InvoiceStatus**: paid, unpaid

### Models
- **User**: id (cuid), name, email, password, timestamps
- **Transaction**: id (cuid), title, amount, type, category, date, notes, userId, timestamps
- **Category**: id (cuid), name, type, isDefault, userId, timestamps
- **Invoice**: id (cuid), invoiceNumber, clientName, status, totalAmount, date, userId, timestamps
- **InvoiceItem**: id (cuid), name, quantity, price, invoiceId

## Environment Variables

### Backend (.env)
```
DATABASE_URL=mysql://user:password@host:port/database
JWT_SECRET=your_jwt_secret_key
PORT=8080
```

### Frontend (.env)
```
API_URL=http://localhost:8080/api
FIREBASE_API_KEY=your_firebase_api_key
FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
FIREBASE_PROJECT_ID=your_firebase_project_id
```

## API Architecture

### RESTful Endpoints
- **POST /api/auth/register**: User registration
- **POST /api/auth/login**: User authentication
- **GET /api/transactions**: List user transactions
- **POST /api/transactions**: Create transaction
- **PUT /api/transactions/:id**: Update transaction
- **DELETE /api/transactions/:id**: Delete transaction
- **GET /api/categories**: List categories
- **POST /api/categories**: Create category
- **GET /api/invoices**: List invoices
- **POST /api/invoices**: Create invoice
- **GET /api/reports**: Generate financial reports

### Authentication
- **Method**: JWT (JSON Web Tokens)
- **Header**: Authorization: Bearer <token>
- **Token Storage**: AsyncStorage (mobile), localStorage (web)

## Deployment Targets

### Backend Deployment
- **Vercel**: Serverless deployment option
- **Google Cloud Platform (GCP)**: Cloud hosting option
- **Requirements**: Node.js runtime, MySQL database

### Frontend Deployment
- **Expo Application Services (EAS)**: Build and submit to app stores
- **Android**: APK/AAB for Google Play Store
- **iOS**: IPA for Apple App Store
- **Web**: Static hosting via Expo web build

## Development Environment

### Prerequisites
- Node.js (v16+ recommended)
- npm or yarn
- MySQL database server
- Expo CLI (npm install -g expo-cli)
- Android Studio (for Android development)
- Xcode (for iOS development, macOS only)

### IDE Recommendations
- Visual Studio Code
- WebStorm
- Android Studio (for native debugging)
- Xcode (for iOS debugging)

## Performance Considerations
- **Database Indexing**: userId and date indexed on Transaction model
- **Lazy Loading**: Navigation screens loaded on demand
- **Optimized Rendering**: React Native performance optimizations
- **Caching**: AsyncStorage for offline data access
- **Image Optimization**: Compressed assets for faster loading

## Security Features
- **Password Hashing**: bcryptjs with salt rounds
- **JWT Expiration**: Token-based session management
- **CORS Configuration**: Controlled cross-origin access
- **SQL Injection Prevention**: Prisma parameterized queries
- **Environment Variables**: Sensitive data in .env files
- **Cascade Deletion**: Automatic cleanup of related records
