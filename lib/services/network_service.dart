import 'dart:async';
import 'dart:convert';
import 'package:http/http.dart' as http;
import '../config/env_config.dart';

class NetworkService {
  final http.Client _client;
  final int maxRetries;
  final Duration retryDelay;

  NetworkService({
    http.Client? client,
    this.maxRetries = 3,
    this.retryDelay = const Duration(seconds: 1),
  }) : _client = client ?? http.Client();

  Future<http.Response> get(
    String endpoint, {
    Map<String, String>? headers,
    int? retryCount,
  }) async {
    return _executeWithRetry(
      () => _client.get(
        Uri.parse('${EnvConfig.instance.backendUrl}$endpoint'),
        headers: _getHeaders(headers),
      ),
      retryCount: retryCount,
    );
  }

  Future<http.Response> post(
    String endpoint, {
    Map<String, String>? headers,
    Object? body,
    int? retryCount,
  }) async {
    return _executeWithRetry(
      () => _client.post(
        Uri.parse('${EnvConfig.instance.backendUrl}$endpoint'),
        headers: _getHeaders(headers),
        body: body != null ? json.encode(body) : null,
      ),
      retryCount: retryCount,
    );
  }

  Future<http.Response> put(
    String endpoint, {
    Map<String, String>? headers,
    Object? body,
    int? retryCount,
  }) async {
    return _executeWithRetry(
      () => _client.put(
        Uri.parse('${EnvConfig.instance.backendUrl}$endpoint'),
        headers: _getHeaders(headers),
        body: body != null ? json.encode(body) : null,
      ),
      retryCount: retryCount,
    );
  }

  Future<http.Response> delete(
    String endpoint, {
    Map<String, String>? headers,
    int? retryCount,
  }) async {
    return _executeWithRetry(
      () => _client.delete(
        Uri.parse('${EnvConfig.instance.backendUrl}$endpoint'),
        headers: _getHeaders(headers),
      ),
      retryCount: retryCount,
    );
  }

  Map<String, String> _getHeaders(Map<String, String>? headers) {
    final defaultHeaders = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    };

    if (headers != null) {
      defaultHeaders.addAll(headers);
    }

    return defaultHeaders;
  }

  Future<http.Response> _executeWithRetry(
    Future<http.Response> Function() request, {
    int? retryCount,
  }) async {
    int attempts = 0;
    int maxAttempts = retryCount ?? maxRetries;

    while (true) {
      try {
        attempts++;
        final response = await request();

        if (response.statusCode >= 200 && response.statusCode < 300) {
          return response;
        }

        if (response.statusCode == 401) {
          throw UnauthorizedException('Authentication required');
        }

        if (response.statusCode == 403) {
          throw ForbiddenException('Access denied');
        }

        if (response.statusCode == 404) {
          throw NotFoundException('Resource not found');
        }

        if (response.statusCode >= 500) {
          throw ServerException('Server error occurred');
        }

        throw ApiException(
          'Request failed with status: ${response.statusCode}',
          response.statusCode,
        );
      } catch (e) {
        if (e is ApiException) {
          rethrow;
        }

        if (attempts >= maxAttempts) {
          throw NetworkException('Failed after $maxAttempts attempts: $e');
        }

        await Future.delayed(retryDelay * attempts);
      }
    }
  }

  void dispose() {
    _client.close();
  }
}

class ApiException implements Exception {
  final String message;
  final int? statusCode;

  ApiException(this.message, [this.statusCode]);

  @override
  String toString() => 'ApiException: $message${statusCode != null ? ' (Status: $statusCode)' : ''}';
}

class NetworkException implements Exception {
  final String message;

  NetworkException(this.message);

  @override
  String toString() => 'NetworkException: $message';
}

class UnauthorizedException extends ApiException {
  UnauthorizedException([String message = 'Unauthorized']) : super(message, 401);
}

class ForbiddenException extends ApiException {
  ForbiddenException([String message = 'Forbidden']) : super(message, 403);
}

class NotFoundException extends ApiException {
  NotFoundException([String message = 'Not Found']) : super(message, 404);
}

class ServerException extends ApiException {
  ServerException([String message = 'Server Error']) : super(message, 500);
} 