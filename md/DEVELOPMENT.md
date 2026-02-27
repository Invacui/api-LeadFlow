# Development Guide

This guide provides comprehensive information for developers working on the Express TypeScript Boilerplate.

## 🛠️ Development Setup

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- MongoDB (local or cloud instance)
- Git

### Initial Setup

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd express-typescript-boilerplate
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**

   ```bash
   cp .env.example Private.env
   # Edit Private.env with your configuration
   ```

4. **Set up the database**

   ```bash
   # Generate Prisma client
   npm run prisma:generate

   # Run database migrations
   npm run prisma:migrate
   ```

5. **Start development server**

   ```bash
   npm run dev

   ```

   ts-node-dev → Runs TypeScript files directly in development with auto-restart on file changes (like nodemon for TS).

--respawn → Restarts the process automatically if it crashes or exits.

--transpile-only → Skips type checking, only transpiles TS → JS for faster startup and reload.

-r tsconfig-paths/register → Loads path aliases from tsconfig.json (so @utils/\* imports work at runtime).

src/server.ts → The entry file for your server (the main application starting point).

## 📁 Project Architecture

### Folder Structure

```
src/
├── config/           # Configuration files
│   └── database.ts   # Database configuration
├── constants/        # Application constants
│   └── Global.constants.ts
├── controllers/      # Route controllers
│   └── Auth.controller.ts
├── dao/             # Data Access Objects
│   └── Auth.dao.ts
├── db/              # Database configuration
│   └── prisma.ts    # Prisma client
├── interfaces/      # Data Transfer Objects
│   └── Auth.dto.ts
├── logger/          # Winston logging replica
│   └── logger.ts
├── middleware/      # Express middleware
│   └── IsLoggedIn.ts
├── routes/          # Route definitions
│   ├── index.ts
│   └── Auth.router.ts
├── services/        # Business logic
│   └── Auth.service.ts
├── types/           # TypeScript types
│   └── index.ts
├── utils/           # Utility functions
└── validators/      # Request validation
    └── Auth.validator.ts
```

### Architecture Patterns

#### 1. Layered Architecture

- **Controllers**: Handle HTTP requests and responses
- **Services**: Contain business logic
- **DAO (Data Access Objects)**: Handle database operations
- **DTOs (Data Transfer Objects)**: Structure data for API responses

#### 2. Dependency Injection

- Services are injected into controllers
- DAOs are injected into services
- Singleton pattern for database connections

#### 3. Error Handling

- Centralized error handling middleware
- Custom error classes for different error types
- Proper HTTP status codes

## 🔧 Development Tools

### TypeScript Configuration

The project uses strict TypeScript configuration:

```json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "strictFunctionTypes": true,
    "noImplicitThis": true,
    "noImplicitReturns": true
  }
}
```

### ESLint Configuration

Code quality is enforced through ESLint:

```bash
# Run linting
npm run lint

# Fix linting errors
npm run lint:fix
```

### Prettier (Optional)

Consider adding Prettier for code formatting:

```bash
npm install --save-dev prettier
```

## 🧪 Testing

### Test Structure

```
test/
├── unit/           # Unit tests
├── integration/    # Integration tests
└── fixtures/       # Test data
```

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

### Writing Tests

Example test structure:

```typescript
import request from 'supertest';
import app from '../src/app';

describe('Auth Controller', () => {
  describe('POST /auth', () => {
    it('should create a new user', async () => {
      const userData = {
        email: 'test@example.com',
        name: 'Test User',
        age: 25,
        city: 'Test City',
        zipCode: '12345',
      };

      const response = await request(app)
        .post('/auth')
        .send(userData)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data.user.email).toBe(userData.email);
    });
  });
});
```

## 🗄️ Database Development

### Prisma Schema

The database schema is defined in `prisma/schema.prisma`:

```prisma
model User {
  id        String   @id @default(auto()) @map("_id") @db.ObjectId
  email     String   @unique
  name      String
  age       Int
  city      String
  zipCode   String
  isDeleted Boolean  @default(false)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@map("users")
}
```

### Database Operations

```bash
# Generate Prisma client after schema changes
npm run prisma:generate

# Create and apply migrations
npm run prisma:migrate

# Open Prisma Studio (database GUI)
npm run prisma:studio

# Reset database
npm run prisma:reset
```

### Adding New Models

1. Add model to `prisma/schema.prisma`
2. Run `npm run prisma:generate`
3. Create migration: `npm run prisma:migrate`
4. Update types in `src/types/index.ts`
5. Create DAO, Service, and Controller

## 📝 Logging

### Logger Configuration

The application uses Logger for logging with multiple transports:

- **Console**: Colored output for development
- **File**: Rotating log files
- **Error**: Separate error logs

### Log Levels

- `error`: Error messages
- `warn`: Warning messages
- `info`: Informational messages
- `http`: HTTP request logs
- `debug`: Debug messages

### Using the Logger

```typescript
import logger from '../logger/logger';

// Basic logging
logger.info('User created successfully');
logger.error('Database connection failed');

// Structured logging
logger.info('User action', {
  fileName: __filename,
  methodName: 'createUser',
  variables: { userId: '123', email: 'user@example.com' },
});
```

## 🔐 Authentication Development

### JWT Implementation

The application uses JWT for authentication:

```typescript
// Generate token
const token = jwt.sign({ userId: user.id }, process.env.PRIVATE_TOKEN_KEY, {
  expiresIn: '1h',
});

// Verify token
const decoded = jwt.verify(token, process.env.PRIVATE_TOKEN_KEY);
```

### Middleware Usage

```typescript
import { isLoggedIn } from '../middleware/IsLoggedIn';

// Protect routes
router.get('/protected', isLoggedIn, controller.protectedMethod);
```

## 🚀 Performance Considerations

### Database Optimization

- Use Prisma's `select` to limit returned fields
- Implement pagination for large datasets
- Use database indexes for frequently queried fields
- Consider connection pooling

### Memory Management

- Monitor memory usage in production
- Implement proper error handling to prevent memory leaks
- Use streaming for large file operations

### Caching

Consider implementing caching for:

- Frequently accessed data
- Database query results
- API responses

## 🔍 Debugging

### Development Tools

1. **VS Code Extensions**:

   - TypeScript and JavaScript Language Features
   - ESLint
   - Prettier
   - REST Client

2. **Debugging Setup**:
   ```json
   {
     "type": "node",
     "request": "launch",
     "name": "Debug Server",
     "program": "${workspaceFolder}/src/server.ts",
     "runtimeArgs": ["-r", "ts-node/register"],
     "env": {
       "NODE_ENV": "development"
     }
   }
   ```

### Common Issues

1. **TypeScript Errors**:

   - Check type definitions
   - Ensure proper imports
   - Verify interface implementations

2. **Database Connection**:

   - Verify MongoDB is running
   - Check connection string
   - Ensure Prisma client is generated

3. **Environment Variables**:
   - Verify `.env` file exists
   - Check variable names and values
   - Ensure proper loading order

## 📦 Building for Production

### Build Process

```bash
# Build TypeScript
npm run build

# Start production server
npm start
```

### Environment Variables

Ensure all production environment variables are set:

```env
NODE_ENV=production
PORT=3001
MONGO_URI=mongodb://production-db:27017
DB_NAME=production_db
PRIVATE_TOKEN_KEY=your-secure-secret
```

## 🔄 Git Workflow

### Branch Naming

- `feature/feature-name` - New features
- `bugfix/bug-description` - Bug fixes
- `hotfix/urgent-fix` - Critical fixes
- `refactor/refactor-description` - Code refactoring

### Commit Messages

Follow conventional commit format:

```
feat: add user authentication
fix: resolve database connection issue
docs: update API documentation
refactor: improve error handling
test: add unit tests for auth service
```

### Pull Request Process

1. Create feature branch
2. Make changes with tests
3. Run linting and tests
4. Create pull request
5. Code review
6. Merge to main

## 📚 Additional Resources

- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Prisma Documentation](https://www.prisma.io/docs/)
- [Express.js Guide](https://expressjs.com/en/guide/routing.html)
- [Jest Testing](https://jestjs.io/docs/getting-started)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Run linting and tests
6. Submit a pull request

## 📞 Support

For questions or issues:

- Create an issue on GitHub
- Contact the development team
- Check the documentation

---

**Happy Coding! 🎉**
