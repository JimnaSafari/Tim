# Testing Guide

This guide provides comprehensive information about testing the Flutter application, including unit tests, widget tests, integration tests, and API tests.

## Table of Contents
1. [Testing Setup](#testing-setup)
2. [Unit Tests](#unit-tests)
3. [Widget Tests](#widget-tests)
4. [Integration Tests](#integration-tests)
5. [API Tests](#api-tests)
6. [Test Coverage](#test-coverage)
7. [Best Practices](#best-practices)

## Testing Setup

### Dependencies
Add the following to your `pubspec.yaml`:
```yaml
dev_dependencies:
  flutter_test:
    sdk: flutter
  mockito: ^5.4.4
  build_runner: ^2.4.8
  integration_test:
    sdk: flutter
  coverage: ^1.6.3
```

### Directory Structure
```
test/
├── unit/
│   ├── services/
│   ├── providers/
│   └── utils/
├── widget/
│   ├── pages/
│   └── components/
├── integration/
└── api/
```

## Unit Tests

### Service Tests

#### Network Service Test
```dart
// test/unit/services/network_service_test.dart
import 'package:flutter_test/flutter_test.dart';
import 'package:mockito/mockito.dart';
import 'package:http/http.dart' as http;

class MockClient extends Mock implements http.Client {}

void main() {
  late NetworkService networkService;
  late MockClient mockClient;

  setUp(() {
    mockClient = MockClient();
    networkService = NetworkService(client: mockClient);
  });

  group('NetworkService', () {
    test('successful GET request', () async {
      when(mockClient.get(any)).thenAnswer(
        (_) async => http.Response('{"data": "test"}', 200),
      );

      final response = await networkService.get('/test');
      expect(response['data'], equals('test'));
    });

    test('handles network error', () async {
      when(mockClient.get(any)).thenThrow(
        SocketException('Failed to connect'),
      );

      expect(
        () => networkService.get('/test'),
        throwsA(isA<NetworkException>()),
      );
    });
  });
}
```

#### Backend Service Test
```dart
// test/unit/services/backend_service_test.dart
import 'package:flutter_test/flutter_test.dart';
import 'package:mockito/mockito.dart';

class MockNetworkService extends Mock implements NetworkService {}

void main() {
  late BackendService backendService;
  late MockNetworkService mockNetworkService;

  setUp(() {
    mockNetworkService = MockNetworkService();
    backendService = BackendService(networkService: mockNetworkService);
  });

  group('BackendService', () {
    test('login success', () async {
      when(mockNetworkService.post(
        any,
        body: anyNamed('body'),
      )).thenAnswer(
        (_) async => {
          'token': 'test_token',
          'user': {'id': '1', 'email': 'test@test.com'},
        },
      );

      final result = await backendService.login('test@test.com', 'password');
      expect(result['token'], equals('test_token'));
    });

    test('login failure', () async {
      when(mockNetworkService.post(
        any,
        body: anyNamed('body'),
      )).thenThrow(UnauthorizedException());

      expect(
        () => backendService.login('test@test.com', 'password'),
        throwsA(isA<UnauthorizedException>()),
      );
    });
  });
}
```

### Provider Tests

#### Auth Provider Test
```dart
// test/unit/providers/auth_provider_test.dart
import 'package:flutter_test/flutter_test.dart';
import 'package:mockito/mockito.dart';

class MockBackendService extends Mock implements BackendService {}

void main() {
  late AuthController authController;
  late MockBackendService mockBackendService;

  setUp(() {
    mockBackendService = MockBackendService();
    authController = AuthController(backendService: mockBackendService);
  });

  group('AuthController', () {
    test('login success', () async {
      when(mockBackendService.login(any, any)).thenAnswer(
        (_) async => {
          'token': 'test_token',
          'user': {'id': '1', 'email': 'test@test.com'},
        },
      );

      await authController.login('test@test.com', 'password');
      expect(authController.state, isA<Authenticated>());
    });

    test('login failure', () async {
      when(mockBackendService.login(any, any))
          .thenThrow(UnauthorizedException());

      await authController.login('test@test.com', 'password');
      expect(authController.state, isA<AuthError>());
    });
  });
}
```

## Widget Tests

### Page Tests

#### Login Page Test
```dart
// test/widget/pages/login_page_test.dart
import 'package:flutter_test/flutter_test.dart';
import 'package:flutter/material.dart';
import 'package:mockito/mockito.dart';

class MockAuthController extends Mock implements AuthController {}

void main() {
  late MockAuthController mockAuthController;

  setUp(() {
    mockAuthController = MockAuthController();
  });

  testWidgets('login form validation', (WidgetTester tester) async {
    await tester.pumpWidget(
      MaterialApp(
        home: LoginPage(controller: mockAuthController),
      ),
    );

    // Test empty form
    await tester.tap(find.byType(ElevatedButton));
    await tester.pump();

    expect(find.text('Please enter your email'), findsOneWidget);
    expect(find.text('Please enter your password'), findsOneWidget);

    // Test invalid email
    await tester.enterText(
      find.byType(TextFormField).first,
      'invalid-email',
    );
    await tester.tap(find.byType(ElevatedButton));
    await tester.pump();

    expect(find.text('Please enter a valid email'), findsOneWidget);
  });

  testWidgets('login success', (WidgetTester tester) async {
    when(mockAuthController.login(any, any)).thenAnswer((_) async {});

    await tester.pumpWidget(
      MaterialApp(
        home: LoginPage(controller: mockAuthController),
      ),
    );

    await tester.enterText(
      find.byType(TextFormField).first,
      'test@test.com',
    );
    await tester.enterText(
      find.byType(TextFormField).last,
      'password',
    );
    await tester.tap(find.byType(ElevatedButton));
    await tester.pump();

    verify(mockAuthController.login('test@test.com', 'password')).called(1);
  });
}
```

### Component Tests

#### Error View Test
```dart
// test/widget/components/error_view_test.dart
import 'package:flutter_test/flutter_test.dart';
import 'package:flutter/material.dart';

void main() {
  testWidgets('error view displays message and retry button',
      (WidgetTester tester) async {
    bool retryPressed = false;

    await tester.pumpWidget(
      MaterialApp(
        home: ErrorView(
          message: 'Test error',
          onRetry: () => retryPressed = true,
        ),
      ),
    );

    expect(find.text('Test error'), findsOneWidget);
    expect(find.byType(ElevatedButton), findsOneWidget);

    await tester.tap(find.byType(ElevatedButton));
    await tester.pump();

    expect(retryPressed, isTrue);
  });
}
```

## Integration Tests

### App Flow Test
```dart
// test/integration/app_flow_test.dart
import 'package:flutter_test/flutter_test.dart';
import 'package:integration_test/integration_test.dart';

void main() {
  IntegrationTestWidgetsFlutterBinding.ensureInitialized();

  group('App Flow', () {
    testWidgets('login to dashboard flow', (WidgetTester tester) async {
      // Start app
      await tester.pumpWidget(MyApp());
      await tester.pumpAndSettle();

      // Verify login page
      expect(find.byType(LoginPage), findsOneWidget);

      // Enter credentials
      await tester.enterText(
        find.byType(TextFormField).first,
        'test@test.com',
      );
      await tester.enterText(
        find.byType(TextFormField).last,
        'password',
      );

      // Login
      await tester.tap(find.byType(ElevatedButton));
      await tester.pumpAndSettle();

      // Verify dashboard
      expect(find.byType(DashboardPage), findsOneWidget);
    });
  });
}
```

## API Tests

### Backend API Test
```dart
// test/api/backend_api_test.dart
import 'package:flutter_test/flutter_test.dart';
import 'package:http/http.dart' as http;

void main() {
  final baseUrl = 'http://localhost:10000';

  group('Backend API', () {
    test('health check', () async {
      final response = await http.get(Uri.parse('$baseUrl/health'));
      expect(response.statusCode, equals(200));
      expect(response.body, contains('"status":"healthy"'));
    });

    test('login endpoint', () async {
      final response = await http.post(
        Uri.parse('$baseUrl/api/auth/login'),
        body: {
          'email': 'test@test.com',
          'password': 'password',
        },
      );

      expect(response.statusCode, equals(200));
      expect(response.body, contains('"token"'));
    });
  });
}
```

## Test Coverage

### Running Tests with Coverage
```bash
# Run all tests with coverage
flutter test --coverage

# Generate coverage report
genhtml coverage/lcov.info -o coverage/html
```

### Coverage Configuration
Add to your `pubspec.yaml`:
```yaml
flutter_test:
  coverage:
    exclude:
      - "**/*.g.dart"
      - "**/*.freezed.dart"
      - "lib/generated/**"
```

## Best Practices

### 1. Test Organization
- Group related tests using `group()`
- Use descriptive test names
- Follow the Arrange-Act-Assert pattern

### 2. Mocking
- Use `Mockito` for mocking dependencies
- Create mock classes for external services
- Verify mock interactions

### 3. Widget Testing
- Test user interactions
- Verify widget state changes
- Test error scenarios

### 4. Integration Testing
- Test complete user flows
- Verify navigation
- Test error handling

### 5. API Testing
- Test all endpoints
- Verify response formats
- Test error cases

### 6. Test Data
- Use realistic test data
- Create test fixtures
- Avoid hardcoding values

### 7. Error Handling
- Test error scenarios
- Verify error messages
- Test retry logic

### 8. Performance
- Keep tests fast
- Use appropriate test types
- Avoid unnecessary setup

## Running Tests

### Command Line
```bash
# Run all tests
flutter test

# Run specific test file
flutter test test/unit/services/network_service_test.dart

# Run tests with coverage
flutter test --coverage

# Run integration tests
flutter test integration_test
```

### VS Code
1. Install Flutter extension
2. Use Test Explorer
3. Click test icons in editor

### Android Studio
1. Open test file
2. Click run icon
3. View results in test window

## Continuous Integration

### GitHub Actions
```yaml
name: Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: subosito/flutter-action@v2
      - run: flutter test --coverage
      - uses: codecov/codecov-action@v3
```

### Coverage Reports
1. Run tests with coverage
2. Generate HTML report
3. Upload to code coverage service

## Debugging Tests

### Common Issues
1. **Async Tests**
   - Use `pumpAndSettle()`
   - Handle animations
   - Use proper async matchers

2. **Widget Tests**
   - Check widget tree
   - Verify state changes
   - Handle navigation

3. **Integration Tests**
   - Check device setup
   - Handle permissions
   - Manage test data

### Debug Tools
1. **Flutter DevTools**
   - Widget inspector
   - Performance profiler
   - Memory profiler

2. **VS Code**
   - Debug console
   - Breakpoints
   - Watch variables

3. **Android Studio**
   - Debug window
   - Logcat
   - Memory monitor 