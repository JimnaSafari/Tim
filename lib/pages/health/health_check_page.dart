import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../providers/backend_provider.dart';

class HealthCheckPage extends ConsumerWidget {
  const HealthCheckPage({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final healthCheck = ref.watch(healthCheckProvider);

    return Scaffold(
      appBar: AppBar(
        title: const Text('Backend Health Check'),
      ),
      body: Center(
        child: healthCheck.when(
          data: (data) => Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              const Icon(
                Icons.check_circle,
                color: Colors.green,
                size: 64,
              ),
              const SizedBox(height: 16),
              Text(
                'Backend is healthy!',
                style: Theme.of(context).textTheme.headlineSmall,
              ),
              const SizedBox(height: 8),
              Text(
                'Status: ${data['status']}',
                style: Theme.of(context).textTheme.bodyLarge,
              ),
              if (data['version'] != null) ...[
                const SizedBox(height: 4),
                Text(
                  'Version: ${data['version']}',
                  style: Theme.of(context).textTheme.bodyMedium,
                ),
              ],
              if (data['timestamp'] != null) ...[
                const SizedBox(height: 4),
                Text(
                  'Last checked: ${DateTime.parse(data['timestamp']).toLocal()}',
                  style: Theme.of(context).textTheme.bodyMedium,
                ),
              ],
            ],
          ),
          loading: () => const CircularProgressIndicator(),
          error: (error, stack) => Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              const Icon(
                Icons.error_outline,
                color: Colors.red,
                size: 64,
              ),
              const SizedBox(height: 16),
              Text(
                'Backend is not responding',
                style: Theme.of(context).textTheme.headlineSmall,
              ),
              const SizedBox(height: 8),
              Text(
                error.toString(),
                style: Theme.of(context).textTheme.bodyLarge?.copyWith(
                      color: Colors.red,
                    ),
                textAlign: TextAlign.center,
              ),
              const SizedBox(height: 16),
              ElevatedButton(
                onPressed: () {
                  ref.refresh(healthCheckProvider);
                },
                child: const Text('Retry'),
              ),
            ],
          ),
        ),
      ),
    );
  }
} 