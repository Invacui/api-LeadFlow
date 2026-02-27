# Environment Configuration

This directory contains environment-specific configuration files for different deployment environments.

## 📁 Environment Files

### `private.dev.env` - Development Environment
- **Purpose**: Local development and testing
- **Database**: Local MongoDB instance
- **Logging**: Debug level with detailed output
- **Security**: Relaxed settings for development
- **Features**: Swagger enabled, debug routes enabled

### `private.staging.env` - Staging Environment
- **Purpose**: Pre-production testing and validation
- **Database**: Staging MongoDB cluster
- **Logging**: Info level with moderate detail
- **Security**: Moderate security settings
- **Features**: Swagger enabled, limited debug features

### `private.prod.env` - Production Environment
- **Purpose**: Live production environment
- **Database**: Production MongoDB cluster
- **Logging**: Warn level with minimal output
- **Security**: Strict security settings
- **Features**: Swagger disabled, no debug features

### `private.test.env` - Test Environment
- **Purpose**: Automated testing and CI/CD
- **Database**: Test MongoDB instance
- **Logging**: Error level only
- **Security**: Relaxed for testing
- **Features**: Mock services enabled

## 🔧 How It Works

The application automatically loads the appropriate environment file based on the `NODE_ENV` variable:

```bash
# Development
NODE_ENV=development  # Loads private.dev.env

# Staging
NODE_ENV=staging      # Loads private.staging.env

# Production
NODE_ENV=production   # Loads private.prod.env

# Test
NODE_ENV=test         # Loads private.test.env
```

## 🚀 Usage

### Development
```bash
npm run dev              # Uses private.dev.env
```

### Staging
```bash
npm run dev:staging      # Uses private.staging.env
npm run start:staging    # Uses private.staging.env
```

### Production
```bash
npm run start            # Uses private.prod.env
```

### Testing
```bash
npm test                 # Uses private.test.env
```

## 🔒 Security

### Environment File Security
- **Never commit** these files to version control
- **Keep secrets secure** and rotate them regularly
- **Use strong passwords** and keys
- **Limit access** to production environment files

### Required Variables
Each environment file must contain these required variables:
- `NODE_ENV` - Environment name
- `PORT` - Server port
- `MONGO_URI` - Database connection string
- `DB_NAME` - Database name
- `PRIVATE_TOKEN_KEY` - JWT secret key

## 📝 Configuration Examples

### Database Configuration
```env
# Development
MONGO_URI=mongodb://localhost:27017
DB_NAME=express_boilerplate_dev

# Production
MONGO_URI=mongodb+srv://user:pass@cluster.mongodb.net
DB_NAME=express_boilerplate_prod
```

### JWT Configuration
```env
# Development
PRIVATE_TOKEN_KEY=dev-secret-key

# Production
PRIVATE_TOKEN_KEY=super-secure-production-key-minimum-32-characters
```

### CORS Configuration
```env
# Development
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:3001

# Production
ALLOWED_ORIGINS=https://yourdomain.com,https://admin.yourdomain.com
```

## 🛠️ Environment-Specific Features

### Development
- Debug logging enabled
- Swagger documentation available
- Relaxed CORS settings
- Detailed error messages
- Hot reload enabled

### Staging
- Moderate logging
- Swagger available for testing
- Stricter CORS settings
- Performance monitoring enabled
- Error reporting enabled

### Production
- Minimal logging
- Swagger disabled
- Strict CORS settings
- Full monitoring enabled
- Error reporting enabled
- SSL/TLS required

### Test
- Error logging only
- Mock services enabled
- Fast database cleanup
- Isolated test data
- Performance testing disabled

## 🔄 Environment Switching

### Check Current Environment
```bash
npm run env:check
```

### Switch Environments
```bash
# Development
export NODE_ENV=development
npm run dev

# Staging
export NODE_ENV=staging
npm run dev:staging

# Production
export NODE_ENV=production
npm run start
```

## 📊 Environment Variables Reference

| Variable | Development | Staging | Production | Test |
|----------|-------------|---------|------------|------|
| `NODE_ENV` | development | staging | production | test |
| `PORT` | 3001 | 3001 | 3001 | 3002 |
| `LOG_LEVEL` | debug | info | warn | error |
| `ENABLE_SWAGGER` | true | true | false | false |
| `RATE_LIMIT_MAX` | 1000 | 500 | 100 | 10000 |
| `BCRYPT_ROUNDS` | 10 | 11 | 12 | 4 |
| `JWT_EXPIRY` | 24h | 2h | 1h | 1h |

## 🚨 Important Notes

1. **Never commit** environment files to version control
2. **Use strong secrets** for production
3. **Rotate keys** regularly
4. **Monitor** environment-specific logs
5. **Test** environment switching before deployment
6. **Backup** production environment files securely

## 🔧 Troubleshooting

### Environment Not Loading
- Check `NODE_ENV` variable is set correctly
- Verify environment file exists
- Check file permissions
- Review console logs for errors

### Missing Variables
- Ensure all required variables are set
- Check variable names match exactly
- Verify no typos in variable names
- Review environment file format

### Database Connection Issues
- Verify `MONGO_URI` is correct
- Check database credentials
- Ensure database is accessible
- Review network connectivity

---

**Remember**: Keep your environment files secure and never commit them to version control! 🔒
