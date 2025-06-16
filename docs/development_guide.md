# Development Guide

## Getting Started

### Prerequisites

1. **Development Environment**
   - Flutter SDK (3.19.0 or later)
   - Dart SDK (3.3.0 or later)
   - Android Studio / VS Code
   - Git

2. **Required Tools**
   - Flutter CLI
   - Android SDK
   - iOS SDK (for macOS users)
   - Code editor with Flutter plugins

### Setup

1. **Clone the Repository**
   ```bash
   git clone https://github.com/JimnaSafari/Tim.git
   cd Tim
   ```

2. **Install Dependencies**
   ```bash
   flutter pub get
   ```

3. **Environment Setup**
   - Copy `.env.example` to `.env`
   - Update environment variables:
     ```
     SUPABASE_URL=your_supabase_url
     SUPABASE_ANON_KEY=your_supabase_anon_key
     ```

4. **Run the App**
   ```bash
   flutter run
   ```

## Development Workflow

### 1. Branch Strategy

- `main`: Production-ready code
- `develop`: Development branch
- `feature/*`: New features
- `bugfix/*`: Bug fixes
- `release/*`: Release preparation

### 2. Code Style

Follow the official Flutter style guide:
```bash
# Format code
dart format .

# Analyze code
flutter analyze
```

### 3. Testing

1. **Unit Tests**
   ```bash
   flutter test
   ```

2. **Widget Tests**
   ```bash
   flutter test --tags=widget
   ```

3. **Integration Tests**
   ```bash
   flutter test integration_test
   ```

### 4. Building

1. **Debug Build**
   ```bash
   flutter build apk --debug
   ```

2. **Release Build**
   ```bash
   flutter build apk --release
   ```

3. **Web Build**
   ```bash
   flutter build web
   ```

## Architecture Guidelines

### 1. State Management

Use Riverpod for state management:

```dart
// Provider definition
final counterProvider = StateNotifierProvider<CounterNotifier, int>((ref) {
  return CounterNotifier();
});

// State notifier
class CounterNotifier extends StateNotifier<int> {
  CounterNotifier() : super(0);

  void increment() => state++;
}
```

### 2. Navigation

Use GoRouter for navigation:

```dart
final router = GoRouter(
  routes: [
    GoRoute(
      path: '/',
      builder: (context, state) => const HomePage(),
    ),
    GoRoute(
      path: '/profile',
      builder: (context, state) => const ProfilePage(),
    ),
  ],
);
```

### 3. API Integration

Use the NetworkService for API calls:

```dart
final response = await networkService.get('/endpoint');
```

## Common Tasks

### 1. Adding a New Page

1. Create page file in `lib/pages/`
2. Add route in `lib/config/router.dart`
3. Create necessary providers
4. Add tests

### 2. Adding a New Feature

1. Create feature branch
2. Implement feature
3. Add tests
4. Create pull request

### 3. Handling Errors

Use the ErrorView widget:

```dart
ErrorView(
  message: 'Error message',
  onRetry: () => retry(),
)
```

## Performance Optimization

### 1. Widget Optimization

- Use `const` constructors
- Implement `shouldRebuild`
- Use `ListView.builder`

### 2. Image Optimization

- Use `cached_network_image`
- Implement proper image sizing
- Use WebP format

### 3. State Management

- Minimize provider scope
- Use `select` for fine-grained updates
- Implement proper disposal

## Debugging

### 1. Flutter DevTools

```bash
flutter run --debug
```

### 2. Logging

```dart
import 'package:logging/logging.dart';

final logger = Logger('App');
logger.info('Message');
```

### 3. Error Tracking

```dart
try {
  // Code
} catch (e, stackTrace) {
  logger.severe('Error', e, stackTrace);
}
```

## Deployment

### 1. Android

1. Update version in `pubspec.yaml`
2. Build release APK
3. Sign APK
4. Upload to Play Store

### 2. iOS

1. Update version in Xcode
2. Archive app
3. Upload to App Store

### 3. Web

1. Build web version
2. Deploy to hosting service

## Troubleshooting

### 1. Common Issues

1. **Build Failures**
   - Clean project: `flutter clean`
   - Get dependencies: `flutter pub get`
   - Rebuild: `flutter run`

2. **Performance Issues**
   - Run in profile mode
   - Use DevTools
   - Check widget rebuilds

3. **State Management**
   - Check provider scope
   - Verify state updates
   - Check disposal

### 2. Getting Help

1. Check documentation
2. Search issues
3. Create new issue

## Contributing

1. Fork repository
2. Create feature branch
3. Make changes
4. Add tests
5. Create pull request

## Resources

1. [Flutter Documentation](https://flutter.dev/docs)
2. [Riverpod Documentation](https://riverpod.dev/docs)
3. [Supabase Documentation](https://supabase.io/docs) 