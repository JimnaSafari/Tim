class SupabaseConfig {
  static const url = String.fromEnvironment(
    'SUPABASE_URL',
    defaultValue: 'YOUR_SUPABASE_URL',
  );
  
  static const anonKey = String.fromEnvironment(
    'SUPABASE_ANON_KEY',
    defaultValue: 'YOUR_SUPABASE_ANON_KEY',
  );
} 