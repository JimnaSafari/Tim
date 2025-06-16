import 'package:flutter/foundation.dart';

enum Environment {
  dev,
  staging,
  prod,
}

class EnvConfig {
  final Environment environment;
  final String backendUrl;
  final String supabaseUrl;
  final String supabaseAnonKey;
  final bool enableLogging;

  static EnvConfig? _instance;

  factory EnvConfig({
    required Environment environment,
    required String backendUrl,
    required String supabaseUrl,
    required String supabaseAnonKey,
    bool enableLogging = false,
  }) {
    _instance ??= EnvConfig._internal(
      environment: environment,
      backendUrl: backendUrl,
      supabaseUrl: supabaseUrl,
      supabaseAnonKey: supabaseAnonKey,
      enableLogging: enableLogging,
    );
    return _instance!;
  }

  EnvConfig._internal({
    required this.environment,
    required this.backendUrl,
    required this.supabaseUrl,
    required this.supabaseAnonKey,
    required this.enableLogging,
  });

  static EnvConfig get instance {
    if (_instance == null) {
      throw Exception('EnvConfig not initialized');
    }
    return _instance!;
  }

  static bool isDevelopment() => instance.environment == Environment.dev;
  static bool isStaging() => instance.environment == Environment.staging;
  static bool isProduction() => instance.environment == Environment.prod;

  static void initialize({
    required Environment environment,
    required String backendUrl,
    required String supabaseUrl,
    required String supabaseAnonKey,
    bool enableLogging = false,
  }) {
    EnvConfig(
      environment: environment,
      backendUrl: backendUrl,
      supabaseUrl: supabaseUrl,
      supabaseAnonKey: supabaseAnonKey,
      enableLogging: enableLogging,
    );
  }
} 