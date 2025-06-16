# Tim - Flutter Savings App

A modern Flutter application for managing savings and batch payments, built with Flutter and Supabase.

## Features

- User Authentication
- Batch Creation and Management
- Savings Tracking
- Profile Management
- Modern UI with Material Design
- Real-time Updates
- Secure Payment Integration

## Getting Started

### Prerequisites

- Flutter SDK (latest version)
- Dart SDK (latest version)
- Supabase account
- Android Studio / VS Code

### Installation

1. Clone the repository:
```bash
git clone https://github.com/JimnaSafari/Tim.git
cd Tim
```

2. Install dependencies:
```bash
flutter pub get
```

3. Configure environment variables:
- Create a `.env` file in the root directory
- Add your Supabase credentials:
```
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key
```

4. Run the app:
```bash
flutter run
```

## Project Structure

```
lib/
├── config/           # Configuration files
├── pages/           # Screen pages
├── providers/       # State management
├── services/        # API and service classes
└── widgets/         # Reusable widgets
```

## Dependencies

- flutter_riverpod: State management
- supabase_flutter: Backend integration
- go_router: Navigation
- flutter_secure_storage: Secure storage
- intl: Internationalization

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Contact

Jimna Safari - [@JimnaSafari](https://github.com/JimnaSafari)

Project Link: [https://github.com/JimnaSafari/Tim](https://github.com/JimnaSafari/Tim)
