import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:tim_app/features/auth/presentation/pages/login_page.dart';
import 'package:tim_app/features/auth/presentation/pages/register_page.dart';
import 'package:tim_app/features/home/presentation/pages/home_page.dart';
import 'package:tim_app/features/profile/presentation/pages/profile_page.dart';
import 'package:tim_app/features/savings/presentation/pages/savings_page.dart';
import 'package:tim_app/features/savings/presentation/pages/savings_detail_page.dart';

final routerProvider = Provider<GoRouter>((ref) {
  return GoRouter(
    initialLocation: '/login',
    routes: [
      GoRoute(
        path: '/login',
        builder: (context, state) => const LoginPage(),
      ),
      GoRoute(
        path: '/register',
        builder: (context, state) => const RegisterPage(),
      ),
      GoRoute(
        path: '/home',
        builder: (context, state) => const HomePage(),
      ),
      GoRoute(
        path: '/profile',
        builder: (context, state) => const ProfilePage(),
      ),
      GoRoute(
        path: '/savings',
        builder: (context, state) => const SavingsPage(),
      ),
      GoRoute(
        path: '/savings/:id',
        builder: (context, state) => SavingsDetailPage(
          savingsId: state.pathParameters['id']!,
        ),
      ),
    ],
    errorBuilder: (context, state) => Scaffold(
      body: Center(
        child: Text(
          'Page not found: ${state.uri.path}',
          style: Theme.of(context).textTheme.titleLarge,
        ),
      ),
    ),
  );
}); 