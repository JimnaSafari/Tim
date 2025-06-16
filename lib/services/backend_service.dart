import 'dart:convert';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'network_service.dart';

final networkServiceProvider = Provider<NetworkService>((ref) {
  return NetworkService();
});

final backendServiceProvider = Provider<BackendService>((ref) {
  final networkService = ref.watch(networkServiceProvider);
  return BackendService(networkService);
});

class BackendService {
  final NetworkService _networkService;

  BackendService(this._networkService);

  // Health check
  Future<Map<String, dynamic>> checkHealth() async {
    try {
      final response = await _networkService.get('/health');
      return json.decode(response.body);
    } on ApiException catch (e) {
      throw Exception('Health check failed: ${e.message}');
    }
  }

  // Auth endpoints
  Future<Map<String, dynamic>> login(String email, String password) async {
    try {
      final response = await _networkService.post(
        '/api/auth/login',
        body: {
          'email': email,
          'password': password,
        },
      );
      return json.decode(response.body);
    } on UnauthorizedException {
      throw Exception('Invalid email or password');
    } on ApiException catch (e) {
      throw Exception('Login failed: ${e.message}');
    }
  }

  Future<Map<String, dynamic>> register({
    required String email,
    required String password,
    required String name,
  }) async {
    try {
      final response = await _networkService.post(
        '/api/auth/register',
        body: {
          'email': email,
          'password': password,
          'name': name,
        },
      );
      return json.decode(response.body);
    } on ApiException catch (e) {
      throw Exception('Registration failed: ${e.message}');
    }
  }

  // Batch endpoints
  Future<List<Map<String, dynamic>>> getBatches() async {
    try {
      final response = await _networkService.get('/api/batches');
      final List<dynamic> data = json.decode(response.body);
      return data.cast<Map<String, dynamic>>();
    } on ApiException catch (e) {
      throw Exception('Failed to get batches: ${e.message}');
    }
  }

  Future<Map<String, dynamic>> createBatch({
    required double amount,
    required int maxMembers,
    required DateTime startDate,
    String? description,
  }) async {
    try {
      final response = await _networkService.post(
        '/api/batches',
        body: {
          'amount': amount,
          'maxMembers': maxMembers,
          'startDate': startDate.toIso8601String(),
          'description': description,
        },
      );
      return json.decode(response.body);
    } on ApiException catch (e) {
      throw Exception('Failed to create batch: ${e.message}');
    }
  }

  Future<void> joinBatch(String batchId) async {
    try {
      await _networkService.post('/api/batches/$batchId/join');
    } on ApiException catch (e) {
      throw Exception('Failed to join batch: ${e.message}');
    }
  }

  Future<void> leaveBatch(String batchId) async {
    try {
      await _networkService.post('/api/batches/$batchId/leave');
    } on ApiException catch (e) {
      throw Exception('Failed to leave batch: ${e.message}');
    }
  }

  // Savings endpoints
  Future<List<Map<String, dynamic>>> getSavings() async {
    try {
      final response = await _networkService.get('/api/savings');
      final List<dynamic> data = json.decode(response.body);
      return data.cast<Map<String, dynamic>>();
    } on ApiException catch (e) {
      throw Exception('Failed to get savings: ${e.message}');
    }
  }

  Future<Map<String, dynamic>> createSavings({
    required double amount,
    required String batchId,
  }) async {
    try {
      final response = await _networkService.post(
        '/api/savings',
        body: {
          'amount': amount,
          'batchId': batchId,
        },
      );
      return json.decode(response.body);
    } on ApiException catch (e) {
      throw Exception('Failed to create savings: ${e.message}');
    }
  }

  // M-Pesa endpoints
  Future<Map<String, dynamic>> initiateMpesaPayment({
    required String phoneNumber,
    required double amount,
    required String batchId,
  }) async {
    try {
      final response = await _networkService.post(
        '/api/mpesa/initiate',
        body: {
          'phoneNumber': phoneNumber,
          'amount': amount,
          'batchId': batchId,
        },
      );
      return json.decode(response.body);
    } on ApiException catch (e) {
      throw Exception('Failed to initiate M-Pesa payment: ${e.message}');
    }
  }

  Future<Map<String, dynamic>> checkMpesaStatus(String checkoutRequestId) async {
    try {
      final response = await _networkService.get(
        '/api/mpesa/status/$checkoutRequestId',
      );
      return json.decode(response.body);
    } on ApiException catch (e) {
      throw Exception('Failed to check M-Pesa status: ${e.message}');
    }
  }
} 