# Feature Documentation: Enhanced Backend Integration

This document provides detailed information about the new features added to enhance the backend integration in the Flutter application.

## Table of Contents
1. [Environment Configuration](#environment-configuration)
2. [Network Layer](#network-layer)
3. [Error Handling](#error-handling)
4. [Loading States](#loading-states)
5. [Empty States](#empty-states)

## Environment Configuration

### Overview
The new environment configuration system replaces hardcoded values with a flexible, environment-aware configuration system.

### Key Features
- Environment-specific configurations (dev/staging/prod)
- Environment variable support
- Centralized configuration management
- Type-safe configuration access

### Usage
```dart
// Initialize in main.dart
void main() {
  EnvConfig.initialize(
    environment: Environment.dev,
    backendUrl: const String.fromEnvironment('BACKEND_URL'),
    supabaseUrl: const String.fromEnvironment('SUPABASE_URL'),
    supabaseAnonKey: const String.fromEnvironment('SUPABASE_ANON_KEY'),
  );
}

// Access configuration
final backendUrl = EnvConfig.instance.backendUrl;
```

### Differences from Original
- Original: Hardcoded values in config files
- New: Environment-aware configuration with variable support

## Network Layer

### Overview
The new network layer provides robust HTTP communication with automatic retry logic and comprehensive error handling.

### Key Features
- Automatic retry for failed requests
- Custom exception types
- Request/response interceptors
- Consistent error handling
- Type-safe responses

### Usage
```dart
// Create network service
final networkService = NetworkService();

// Make requests
try {
  final response = await networkService.get('/api/endpoint');
  // Handle response
} on ApiException catch (e) {
  // Handle specific error
}
```

### Differences from Original
- Original: Direct HTTP calls without retry logic
- New: Robust network layer with retry and error handling

## Error Handling

### Overview
The new error handling system provides consistent error UI and better user feedback.

### Key Features
- Reusable error widgets
- Consistent error UI
- Retry functionality
- Custom error messages
- Error type differentiation

### Usage
```dart
// Show error
ErrorView(
  message: 'Failed to load data',
  onRetry: () => ref.refresh(dataProvider),
)

// Handle specific errors
try {
  // API call
} on UnauthorizedException {
  // Handle auth error
} on NetworkException {
  // Handle network error
}
```

### Differences from Original
- Original: Basic error handling with print statements
- New: Comprehensive error handling with UI components

## Loading States

### Overview
The new loading state system provides consistent loading indicators and messages.

### Key Features
- Reusable loading widget
- Loading messages
- Consistent loading UI
- Easy integration

### Usage
```dart
// Show loading
LoadingView(
  message: 'Loading data...',
)

// In async operations
FutureBuilder(
  future: dataFuture,
  builder: (context, snapshot) {
    if (snapshot.connectionState == ConnectionState.waiting) {
      return const LoadingView();
    }
    // Handle other states
  },
)
```

### Differences from Original
- Original: Basic CircularProgressIndicator
- New: Consistent loading UI with messages

## Empty States

### Overview
The new empty state system provides consistent UI for when no data is available.

### Key Features
- Reusable empty state widget
- Action buttons
- Consistent empty state UI
- Custom messages

### Usage
```dart
// Show empty state
EmptyView(
  message: 'No data available',
  actionText: 'Add New',
  onAction: () => // handle action
)

// In lists
if (items.isEmpty) {
  return EmptyView(
    message: 'No items found',
    actionText: 'Create Item',
    onAction: () => // handle action
  );
}
```

### Differences from Original
- Original: Basic empty state handling
- New: Consistent empty state UI with actions

## Integration Guide

### 1. Add Dependencies
```yaml
dependencies:
  http: ^1.1.0
  flutter_riverpod: ^2.4.0
```

### 2. Set Up Environment
```bash
# Development
flutter run --dart-define=BACKEND_URL=http://localhost:10000

# Production
flutter run --dart-define=BACKEND_URL=https://api.production.com
```

### 3. Use in Pages
```dart
class MyPage extends ConsumerWidget {
  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final data = ref.watch(dataProvider);

    return data.when(
      data: (items) => items.isEmpty
          ? EmptyView(message: 'No items')
          : ListView.builder(
              itemCount: items.length,
              itemBuilder: (context, index) => ItemWidget(items[index]),
            ),
      loading: () => const LoadingView(),
      error: (error, stack) => ErrorView(
        message: error.toString(),
        onRetry: () => ref.refresh(dataProvider),
      ),
    );
  }
}
```

## Best Practices

### 1. Environment Configuration
- Use different configurations for different environments
- Never commit sensitive data
- Document required environment variables

### 2. Network Calls
- Use NetworkService for all API calls
- Handle specific error types
- Include retry logic where appropriate

### 3. Error Handling
- Use ErrorView for consistent error UI
- Provide meaningful error messages
- Include retry options where appropriate

### 4. Loading States
- Show loading indicators for async operations
- Include loading messages
- Handle loading states consistently

### 5. Empty States
- Use EmptyView for consistent empty state UI
- Include action buttons where appropriate
- Provide clear empty state messages

## Troubleshooting

### Common Issues

1. **Environment Variables**
   - Issue: Missing environment variables
   - Solution: Check environment setup and .env file

2. **Network Errors**
   - Issue: Unhandled network exceptions
   - Solution: Use NetworkService with proper error handling

3. **UI Consistency**
   - Issue: Inconsistent error/loading states
   - Solution: Use provided widgets consistently

### Debugging Tips

1. **Network Issues**
   - Check network connectivity
   - Verify API endpoints
   - Check request/response logs

2. **Configuration Issues**
   - Verify environment variables
   - Check configuration initialization
   - Validate configuration values

3. **UI Issues**
   - Check widget hierarchy
   - Verify state management
   - Test error scenarios

## Support

For additional support:
1. Check the migration guide
2. Review error messages
3. Test in different environments
4. Verify API endpoints
5. Check network connectivity 