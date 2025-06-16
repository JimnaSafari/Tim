# Migration Guide: Original Code to Enhanced Features

This guide will help you migrate from the original codebase to the new enhanced features. We'll go through each component and explain the changes needed.

## 1. Environment Configuration

### Original Code
The original code had hardcoded configuration values:

```dart
// Original approach
class SupabaseConfig {
  static const String url = 'https://your-project.supabase.co';
  static const String anonKey = 'your-anon-key';
}
```

### New Approach
Replace with environment configuration:

```dart
// 1. Create env_config.dart
import 'package:flutter/foundation.dart';

enum Environment {
  dev,
  staging,
  prod,
}

class EnvConfig {
  // ... (see env_config.dart for full implementation)
}

// 2. Initialize in main.dart
void main() {
  EnvConfig.initialize(
    environment: Environment.dev,
    backendUrl: const String.fromEnvironment('BACKEND_URL'),
    supabaseUrl: const String.fromEnvironment('SUPABASE_URL'),
    supabaseAnonKey: const String.fromEnvironment('SUPABASE_ANON_KEY'),
  );
}
```

## 2. Network Layer

### Original Code
Direct HTTP calls without retry logic:

```dart
// Original approach
Future<Map<String, dynamic>> getBatches() async {
  final response = await http.get(Uri.parse('$baseUrl/api/batches'));
  return json.decode(response.body);
}
```

### New Approach
Use the new NetworkService:

```dart
// 1. Create network_service.dart
class NetworkService {
  // ... (see network_service.dart for full implementation)
}

// 2. Update backend_service.dart
class BackendService {
  final NetworkService _networkService;

  BackendService(this._networkService);

  Future<List<Map<String, dynamic>>> getBatches() async {
    try {
      final response = await _networkService.get('/api/batches');
      final List<dynamic> data = json.decode(response.body);
      return data.cast<Map<String, dynamic>>();
    } on ApiException catch (e) {
      throw Exception('Failed to get batches: ${e.message}');
    }
  }
}
```

## 3. Error Handling

### Original Code
Basic error handling:

```dart
// Original approach
try {
  // API call
} catch (e) {
  print('Error: $e');
}
```

### New Approach
Use the new error widgets:

```dart
// 1. Create error_view.dart
class ErrorView extends StatelessWidget {
  // ... (see error_view.dart for full implementation)
}

// 2. Use in your pages
ErrorView(
  message: 'Failed to load data',
  onRetry: () => ref.refresh(dataProvider),
)
```

## 4. Loading States

### Original Code
Basic loading indicator:

```dart
// Original approach
Center(
  child: CircularProgressIndicator(),
)
```

### New Approach
Use the new LoadingView:

```dart
LoadingView(
  message: 'Loading data...',
)
```

## 5. Empty States

### Original Code
No dedicated empty state handling:

```dart
// Original approach
if (data.isEmpty) {
  return Center(
    child: Text('No data available'),
  );
}
```

### New Approach
Use the new EmptyView:

```dart
EmptyView(
  message: 'No data available',
  actionText: 'Add New',
  onAction: () => // handle action
)
```

## Migration Steps

1. **Environment Setup**
   ```bash
   # Add to your .gitignore
   .env
   .env.*
   ```

2. **Update Dependencies**
   ```yaml
   # pubspec.yaml
   dependencies:
     http: ^1.1.0
     flutter_riverpod: ^2.4.0
   ```

3. **File Structure**
   ```
   lib/
   ├── config/
   │   └── env_config.dart
   ├── services/
   │   ├── network_service.dart
   │   └── backend_service.dart
   ├── widgets/
   │   └── error_view.dart
   └── main.dart
   ```

4. **Code Migration**
   - Copy new files to your project
   - Update existing files with new implementations
   - Update main.dart with environment initialization
   - Replace error handling with new widgets
   - Update API calls to use NetworkService

5. **Testing**
   - Test each environment configuration
   - Verify error handling
   - Check retry logic
   - Test loading states
   - Verify empty states

## Best Practices

1. **Environment Variables**
   - Never commit sensitive data
   - Use different configurations for different environments
   - Document required environment variables

2. **Error Handling**
   - Use specific error types
   - Provide meaningful error messages
   - Include retry options where appropriate

3. **Loading States**
   - Show loading indicators for async operations
   - Include loading messages for better UX
   - Handle loading states consistently

4. **Empty States**
   - Provide clear empty state messages
   - Include action buttons when appropriate
   - Maintain consistent empty state UI

## Common Issues

1. **Environment Variables**
   - Issue: Missing environment variables
   - Solution: Check .env file and environment setup

2. **Network Errors**
   - Issue: Unhandled network exceptions
   - Solution: Use NetworkService with proper error handling

3. **UI Consistency**
   - Issue: Inconsistent error/loading states
   - Solution: Use provided widgets consistently

## Support

If you encounter any issues during migration:
1. Check the documentation
2. Review error messages
3. Verify environment setup
4. Test network connectivity
5. Check API endpoints 