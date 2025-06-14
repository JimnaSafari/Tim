export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      batch_agreements: {
        Row: {
          agreement_content: string
          batch_id: string
          created_at: string | null
          id: string
          member_signatures: Json | null
          organizer_signature: boolean | null
          updated_at: string | null
        }
        Insert: {
          agreement_content: string
          batch_id: string
          created_at?: string | null
          id?: string
          member_signatures?: Json | null
          organizer_signature?: boolean | null
          updated_at?: string | null
        }
        Update: {
          agreement_content?: string
          batch_id?: string
          created_at?: string | null
          id?: string
          member_signatures?: Json | null
          organizer_signature?: boolean | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "batch_agreements_batch_id_fkey"
            columns: ["batch_id"]
            isOneToOne: true
            referencedRelation: "batches"
            referencedColumns: ["id"]
          },
        ]
      }
      batch_members: {
        Row: {
          batch_id: string
          has_received_payout: boolean | null
          id: string
          joined_at: string | null
          payout_date: string | null
          position: number | null
          user_id: string
        }
        Insert: {
          batch_id: string
          has_received_payout?: boolean | null
          id?: string
          joined_at?: string | null
          payout_date?: string | null
          position?: number | null
          user_id: string
        }
        Update: {
          batch_id?: string
          has_received_payout?: boolean | null
          id?: string
          joined_at?: string | null
          payout_date?: string | null
          position?: number | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "batch_members_batch_id_fkey"
            columns: ["batch_id"]
            isOneToOne: false
            referencedRelation: "batches"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "batch_members_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      batches: {
        Row: {
          agreement_generated: boolean | null
          created_at: string | null
          created_by: string
          current_members: number | null
          current_week: number | null
          description: string | null
          id: string
          invite_code: string
          max_members: number
          monthly_contribution: number
          name: string
          payout_schedule_generated: boolean | null
          payout_start_date: string | null
          service_fee_per_member: number | null
          status: string | null
          total_weeks: number | null
          updated_at: string | null
          weekly_contribution: number | null
        }
        Insert: {
          agreement_generated?: boolean | null
          created_at?: string | null
          created_by: string
          current_members?: number | null
          current_week?: number | null
          description?: string | null
          id?: string
          invite_code: string
          max_members?: number
          monthly_contribution: number
          name: string
          payout_schedule_generated?: boolean | null
          payout_start_date?: string | null
          service_fee_per_member?: number | null
          status?: string | null
          total_weeks?: number | null
          updated_at?: string | null
          weekly_contribution?: number | null
        }
        Update: {
          agreement_generated?: boolean | null
          created_at?: string | null
          created_by?: string
          current_members?: number | null
          current_week?: number | null
          description?: string | null
          id?: string
          invite_code?: string
          max_members?: number
          monthly_contribution?: number
          name?: string
          payout_schedule_generated?: boolean | null
          payout_start_date?: string | null
          service_fee_per_member?: number | null
          status?: string | null
          total_weeks?: number | null
          updated_at?: string | null
          weekly_contribution?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "batches_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      contribution_reminders: {
        Row: {
          batch_id: string
          created_at: string | null
          id: string
          is_active: boolean | null
          message_template: string
          template_type: string
          updated_at: string | null
        }
        Insert: {
          batch_id: string
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          message_template: string
          template_type: string
          updated_at?: string | null
        }
        Update: {
          batch_id?: string
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          message_template?: string
          template_type?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "contribution_reminders_batch_id_fkey"
            columns: ["batch_id"]
            isOneToOne: false
            referencedRelation: "batches"
            referencedColumns: ["id"]
          },
        ]
      }
      payout_schedules: {
        Row: {
          batch_id: string
          created_at: string | null
          id: string
          is_paid: boolean | null
          member_id: string
          payment_date: string | null
          payout_amount: number
          payout_date: string
          week_number: number
        }
        Insert: {
          batch_id: string
          created_at?: string | null
          id?: string
          is_paid?: boolean | null
          member_id: string
          payment_date?: string | null
          payout_amount: number
          payout_date: string
          week_number: number
        }
        Update: {
          batch_id?: string
          created_at?: string | null
          id?: string
          is_paid?: boolean | null
          member_id?: string
          payment_date?: string | null
          payout_amount?: number
          payout_date?: string
          week_number?: number
        }
        Relationships: [
          {
            foreignKeyName: "payout_schedules_batch_id_fkey"
            columns: ["batch_id"]
            isOneToOne: false
            referencedRelation: "batches"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payout_schedules_member_id_fkey"
            columns: ["member_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          full_name: string | null
          id: string
          phone_number: string | null
          phone_verified: boolean | null
          preferred_reminder_method: string | null
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          full_name?: string | null
          id: string
          phone_number?: string | null
          phone_verified?: boolean | null
          preferred_reminder_method?: string | null
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          full_name?: string | null
          id?: string
          phone_number?: string | null
          phone_verified?: boolean | null
          preferred_reminder_method?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      referrals: {
        Row: {
          completed_at: string | null
          created_at: string | null
          id: string
          referral_code: string
          referred_id: string
          referrer_id: string
          reward_amount: number | null
          status: string | null
        }
        Insert: {
          completed_at?: string | null
          created_at?: string | null
          id?: string
          referral_code: string
          referred_id: string
          referrer_id: string
          reward_amount?: number | null
          status?: string | null
        }
        Update: {
          completed_at?: string | null
          created_at?: string | null
          id?: string
          referral_code?: string
          referred_id?: string
          referrer_id?: string
          reward_amount?: number | null
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "referrals_referred_id_fkey"
            columns: ["referred_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "referrals_referrer_id_fkey"
            columns: ["referrer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      reminder_logs: {
        Row: {
          batch_id: string
          created_at: string | null
          delivered_at: string | null
          delivery_method: string
          error_message: string | null
          id: string
          member_id: string
          message_content: string
          phone_number: string
          reminder_type: string
          sent_at: string | null
          status: string | null
          updated_at: string | null
        }
        Insert: {
          batch_id: string
          created_at?: string | null
          delivered_at?: string | null
          delivery_method: string
          error_message?: string | null
          id?: string
          member_id: string
          message_content: string
          phone_number: string
          reminder_type: string
          sent_at?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          batch_id?: string
          created_at?: string | null
          delivered_at?: string | null
          delivery_method?: string
          error_message?: string | null
          id?: string
          member_id?: string
          message_content?: string
          phone_number?: string
          reminder_type?: string
          sent_at?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "reminder_logs_batch_id_fkey"
            columns: ["batch_id"]
            isOneToOne: false
            referencedRelation: "batches"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reminder_logs_member_id_fkey"
            columns: ["member_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      reminder_schedules: {
        Row: {
          batch_id: string
          created_at: string | null
          day_of_week: number | null
          id: string
          is_active: boolean | null
          reminder_type: string
          time_of_day: string
          updated_at: string | null
        }
        Insert: {
          batch_id: string
          created_at?: string | null
          day_of_week?: number | null
          id?: string
          is_active?: boolean | null
          reminder_type: string
          time_of_day?: string
          updated_at?: string | null
        }
        Update: {
          batch_id?: string
          created_at?: string | null
          day_of_week?: number | null
          id?: string
          is_active?: boolean | null
          reminder_type?: string
          time_of_day?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "reminder_schedules_batch_id_fkey"
            columns: ["batch_id"]
            isOneToOne: false
            referencedRelation: "batches"
            referencedColumns: ["id"]
          },
        ]
      }
      savings: {
        Row: {
          amount: number
          created_at: string | null
          description: string | null
          id: string
          status: string | null
          transaction_type: string
          user_id: string
        }
        Insert: {
          amount: number
          created_at?: string | null
          description?: string | null
          id?: string
          status?: string | null
          transaction_type: string
          user_id: string
        }
        Update: {
          amount?: number
          created_at?: string | null
          description?: string | null
          id?: string
          status?: string | null
          transaction_type?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "savings_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_referral_codes: {
        Row: {
          created_at: string | null
          id: string
          referral_code: string
          user_id: string
          uses_count: number | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          referral_code: string
          user_id: string
          uses_count?: number | null
        }
        Update: {
          created_at?: string | null
          id?: string
          referral_code?: string
          user_id?: string
          uses_count?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "user_referral_codes_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      weekly_contributions: {
        Row: {
          amount_due: number
          amount_paid: number | null
          batch_id: string
          created_at: string | null
          id: string
          member_id: string
          payment_date: string | null
          reminder_sent: boolean | null
          status: string | null
          week_number: number
        }
        Insert: {
          amount_due: number
          amount_paid?: number | null
          batch_id: string
          created_at?: string | null
          id?: string
          member_id: string
          payment_date?: string | null
          reminder_sent?: boolean | null
          status?: string | null
          week_number: number
        }
        Update: {
          amount_due?: number
          amount_paid?: number | null
          batch_id?: string
          created_at?: string | null
          id?: string
          member_id?: string
          payment_date?: string | null
          reminder_sent?: boolean | null
          status?: string | null
          week_number?: number
        }
        Relationships: [
          {
            foreignKeyName: "weekly_contributions_batch_id_fkey"
            columns: ["batch_id"]
            isOneToOne: false
            referencedRelation: "batches"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "weekly_contributions_member_id_fkey"
            columns: ["member_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      generate_invite_code: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      generate_referral_code: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
