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
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      change_orders: {
        Row: {
          amount: number
          date: string
          description: string
          id: string
          job_id: string
        }
        Insert: {
          amount: number
          date: string
          description: string
          id: string
          job_id: string
        }
        Update: {
          amount?: number
          date?: string
          description?: string
          id?: string
          job_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "change_orders_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "jobs"
            referencedColumns: ["id"]
          },
        ]
      }
      equipment_lines: {
        Row: {
          category: Database["public"]["Enums"]["equipment_category"]
          day_rate: number
          days: number
          id: string
          job_id: string
          machine: string
        }
        Insert: {
          category: Database["public"]["Enums"]["equipment_category"]
          day_rate: number
          days: number
          id: string
          job_id: string
          machine: string
        }
        Update: {
          category?: Database["public"]["Enums"]["equipment_category"]
          day_rate?: number
          days?: number
          id?: string
          job_id?: string
          machine?: string
        }
        Relationships: [
          {
            foreignKeyName: "equipment_lines_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "jobs"
            referencedColumns: ["id"]
          },
        ]
      }
      jobs: {
        Row: {
          client: string
          closed_date: string | null
          contract_amount: number
          county: string
          created_at: string
          id: string
          name: string
          start_date: string
          status: Database["public"]["Enums"]["job_status"]
        }
        Insert: {
          client: string
          closed_date?: string | null
          contract_amount?: number
          county: string
          created_at?: string
          id: string
          name: string
          start_date: string
          status?: Database["public"]["Enums"]["job_status"]
        }
        Update: {
          client?: string
          closed_date?: string | null
          contract_amount?: number
          county?: string
          created_at?: string
          id?: string
          name?: string
          start_date?: string
          status?: Database["public"]["Enums"]["job_status"]
        }
        Relationships: []
      }
      labor_lines: {
        Row: {
          hours: number
          id: string
          job_id: string
          rate: number
          role: string
          worker: string
        }
        Insert: {
          hours: number
          id: string
          job_id: string
          rate: number
          role: string
          worker: string
        }
        Update: {
          hours?: number
          id?: string
          job_id?: string
          rate?: number
          role?: string
          worker?: string
        }
        Relationships: [
          {
            foreignKeyName: "labor_lines_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "jobs"
            referencedColumns: ["id"]
          },
        ]
      }
      material_lines: {
        Row: {
          id: string
          item: string
          job_id: string
          qty: number
          unit: string
          unit_cost: number
        }
        Insert: {
          id: string
          item: string
          job_id: string
          qty: number
          unit: string
          unit_cost: number
        }
        Update: {
          id?: string
          item?: string
          job_id?: string
          qty?: number
          unit?: string
          unit_cost?: number
        }
        Relationships: [
          {
            foreignKeyName: "material_lines_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "jobs"
            referencedColumns: ["id"]
          },
        ]
      }
      overhead: {
        Row: {
          amount: number
          category: string
          id: string
          period: string
        }
        Insert: {
          amount: number
          category: string
          id: string
          period: string
        }
        Update: {
          amount?: number
          category?: string
          id?: string
          period?: string
        }
        Relationships: []
      }
      owner_draws: {
        Row: {
          amount: number
          id: string
          owner: string
          period: string
        }
        Insert: {
          amount: number
          id: string
          owner: string
          period: string
        }
        Update: {
          amount?: number
          id?: string
          owner?: string
          period?: string
        }
        Relationships: []
      }
      quote_requests: {
        Row: {
          county: string
          created_at: string
          email: string
          id: string
          message: string | null
          name: string
          phone: string
          project_type: string
        }
        Insert: {
          county: string
          created_at?: string
          email: string
          id?: string
          message?: string | null
          name: string
          phone: string
          project_type: string
        }
        Update: {
          county?: string
          created_at?: string
          email?: string
          id?: string
          message?: string | null
          name?: string
          phone?: string
          project_type?: string
        }
        Relationships: []
      }
      sub_lines: {
        Row: {
          amount: number
          id: string
          job_id: string
          trade: Database["public"]["Enums"]["sub_trade"]
          vendor: string
        }
        Insert: {
          amount: number
          id: string
          job_id: string
          trade: Database["public"]["Enums"]["sub_trade"]
          vendor: string
        }
        Update: {
          amount?: number
          id?: string
          job_id?: string
          trade?: Database["public"]["Enums"]["sub_trade"]
          vendor?: string
        }
        Relationships: [
          {
            foreignKeyName: "sub_lines_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "jobs"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      equipment_category:
        | "Excavator"
        | "Skid Steer"
        | "Dump Truck"
        | "Concrete Pump"
        | "Lift"
        | "Other"
      job_status: "active" | "closed"
      sub_trade:
        | "Electrical"
        | "Plumbing"
        | "Concrete"
        | "HVAC"
        | "Roofing"
        | "Framing"
        | "Other"
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
      equipment_category: [
        "Excavator",
        "Skid Steer",
        "Dump Truck",
        "Concrete Pump",
        "Lift",
        "Other",
      ],
      job_status: ["active", "closed"],
      sub_trade: [
        "Electrical",
        "Plumbing",
        "Concrete",
        "HVAC",
        "Roofing",
        "Framing",
        "Other",
      ],
    },
  },
} as const
