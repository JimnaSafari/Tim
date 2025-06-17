import 'package:flutter/material.dart';
import 'package:tim_app/features/savings/domain/models/savings_goal.dart';

class SavingsForm extends StatefulWidget {
  final SavingsGoal? initialGoal;
  final Function(SavingsGoal) onSubmit;

  const SavingsForm({
    super.key,
    this.initialGoal,
    required this.onSubmit,
  });

  @override
  State<SavingsForm> createState() => _SavingsFormState();
}

class _SavingsFormState extends State<SavingsForm> {
  final _formKey = GlobalKey<FormState>();
  late final TextEditingController _titleController;
  late final TextEditingController _descriptionController;
  late final TextEditingController _targetAmountController;
  late final TextEditingController _currentAmountController;
  late DateTime _targetDate;

  @override
  void initState() {
    super.initState();
    _titleController = TextEditingController(text: widget.initialGoal?.title);
    _descriptionController = TextEditingController(text: widget.initialGoal?.description);
    _targetAmountController = TextEditingController(
      text: widget.initialGoal?.targetAmount.toString() ?? '',
    );
    _currentAmountController = TextEditingController(
      text: widget.initialGoal?.currentAmount.toString() ?? '',
    );
    _targetDate = widget.initialGoal?.targetDate ?? DateTime.now().add(const Duration(days: 30));
  }

  @override
  void dispose() {
    _titleController.dispose();
    _descriptionController.dispose();
    _targetAmountController.dispose();
    _currentAmountController.dispose();
    super.dispose();
  }

  Future<void> _selectDate(BuildContext context) async {
    final DateTime? picked = await showDatePicker(
      context: context,
      initialDate: _targetDate,
      firstDate: DateTime.now(),
      lastDate: DateTime.now().add(const Duration(days: 3650)),
    );
    if (picked != null && picked != _targetDate) {
      setState(() {
        _targetDate = picked;
      });
    }
  }

  void _handleSubmit() {
    if (!_formKey.currentState!.validate()) return;

    final goal = SavingsGoal(
      id: widget.initialGoal?.id ?? DateTime.now().millisecondsSinceEpoch.toString(),
      title: _titleController.text,
      description: _descriptionController.text,
      targetAmount: double.parse(_targetAmountController.text),
      currentAmount: double.parse(_currentAmountController.text),
      targetDate: _targetDate,
      createdAt: widget.initialGoal?.createdAt ?? DateTime.now(),
      userId: widget.initialGoal?.userId ?? 'user1', // TODO: Get from auth
    );

    widget.onSubmit(goal);
  }

  @override
  Widget build(BuildContext context) {
    return Form(
      key: _formKey,
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          TextFormField(
            controller: _titleController,
            decoration: const InputDecoration(
              labelText: 'Goal Title',
              hintText: 'e.g., New Car, Vacation Fund',
            ),
            validator: (value) {
              if (value == null || value.isEmpty) {
                return 'Please enter a title';
              }
              return null;
            },
          ),
          const SizedBox(height: 16),
          TextFormField(
            controller: _descriptionController,
            decoration: const InputDecoration(
              labelText: 'Description',
              hintText: 'Describe your savings goal',
            ),
            maxLines: 3,
            validator: (value) {
              if (value == null || value.isEmpty) {
                return 'Please enter a description';
              }
              return null;
            },
          ),
          const SizedBox(height: 16),
          TextFormField(
            controller: _targetAmountController,
            decoration: const InputDecoration(
              labelText: 'Target Amount',
              prefixText: '\$',
            ),
            keyboardType: TextInputType.number,
            validator: (value) {
              if (value == null || value.isEmpty) {
                return 'Please enter a target amount';
              }
              if (double.tryParse(value) == null) {
                return 'Please enter a valid number';
              }
              return null;
            },
          ),
          const SizedBox(height: 16),
          TextFormField(
            controller: _currentAmountController,
            decoration: const InputDecoration(
              labelText: 'Current Amount',
              prefixText: '\$',
            ),
            keyboardType: TextInputType.number,
            validator: (value) {
              if (value == null || value.isEmpty) {
                return 'Please enter the current amount';
              }
              if (double.tryParse(value) == null) {
                return 'Please enter a valid number';
              }
              return null;
            },
          ),
          const SizedBox(height: 16),
          ListTile(
            title: const Text('Target Date'),
            subtitle: Text(
              '${_targetDate.day}/${_targetDate.month}/${_targetDate.year}',
            ),
            trailing: const Icon(Icons.calendar_today),
            onTap: () => _selectDate(context),
          ),
          const SizedBox(height: 24),
          ElevatedButton(
            onPressed: _handleSubmit,
            child: Text(widget.initialGoal == null ? 'Create Goal' : 'Update Goal'),
          ),
        ],
      ),
    );
  }
} 