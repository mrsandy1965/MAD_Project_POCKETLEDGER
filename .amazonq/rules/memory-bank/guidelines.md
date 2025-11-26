# PocketLedger - Development Guidelines

## Code Quality Standards

### Formatting & Structure
- **Indentation**: 2 spaces for both JavaScript and JSX
- **Semicolons**: Required at end of statements
- **Quotes**: Double quotes for strings, single quotes for imports
- **Line Length**: Keep lines readable, break long chains appropriately
- **Trailing Commas**: Used in multi-line objects and arrays

### Naming Conventions
- **Variables & Functions**: camelCase (e.g., `createTransaction`, `authLoading`, `handleProfileSave`)
- **React Components**: PascalCase (e.g., `SettingsScreen`, `AuthProvider`, `MetricCard`)
- **Constants**: UPPER_SNAKE_CASE (e.g., `TOKEN_KEY`, `DEFAULT_API_URL`, `API_BASE_URL`)
- **Private Functions**: camelCase with descriptive names (e.g., `handleResponse`, `buildHeaders`)
- **Boolean Variables**: Prefix with `is`, `has`, or descriptive state (e.g., `isAuthenticated`, `initializing`, `savingProfile`)
- **Event Handlers**: Prefix with `handle` (e.g., `handleAuthSuccess`, `handlePasswordChange`)

### File Organization
- **Imports Order**:
  1. React and React Native core imports
  2. Third-party libraries (navigation, icons, storage)
  3. Local context and services
  4. Utilities and helpers
- **Component Structure**:
  1. Main component function
  2. Sub-components (if any)
  3. StyleSheet definitions at bottom
- **Controller Structure**:
  1. Imports
  2. Controller functions
  3. Module exports

### Documentation Standards
- **Minimal Comments**: Code should be self-documenting through clear naming
- **Error Logging**: Console errors include descriptive context (e.g., `'Create transaction error:'`, `'Stats error:'`)
- **JSDoc**: Not heavily used; prefer clear function and variable names
- **README Files**: Used for model documentation and setup instructions

## React & React Native Patterns

### Component Patterns
- **Functional Components**: All components use function syntax, no class components
- **Hooks Usage**:
  - `useState` for local component state
  - `useEffect` for side effects and initialization
  - `useMemo` for expensive computations and object stability
  - `useContext` for accessing global state
  - Custom hooks for reusable logic (e.g., `useAuth`, `useTransactions`)

### State Management
- **Context API**: Primary state management solution
- **Context Structure**:
  ```javascript
  const [state, setState] = useState(initialValue);
  const value = useMemo(() => ({ state, actions }), [dependencies]);
  return <Context.Provider value={value}>{children}</Context.Provider>;
  ```
- **Custom Hooks**: Export custom hooks for context consumption
  ```javascript
  export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error("useAuth must be used within AuthProvider");
    return context;
  };
  ```

### Component Composition
- **Sub-Components**: Define small, reusable components within the same file
  ```javascript
  const MetricCard = ({ label, value, icon, highlight }) => (
    <View style={[styles.metricCard, highlight && styles.metricCardHighlight]}>
      {/* component content */}
    </View>
  );
  ```
- **Props Destructuring**: Destructure props in function parameters
- **Spread Props**: Use `{...props}` for passing through additional props
- **Conditional Styling**: Use array syntax for conditional styles
  ```javascript
  style={[styles.base, condition && styles.conditional]}
  ```

### Async Operations
- **Try-Catch Blocks**: Wrap all async operations
- **Loading States**: Track loading with boolean state variables
- **Error Handling**: Set error state and show user-friendly alerts
- **Finally Blocks**: Always reset loading states in finally
  ```javascript
  try {
    setLoading(true);
    await operation();
  } catch (err) {
    setError(err.message);
    Alert.alert('Operation failed', err.message);
  } finally {
    setLoading(false);
  }
  ```

### Data Persistence
- **AsyncStorage**: Used for token and local data storage
- **Storage Keys**: Define as constants (e.g., `TOKEN_KEY = "pocketledger_token"`)
- **Session Hydration**: Restore session on app initialization
  ```javascript
  useEffect(() => {
    const bootstrap = async () => {
      const storedToken = await AsyncStorage.getItem(TOKEN_KEY);
      if (storedToken) await hydrateSession(storedToken);
      setInitializing(false);
    };
    bootstrap();
  }, []);
  ```

## Backend Patterns

### Controller Structure
- **Async Functions**: All controller functions are async
- **Request Validation**: Validate required fields at start of function
  ```javascript
  if (!title || !amount || !type || !category) {
    return errorResponse(res, 'Title, amount, type and category are required', 400);
  }
  ```
- **Type Coercion**: Explicitly parse and validate types
  ```javascript
  const parsedAmount = Number(amount);
  if (Number.isNaN(parsedAmount)) {
    return errorResponse(res, 'Amount must be a number', 400);
  }
  ```
- **User Authorization**: Access user ID from `req.user.id` (set by auth middleware)
- **Error Handling**: Catch all errors, log to console, return error response
  ```javascript
  try {
    // operation
  } catch (error) {
    console.error('Operation error:', error.message);
    return errorResponse(res, 'Unable to perform operation');
  }
  ```

### Database Operations (Prisma)
- **Prisma Client**: Import from config: `const { prisma } = require('../config/db')`
- **Query Patterns**:
  - `findMany` with `where`, `orderBy`, `skip`, `take` for lists
  - `findFirst` for single record with user ownership check
  - `create` with `data` object
  - `update` with `where` and `data`
  - `delete` with `where`
  - `count` for pagination totals
- **User Scoping**: Always filter by `userId: req.user.id` for user-specific data
- **Ownership Verification**: Check record exists and belongs to user before update/delete
  ```javascript
  const existing = await prisma.transaction.findFirst({
    where: { id, userId: req.user.id }
  });
  if (!existing) return errorResponse(res, 'Transaction not found', 404);
  ```
- **Parallel Queries**: Use `Promise.all` for independent queries
  ```javascript
  const [transactions, total] = await Promise.all([
    prisma.transaction.findMany({ where, orderBy, skip, take }),
    prisma.transaction.count({ where })
  ]);
  ```

### API Response Format
- **Standardized Responses**: Use utility functions from `utils/response.js`
  ```javascript
  successResponse(res, { data }, 'Success message', statusCode);
  errorResponse(res, 'Error message', statusCode);
  ```
- **Success Response Structure**:
  ```javascript
  { success: true, data: {...}, message: 'Operation successful' }
  ```
- **Error Response Structure**:
  ```javascript
  { success: false, message: 'Error description' }
  ```
- **Pagination Format**:
  ```javascript
  {
    transactions: [...],
    pagination: { total, page, limit }
  }
  ```

### Query Parameters
- **Filtering**: Support type, category, date range filters
- **Pagination**: Default `page=1`, `limit=50`
- **Date Handling**: Parse query dates with `new Date()`
- **Type Coercion**: Convert query params to numbers with fallbacks
  ```javascript
  const pageNumber = Number(page) || 1;
  const limitNumber = Number(limit) || 50;
  ```

## API Client Patterns

### Service Layer Structure
- **Centralized API Client**: Single `api` object with namespaced methods
- **Method Organization**: Group by resource (auth, transactions, categories, reports, invoices)
- **Request Abstraction**: Generic `request` function handles all HTTP calls
  ```javascript
  const request = async (method, path, { body, token, headers } = {}) => {
    // build options, make fetch call, handle response
  };
  ```

### HTTP Request Handling
- **Headers Builder**: Centralized header construction with token injection
  ```javascript
  const buildHeaders = (token, customHeaders = {}) => ({
    Accept: "application/json",
    "Content-Type": "application/json",
    ...customHeaders,
    ...(token && { Authorization: `Bearer ${token}` })
  });
  ```
- **Response Handler**: Unified response parsing and error handling
  ```javascript
  const handleResponse = async (response) => {
    const data = await response.json();
    if (!response.ok) {
      const error = new Error(data?.message || 'Request failed');
      error.status = response.status;
      throw error;
    }
    return data;
  };
  ```
- **Query Parameters**: Use URLSearchParams for query string construction
  ```javascript
  const query = new URLSearchParams(params).toString();
  const path = query ? `/endpoint?${query}` : "/endpoint";
  ```

### Configuration Management
- **Environment Variables**: Support multiple sources with fallbacks
  ```javascript
  const expoExtraUrl = Constants.expoConfig?.extra?.apiBaseUrl;
  const envUrl = process.env.EXPO_PUBLIC_API_URL;
  const API_BASE_URL = (expoExtraUrl || envUrl || DEFAULT_API_URL).replace(/\/$/, "");
  ```
- **URL Normalization**: Remove trailing slashes from base URLs
- **Export Helpers**: Provide getter functions for configuration access

## Testing Patterns

### Test Structure
- **Jest Framework**: Primary testing framework for backend
- **Supertest**: HTTP assertion library for API endpoint testing
- **Test Organization**: Describe blocks group related tests
  ```javascript
  describe('Auth Routes', () => {
    it('registers a user and returns JWT', async () => {
      // test implementation
    });
  });
  ```

### Mocking Strategies
- **Prisma Mocking**: Mock entire Prisma client with jest.mock
  ```javascript
  const mockPrisma = {
    user: {
      findUnique: jest.fn(),
      create: jest.fn()
    }
  };
  jest.mock('../config/db', () => ({ prisma: mockPrisma }));
  ```
- **Mock Reset**: Clear mocks in beforeEach hooks
  ```javascript
  beforeEach(() => {
    mockPrisma.user.findUnique.mockReset();
  });
  ```
- **Mock Resolved Values**: Use mockResolvedValueOnce for async returns
  ```javascript
  mockPrisma.user.findUnique.mockResolvedValueOnce(userData);
  ```

### Test Assertions
- **Status Codes**: Verify HTTP response status
  ```javascript
  expect(response.status).toBe(201);
  ```
- **Response Structure**: Check success flags and data presence
  ```javascript
  expect(response.body.success).toBe(true);
  expect(response.body.data.token).toBeDefined();
  ```
- **Mock Calls**: Verify functions called with correct arguments
  ```javascript
  expect(mockPrisma.user.create).toHaveBeenCalled();
  expect(mockPrisma.user.findUnique).toHaveBeenCalledWith({ where: { email } });
  ```
- **Object Matching**: Use toMatchObject for partial matches
  ```javascript
  expect(response.body.data.user).toMatchObject({ id: user.id, name: user.name });
  ```

### Authentication Testing
- **JWT Generation**: Create test tokens with jwt.sign
  ```javascript
  const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
  ```
- **Password Hashing**: Use bcrypt for test password hashing
  ```javascript
  const hashedPassword = await bcrypt.hash(plainPassword, 10);
  ```
- **Authorization Headers**: Set Bearer token in test requests
  ```javascript
  await request(app).get('/api/auth/me').set('Authorization', `Bearer ${token}`);
  ```

## Styling Patterns

### StyleSheet Organization
- **StyleSheet.create**: All styles defined using StyleSheet.create at bottom of file
- **Naming**: Style names match component structure (e.g., `container`, `header`, `profileCard`)
- **Grouping**: Related styles grouped together (e.g., all profile styles, all button styles)

### Design System
- **Color Palette**:
  - Primary: `#2563EB` (blue)
  - Success: `#10B981` (green)
  - Warning: `#F59E0B` (amber)
  - Error: `#EF4444` (red)
  - Background: `#F1F5F9` (light gray)
  - Text: `#0F172A` (dark), `#6B7280` (gray), `#94A3B8` (light gray)
- **Spacing**: Consistent padding/margin values (4, 8, 12, 16, 20, 24, 32)
- **Border Radius**: 10, 12, 14, 16, 18 for different component sizes
- **Shadows**: Subtle shadows with low opacity (0.06) for elevation

### Responsive Design
- **Flex Layouts**: Use flexbox for responsive layouts
- **SafeAreaView**: Wrap screens in SafeAreaView for notch/status bar handling
- **ScrollView**: Use for scrollable content with contentContainerStyle
- **Relative Sizing**: Use flex: 1 for flexible components

## Security Practices

### Authentication
- **JWT Tokens**: Stateless authentication with JSON Web Tokens
- **Token Storage**: Secure storage in AsyncStorage (mobile) with key constants
- **Password Hashing**: bcryptjs with salt rounds for password storage
- **Token Verification**: Middleware validates JWT on protected routes

### Data Validation
- **Input Validation**: Validate all user inputs before processing
- **Type Checking**: Explicit type conversion and NaN checks
- **Required Fields**: Check for required fields at controller entry
- **Email Normalization**: Convert emails to lowercase for consistency

### Authorization
- **User Scoping**: All queries filtered by authenticated user ID
- **Ownership Checks**: Verify resource ownership before update/delete operations
- **Cascade Deletion**: Prisma configured for automatic cleanup of related records

### Error Handling
- **Generic Error Messages**: Don't expose internal details to clients
- **Error Logging**: Log detailed errors server-side for debugging
- **Status Codes**: Use appropriate HTTP status codes (400, 401, 404, 500)

## Performance Optimization

### Frontend Optimization
- **useMemo**: Memoize expensive computations and object references
  ```javascript
  const totals = useMemo(() => ({
    transactions: transactions.length,
    income: stats?.totalIncome || 0
  }), [transactions.length, stats]);
  ```
- **Conditional Rendering**: Use `&&` and ternary operators for conditional UI
- **Lazy Evaluation**: Compute values only when needed
- **Debouncing**: Implement timeouts for status messages
  ```javascript
  setTimeout(() => setStatusMessage(""), 4000);
  ```

### Backend Optimization
- **Database Indexing**: Index frequently queried fields (userId, date)
- **Pagination**: Implement skip/take for large result sets
- **Parallel Queries**: Use Promise.all for independent database operations
- **Query Optimization**: Select only needed fields, use appropriate filters

### Data Handling
- **Date Handling**: Use ISO string slicing for date keys
  ```javascript
  const dateKey = item.date.toISOString().slice(0, 10);
  ```
- **Aggregation**: Compute aggregates in single pass through data
- **Default Values**: Use nullish coalescing and optional chaining
  ```javascript
  const income = stats?.totalIncome || 0;
  ```

## Common Idioms

### Conditional Execution
```javascript
if (!condition) return errorResponse(res, 'Error message', 400);
```

### Object Building
```javascript
const payload = {};
if (field1) payload.field1 = field1;
if (field2) payload.field2 = field2;
```

### Array Iteration with Side Effects
```javascript
items.forEach((item) => {
  // perform operations
  if (item.type === 'income') totalIncome += item.amount;
});
```

### Async Bootstrap Pattern
```javascript
useEffect(() => {
  const bootstrap = async () => {
    try {
      // initialization logic
    } catch (err) {
      console.warn('Bootstrap failed', err);
    } finally {
      setInitializing(false);
    }
  };
  bootstrap();
}, []);
```

### Spread with Conditionals
```javascript
const headers = {
  ...baseHeaders,
  ...(token && { Authorization: `Bearer ${token}` })
};
```

### Status Message Pattern
```javascript
const setStatus = (message, type = 'success') => {
  setStatusMessage(message);
  setStatusType(type);
  if (message) setTimeout(() => setStatusMessage(''), 4000);
};
```
