import 'package:flutter/material.dart';

class AppTheme {
  static const _primaryColor = Color(0xFF007AFF);
  static const _secondaryColor = Color(0xFF5856D6);
  static const _errorColor = Color(0xFFFF3B30);
  static const _successColor = Color(0xFF34C759);
  static const _warningColor = Color(0xFFFF9500);

  static final lightTheme = ThemeData(
    useMaterial3: true,
    colorScheme: ColorScheme.light(
      primary: _primaryColor,
      secondary: _secondaryColor,
      error: _errorColor,
      surface: Colors.white,
      background: const Color(0xFFF2F2F7),
    ),
    scaffoldBackgroundColor: const Color(0xFFF2F2F7),
    appBarTheme: const AppBarTheme(
      backgroundColor: Colors.white,
      elevation: 0,
      centerTitle: true,
      iconTheme: IconThemeData(color: Colors.black),
      titleTextStyle: TextStyle(
        color: Colors.black,
        fontSize: 17,
        fontWeight: FontWeight.w600,
        fontFamily: 'Inter',
      ),
    ),
    textTheme: const TextTheme(
      displayLarge: TextStyle(
        fontSize: 34,
        fontWeight: FontWeight.bold,
        fontFamily: 'Inter',
      ),
      displayMedium: TextStyle(
        fontSize: 28,
        fontWeight: FontWeight.bold,
        fontFamily: 'Inter',
      ),
      displaySmall: TextStyle(
        fontSize: 22,
        fontWeight: FontWeight.bold,
        fontFamily: 'Inter',
      ),
      bodyLarge: TextStyle(
        fontSize: 17,
        fontFamily: 'Inter',
      ),
      bodyMedium: TextStyle(
        fontSize: 15,
        fontFamily: 'Inter',
      ),
      bodySmall: TextStyle(
        fontSize: 13,
        fontFamily: 'Inter',
      ),
    ),
  );

  static final darkTheme = ThemeData(
    useMaterial3: true,
    colorScheme: ColorScheme.dark(
      primary: _primaryColor,
      secondary: _secondaryColor,
      error: _errorColor,
      surface: const Color(0xFF1C1C1E),
      background: const Color(0xFF000000),
    ),
    scaffoldBackgroundColor: const Color(0xFF000000),
    appBarTheme: const AppBarTheme(
      backgroundColor: Color(0xFF1C1C1E),
      elevation: 0,
      centerTitle: true,
      iconTheme: IconThemeData(color: Colors.white),
      titleTextStyle: TextStyle(
        color: Colors.white,
        fontSize: 17,
        fontWeight: FontWeight.w600,
        fontFamily: 'Inter',
      ),
    ),
    textTheme: const TextTheme(
      displayLarge: TextStyle(
        fontSize: 34,
        fontWeight: FontWeight.bold,
        fontFamily: 'Inter',
        color: Colors.white,
      ),
      displayMedium: TextStyle(
        fontSize: 28,
        fontWeight: FontWeight.bold,
        fontFamily: 'Inter',
        color: Colors.white,
      ),
      displaySmall: TextStyle(
        fontSize: 22,
        fontWeight: FontWeight.bold,
        fontFamily: 'Inter',
        color: Colors.white,
      ),
      bodyLarge: TextStyle(
        fontSize: 17,
        fontFamily: 'Inter',
        color: Colors.white,
      ),
      bodyMedium: TextStyle(
        fontSize: 15,
        fontFamily: 'Inter',
        color: Colors.white,
      ),
      bodySmall: TextStyle(
        fontSize: 13,
        fontFamily: 'Inter',
        color: Colors.white,
      ),
    ),
  );
} 