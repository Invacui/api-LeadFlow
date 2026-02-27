# API Documentation

This document provides comprehensive API documentation for the Express TypeScript Boilerplate.

## Base URL

```
Development: http://localhost:3001
Production: https://your-domain.com
```

## Authentication

Most endpoints require JWT authentication. Include the token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

## Response Format

All API responses follow a consistent format:

### Success Response
```json
{
  "success": true,
  "message": "Operation completed successfully",
  "data": { ... }
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error description",
  "error": "Detailed error message",
  "details": ["Validation error 1", "Validation error 2"]
}
```

## Endpoints

### Health Check

#### GET /health
Check if the server is running.

**Response:**
```json
{
  "success": true,
  "message": "Server is running",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "uptime": 123.456
}
```

---

## User Management

### Create User

#### POST /auth
Create a new user account.

**Request Body:**
```json
{
  "email": "user@example.com",
  "name": "John Doe",
  "age": 25,
  "city": "New York",
  "zipCode": "10001"
}
```

**Validation Rules:**
- `email`: Valid email address (required)
- `name`: 2-50 characters (required)
- `age`: Integer between 1-120 (required)
- `city`: 2-50 characters (required)
- `zipCode`: Valid US zip code format (required)

**Success Response (201):**
```json
{
  "success": true,
  "message": "User created successfully",
  "data": {
    "user": {
      "id": "507f1f77bcf86cd799439011",
      "email": "user@example.com",
      "name": "John Doe",
      "age": 25,
      "city": "New York",
      "zipCode": "10001",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Error Responses:**
- `400` - Validation error
- `409` - User already exists
- `500` - Internal server error

---

### Get All Users

#### GET /auth
Retrieve all users (requires authentication).

**Headers:**
```
Authorization: Bearer <jwt-token>
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Users retrieved successfully",
  "data": [
    {
      "id": "507f1f77bcf86cd799439011",
      "email": "user@example.com",
      "name": "John Doe",
      "age": 25,
      "city": "New York",
      "zipCode": "10001",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

**Error Responses:**
- `401` - Unauthorized (missing or invalid token)
- `500` - Internal server error

---

### Get User by ID

#### GET /auth/:userId
Retrieve a specific user by ID (requires authentication).

**Parameters:**
- `userId` (string, required) - User ID

**Headers:**
```
Authorization: Bearer <jwt-token>
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "User retrieved successfully",
  "data": {
    "id": "507f1f77bcf86cd799439011",
    "email": "user@example.com",
    "name": "John Doe",
    "age": 25,
    "city": "New York",
    "zipCode": "10001",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

**Error Responses:**
- `401` - Unauthorized (missing or invalid token)
- `404` - User not found
- `500` - Internal server error

---

### Update User

#### PUT /auth/:userId
Update a user's information (requires authentication).

**Parameters:**
- `userId` (string, required) - User ID

**Headers:**
```
Authorization: Bearer <jwt-token>
```

**Request Body:**
```json
{
  "email": "newemail@example.com",
  "name": "Jane Doe",
  "age": 30,
  "city": "Los Angeles",
  "zipCode": "90210"
}
```

**Validation Rules:**
- All fields are optional for updates
- Same validation rules as create user apply to provided fields

**Success Response (200):**
```json
{
  "success": true,
  "message": "User updated successfully",
  "data": {
    "id": "507f1f77bcf86cd799439011",
    "email": "newemail@example.com",
    "name": "Jane Doe",
    "age": 30,
    "city": "Los Angeles",
    "zipCode": "90210",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T12:00:00.000Z"
  }
}
```

**Error Responses:**
- `400` - Validation error
- `401` - Unauthorized (missing or invalid token)
- `404` - User not found
- `500` - Internal server error

---

### Delete User

#### DELETE /auth/:userId
Soft delete a user (requires authentication).

**Parameters:**
- `userId` (string, required) - User ID

**Headers:**
```
Authorization: Bearer <jwt-token>
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "User deleted successfully"
}
```

**Error Responses:**
- `401` - Unauthorized (missing or invalid token)
- `404` - User not found
- `500` - Internal server error

---

## Error Codes

| Status Code | Description |
|-------------|-------------|
| 200 | OK - Request successful |
| 201 | Created - Resource created successfully |
| 400 | Bad Request - Invalid request data |
| 401 | Unauthorized - Authentication required |
| 403 | Forbidden - Access denied |
| 404 | Not Found - Resource not found |
| 409 | Conflict - Resource already exists |
| 500 | Internal Server Error - Server error |

## Rate Limiting

Currently, no rate limiting is implemented. Consider implementing rate limiting for production use.

## CORS

The API supports CORS with configurable origins. In development, all origins are allowed. In production, configure allowed origins via the `ALLOWED_ORIGINS` environment variable.

## Pagination

Pagination is not currently implemented. Consider adding pagination for endpoints that return multiple resources.

## Filtering and Sorting

Filtering and sorting are not currently implemented. Consider adding query parameters for these features.

## Examples

### Using cURL

**Create a user:**
```bash
curl -X POST http://localhost:3001/auth \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "name": "John Doe",
    "age": 25,
    "city": "New York",
    "zipCode": "10001"
  }'
```

**Get all users:**
```bash
curl -X GET http://localhost:3001/auth \
  -H "Authorization: Bearer <your-jwt-token>"
```

### Using JavaScript/Fetch

**Create a user:**
```javascript
const response = await fetch('http://localhost:3001/auth', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    email: 'user@example.com',
    name: 'John Doe',
    age: 25,
    city: 'New York',
    zipCode: '10001'
  })
});

const data = await response.json();
console.log(data);
```

**Get all users:**
```javascript
const response = await fetch('http://localhost:3001/auth', {
  method: 'GET',
  headers: {
    'Authorization': 'Bearer <your-jwt-token>'
  }
});

const data = await response.json();
console.log(data);
```
