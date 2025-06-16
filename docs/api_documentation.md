# API Documentation

This document provides detailed information about the API endpoints and their integration with the Flutter application.

## Table of Contents
1. [Authentication](#authentication)
2. [Batches](#batches)
3. [Savings](#savings)
4. [M-Pesa Integration](#m-pesa-integration)
5. [Health Check](#health-check)

## Authentication

### Login
```dart
Future<Map<String, dynamic>> login(String email, String password)
```

**Endpoint:** `POST /api/auth/login`

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "token": "jwt_token",
  "user": {
    "id": "user_id",
    "email": "user@example.com",
    "name": "User Name"
  }
}
```

**Error Codes:**
- 401: Invalid credentials
- 400: Invalid request format

**Usage:**
```dart
try {
  final response = await backendService.login(email, password);
  // Handle successful login
} on UnauthorizedException {
  // Handle invalid credentials
} on ApiException catch (e) {
  // Handle other errors
}
```

### Register
```dart
Future<Map<String, dynamic>> register({
  required String email,
  required String password,
  required String name,
})
```

**Endpoint:** `POST /api/auth/register`

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123",
  "name": "User Name"
}
```

**Response:**
```json
{
  "token": "jwt_token",
  "user": {
    "id": "user_id",
    "email": "user@example.com",
    "name": "User Name"
  }
}
```

**Error Codes:**
- 400: Invalid request format
- 409: Email already exists

## Batches

### Get Batches
```dart
Future<List<Map<String, dynamic>>> getBatches()
```

**Endpoint:** `GET /api/batches`

**Response:**
```json
[
  {
    "id": "batch_id",
    "amount": 1000.00,
    "maxMembers": 10,
    "currentMembers": 5,
    "startDate": "2024-03-20T00:00:00Z",
    "description": "Monthly savings batch"
  }
]
```

**Error Codes:**
- 401: Unauthorized
- 500: Server error

### Create Batch
```dart
Future<Map<String, dynamic>> createBatch({
  required double amount,
  required int maxMembers,
  required DateTime startDate,
  String? description,
})
```

**Endpoint:** `POST /api/batches`

**Request Body:**
```json
{
  "amount": 1000.00,
  "maxMembers": 10,
  "startDate": "2024-03-20T00:00:00Z",
  "description": "Monthly savings batch"
}
```

**Response:**
```json
{
  "id": "batch_id",
  "amount": 1000.00,
  "maxMembers": 10,
  "currentMembers": 1,
  "startDate": "2024-03-20T00:00:00Z",
  "description": "Monthly savings batch"
}
```

**Error Codes:**
- 400: Invalid request format
- 401: Unauthorized
- 500: Server error

### Join Batch
```dart
Future<void> joinBatch(String batchId)
```

**Endpoint:** `POST /api/batches/{batchId}/join`

**Response:** 200 OK

**Error Codes:**
- 400: Batch is full
- 401: Unauthorized
- 404: Batch not found

### Leave Batch
```dart
Future<void> leaveBatch(String batchId)
```

**Endpoint:** `POST /api/batches/{batchId}/leave`

**Response:** 200 OK

**Error Codes:**
- 401: Unauthorized
- 404: Batch not found

## Savings

### Get Savings
```dart
Future<List<Map<String, dynamic>>> getSavings()
```

**Endpoint:** `GET /api/savings`

**Response:**
```json
[
  {
    "id": "saving_id",
    "amount": 1000.00,
    "batchId": "batch_id",
    "status": "pending",
    "createdAt": "2024-03-20T00:00:00Z"
  }
]
```

**Error Codes:**
- 401: Unauthorized
- 500: Server error

### Create Savings
```dart
Future<Map<String, dynamic>> createSavings({
  required double amount,
  required String batchId,
})
```

**Endpoint:** `POST /api/savings`

**Request Body:**
```json
{
  "amount": 1000.00,
  "batchId": "batch_id"
}
```

**Response:**
```json
{
  "id": "saving_id",
  "amount": 1000.00,
  "batchId": "batch_id",
  "status": "pending",
  "createdAt": "2024-03-20T00:00:00Z"
}
```

**Error Codes:**
- 400: Invalid request format
- 401: Unauthorized
- 404: Batch not found
- 500: Server error

## M-Pesa Integration

### Initiate Payment
```dart
Future<Map<String, dynamic>> initiateMpesaPayment({
  required String phoneNumber,
  required double amount,
  required String batchId,
})
```

**Endpoint:** `POST /api/mpesa/initiate`

**Request Body:**
```json
{
  "phoneNumber": "254712345678",
  "amount": 1000.00,
  "batchId": "batch_id"
}
```

**Response:**
```json
{
  "checkoutRequestId": "checkout_id",
  "merchantRequestId": "merchant_id",
  "responseCode": "0",
  "responseDescription": "Success",
  "customerMessage": "Please check your phone to complete the payment"
}
```

**Error Codes:**
- 400: Invalid request format
- 401: Unauthorized
- 500: Server error

### Check Payment Status
```dart
Future<Map<String, dynamic>> checkMpesaStatus(String checkoutRequestId)
```

**Endpoint:** `GET /api/mpesa/status/{checkoutRequestId}`

**Response:**
```json
{
  "status": "success",
  "transactionId": "transaction_id",
  "amount": 1000.00,
  "phoneNumber": "254712345678",
  "timestamp": "2024-03-20T00:00:00Z"
}
```

**Error Codes:**
- 401: Unauthorized
- 404: Payment not found
- 500: Server error

## Health Check

### Check Health
```dart
Future<Map<String, dynamic>> checkHealth()
```

**Endpoint:** `GET /health`

**Response:**
```json
{
  "status": "healthy",
  "version": "1.0.0",
  "timestamp": "2024-03-20T00:00:00Z"
}
```

**Error Codes:**
- 500: Server error

## Error Handling

### Common Error Types
```dart
class ApiException implements Exception {
  final String message;
  final int? statusCode;
}

class UnauthorizedException extends ApiException {
  UnauthorizedException([String message = 'Unauthorized']) : super(message, 401);
}

class NetworkException implements Exception {
  final String message;
}
```

### Error Handling Example
```dart
try {
  final response = await backendService.getBatches();
  // Handle successful response
} on UnauthorizedException {
  // Handle authentication error
} on NetworkException {
  // Handle network error
} on ApiException catch (e) {
  // Handle other API errors
}
```

## Rate Limiting

The API implements rate limiting to prevent abuse:
- 100 requests per minute per IP
- 1000 requests per hour per user

**Rate Limit Headers:**
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 99
X-RateLimit-Reset: 1616198400
```

## Authentication

All API endpoints (except health check) require authentication:
1. Include JWT token in Authorization header:
```
Authorization: Bearer <token>
```

2. Token expiration:
- Access tokens expire after 1 hour
- Refresh tokens expire after 7 days

## Best Practices

1. **Error Handling**
   - Always handle specific error types
   - Provide meaningful error messages
   - Include retry logic where appropriate

2. **Request Validation**
   - Validate input before sending
   - Handle validation errors
   - Use proper data types

3. **Response Handling**
   - Parse responses properly
   - Handle null values
   - Validate response structure

4. **Security**
   - Never store tokens in plain text
   - Use secure storage for sensitive data
   - Implement proper token refresh

## Testing

1. **Local Testing**
   ```bash
   # Start local server
   npm run dev

   # Test endpoints
   curl http://localhost:10000/health
   ```

2. **Environment Setup**
   ```bash
   # Development
   flutter run --dart-define=BACKEND_URL=http://localhost:10000

   # Production
   flutter run --dart-define=BACKEND_URL=https://api.production.com
   ```

3. **API Testing**
   ```dart
   // Test health check
   final health = await backendService.checkHealth();
   print('Health status: ${health['status']}');

   // Test authentication
   final auth = await backendService.login(email, password);
   print('Auth token: ${auth['token']}');
   ``` 