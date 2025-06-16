import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:supabase_flutter/supabase_flutter.dart';
import 'package:go_router/go_router.dart';
import 'package:flutter_app/config/router.dart';
import 'package:flutter_app/config/theme.dart';
import 'package:flutter_app/config/supabase_config.dart';
import 'pages/auth/login_page.dart';
import 'pages/auth/register_page.dart';
import 'pages/dashboard/dashboard_page.dart';
import 'pages/profile/edit_profile_page.dart';
import 'pages/batches/create_batch_page.dart';
import 'pages/health/health_check_page.dart';
import 'pages/home/home_page.dart';
import 'providers/auth_provider.dart';
import 'config/env_config.dart';

void main() {
  WidgetsFlutterBinding.ensureInitialized();

  // Initialize environment configuration
  EnvConfig.initialize(
    environment: Environment.dev,
    backendUrl: const String.fromEnvironment(
      'BACKEND_URL',
      defaultValue: 'http://localhost:10000',
    ),
    supabaseUrl: const String.fromEnvironment(
      'SUPABASE_URL',
      defaultValue: 'https://your-project.supabase.co',
    ),
    supabaseAnonKey: const String.fromEnvironment(
      'SUPABASE_ANON_KEY',
      defaultValue: 'your-anon-key',
    ),
    enableLogging: true,
  );

  runApp(
    const ProviderScope(
      child: MyApp(),
    ),
  );
}

class MyApp extends ConsumerWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final authState = ref.watch(authProvider);

    return MaterialApp(
      title: 'Savings App',
      theme: ThemeData(
        colorScheme: ColorScheme.fromSeed(seedColor: Colors.blue),
        useMaterial3: true,
      ),
      home: authState.when(
        data: (user) => user != null ? const HomePage() : const LoginPage(),
        loading: () => const Scaffold(
          body: LoadingView(message: 'Loading...'),
        ),
        error: (error, stack) => Scaffold(
          body: ErrorView(
            message: 'Error: $error',
            onRetry: () {
              ref.refresh(authProvider);
            },
          ),
        ),
      ),
    );
  }
}

class HomePage extends StatelessWidget {
  const HomePage({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: IndexedStack(
        index: 0,
        children: const [
          DashboardPage(),
          CreateBatchPage(),
          EditProfilePage(),
          HealthCheckPage(),
        ],
      ),
      bottomNavigationBar: NavigationBar(
        destinations: const [
          NavigationDestination(
            icon: Icon(Icons.dashboard),
            label: 'Dashboard',
          ),
          NavigationDestination(
            icon: Icon(Icons.add_circle),
            label: 'Create Batch',
          ),
          NavigationDestination(
            icon: Icon(Icons.person),
            label: 'Profile',
          ),
          NavigationDestination(
            icon: Icon(Icons.health_and_safety),
            label: 'Health',
          ),
        ],
        onDestinationSelected: (index) {
          // Handle navigation
        },
      ),
    );
  }
} 