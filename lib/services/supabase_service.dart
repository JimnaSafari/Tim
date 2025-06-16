import 'package:supabase_flutter/supabase_flutter.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

final supabaseClientProvider = Provider<SupabaseClient>((ref) {
  return Supabase.instance.client;
});

final supabaseServiceProvider = Provider<SupabaseService>((ref) {
  final client = ref.watch(supabaseClientProvider);
  return SupabaseService(client);
});

class SupabaseService {
  final SupabaseClient _client;

  SupabaseService(this._client);

  // Auth methods
  Future<AuthResponse> signUp({
    required String email,
    required String password,
    Map<String, dynamic>? data,
  }) async {
    return await _client.auth.signUp(
      email: email,
      password: password,
      data: data,
    );
  }

  Future<AuthResponse> signIn({
    required String email,
    required String password,
  }) async {
    return await _client.auth.signInWithPassword(
      email: email,
      password: password,
    );
  }

  Future<void> signOut() async {
    await _client.auth.signOut();
  }

  Future<AuthResponse> resetPassword(String email) async {
    return await _client.auth.resetPasswordForEmail(email);
  }

  Future<AuthResponse> updatePassword(String newPassword) async {
    return await _client.auth.updateUser(
      UserAttributes(password: newPassword),
    );
  }

  // User methods
  User? get currentUser => _client.auth.currentUser;

  Stream<AuthState> get authStateChanges => _client.auth.onAuthStateChange;

  Future<void> updateUserProfile(Map<String, dynamic> data) async {
    final userId = currentUser?.id;
    if (userId == null) throw Exception('User not authenticated');

    await _client.from('profiles').upsert({
      'id': userId,
      ...data,
      'updated_at': DateTime.now().toIso8601String(),
    });
  }

  Future<Map<String, dynamic>> getUserProfile() async {
    final userId = currentUser?.id;
    if (userId == null) throw Exception('User not authenticated');

    final response = await _client
        .from('profiles')
        .select()
        .eq('id', userId)
        .single();
    return response;
  }

  // Batch methods
  Future<List<Map<String, dynamic>>> getBatches() async {
    final response = await _client
        .from('batches')
        .select()
        .order('created_at', ascending: false);
    return List<Map<String, dynamic>>.from(response);
  }

  Future<Map<String, dynamic>> getBatch(String id) async {
    final response = await _client
        .from('batches')
        .select()
        .eq('id', id)
        .single();
    return response;
  }

  Future<List<Map<String, dynamic>>> getUserBatches() async {
    final userId = currentUser?.id;
    if (userId == null) throw Exception('User not authenticated');

    final response = await _client
        .from('batches')
        .select()
        .eq('user_id', userId)
        .order('created_at', ascending: false);
    return List<Map<String, dynamic>>.from(response);
  }

  Future<void> createBatch(Map<String, dynamic> batchData) async {
    final userId = currentUser?.id;
    if (userId == null) throw Exception('User not authenticated');

    await _client.from('batches').insert({
      ...batchData,
      'user_id': userId,
      'created_at': DateTime.now().toIso8601String(),
      'updated_at': DateTime.now().toIso8601String(),
    });
  }

  Future<void> updateBatch(String id, Map<String, dynamic> batchData) async {
    await _client
        .from('batches')
        .update({
          ...batchData,
          'updated_at': DateTime.now().toIso8601String(),
        })
        .eq('id', id);
  }

  Future<void> deleteBatch(String id) async {
    await _client
        .from('batches')
        .delete()
        .eq('id', id);
  }

  // Batch membership methods
  Future<void> joinBatch(String batchId) async {
    final userId = currentUser?.id;
    if (userId == null) throw Exception('User not authenticated');

    await _client.from('batch_members').insert({
      'batch_id': batchId,
      'user_id': userId,
      'joined_at': DateTime.now().toIso8601String(),
    });
  }

  Future<void> leaveBatch(String batchId) async {
    final userId = currentUser?.id;
    if (userId == null) throw Exception('User not authenticated');

    await _client
        .from('batch_members')
        .delete()
        .eq('batch_id', batchId)
        .eq('user_id', userId);
  }

  Future<List<Map<String, dynamic>>> getBatchMembers(String batchId) async {
    final response = await _client
        .from('batch_members')
        .select('*, profiles(*)')
        .eq('batch_id', batchId)
        .order('joined_at', ascending: true);
    return List<Map<String, dynamic>>.from(response);
  }

  // Payment methods
  Future<void> createPayment({
    required String batchId,
    required double amount,
    required String paymentMethod,
    String? reference,
  }) async {
    final userId = currentUser?.id;
    if (userId == null) throw Exception('User not authenticated');

    await _client.from('payments').insert({
      'batch_id': batchId,
      'user_id': userId,
      'amount': amount,
      'payment_method': paymentMethod,
      'reference': reference,
      'status': 'pending',
      'created_at': DateTime.now().toIso8601String(),
    });
  }

  Future<List<Map<String, dynamic>>> getBatchPayments(String batchId) async {
    final response = await _client
        .from('payments')
        .select('*, profiles(*)')
        .eq('batch_id', batchId)
        .order('created_at', ascending: false);
    return List<Map<String, dynamic>>.from(response);
  }

  Future<List<Map<String, dynamic>>> getUserPayments() async {
    final userId = currentUser?.id;
    if (userId == null) throw Exception('User not authenticated');

    final response = await _client
        .from('payments')
        .select('*, batches(*)')
        .eq('user_id', userId)
        .order('created_at', ascending: false);
    return List<Map<String, dynamic>>.from(response);
  }

  // Notification methods
  Future<void> createNotification({
    required String userId,
    required String title,
    required String message,
    String? type,
    Map<String, dynamic>? data,
  }) async {
    await _client.from('notifications').insert({
      'user_id': userId,
      'title': title,
      'message': message,
      'type': type,
      'data': data,
      'read': false,
      'created_at': DateTime.now().toIso8601String(),
    });
  }

  Future<List<Map<String, dynamic>>> getUserNotifications() async {
    final userId = currentUser?.id;
    if (userId == null) throw Exception('User not authenticated');

    final response = await _client
        .from('notifications')
        .select()
        .eq('user_id', userId)
        .order('created_at', ascending: false);
    return List<Map<String, dynamic>>.from(response);
  }

  Future<void> markNotificationAsRead(String notificationId) async {
    await _client
        .from('notifications')
        .update({'read': true})
        .eq('id', notificationId);
  }

  Future<void> markAllNotificationsAsRead() async {
    final userId = currentUser?.id;
    if (userId == null) throw Exception('User not authenticated');

    await _client
        .from('notifications')
        .update({'read': true})
        .eq('user_id', userId)
        .eq('read', false);
  }
} 