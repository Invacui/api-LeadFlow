# TypeScript Path Aliases Reference

This document provides a comprehensive reference for all TypeScript path aliases available in the Express TypeScript Boilerplate project.

## 🎯 **Available Aliases**

### **Main Application Files**

```typescript
import App from '@/app'; // Main application class
import Server from '@/server'; // Server entry point
```

### **Configuration**

```typescript
import envConfig from '@/config/environment'; // Environment configuration
```

### **Constants**

```typescript
import { globalConstants } from '@/constants/Global.constants';
```

### **Controllers**

```typescript
import { UserAuthController } from '@/controllers/Auth.controller';
```

### **Data Access Objects (DAO)**

```typescript
import { authDao } from '@/dao/Auth.dao';
```

### **Database**

```typescript
import { prisma } from '@/db/prisma'; // Prisma client
```

### **Interfaces (DTOs)**

```typescript
import { UserDto } from '@/interfaces/Auth.dto';
```

### **Logging**

```typescript
//  logger
```

### **Middleware**

```typescript
import { isLoggedIn } from '@/middleware/IsLoggedIn';
```

### **Routes**

```typescript
import authRouter from '@/routes/Auth.router';
import mainRoutes from '@/routes/index';
```

### **Services**

```typescript
import { authService } from '@/services/Auth.service';
```

### **Types**

```typescript
import {
  CreateUserRequest,
  UserResponse,
  AuthResponse,
  AuthenticatedRequest,
  ControllerMethod,
  ValidationError,
  ApiResponse,
  ErrorResponse,
  EnvironmentVariables,
  JWTPayload,
} from '@/types';
```

### **Validators**

```typescript
import {
  CreateUserApiRequestValidator,
  UpdateUserApiRequestValidator,
  UserIdParamValidator,
  validateRequest,
} from '@/validators/Auth.validator';
```

### **Tests**

```typescript
// Source tests
import { authTest } from '@/tests/auth.test';

// Root tests
import { userTest } from '@/test/user.test';
```

### **Prisma**

```typescript
import { PrismaClient } from '@prisma/client';
// Note: Prisma client is imported from @prisma/client, not from aliases
```

### **Environment Files**

```typescript
// These are typically used by the environment loader, not directly imported
// But if needed for type definitions:
import type DevEnv from '@/environment/private.dev.env';
import type ProdEnv from '@/environment/private.prod.env';
import type TestEnv from '@/environment/private.test.env';
import type StagingEnv from '@/environment/private.staging.env';
```

## 🔄 **Before vs After Examples**

### **Before (Relative Imports)**

```typescript
// ❌ Old way - relative imports
import { UserDto } from '../interfaces/Auth.dto';
import { authService } from '../services/Auth.service';
import { CreateUserRequest } from '../types';
import logger from '../logger/logger';
import { prisma } from '../db/prisma';
import { isLoggedIn } from '../middleware/IsLoggedIn';
import { globalConstants } from '../constants/Global.constants';
```

### **After (Path Aliases)**

```typescript
// ✅ New way - path aliases
import { UserDto } from '@/interfaces/Auth.dto';
import { authService } from '@/services/Auth.service';
import { CreateUserRequest } from '@/types';

import { prisma } from '@/db/prisma';
import { isLoggedIn } from '@/middleware/IsLoggedIn';
import { globalConstants } from '@/constants/Global.constants';
```

## 📁 **Alias Mapping**

| Alias             | Maps To             | Description            |
| ----------------- | ------------------- | ---------------------- |
| `@/*`             | `src/*`             | General source files   |
| `@/app`           | `src/app`           | Main application       |
| `@/server`        | `src/server`        | Server entry point     |
| `@/config/*`      | `src/config/*`      | Configuration files    |
| `@/constants/*`   | `src/constants/*`   | Application constants  |
| `@/controllers/*` | `src/controllers/*` | Route controllers      |
| `@/dao/*`         | `src/dao/*`         | Data Access Objects    |
| `@/db/*`          | `src/db/*`          | Database configuration |
| `@/interfaces/*`  | `src/interfaces/*`  | Data Transfer Objects  |
| `@/logger/*`      | `src/logger/*`      | Logging configuration  |
| `@/middleware/*`  | `src/middleware/*`  | Express middleware     |
| `@/routes/*`      | `src/routes/*`      | Route definitions      |
| `@/services/*`    | `src/services/*`    | Business logic         |
| `@/types/*`       | `src/types/*`       | TypeScript types       |
| `@/utils/*`       | `src/utils/*`       | Utility functions      |
| `@/validators/*`  | `src/validators/*`  | Request validation     |
| `@/tests/*`       | `src/__tests__/*`   | Source tests           |
| `@/test/*`        | `test/*`            | Root tests             |
| `@/prisma/*`      | `prisma/*`          | Prisma schema          |
| `@/environment/*` | `environment/*`     | Environment files      |

## 🛠️ **Configuration Files**

### **TypeScript Configuration (`tsconfig.json`)**

```json
{
  "compilerOptions": {
    "baseUrl": "./",
    "paths": {
      "@/*": ["src/*"],
      "@/app": ["src/app"],
      "@/server": ["src/server"],
      "@/config/*": ["src/config/*"],
      "@/constants/*": ["src/constants/*"],
      "@/controllers/*": ["src/controllers/*"],
      "@/dao/*": ["src/dao/*"],
      "@/db/*": ["src/db/*"],
      "@/interfaces/*": ["src/interfaces/*"],
      "@/logger/*": ["src/logger/*"],
      "@/middleware/*": ["src/middleware/*"],
      "@/routes/*": ["src/routes/*"],
      "@/services/*": ["src/services/*"],
      "@/types/*": ["src/types/*"],
      "@/utils/*": ["src/utils/*"],
      "@/validators/*": ["src/validators/*"],
      "@/tests/*": ["src/__tests__/*"],
      "@/test/*": ["test/*"],
      "@/prisma/*": ["prisma/*"],
      "@/environment/*": ["environment/*"]
    }
  }
}
```

### **Jest Configuration (`jest.config.js`)**

```javascript
module.exports = {
  moduleNameMapping: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '^@/app$': '<rootDir>/src/app',
    '^@/server$': '<rootDir>/src/server',
    '^@/config/(.*)$': '<rootDir>/src/config/$1',
    '^@/constants/(.*)$': '<rootDir>/src/constants/$1',
    '^@/controllers/(.*)$': '<rootDir>/src/controllers/$1',
    '^@/dao/(.*)$': '<rootDir>/src/dao/$1',
    '^@/db/(.*)$': '<rootDir>/src/db/$1',
    '^@/interfaces/(.*)$': '<rootDir>/src/interfaces/$1',
    '^@/logger/(.*)$': '<rootDir>/src/logger/$1',
    '^@/middleware/(.*)$': '<rootDir>/src/middleware/$1',
    '^@/routes/(.*)$': '<rootDir>/src/routes/$1',
    '^@/services/(.*)$': '<rootDir>/src/services/$1',
    '^@/types/(.*)$': '<rootDir>/src/types/$1',
    '^@/utils/(.*)$': '<rootDir>/src/utils/$1',
    '^@/validators/(.*)$': '<rootDir>/src/validators/$1',
    '^@/tests/(.*)$': '<rootDir>/src/__tests__/$1',
    '^@/test/(.*)$': '<rootDir>/test/$1',
    '^@/prisma/(.*)$': '<rootDir>/prisma/$1',
    '^@/environment/(.*)$': '<rootDir>/environment/$1',
  },
};
```

## 🎯 **Benefits of Using Aliases**

### **1. Cleaner Imports**

```typescript
// Instead of complex relative paths
import { UserDto } from '../../../interfaces/Auth.dto';

// Use clean aliases
import { UserDto } from '@/interfaces/Auth.dto';
```

### **2. Easier Refactoring**

- Move files without breaking imports
- Rename directories without updating all imports
- Restructure project without import issues

### **3. Better IDE Support**

- Auto-completion works better
- Go to definition works correctly
- Refactoring tools work properly

### **4. Consistent Imports**

- All imports follow the same pattern
- Easy to understand project structure
- Reduced cognitive load

### **5. Type Safety**

- TypeScript can resolve types correctly
- Better error messages
- Improved development experience

## 🚀 **Usage Guidelines**

### **1. Always Use Aliases**

- Prefer aliases over relative imports
- Use `@/` for all internal imports
- Keep relative imports only for same-directory files

### **2. Import Order**

```typescript
// 1. External libraries
import express from 'express';
import jwt from 'jsonwebtoken';

// 2. Internal aliases (alphabetical)
import { authService } from '@/services/Auth.service';
import { UserDto } from '@/interfaces/Auth.dto';

import { CreateUserRequest } from '@/types';

// 3. Relative imports (same directory only)
import { validateRequest } from './validation-helper';
```

### **3. Type Imports**

```typescript
// For types only
import type { CreateUserRequest } from '@/types';

// For values and types
import { CreateUserRequest, authService } from '@/services/Auth.service';
```

## 🔧 **Troubleshooting**

### **Common Issues**

1. **Alias Not Resolved**

   - Check `tsconfig.json` paths configuration
   - Restart TypeScript server in IDE
   - Verify file exists at the mapped location

2. **Jest Tests Failing**

   - Check `jest.config.js` moduleNameMapping
   - Ensure aliases match TypeScript configuration
   - Restart Jest test runner

3. **Build Errors**
   - Verify all aliases are properly configured
   - Check for typos in alias names
   - Ensure baseUrl is set correctly

### **IDE Configuration**

#### **VS Code**

- Install TypeScript extension
- Restart TypeScript server: `Ctrl+Shift+P` → "TypeScript: Restart TS Server"
- Check workspace settings for TypeScript configuration

#### **WebStorm/IntelliJ**

- Go to Settings → Languages & Frameworks → TypeScript
- Enable "Use TypeScript service"
- Restart IDE if needed

## ✅ **Verification**

To verify aliases are working correctly:

1. **Build Test**

   ```bash
   npm run build
   ```

2. **Type Check**

   ```bash
   npx tsc --noEmit
   ```

3. **Test Run**

   ```bash
   npm test
   ```

4. **IDE Check**
   - Hover over imports to see resolved paths
   - Use "Go to Definition" on imported items
   - Check auto-completion works

---

**All aliases are now configured and ready to use! 🎉**

Use `@/` aliases for cleaner, more maintainable imports throughout your Express TypeScript application.
