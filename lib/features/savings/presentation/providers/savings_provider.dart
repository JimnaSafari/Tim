import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:tim_app/features/savings/domain/models/savings_goal.dart';

final savingsProvider = StateNotifierProvider<SavingsNotifier, AsyncValue<List<SavingsGoal>>>((ref) {
  return SavingsNotifier();
});

class SavingsNotifier extends StateNotifier<AsyncValue<List<SavingsGoal>>> {
  SavingsNotifier() : super(const AsyncValue.loading()) {
    loadSavings();
  }

  Future<void> loadSavings() async {
    try {
      // TODO: Implement loading from Supabase
      await Future.delayed(const Duration(seconds: 1)); // Simulated delay
      state = AsyncValue.data([
        SavingsGoal(
          id: '1',
          title: 'New Car',
          description: 'Saving for a new car',
          targetAmount: 25000,
          currentAmount: 5000,
          targetDate: DateTime.now().add(const Duration(days: 180)),
          createdAt: DateTime.now(),
          userId: 'user1',
        ),
        SavingsGoal(
          id: '2',
          title: 'Vacation',
          description: 'Summer vacation fund',
          targetAmount: 5000,
          currentAmount: 2000,
          targetDate: DateTime.now().add(const Duration(days: 90)),
          createdAt: DateTime.now(),
          userId: 'user1',
        ),
      ]);
    } catch (e, stack) {
      state = AsyncValue.error(e, stack);
    }
  }

  Future<void> addSavingsGoal(SavingsGoal goal) async {
    try {
      // TODO: Implement adding to Supabase
      await Future.delayed(const Duration(seconds: 1)); // Simulated delay
      state.whenData((goals) {
        state = AsyncValue.data([...goals, goal]);
      });
    } catch (e, stack) {
      state = AsyncValue.error(e, stack);
    }
  }

  Future<void> updateSavingsGoal(SavingsGoal goal) async {
    try {
      // TODO: Implement updating in Supabase
      await Future.delayed(const Duration(seconds: 1)); // Simulated delay
      state.whenData((goals) {
        state = AsyncValue.data(
          goals.map((g) => g.id == goal.id ? goal : g).toList(),
        );
      });
    } catch (e, stack) {
      state = AsyncValue.error(e, stack);
    }
  }

  Future<void> deleteSavingsGoal(String id) async {
    try {
      // TODO: Implement deleting from Supabase
      await Future.delayed(const Duration(seconds: 1)); // Simulated delay
      state.whenData((goals) {
        state = AsyncValue.data(
          goals.where((g) => g.id != id).toList(),
        );
      });
    } catch (e, stack) {
      state = AsyncValue.error(e, stack);
    }
  }
} 