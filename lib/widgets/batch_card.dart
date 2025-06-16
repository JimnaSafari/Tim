import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

class BatchCard extends StatelessWidget {
  final Map<String, dynamic> batch;
  final VoidCallback? onJoin;
  final VoidCallback? onLeave;

  const BatchCard({
    super.key,
    required this.batch,
    this.onJoin,
    this.onLeave,
  });

  @override
  Widget build(BuildContext context) {
    final isMember = batch['is_member'] as bool? ?? false;
    final isFull = batch['is_full'] as bool? ?? false;
    final membersCount = batch['members_count'] as int? ?? 0;
    final maxMembers = batch['max_members'] as int? ?? 0;
    final amount = batch['amount'] as num? ?? 0;
    final startDate = batch['start_date'] != null
        ? DateTime.parse(batch['start_date'] as String)
        : null;

    return Card(
      child: InkWell(
        onTap: () => context.push('/batches/${batch['id']}'),
        child: Padding(
          padding: const EdgeInsets.all(16.0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Text(
                    'Batch #${batch['id']}',
                    style: Theme.of(context).textTheme.titleLarge,
                  ),
                  Container(
                    padding: const EdgeInsets.symmetric(
                      horizontal: 8,
                      vertical: 4,
                    ),
                    decoration: BoxDecoration(
                      color: isFull
                          ? Theme.of(context).colorScheme.errorContainer
                          : Theme.of(context).colorScheme.primaryContainer,
                      borderRadius: BorderRadius.circular(12),
                    ),
                    child: Text(
                      isFull ? 'Full' : 'Open',
                      style: TextStyle(
                        color: isFull
                            ? Theme.of(context).colorScheme.onErrorContainer
                            : Theme.of(context).colorScheme.onPrimaryContainer,
                      ),
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 16),
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        'Amount',
                        style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                              color: Theme.of(context).colorScheme.onSurfaceVariant,
                            ),
                      ),
                      const SizedBox(height: 4),
                      Text(
                        '\$${amount.toStringAsFixed(2)}',
                        style: Theme.of(context).textTheme.titleMedium,
                      ),
                    ],
                  ),
                  Column(
                    crossAxisAlignment: CrossAxisAlignment.end,
                    children: [
                      Text(
                        'Members',
                        style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                              color: Theme.of(context).colorScheme.onSurfaceVariant,
                            ),
                      ),
                      const SizedBox(height: 4),
                      Text(
                        '$membersCount/$maxMembers',
                        style: Theme.of(context).textTheme.titleMedium,
                      ),
                    ],
                  ),
                ],
              ),
              if (startDate != null) ...[
                const SizedBox(height: 16),
                Row(
                  children: [
                    Icon(
                      Icons.calendar_today,
                      size: 16,
                      color: Theme.of(context).colorScheme.onSurfaceVariant,
                    ),
                    const SizedBox(width: 8),
                    Text(
                      'Starts ${startDate.toString().split(' ')[0]}',
                      style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                            color: Theme.of(context).colorScheme.onSurfaceVariant,
                          ),
                    ),
                  ],
                ),
              ],
              const SizedBox(height: 16),
              if (!isFull)
                FilledButton(
                  onPressed: isMember ? onLeave : onJoin,
                  child: Text(isMember ? 'Leave Batch' : 'Join Batch'),
                ),
            ],
          ),
        ),
      ),
    );
  }
} 