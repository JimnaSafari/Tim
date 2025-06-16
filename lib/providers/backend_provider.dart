import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../services/backend_service.dart';

// Health check provider
final healthCheckProvider = FutureProvider<Map<String, dynamic>>((ref) {
  final backendService = ref.watch(backendServiceProvider);
  return backendService.checkHealth();
});

// Batch providers
final batchesProvider = FutureProvider<List<Map<String, dynamic>>>((ref) {
  final backendService = ref.watch(backendServiceProvider);
  return backendService.getBatches();
});

final createBatchProvider = StateNotifierProvider<CreateBatchNotifier, AsyncValue<void>>((ref) {
  final backendService = ref.watch(backendServiceProvider);
  return CreateBatchNotifier(backendService);
});

class CreateBatchNotifier extends StateNotifier<AsyncValue<void>> {
  final BackendService _backendService;

  CreateBatchNotifier(this._backendService) : super(const AsyncValue.data(null));

  Future<void> createBatch({
    required double amount,
    required int maxMembers,
    required DateTime startDate,
    String? description,
  }) async {
    state = const AsyncValue.loading();
    try {
      await _backendService.createBatch(
        amount: amount,
        maxMembers: maxMembers,
        startDate: startDate,
        description: description,
      );
      state = const AsyncValue.data(null);
    } catch (e, stack) {
      state = AsyncValue.error(e, stack);
    }
  }
}

// Savings providers
final savingsProvider = FutureProvider<List<Map<String, dynamic>>>((ref) {
  final backendService = ref.watch(backendServiceProvider);
  return backendService.getSavings();
});

final createSavingsProvider = StateNotifierProvider<CreateSavingsNotifier, AsyncValue<void>>((ref) {
  final backendService = ref.watch(backendServiceProvider);
  return CreateSavingsNotifier(backendService);
});

class CreateSavingsNotifier extends StateNotifier<AsyncValue<void>> {
  final BackendService _backendService;

  CreateSavingsNotifier(this._backendService) : super(const AsyncValue.data(null));

  Future<void> createSavings({
    required double amount,
    required String batchId,
  }) async {
    state = const AsyncValue.loading();
    try {
      await _backendService.createSavings(
        amount: amount,
        batchId: batchId,
      );
      state = const AsyncValue.data(null);
    } catch (e, stack) {
      state = AsyncValue.error(e, stack);
    }
  }
}

// M-Pesa providers
final mpesaPaymentProvider = StateNotifierProvider<MpesaPaymentNotifier, AsyncValue<Map<String, dynamic>?>>((ref) {
  final backendService = ref.watch(backendServiceProvider);
  return MpesaPaymentNotifier(backendService);
});

class MpesaPaymentNotifier extends StateNotifier<AsyncValue<Map<String, dynamic>?>> {
  final BackendService _backendService;

  MpesaPaymentNotifier(this._backendService) : super(const AsyncValue.data(null));

  Future<void> initiatePayment({
    required String phoneNumber,
    required double amount,
    required String batchId,
  }) async {
    state = const AsyncValue.loading();
    try {
      final result = await _backendService.initiateMpesaPayment(
        phoneNumber: phoneNumber,
        amount: amount,
        batchId: batchId,
      );
      state = AsyncValue.data(result);
    } catch (e, stack) {
      state = AsyncValue.error(e, stack);
    }
  }

  Future<void> checkStatus(String checkoutRequestId) async {
    state = const AsyncValue.loading();
    try {
      final result = await _backendService.checkMpesaStatus(checkoutRequestId);
      state = AsyncValue.data(result);
    } catch (e, stack) {
      state = AsyncValue.error(e, stack);
    }
  }
} 