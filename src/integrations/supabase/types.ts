export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.4"
  }
  public: {
    Tables: {
      announcements: {
        Row: {
          body: string
          created_at: string
          created_by: string
          id: string
          is_active: boolean
          masjid_id: string
          title: string
        }
        Insert: {
          body: string
          created_at?: string
          created_by: string
          id?: string
          is_active?: boolean
          masjid_id: string
          title: string
        }
        Update: {
          body?: string
          created_at?: string
          created_by?: string
          id?: string
          is_active?: boolean
          masjid_id?: string
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "announcements_masjid_id_fkey"
            columns: ["masjid_id"]
            isOneToOne: false
            referencedRelation: "masjids"
            referencedColumns: ["id"]
          },
        ]
      }
      expenses: {
        Row: {
          amount: number
          created_at: string
          created_by: string
          description: string | null
          expense_date: string
          id: string
          masjid_id: string
          receipt_image_url: string | null
          title: string
        }
        Insert: {
          amount: number
          created_at?: string
          created_by: string
          description?: string | null
          expense_date?: string
          id?: string
          masjid_id: string
          receipt_image_url?: string | null
          title: string
        }
        Update: {
          amount?: number
          created_at?: string
          created_by?: string
          description?: string | null
          expense_date?: string
          id?: string
          masjid_id?: string
          receipt_image_url?: string | null
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "expenses_masjid_id_fkey"
            columns: ["masjid_id"]
            isOneToOne: false
            referencedRelation: "masjids"
            referencedColumns: ["id"]
          },
        ]
      }
      fund_events: {
        Row: {
          created_at: string
          created_by: string
          description: string | null
          due_date: string | null
          fixed_amount: number | null
          id: string
          is_active: boolean
          masjid_id: string
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          created_by: string
          description?: string | null
          due_date?: string | null
          fixed_amount?: number | null
          id?: string
          is_active?: boolean
          masjid_id: string
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          created_by?: string
          description?: string | null
          due_date?: string | null
          fixed_amount?: number | null
          id?: string
          is_active?: boolean
          masjid_id?: string
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "fund_events_masjid_id_fkey"
            columns: ["masjid_id"]
            isOneToOne: false
            referencedRelation: "masjids"
            referencedColumns: ["id"]
          },
        ]
      }
      fund_payments: {
        Row: {
          amount: number | null
          created_at: string
          fund_event_id: string
          id: string
          marked_by: string | null
          notes: string | null
          paid_at: string | null
          payment_screenshot_url: string | null
          status: Database["public"]["Enums"]["fund_payment_status"]
          updated_at: string
          user_id: string
        }
        Insert: {
          amount?: number | null
          created_at?: string
          fund_event_id: string
          id?: string
          marked_by?: string | null
          notes?: string | null
          paid_at?: string | null
          payment_screenshot_url?: string | null
          status?: Database["public"]["Enums"]["fund_payment_status"]
          updated_at?: string
          user_id: string
        }
        Update: {
          amount?: number | null
          created_at?: string
          fund_event_id?: string
          id?: string
          marked_by?: string | null
          notes?: string | null
          paid_at?: string | null
          payment_screenshot_url?: string | null
          status?: Database["public"]["Enums"]["fund_payment_status"]
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "fund_payments_fund_event_id_fkey"
            columns: ["fund_event_id"]
            isOneToOne: false
            referencedRelation: "fund_events"
            referencedColumns: ["id"]
          },
        ]
      }
      imam_details: {
        Row: {
          aadhaar_number: string | null
          children_names: string | null
          created_at: string
          expected_salary: number | null
          experience_details: string | null
          experience_years: number | null
          father_name: string | null
          home_address: string | null
          id: string
          islamic_degree: string | null
          marital_status: Database["public"]["Enums"]["marital_status"] | null
          masjid_id: string | null
          mother_name: string | null
          qr_code_image_url: string | null
          salary_period: Database["public"]["Enums"]["salary_period"] | null
          updated_at: string
          upi_id: string | null
          user_id: string
          wife_name: string | null
        }
        Insert: {
          aadhaar_number?: string | null
          children_names?: string | null
          created_at?: string
          expected_salary?: number | null
          experience_details?: string | null
          experience_years?: number | null
          father_name?: string | null
          home_address?: string | null
          id?: string
          islamic_degree?: string | null
          marital_status?: Database["public"]["Enums"]["marital_status"] | null
          masjid_id?: string | null
          mother_name?: string | null
          qr_code_image_url?: string | null
          salary_period?: Database["public"]["Enums"]["salary_period"] | null
          updated_at?: string
          upi_id?: string | null
          user_id: string
          wife_name?: string | null
        }
        Update: {
          aadhaar_number?: string | null
          children_names?: string | null
          created_at?: string
          expected_salary?: number | null
          experience_details?: string | null
          experience_years?: number | null
          father_name?: string | null
          home_address?: string | null
          id?: string
          islamic_degree?: string | null
          marital_status?: Database["public"]["Enums"]["marital_status"] | null
          masjid_id?: string | null
          mother_name?: string | null
          qr_code_image_url?: string | null
          salary_period?: Database["public"]["Enums"]["salary_period"] | null
          updated_at?: string
          upi_id?: string | null
          user_id?: string
          wife_name?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "imam_details_masjid_id_fkey"
            columns: ["masjid_id"]
            isOneToOne: false
            referencedRelation: "masjids"
            referencedColumns: ["id"]
          },
        ]
      }
      masjids: {
        Row: {
          address: string | null
          city: string
          created_at: string
          id: string
          name: string
          profile_image_url: string | null
          updated_at: string
        }
        Insert: {
          address?: string | null
          city: string
          created_at?: string
          id?: string
          name: string
          profile_image_url?: string | null
          updated_at?: string
        }
        Update: {
          address?: string | null
          city?: string
          created_at?: string
          id?: string
          name?: string
          profile_image_url?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      namaz_timings: {
        Row: {
          asr: string
          fajr: string
          id: string
          isha: string
          maghrib: string
          masjid_id: string
          updated_at: string
          updated_by: string | null
          zuhr: string
        }
        Insert: {
          asr: string
          fajr: string
          id?: string
          isha: string
          maghrib: string
          masjid_id: string
          updated_at?: string
          updated_by?: string | null
          zuhr: string
        }
        Update: {
          asr?: string
          fajr?: string
          id?: string
          isha?: string
          maghrib?: string
          masjid_id?: string
          updated_at?: string
          updated_by?: string | null
          zuhr?: string
        }
        Relationships: [
          {
            foreignKeyName: "namaz_timings_masjid_id_fkey"
            columns: ["masjid_id"]
            isOneToOne: true
            referencedRelation: "masjids"
            referencedColumns: ["id"]
          },
        ]
      }
      posts: {
        Row: {
          author_id: string
          content: string | null
          created_at: string
          id: string
          masjid_id: string
          media_type: string | null
          media_url: string | null
          title: string
        }
        Insert: {
          author_id: string
          content?: string | null
          created_at?: string
          id?: string
          masjid_id: string
          media_type?: string | null
          media_url?: string | null
          title: string
        }
        Update: {
          author_id?: string
          content?: string | null
          created_at?: string
          id?: string
          masjid_id?: string
          media_type?: string | null
          media_url?: string | null
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "posts_masjid_id_fkey"
            columns: ["masjid_id"]
            isOneToOne: false
            referencedRelation: "masjids"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          alternate_phone: string | null
          city: string | null
          created_at: string
          full_name: string
          id: string
          masjid_id: string | null
          phone: string | null
          profile_image_url: string | null
          updated_at: string
          user_id: string
          whatsapp_number: string | null
        }
        Insert: {
          alternate_phone?: string | null
          city?: string | null
          created_at?: string
          full_name?: string
          id?: string
          masjid_id?: string | null
          phone?: string | null
          profile_image_url?: string | null
          updated_at?: string
          user_id: string
          whatsapp_number?: string | null
        }
        Update: {
          alternate_phone?: string | null
          city?: string | null
          created_at?: string
          full_name?: string
          id?: string
          masjid_id?: string | null
          phone?: string | null
          profile_image_url?: string | null
          updated_at?: string
          user_id?: string
          whatsapp_number?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "profiles_masjid_id_fkey"
            columns: ["masjid_id"]
            isOneToOne: false
            referencedRelation: "masjids"
            referencedColumns: ["id"]
          },
        ]
      }
      qr_codes: {
        Row: {
          created_at: string
          id: string
          image_url: string
          label: string | null
          masjid_id: string
          uploaded_by: string
        }
        Insert: {
          created_at?: string
          id?: string
          image_url: string
          label?: string | null
          masjid_id: string
          uploaded_by: string
        }
        Update: {
          created_at?: string
          id?: string
          image_url?: string
          label?: string | null
          masjid_id?: string
          uploaded_by?: string
        }
        Relationships: [
          {
            foreignKeyName: "qr_codes_masjid_id_fkey"
            columns: ["masjid_id"]
            isOneToOne: false
            referencedRelation: "masjids"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          is_active: boolean
          is_approved: boolean
          masjid_id: string | null
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_active?: boolean
          is_approved?: boolean
          masjid_id?: string | null
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          is_active?: boolean
          is_approved?: boolean
          masjid_id?: string | null
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_roles_masjid_id_fkey"
            columns: ["masjid_id"]
            isOneToOne: false
            referencedRelation: "masjids"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _masjid_id?: string
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "imam" | "motaballi" | "user"
      fund_payment_status: "paid" | "unpaid" | "pending"
      marital_status: "single" | "married" | "divorced" | "widowed"
      salary_period: "monthly" | "quarterly" | "half_yearly" | "yearly"
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
    Enums: {
      app_role: ["imam", "motaballi", "user"],
      fund_payment_status: ["paid", "unpaid", "pending"],
      marital_status: ["single", "married", "divorced", "widowed"],
      salary_period: ["monthly", "quarterly", "half_yearly", "yearly"],
    },
  },
} as const
