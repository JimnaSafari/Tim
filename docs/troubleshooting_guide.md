# Troubleshooting Guide

This guide provides solutions for common issues you might encounter while using the enhanced backend integration features.

## Table of Contents
1. [Environment Issues](#environment-issues)
2. [Network Issues](#network-issues)
3. [UI Issues](#ui-issues)
4. [State Management Issues](#state-management-issues)
5. [API Integration Issues](#api-integration-issues)

## Environment Issues

### Missing Environment Variables
**Symptoms:**
- App fails to start
- Configuration errors in console
- API calls failing with connection errors

**Solutions:**
1. Check environment setup:
```bash
# Verify environment variables are set
echo $BACKEND_URL
echo $SUPABASE_URL
echo $SUPABASE_ANON_KEY
```

2. Update launch configuration:
```bash
flutter run --dart-define=BACKEND_URL=http://localhost:10000 \
           --dart-define=SUPABASE_URL=your-supabase-url \
           --dart-define=SUPABASE_ANON_KEY=your-anon-key
```

3. Verify EnvConfig initialization:
```dart
void main() {
  EnvConfig.initialize(
    environment: Environment.dev,
    backendUrl: const String.fromEnvironment('BACKEND_URL'),
    supabaseUrl: const String.fromEnvironment('SUPABASE_URL'),
    supabaseAnonKey: const String.fromEnvironment('SUPABASE_ANON_KEY'),
  );
}
```

### Wrong Environment Configuration
**Symptoms:**
- API calls going to wrong endpoints
- Authentication failures
- Inconsistent behavior

**Solutions:**
1. Check current environment:
```dart
print('Current environment: ${EnvConfig.instance.environment}');
```

2. Verify environment-specific settings:
```dart
if (EnvConfig.isDevelopment()) {
  // Development-specific logic
} else if (EnvConfig.isProduction()) {
  // Production-specific logic
}
```

## Network Issues

### API Connection Failures
**Symptoms:**
- Network error messages
- Failed API calls
- Timeout errors

**Solutions:**
1. Check network connectivity:
```dart
try {
  final response = await networkService.get('/health');
  print('Connection status: ${response.statusCode}');
} catch (e) {
  print('Connection error: $e');
}
```

2. Verify API endpoints:
```dart
// Check endpoint configuration
print('API URL: ${EnvConfig.instance.backendUrl}');
```

3. Test with curl:
```bash
curl -v http://localhost:10000/health
```

### Retry Logic Not Working
**Symptoms:**
- Repeated failures without retry
- Immediate error messages
- No retry attempts

**Solutions:**
1. Check retry configuration:
```dart
final networkService = NetworkService(
  maxRetries: 3,
  retryDelay: const Duration(seconds: 1),
);
```

2. Verify error handling:
```dart
try {
  await networkService.get('/endpoint');
} on NetworkException catch (e) {
  print('Network error: $e');
} on ApiException catch (e) {
  print('API error: $e');
}
```

## UI Issues

### Error Views Not Displaying
**Symptoms:**
- Missing error messages
- Inconsistent error UI
- No retry buttons

**Solutions:**
1. Check error widget implementation:
```dart
ErrorView(
  message: 'Error message',
  onRetry: () => ref.refresh(provider),
)
```

2. Verify error state handling:
```dart
data.when(
  data: (items) => // handle data,
  loading: () => const LoadingView(),
  error: (error, stack) => ErrorView(
    message: error.toString(),
    onRetry: () => ref.refresh(provider),
  ),
)
```

### Loading States Not Showing
**Symptoms:**
- Missing loading indicators
- Inconsistent loading UI
- No loading messages

**Solutions:**
1. Check loading widget implementation:
```dart
LoadingView(
  message: 'Loading data...',
)
```

2. Verify loading state handling:
```dart
if (isLoading) {
  return const LoadingView();
}
```

## State Management Issues

### Provider Not Updating
**Symptoms:**
- UI not refreshing
- Stale data
- State not changing

**Solutions:**
1. Check provider implementation:
```dart
final dataProvider = FutureProvider<List<Item>>((ref) async {
  final backendService = ref.watch(backendServiceProvider);
  return backendService.getItems();
});
```

2. Verify state updates:
```dart
// Refresh provider
ref.refresh(dataProvider);

// Watch provider
final data = ref.watch(dataProvider);
```

### State Not Persisting
**Symptoms:**
- Data lost on app restart
- State reset on navigation
- Inconsistent state

**Solutions:**
1. Check state persistence:
```dart
final persistentProvider = StateNotifierProvider<PersistentNotifier, State>((ref) {
  return PersistentNotifier();
});
```

2. Verify state initialization:
```dart
class PersistentNotifier extends StateNotifier<State> {
  PersistentNotifier() : super(initialState) {
    // Load persisted state
    loadState();
  }
}
```

## API Integration Issues

### Authentication Failures
**Symptoms:**
- Login failures
- Token errors
- Unauthorized access

**Solutions:**
1. Check authentication flow:
```dart
try {
  final response = await backendService.login(email, password);
  // Handle successful login
} on UnauthorizedException {
  // Handle authentication error
}
```

2. Verify token handling:
```dart
// Check token storage
final token = await secureStorage.read(key: 'auth_token');
if (token == null) {
  // Handle missing token
}
```

### API Response Parsing
**Symptoms:**
- JSON parsing errors
- Type mismatches
- Invalid data

**Solutions:**
1. Check response parsing:
```dart
try {
  final response = await networkService.get('/endpoint');
  final data = json.decode(response.body);
  // Validate data structure
} catch (e) {
  print('Parsing error: $e');
}
```

2. Verify data models:
```dart
class Item {
  final String id;
  final String name;

  Item.fromJson(Map<String, dynamic> json)
      : id = json['id'] as String,
        name = json['name'] as String;
}
```

## Debugging Tips

### Network Debugging
1. Enable network logging:
```dart
final networkService = NetworkService(
  enableLogging: true,
);
```

2. Check request/response:
```dart
print('Request: ${request.url}');
print('Response: ${response.body}');
```

### State Debugging
1. Add state logging:
```dart
ref.listen(provider, (previous, next) {
  print('State changed: $previous -> $next');
});
```

2. Check provider state:
```dart
print('Current state: ${ref.read(provider)}');
```

## Common Error Messages

### Network Errors
- "Connection refused": Check backend server
- "Timeout": Check network connectivity
- "Unauthorized": Check authentication

### State Errors
- "Provider not found": Check provider registration
- "State not initialized": Check state initialization
- "Invalid state": Check state updates

### API Errors
- "Invalid response": Check API response format
- "Missing required field": Check request payload
- "Validation failed": Check input data

## Getting Help

If you're still experiencing issues:
1. Check the error logs
2. Review the API documentation
3. Test with the API testing guide
4. Contact support with:
   - Error message
   - Steps to reproduce
   - Environment details
   - Logs and stack traces 