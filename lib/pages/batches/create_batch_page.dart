import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:flutter_app/services/supabase_service.dart';

final createBatchProvider = StateNotifierProvider<CreateBatchController, AsyncValue<void>>((ref) {
  final service = ref.watch(supabaseServiceProvider);
  return CreateBatchController(service);
});

class CreateBatchController extends StateNotifier<AsyncValue<void>> {
  final SupabaseService _service;

  CreateBatchController(this._service) : super(const AsyncValue.data(null));

  Future<void> createBatch({
    required double amount,
    required int maxMembers,
    required DateTime startDate,
    String? description,
  }) async {
    state = const AsyncValue.loading();
    try {
      await _service.createBatch({
        'amount': amount,
        'max_members': maxMembers,
        'start_date': startDate.toIso8601String(),
        'description': description,
      });
      state = const AsyncValue.data(null);
    } catch (e, st) {
      state = AsyncValue.error(e, st);
    }
  }
}

class CreateBatchPage extends ConsumerStatefulWidget {
  const CreateBatchPage({super.key});

  @override
  ConsumerState<CreateBatchPage> createState() => _CreateBatchPageState();
}

class _CreateBatchPageState extends ConsumerState<CreateBatchPage> {
  final _formKey = GlobalKey<FormState>();
  final _amountController = TextEditingController();
  final _maxMembersController = TextEditingController();
  final _descriptionController = TextEditingController();
  DateTime _startDate = DateTime.now().add(const Duration(days: 1));

  @override
  void dispose() {
    _amountController.dispose();
    _maxMembersController.dispose();
    _descriptionController.dispose();
    super.dispose();
  }

  Future<void> _selectDate() async {
    final picked = await showDatePicker(
      context: context,
      initialDate: _startDate,
      firstDate: DateTime.now(),
      lastDate: DateTime.now().add(const Duration(days: 365)),
    );
    if (picked != null) {
      setState(() {
        _startDate = picked;
      });
    }
  }

  Future<void> _handleSubmit() async {
    if (!_formKey.currentState!.validate()) return;

    final controller = ref.read(createBatchProvider.notifier);
    await controller.createBatch(
      amount: double.parse(_amountController.text),
      maxMembers: int.parse(_maxMembersController.text),
      startDate: _startDate,
      description: _descriptionController.text,
    );

    if (mounted) {
      final state = ref.read(createBatchProvider);
      state.whenOrNull(
        error: (error, _) {
          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(
              content: Text(error.toString()),
              backgroundColor: Theme.of(context).colorScheme.error,
            ),
          );
        },
        data: (_) {
          context.pop();
        },
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    final state = ref.watch(createBatchProvider);

    return Scaffold(
      appBar: AppBar(
        title: const Text('Create Batch'),
      ),
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(16.0),
          child: Form(
            key: _formKey,
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.stretch,
              children: [
                Text(
                  'Create a New Batch',
                  style: Theme.of(context).textTheme.headlineSmall,
                ),
                const SizedBox(height: 8),
                Text(
                  'Set up a new batch for group savings',
                  style: Theme.of(context).textTheme.bodyLarge?.copyWith(
                        color: Theme.of(context).colorScheme.onSurfaceVariant,
                      ),
                ),
                const SizedBox(height: 24),
                TextFormField(
                  controller: _amountController,
                  keyboardType: TextInputType.number,
                  decoration: const InputDecoration(
                    labelText: 'Amount per Member',
                    prefixIcon: Icon(Icons.attach_money),
                  ),
                  validator: (value) {
                    if (value == null || value.isEmpty) {
                      return 'Please enter an amount';
                    }
                    if (double.tryParse(value) == null) {
                      return 'Please enter a valid amount';
                    }
                    return null;
                  },
                ),
                const SizedBox(height: 16),
                TextFormField(
                  controller: _maxMembersController,
                  keyboardType: TextInputType.number,
                  decoration: const InputDecoration(
                    labelText: 'Maximum Members',
                    prefixIcon: Icon(Icons.group),
                  ),
                  validator: (value) {
                    if (value == null || value.isEmpty) {
                      return 'Please enter the maximum number of members';
                    }
                    if (int.tryParse(value) == null) {
                      return 'Please enter a valid number';
                    }
                    return null;
                  },
                ),
                const SizedBox(height: 16),
                ListTile(
                  leading: const Icon(Icons.calendar_today),
                  title: const Text('Start Date'),
                  subtitle: Text(
                    _startDate.toString().split(' ')[0],
                  ),
                  trailing: const Icon(Icons.chevron_right),
                  onTap: _selectDate,
                ),
                const SizedBox(height: 16),
                TextFormField(
                  controller: _descriptionController,
                  maxLines: 3,
                  decoration: const InputDecoration(
                    labelText: 'Description (Optional)',
                    alignLabelWithHint: true,
                  ),
                ),
                const SizedBox(height: 24),
                FilledButton(
                  onPressed: state.isLoading ? null : _handleSubmit,
                  child: state.isLoading
                      ? const SizedBox(
                          height: 20,
                          width: 20,
                          child: CircularProgressIndicator(
                            strokeWidth: 2,
                          ),
                        )
                      : const Text('Create Batch'),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
} 