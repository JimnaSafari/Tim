import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:flutter_app/services/supabase_service.dart';
import 'package:flutter_app/widgets/batch_card.dart';

final dashboardProvider = FutureProvider<Map<String, dynamic>>((ref) async {
  final service = ref.watch(supabaseServiceProvider);
  final batches = await service.getUserBatches();
  final totalSavings = batches.fold<double>(
    0,
    (sum, batch) => sum + (batch['amount'] as num).toDouble(),
  );
  final activeBatches = batches.where((batch) => !(batch['is_full'] as bool)).length;
  final completedBatches = batches.where((batch) => batch['is_full'] as bool).length;

  return {
    'batches': batches,
    'totalSavings': totalSavings,
    'activeBatches': activeBatches,
    'completedBatches': completedBatches,
  };
});

class DashboardPage extends ConsumerWidget {
  const DashboardPage({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final dashboard = ref.watch(dashboardProvider);

    return Scaffold(
      appBar: AppBar(
        title: const Text('Dashboard'),
        actions: [
          IconButton(
            icon: const Icon(Icons.add),
            onPressed: () => context.push('/batches/create'),
          ),
        ],
      ),
      body: dashboard.when(
        loading: () => const Center(child: CircularProgressIndicator()),
        error: (error, stack) => Center(
          child: Text(
            'Error: ${error.toString()}',
            style: TextStyle(color: Theme.of(context).colorScheme.error),
          ),
        ),
        data: (data) => RefreshIndicator(
          onRefresh: () => ref.refresh(dashboardProvider.future),
          child: SingleChildScrollView(
            padding: const EdgeInsets.all(16.0),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                _buildSummaryCards(context, data),
                const SizedBox(height: 24),
                Text(
                  'Your Batches',
                  style: Theme.of(context).textTheme.titleLarge,
                ),
                const SizedBox(height: 16),
                if (data['batches'].isEmpty)
                  Center(
                    child: Column(
                      children: [
                        Icon(
                          Icons.group_outlined,
                          size: 48,
                          color: Theme.of(context).colorScheme.onSurfaceVariant,
                        ),
                        const SizedBox(height: 16),
                        Text(
                          'No batches yet',
                          style: Theme.of(context).textTheme.titleMedium?.copyWith(
                                color: Theme.of(context).colorScheme.onSurfaceVariant,
                              ),
                        ),
                        const SizedBox(height: 8),
                        FilledButton.icon(
                          onPressed: () => context.push('/batches/create'),
                          icon: const Icon(Icons.add),
                          label: const Text('Create Batch'),
                        ),
                      ],
                    ),
                  )
                else
                  ListView.separated(
                    shrinkWrap: true,
                    physics: const NeverScrollableScrollPhysics(),
                    itemCount: data['batches'].length,
                    separatorBuilder: (context, index) => const SizedBox(height: 16),
                    itemBuilder: (context, index) {
                      final batch = data['batches'][index];
                      return BatchCard(
                        batch: batch,
                        onJoin: () {
                          // TODO: Implement join batch
                        },
                        onLeave: () {
                          // TODO: Implement leave batch
                        },
                      );
                    },
                  ),
              ],
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildSummaryCards(BuildContext context, Map<String, dynamic> data) {
    return GridView.count(
      shrinkWrap: true,
      physics: const NeverScrollableScrollPhysics(),
      crossAxisCount: 2,
      mainAxisSpacing: 16,
      crossAxisSpacing: 16,
      childAspectRatio: 1.5,
      children: [
        _SummaryCard(
          title: 'Total Savings',
          value: '\$${data['totalSavings'].toStringAsFixed(2)}',
          icon: Icons.savings_outlined,
          color: Theme.of(context).colorScheme.primary,
        ),
        _SummaryCard(
          title: 'Active Batches',
          value: data['activeBatches'].toString(),
          icon: Icons.group_outlined,
          color: Theme.of(context).colorScheme.secondary,
        ),
        _SummaryCard(
          title: 'Completed',
          value: data['completedBatches'].toString(),
          icon: Icons.check_circle_outline,
          color: Theme.of(context).colorScheme.tertiary,
        ),
        _SummaryCard(
          title: 'Total Batches',
          value: data['batches'].length.toString(),
          icon: Icons.list_alt_outlined,
          color: Theme.of(context).colorScheme.error,
        ),
      ],
    );
  }
}

class _SummaryCard extends StatelessWidget {
  final String title;
  final String value;
  final IconData icon;
  final Color color;

  const _SummaryCard({
    required this.title,
    required this.value,
    required this.icon,
    required this.color,
  });

  @override
  Widget build(BuildContext context) {
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(
              icon,
              color: color,
              size: 32,
            ),
            const SizedBox(height: 8),
            Text(
              value,
              style: Theme.of(context).textTheme.headlineSmall?.copyWith(
                    color: color,
                  ),
            ),
            const SizedBox(height: 4),
            Text(
              title,
              style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                    color: Theme.of(context).colorScheme.onSurfaceVariant,
                  ),
              textAlign: TextAlign.center,
            ),
          ],
        ),
      ),
    );
  }
} 