# Deployment Guide

This guide covers deploying the Express TypeScript Boilerplate to various platforms and environments.

## 🚀 Deployment Options

### 1. Docker Deployment

#### Dockerfile

Create a `Dockerfile` in the root directory:

```dockerfile
# Use Node.js LTS version
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./
COPY prisma ./prisma/

# Install dependencies
RUN npm ci --only=production

# Generate Prisma client
RUN npx prisma generate

# Copy source code
COPY dist ./dist

# Create logs directory
RUN mkdir -p logs

# Expose port
EXPOSE 3001

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:3001/health || exit 1

# Start the application
CMD ["node", "dist/server.js"]
```

#### Docker Compose

Create a `docker-compose.yml` file:

```yaml
version: '3.8'

services:
  app:
    build: .
    ports:
      - "3001:3001"
    environment:
      - NODE_ENV=production
      - PORT=3001
      - MONGO_URI=mongodb://mongo:27017
      - DB_NAME=production_db
      - PRIVATE_TOKEN_KEY=your-secure-secret
    depends_on:
      - mongo
    volumes:
      - ./logs:/app/logs

  mongo:
    image: mongo:6
    ports:
      - "27017:27017"
    volumes:
      - mongo_data:/data/db
    environment:
      - MONGO_INITDB_DATABASE=production_db

volumes:
  mongo_data:
```

#### Build and Run

```bash
# Build the application
npm run build

# Build Docker image
docker build -t express-typescript-app .

# Run with Docker Compose
docker-compose up -d
```

### 2. Cloud Platform Deployment

#### Heroku

1. **Install Heroku CLI**
   ```bash
   # Install Heroku CLI
   npm install -g heroku
   ```

2. **Create Heroku App**
   ```bash
   heroku create your-app-name
   ```

3. **Set Environment Variables**
   ```bash
   heroku config:set NODE_ENV=production
   heroku config:set MONGO_URI=your-mongodb-uri
   heroku config:set DB_NAME=your-database-name
   heroku config:set PRIVATE_TOKEN_KEY=your-jwt-secret
   ```

4. **Deploy**
   ```bash
   git push heroku main
   ```

#### AWS EC2

1. **Launch EC2 Instance**
   - Choose Ubuntu 20.04 LTS
   - Configure security groups (port 3001, 22)
   - Launch instance

2. **Connect and Setup**
   ```bash
   # Connect to instance
   ssh -i your-key.pem ubuntu@your-ec2-ip

   # Update system
   sudo apt update && sudo apt upgrade -y

   # Install Node.js
   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   sudo apt-get install -y nodejs

   # Install PM2
   sudo npm install -g pm2

   # Install MongoDB
   wget -qO - https://www.mongodb.org/static/pgp/server-6.0.asc | sudo apt-key add -
   echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/6.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-6.0.list
   sudo apt-get update
   sudo apt-get install -y mongodb-org
   sudo systemctl start mongod
   sudo systemctl enable mongod
   ```

3. **Deploy Application**
   ```bash
   # Clone repository
   git clone <your-repo-url>
   cd express-typescript-boilerplate

   # Install dependencies
   npm install

   # Build application
   npm run build

   # Set up environment
   cp .env.example .env
   # Edit .env with production values

   # Start with PM2
   pm2 start dist/server.js --name "express-app"
   pm2 save
   pm2 startup
   ```

#### DigitalOcean App Platform

1. **Create App**
   - Connect GitHub repository
   - Select Node.js
   - Configure build settings

2. **Environment Variables**
   ```env
   NODE_ENV=production
   PORT=3001
   MONGO_URI=your-mongodb-uri
   DB_NAME=your-database-name
   PRIVATE_TOKEN_KEY=your-jwt-secret
   ```

3. **Build Settings**
   ```yaml
   build_command: npm run build
   run_command: npm start
   ```

#### Vercel

1. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Configure vercel.json**
   ```json
   {
     "version": 2,
     "builds": [
       {
         "src": "dist/server.js",
         "use": "@vercel/node"
       }
     ],
     "routes": [
       {
         "src": "/(.*)",
         "dest": "dist/server.js"
       }
     ]
   }
   ```

3. **Deploy**
   ```bash
   npm run build
   vercel --prod
   ```

### 3. Kubernetes Deployment

#### Dockerfile (Multi-stage)

```dockerfile
# Build stage
FROM node:18-alpine AS builder

WORKDIR /app
COPY package*.json ./
COPY prisma ./prisma/
RUN npm ci
COPY . .
RUN npm run build

# Production stage
FROM node:18-alpine AS production

WORKDIR /app
COPY package*.json ./
COPY prisma ./prisma/
RUN npm ci --only=production && npx prisma generate
COPY --from=builder /app/dist ./dist
RUN mkdir -p logs

EXPOSE 3001
CMD ["node", "dist/server.js"]
```

#### Kubernetes Manifests

**deployment.yaml**
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: express-app
spec:
  replicas: 3
  selector:
    matchLabels:
      app: express-app
  template:
    metadata:
      labels:
        app: express-app
    spec:
      containers:
      - name: express-app
        image: your-registry/express-app:latest
        ports:
        - containerPort: 3001
        env:
        - name: NODE_ENV
          value: "production"
        - name: PORT
          value: "3001"
        - name: MONGO_URI
          valueFrom:
            secretKeyRef:
              name: app-secrets
              key: mongo-uri
        - name: DB_NAME
          value: "production_db"
        - name: PRIVATE_TOKEN_KEY
          valueFrom:
            secretKeyRef:
              name: app-secrets
              key: jwt-secret
        resources:
          requests:
            memory: "256Mi"
            cpu: "250m"
          limits:
            memory: "512Mi"
            cpu: "500m"
        livenessProbe:
          httpGet:
            path: /health
            port: 3001
          initialDelaySeconds: 30
          periodSeconds: 10
        readinessProbe:
          httpGet:
            path: /health
            port: 3001
          initialDelaySeconds: 5
          periodSeconds: 5
```

**service.yaml**
```yaml
apiVersion: v1
kind: Service
metadata:
  name: express-app-service
spec:
  selector:
    app: express-app
  ports:
  - port: 80
    targetPort: 3001
  type: LoadBalancer
```

**secrets.yaml**
```yaml
apiVersion: v1
kind: Secret
metadata:
  name: app-secrets
type: Opaque
data:
  mongo-uri: <base64-encoded-mongo-uri>
  jwt-secret: <base64-encoded-jwt-secret>
```

## 🔧 Production Configuration

### Environment Variables

Create a production `.env` file:

```env
# Server Configuration
NODE_ENV=production
PORT=3001
BASE_URL=https://your-domain.com

# Database Configuration
MONGO_URI=mongodb://username:password@host:port/database
DB_NAME=production_db

# JWT Configuration
PRIVATE_TOKEN_KEY=your-super-secure-jwt-secret-key

# CORS Configuration
ALLOWED_ORIGINS=https://your-frontend-domain.com,https://your-admin-domain.com

# Logging Configuration
LOG_LEVEL=info
LOG_FILE_MAX_SIZE=20m
LOG_FILE_MAX_FILES=14d
```

### Security Considerations

1. **Environment Variables**
   - Use strong, unique secrets
   - Never commit secrets to version control
   - Use secret management services

2. **HTTPS**
   - Always use HTTPS in production
   - Configure SSL certificates
   - Use Let's Encrypt for free certificates

3. **CORS**
   - Configure specific allowed origins
   - Avoid using wildcard (*) in production

4. **Rate Limiting**
   - Implement rate limiting
   - Use Redis for distributed rate limiting

5. **Input Validation**
   - Validate all inputs
   - Sanitize user data
   - Use parameterized queries

### Performance Optimization

1. **Database**
   - Use connection pooling
   - Implement proper indexing
   - Consider read replicas

2. **Caching**
   - Implement Redis caching
   - Cache frequently accessed data
   - Use CDN for static assets

3. **Monitoring**
   - Set up application monitoring
   - Monitor database performance
   - Track error rates and response times

### Health Checks

The application includes a health check endpoint:

```bash
curl https://your-domain.com/health
```

Response:
```json
{
  "success": true,
  "message": "Server is running",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "uptime": 123.456
}
```

### Logging

Production logging configuration:

```typescript
// In production, logs are written to files
// Log files are rotated daily
// Error logs are separated from general logs
// Logs are stored in the logs/ directory
```

## 📊 Monitoring and Maintenance

### Application Monitoring

1. **Health Checks**
   - Monitor `/health` endpoint
   - Set up alerts for failures
   - Track response times

2. **Error Tracking**
   - Monitor error logs
   - Set up error alerts
   - Track error rates

3. **Performance Monitoring**
   - Monitor response times
   - Track database query performance
   - Monitor memory usage

### Database Maintenance

1. **Backups**
   - Set up regular database backups
   - Test backup restoration
   - Store backups securely

2. **Indexing**
   - Monitor query performance
   - Add indexes as needed
   - Remove unused indexes

3. **Scaling**
   - Monitor database load
   - Consider read replicas
   - Plan for horizontal scaling

### Security Updates

1. **Dependencies**
   - Regularly update dependencies
   - Monitor security advisories
   - Use automated security scanning

2. **System Updates**
   - Keep the operating system updated
   - Apply security patches promptly
   - Monitor for vulnerabilities

## 🔄 CI/CD Pipeline

### GitHub Actions

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run lint
      - run: npm test
      - run: npm run build

  deploy:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Deploy to production
        run: |
          # Your deployment commands here
```

### Deployment Checklist

- [ ] All tests pass
- [ ] Code is linted and formatted
- [ ] Environment variables are configured
- [ ] Database migrations are applied
- [ ] SSL certificates are configured
- [ ] Monitoring is set up
- [ ] Backup strategy is in place
- [ ] Security measures are implemented
- [ ] Performance is optimized
- [ ] Documentation is updated

## 🆘 Troubleshooting

### Common Issues

1. **Application Won't Start**
   - Check environment variables
   - Verify database connection
   - Check port availability

2. **Database Connection Issues**
   - Verify MongoDB is running
   - Check connection string
   - Verify network connectivity

3. **Memory Issues**
   - Monitor memory usage
   - Check for memory leaks
   - Optimize database queries

4. **Performance Issues**
   - Monitor response times
   - Check database performance
   - Review application logs

### Debug Commands

```bash
# Check application status
pm2 status

# View application logs
pm2 logs express-app

# Restart application
pm2 restart express-app

# Check database connection
mongo --eval "db.adminCommand('ismaster')"

# Check disk space
df -h

# Check memory usage
free -h
```

## 📞 Support

For deployment issues:
- Check the logs
- Review the documentation
- Contact the development team
- Create an issue on GitHub

---

**Happy Deploying! 🚀**
