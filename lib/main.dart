import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_dotenv/flutter_dotenv.dart';
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

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  
  // Load environment variables
  await dotenv.load(fileName: ".env");
  
  // Initialize Supabase
  await Supabase.initialize(
    url: dotenv.env['SUPABASE_URL'] ?? '',
    anonKey: dotenv.env['SUPABASE_ANON_KEY'] ?? '',
  );
  
  runApp(
    const ProviderScope(
      child: TimApp(),
    ),
  );
}

class TimApp extends ConsumerWidget {
  const TimApp({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final router = ref.watch(routerProvider);
    
    return MaterialApp.router(
      title: 'Tim Savings App',
      theme: AppTheme.lightTheme,
      darkTheme: AppTheme.darkTheme,
      themeMode: ThemeMode.system,
      routerConfig: router,
      debugShowCheckedModeBanner: false,
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