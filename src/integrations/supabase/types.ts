export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      conversations: {
        Row: {
          created_at: string
          id: string
          title: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          title?: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          title?: string
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      custom_instructions: {
        Row: {
          content: string
          created_at: string
          id: string
          is_active: boolean | null
          title: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          is_active?: boolean | null
          title: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          is_active?: boolean | null
          title?: string
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      meals: {
        Row: {
          calories: number | null
          created_at: string
          food_items: string
          id: string
          meal_type: string
          notes: string | null
          recorded_at: string
          user_id: string
        }
        Insert: {
          calories?: number | null
          created_at?: string
          food_items: string
          id?: string
          meal_type: string
          notes?: string | null
          recorded_at?: string
          user_id: string
        }
        Update: {
          calories?: number | null
          created_at?: string
          food_items?: string
          id?: string
          meal_type?: string
          notes?: string | null
          recorded_at?: string
          user_id?: string
        }
        Relationships: []
      }
      medications: {
        Row: {
          created_at: string
          dosage: string
          frequency: string
          id: string
          medication_name: string
          notes: string | null
          taken_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          dosage: string
          frequency: string
          id?: string
          medication_name: string
          notes?: string | null
          taken_at: string
          user_id: string
        }
        Update: {
          created_at?: string
          dosage?: string
          frequency?: string
          id?: string
          medication_name?: string
          notes?: string | null
          taken_at?: string
          user_id?: string
        }
        Relationships: []
      }
      messages: {
        Row: {
          content: string
          conversation_id: string | null
          created_at: string
          id: string
          is_user: boolean
          model: string | null
        }
        Insert: {
          content: string
          conversation_id?: string | null
          created_at?: string
          id?: string
          is_user: boolean
          model?: string | null
        }
        Update: {
          content?: string
          conversation_id?: string | null
          created_at?: string
          id?: string
          is_user?: boolean
          model?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "messages_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "conversations"
            referencedColumns: ["id"]
          },
        ]
      }
      moods: {
        Row: {
          created_at: string
          id: string
          mood_name: string
          mood_value: number | null
          notes: string | null
          recorded_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          mood_name: string
          mood_value?: number | null
          notes?: string | null
          recorded_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          mood_name?: string
          mood_value?: number | null
          notes?: string | null
          recorded_at?: string
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          email: string
          full_name: string | null
          id: string
          subscription_tier: string | null
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          email: string
          full_name?: string | null
          id: string
          subscription_tier?: string | null
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          email?: string
          full_name?: string | null
          id?: string
          subscription_tier?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      symptoms: {
        Row: {
          created_at: string
          id: string
          notes: string | null
          recorded_at: string
          severity: number | null
          symptom_name: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          notes?: string | null
          recorded_at?: string
          severity?: number | null
          symptom_name: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          notes?: string | null
          recorded_at?: string
          severity?: number | null
          symptom_name?: string
          user_id?: string
        }
        Relationships: []
      }
      user_credits: {
        Row: {
          created_at: string
          credits_remaining: number
          id: string
          last_reset_date: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          credits_remaining?: number
          id?: string
          last_reset_date?: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          credits_remaining?: number
          id?: string
          last_reset_date?: string
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      reset_daily_credits: {
        Args: Record<PropertyKey, never>
        Returns: undefined
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

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
