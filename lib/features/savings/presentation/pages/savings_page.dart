import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:tim_app/core/presentation/widgets/savings_card.dart';
import 'package:tim_app/features/savings/domain/models/savings_goal.dart';
import 'package:tim_app/features/savings/presentation/providers/savings_provider.dart';
import 'package:tim_app/features/savings/presentation/widgets/savings_form.dart';

class SavingsPage extends ConsumerWidget {
  const SavingsPage({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final savingsAsync = ref.watch(savingsProvider);

    return Scaffold(
      appBar: AppBar(
        title: const Text('Savings Goals'),
        actions: [
          IconButton(
            icon: const Icon(Icons.add),
            onPressed: () => _showAddGoalDialog(context, ref),
          ),
        ],
      ),
      body: savingsAsync.when(
        data: (goals) => goals.isEmpty
            ? Center(
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    Icon(
                      Icons.savings_outlined,
                      size: 64,
                      color: Theme.of(context).colorScheme.primary,
                    ),
                    const SizedBox(height: 16),
                    Text(
                      'No savings goals yet',
                      style: Theme.of(context).textTheme.titleLarge,
                    ),
                    const SizedBox(height: 8),
                    Text(
                      'Tap the + button to create your first goal',
                      style: Theme.of(context).textTheme.bodyMedium,
                    ),
                  ],
                ),
              )
            : ListView.builder(
                padding: const EdgeInsets.all(16),
                itemCount: goals.length,
                itemBuilder: (context, index) {
                  final goal = goals[index];
                  return Padding(
                    padding: const EdgeInsets.only(bottom: 16),
                    child: SavingsCard(
                      goal: goal,
                      onTap: () => _showEditGoalDialog(context, ref, goal),
                      onDelete: () => _showDeleteConfirmation(context, ref, goal),
                    ),
                  );
                },
              ),
        loading: () => const Center(child: CircularProgressIndicator()),
        error: (error, stack) => Center(
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Icon(
                Icons.error_outline,
                size: 64,
                color: Theme.of(context).colorScheme.error,
              ),
              const SizedBox(height: 16),
              Text(
                'Error loading savings goals',
                style: Theme.of(context).textTheme.titleLarge,
              ),
              const SizedBox(height: 8),
              Text(
                error.toString(),
                style: Theme.of(context).textTheme.bodyMedium,
                textAlign: TextAlign.center,
              ),
              const SizedBox(height: 16),
              ElevatedButton(
                onPressed: () => ref.refresh(savingsProvider),
                child: const Text('Retry'),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Future<void> _showAddGoalDialog(BuildContext context, WidgetRef ref) async {
    return showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Add Savings Goal'),
        content: SingleChildScrollView(
          child: SavingsForm(
            onSubmit: (goal) {
              ref.read(savingsProvider.notifier).addSavingsGoal(goal);
              Navigator.of(context).pop();
            },
          ),
        ),
      ),
    );
  }

  Future<void> _showEditGoalDialog(
    BuildContext context,
    WidgetRef ref,
    SavingsGoal goal,
  ) async {
    return showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Edit Savings Goal'),
        content: SingleChildScrollView(
          child: SavingsForm(
            initialGoal: goal,
            onSubmit: (updatedGoal) {
              ref.read(savingsProvider.notifier).updateSavingsGoal(updatedGoal);
              Navigator.of(context).pop();
            },
          ),
        ),
      ),
    );
  }

  Future<void> _showDeleteConfirmation(
    BuildContext context,
    WidgetRef ref,
    SavingsGoal goal,
  ) async {
    return showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Delete Savings Goal'),
        content: Text('Are you sure you want to delete "${goal.title}"?'),
        actions: [
          TextButton(
            onPressed: () => Navigator.of(context).pop(),
            child: const Text('Cancel'),
          ),
          TextButton(
            onPressed: () {
              ref.read(savingsProvider.notifier).deleteSavingsGoal(goal.id);
              Navigator.of(context).pop();
            },
            style: TextButton.styleFrom(
              foregroundColor: Theme.of(context).colorScheme.error,
            ),
            child: const Text('Delete'),
          ),
        ],
      ),
    );
  }
} 