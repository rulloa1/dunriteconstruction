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
      bid_logs: {
        Row: {
          bid_amount: number | null
          bid_date: string | null
          bid_number: string | null
          contractor: string | null
          created_at: string
          created_by: string | null
          description: string | null
          id: string
          notes: string | null
          project_id: string
          status: string | null
          updated_at: string
        }
        Insert: {
          bid_amount?: number | null
          bid_date?: string | null
          bid_number?: string | null
          contractor?: string | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          notes?: string | null
          project_id: string
          status?: string | null
          updated_at?: string
        }
        Update: {
          bid_amount?: number | null
          bid_date?: string | null
          bid_number?: string | null
          contractor?: string | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          notes?: string | null
          project_id?: string
          status?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "bid_logs_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      certifications: {
        Row: {
          certification_number: string | null
          certification_type: string
          created_at: string
          created_by: string | null
          employee_name: string
          expiration_date: string | null
          id: string
          issue_date: string | null
          issuing_body: string | null
          notes: string | null
          status: string
          updated_at: string
        }
        Insert: {
          certification_number?: string | null
          certification_type: string
          created_at?: string
          created_by?: string | null
          employee_name: string
          expiration_date?: string | null
          id?: string
          issue_date?: string | null
          issuing_body?: string | null
          notes?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          certification_number?: string | null
          certification_type?: string
          created_at?: string
          created_by?: string | null
          employee_name?: string
          expiration_date?: string | null
          id?: string
          issue_date?: string | null
          issuing_body?: string | null
          notes?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
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
      driver_qualifications: {
        Row: {
          created_at: string
          created_by: string | null
          driver_name: string
          drug_test_date: string | null
          id: string
          license_class: string | null
          license_expiration: string | null
          license_number: string | null
          license_state: string | null
          medical_card_expiration: string | null
          mvr_date: string | null
          notes: string | null
          status: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          driver_name: string
          drug_test_date?: string | null
          id?: string
          license_class?: string | null
          license_expiration?: string | null
          license_number?: string | null
          license_state?: string | null
          medical_card_expiration?: string | null
          mvr_date?: string | null
          notes?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          driver_name?: string
          drug_test_date?: string | null
          id?: string
          license_class?: string | null
          license_expiration?: string | null
          license_number?: string | null
          license_state?: string | null
          medical_card_expiration?: string | null
          mvr_date?: string | null
          notes?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: []
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
      handbook_acknowledgments: {
        Row: {
          acknowledged_date: string | null
          created_at: string
          created_by: string | null
          employee_name: string
          form_type: string
          id: string
          notes: string | null
          signed_on_file: boolean
          supervisor: string | null
          updated_at: string
        }
        Insert: {
          acknowledged_date?: string | null
          created_at?: string
          created_by?: string | null
          employee_name: string
          form_type: string
          id?: string
          notes?: string | null
          signed_on_file?: boolean
          supervisor?: string | null
          updated_at?: string
        }
        Update: {
          acknowledged_date?: string | null
          created_at?: string
          created_by?: string | null
          employee_name?: string
          form_type?: string
          id?: string
          notes?: string | null
          signed_on_file?: boolean
          supervisor?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      hazardous_chemicals: {
        Row: {
          chemical_name: string
          created_at: string
          created_by: string | null
          first_aid_summary: string | null
          hazard_class: string | null
          id: string
          last_reviewed: string | null
          location: string | null
          manufacturer: string | null
          notes: string | null
          ppe_required: string | null
          quantity_on_hand: string | null
          sds_on_file: boolean
          sds_url: string | null
          updated_at: string
        }
        Insert: {
          chemical_name: string
          created_at?: string
          created_by?: string | null
          first_aid_summary?: string | null
          hazard_class?: string | null
          id?: string
          last_reviewed?: string | null
          location?: string | null
          manufacturer?: string | null
          notes?: string | null
          ppe_required?: string | null
          quantity_on_hand?: string | null
          sds_on_file?: boolean
          sds_url?: string | null
          updated_at?: string
        }
        Update: {
          chemical_name?: string
          created_at?: string
          created_by?: string | null
          first_aid_summary?: string | null
          hazard_class?: string | null
          id?: string
          last_reviewed?: string | null
          location?: string | null
          manufacturer?: string | null
          notes?: string | null
          ppe_required?: string | null
          quantity_on_hand?: string | null
          sds_on_file?: boolean
          sds_url?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      incident_reports: {
        Row: {
          action_taken: string | null
          created_at: string
          damage_description: string | null
          description: string
          equipment_ownership: string
          id: string
          incident_date: string
          incident_time: string | null
          injuries: boolean
          injury_description: string | null
          location: string | null
          people_involved: string | null
          property_damage: boolean
          report_type: string
          reported_by: string | null
          status: string
          updated_at: string
          vehicle: string | null
          witnesses: string | null
        }
        Insert: {
          action_taken?: string | null
          created_at?: string
          damage_description?: string | null
          description: string
          equipment_ownership?: string
          id?: string
          incident_date?: string
          incident_time?: string | null
          injuries?: boolean
          injury_description?: string | null
          location?: string | null
          people_involved?: string | null
          property_damage?: boolean
          report_type?: string
          reported_by?: string | null
          status?: string
          updated_at?: string
          vehicle?: string | null
          witnesses?: string | null
        }
        Update: {
          action_taken?: string | null
          created_at?: string
          damage_description?: string | null
          description?: string
          equipment_ownership?: string
          id?: string
          incident_date?: string
          incident_time?: string | null
          injuries?: boolean
          injury_description?: string | null
          location?: string | null
          people_involved?: string | null
          property_damage?: boolean
          report_type?: string
          reported_by?: string | null
          status?: string
          updated_at?: string
          vehicle?: string | null
          witnesses?: string | null
        }
        Relationships: []
      }
      job_safety_analyses: {
        Row: {
          analysis_date: string
          controls: string | null
          created_at: string
          created_by: string | null
          crew: string | null
          hazards: string | null
          id: string
          job_task: string
          location: string | null
          notes: string | null
          ppe_required: string | null
          supervisor: string | null
          updated_at: string
        }
        Insert: {
          analysis_date?: string
          controls?: string | null
          created_at?: string
          created_by?: string | null
          crew?: string | null
          hazards?: string | null
          id?: string
          job_task: string
          location?: string | null
          notes?: string | null
          ppe_required?: string | null
          supervisor?: string | null
          updated_at?: string
        }
        Update: {
          analysis_date?: string
          controls?: string | null
          created_at?: string
          created_by?: string | null
          crew?: string | null
          hazards?: string | null
          id?: string
          job_task?: string
          location?: string | null
          notes?: string | null
          ppe_required?: string | null
          supervisor?: string | null
          updated_at?: string
        }
        Relationships: []
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
      maintenance_records: {
        Row: {
          asset: string
          cost: number | null
          created_at: string
          created_by: string | null
          id: string
          next_service_due: string | null
          next_service_odometer: number | null
          notes: string | null
          odometer_hours: number | null
          performed_by: string | null
          service_date: string
          service_type: string | null
          status: string
          updated_at: string
        }
        Insert: {
          asset: string
          cost?: number | null
          created_at?: string
          created_by?: string | null
          id?: string
          next_service_due?: string | null
          next_service_odometer?: number | null
          notes?: string | null
          odometer_hours?: number | null
          performed_by?: string | null
          service_date?: string
          service_type?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          asset?: string
          cost?: number | null
          created_at?: string
          created_by?: string | null
          id?: string
          next_service_due?: string | null
          next_service_odometer?: number | null
          notes?: string | null
          odometer_hours?: number | null
          performed_by?: string | null
          service_date?: string
          service_type?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: []
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
      osha300_log: {
        Row: {
          calendar_year: number | null
          case_number: string | null
          classification: string | null
          created_at: string
          created_by: string | null
          days_away_from_work: number
          days_restricted_or_transferred: number
          description: string | null
          employee_name: string
          id: string
          incident_date: string | null
          injury_type: string | null
          job_title: string | null
          notes: string | null
          updated_at: string
          where_event_occurred: string | null
        }
        Insert: {
          calendar_year?: number | null
          case_number?: string | null
          classification?: string | null
          created_at?: string
          created_by?: string | null
          days_away_from_work?: number
          days_restricted_or_transferred?: number
          description?: string | null
          employee_name: string
          id?: string
          incident_date?: string | null
          injury_type?: string | null
          job_title?: string | null
          notes?: string | null
          updated_at?: string
          where_event_occurred?: string | null
        }
        Update: {
          calendar_year?: number | null
          case_number?: string | null
          classification?: string | null
          created_at?: string
          created_by?: string | null
          days_away_from_work?: number
          days_restricted_or_transferred?: number
          description?: string | null
          employee_name?: string
          id?: string
          incident_date?: string | null
          injury_type?: string | null
          job_title?: string | null
          notes?: string | null
          updated_at?: string
          where_event_occurred?: string | null
        }
        Relationships: []
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
      po_logs: {
        Row: {
          amount: number | null
          created_at: string
          created_by: string | null
          delivery_date: string | null
          description: string | null
          id: string
          notes: string | null
          po_date: string | null
          po_number: string | null
          project_id: string
          status: string
          updated_at: string
          vendor: string | null
        }
        Insert: {
          amount?: number | null
          created_at?: string
          created_by?: string | null
          delivery_date?: string | null
          description?: string | null
          id?: string
          notes?: string | null
          po_date?: string | null
          po_number?: string | null
          project_id: string
          status?: string
          updated_at?: string
          vendor?: string | null
        }
        Update: {
          amount?: number | null
          created_at?: string
          created_by?: string | null
          delivery_date?: string | null
          description?: string | null
          id?: string
          notes?: string | null
          po_date?: string | null
          po_number?: string | null
          project_id?: string
          status?: string
          updated_at?: string
          vendor?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "po_logs_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      procurement_items: {
        Row: {
          committed: boolean
          created_at: string
          created_by: string | null
          expected_delivery: string | null
          id: string
          item: string
          notes: string | null
          po_number: string | null
          project_id: string
          purchased: boolean
          sort_order: number
          status: string
          updated_at: string
          vendor: string | null
        }
        Insert: {
          committed?: boolean
          created_at?: string
          created_by?: string | null
          expected_delivery?: string | null
          id?: string
          item: string
          notes?: string | null
          po_number?: string | null
          project_id: string
          purchased?: boolean
          sort_order?: number
          status?: string
          updated_at?: string
          vendor?: string | null
        }
        Update: {
          committed?: boolean
          created_at?: string
          created_by?: string | null
          expected_delivery?: string | null
          id?: string
          item?: string
          notes?: string | null
          po_number?: string | null
          project_id?: string
          purchased?: boolean
          sort_order?: number
          status?: string
          updated_at?: string
          vendor?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "procurement_items_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string
          email: string | null
          full_name: string | null
          id: string
          title: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          email?: string | null
          full_name?: string | null
          id: string
          title?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string | null
          full_name?: string | null
          id?: string
          title?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      project_documents: {
        Row: {
          content_type: string | null
          created_at: string
          extracted_text: string | null
          extraction_status: string
          file_path: string
          file_size: number | null
          id: string
          name: string
          project_id: string
          uploaded_by: string | null
        }
        Insert: {
          content_type?: string | null
          created_at?: string
          extracted_text?: string | null
          extraction_status?: string
          file_path: string
          file_size?: number | null
          id?: string
          name: string
          project_id: string
          uploaded_by?: string | null
        }
        Update: {
          content_type?: string | null
          created_at?: string
          extracted_text?: string | null
          extraction_status?: string
          file_path?: string
          file_size?: number | null
          id?: string
          name?: string
          project_id?: string
          uploaded_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "project_documents_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      project_milestones: {
        Row: {
          actual: string | null
          created_at: string
          created_by: string | null
          id: string
          name: string
          notes: string | null
          project_id: string
          scheduled: string | null
          sort_order: number
          status: string
          updated_at: string
        }
        Insert: {
          actual?: string | null
          created_at?: string
          created_by?: string | null
          id?: string
          name: string
          notes?: string | null
          project_id: string
          scheduled?: string | null
          sort_order?: number
          status?: string
          updated_at?: string
        }
        Update: {
          actual?: string | null
          created_at?: string
          created_by?: string | null
          id?: string
          name?: string
          notes?: string | null
          project_id?: string
          scheduled?: string | null
          sort_order?: number
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "project_milestones_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      projects: {
        Row: {
          assigned_to: string | null
          bid_due_date: string | null
          client: string | null
          contract_completion: string | null
          created_at: string
          created_by: string | null
          current_completion: string | null
          id: string
          location: string | null
          name: string
          notes: string | null
          start_date: string | null
          status: Database["public"]["Enums"]["project_status"]
          updated_at: string
          value: number
        }
        Insert: {
          assigned_to?: string | null
          bid_due_date?: string | null
          client?: string | null
          contract_completion?: string | null
          created_at?: string
          created_by?: string | null
          current_completion?: string | null
          id?: string
          location?: string | null
          name: string
          notes?: string | null
          start_date?: string | null
          status?: Database["public"]["Enums"]["project_status"]
          updated_at?: string
          value?: number
        }
        Update: {
          assigned_to?: string | null
          bid_due_date?: string | null
          client?: string | null
          contract_completion?: string | null
          created_at?: string
          created_by?: string | null
          current_completion?: string | null
          id?: string
          location?: string | null
          name?: string
          notes?: string | null
          start_date?: string | null
          status?: Database["public"]["Enums"]["project_status"]
          updated_at?: string
          value?: number
        }
        Relationships: []
      }
      purchasing_logs: {
        Row: {
          contract_amount: number | null
          contract_issued: string | null
          contractor: string | null
          cost_code: string | null
          created_at: string
          created_by: string | null
          description: string | null
          id: string
          material_amount: number | null
          noci: number | null
          notes: string | null
          original_budget: number | null
          po_number: string | null
          project_id: string
          updated_at: string
          vendor: string | null
        }
        Insert: {
          contract_amount?: number | null
          contract_issued?: string | null
          contractor?: string | null
          cost_code?: string | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          material_amount?: number | null
          noci?: number | null
          notes?: string | null
          original_budget?: number | null
          po_number?: string | null
          project_id: string
          updated_at?: string
          vendor?: string | null
        }
        Update: {
          contract_amount?: number | null
          contract_issued?: string | null
          contractor?: string | null
          cost_code?: string | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          material_amount?: number | null
          noci?: number | null
          notes?: string | null
          original_budget?: number | null
          po_number?: string | null
          project_id?: string
          updated_at?: string
          vendor?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "purchasing_logs_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
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
      rfi_logs: {
        Row: {
          closed: boolean
          cost_impact: number | null
          created_at: string
          created_by: string | null
          date_received: string | null
          date_required: string | null
          description: string | null
          id: string
          issue_date: string | null
          notes: string | null
          project_id: string
          rfi_number: string | null
          updated_at: string
        }
        Insert: {
          closed?: boolean
          cost_impact?: number | null
          created_at?: string
          created_by?: string | null
          date_received?: string | null
          date_required?: string | null
          description?: string | null
          id?: string
          issue_date?: string | null
          notes?: string | null
          project_id: string
          rfi_number?: string | null
          updated_at?: string
        }
        Update: {
          closed?: boolean
          cost_impact?: number | null
          created_at?: string
          created_by?: string | null
          date_received?: string | null
          date_required?: string | null
          description?: string | null
          id?: string
          issue_date?: string | null
          notes?: string | null
          project_id?: string
          rfi_number?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "rfi_logs_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      schedule_delays: {
        Row: {
          created_at: string
          created_by: string | null
          days_delayed: number | null
          delay_description: string | null
          id: string
          impact: string | null
          notes: string | null
          original_date: string | null
          project_id: string
          reason: string | null
          revised_date: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          days_delayed?: number | null
          delay_description?: string | null
          id?: string
          impact?: string | null
          notes?: string | null
          original_date?: string | null
          project_id: string
          reason?: string | null
          revised_date?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          days_delayed?: number | null
          delay_description?: string | null
          id?: string
          impact?: string | null
          notes?: string | null
          original_date?: string | null
          project_id?: string
          reason?: string | null
          revised_date?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "schedule_delays_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
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
      subcontractor_prequalifications: {
        Row: {
          contact_email: string | null
          contact_name: string | null
          contact_phone: string | null
          created_at: string
          created_by: string | null
          id: string
          insurance_expiration: string | null
          insurance_on_file: boolean
          license_expiration: string | null
          license_number: string | null
          notes: string | null
          safety_rating: string | null
          status: string
          subcontractor_name: string
          trade: string | null
          updated_at: string
          w9_on_file: boolean
        }
        Insert: {
          contact_email?: string | null
          contact_name?: string | null
          contact_phone?: string | null
          created_at?: string
          created_by?: string | null
          id?: string
          insurance_expiration?: string | null
          insurance_on_file?: boolean
          license_expiration?: string | null
          license_number?: string | null
          notes?: string | null
          safety_rating?: string | null
          status?: string
          subcontractor_name: string
          trade?: string | null
          updated_at?: string
          w9_on_file?: boolean
        }
        Update: {
          contact_email?: string | null
          contact_name?: string | null
          contact_phone?: string | null
          created_at?: string
          created_by?: string | null
          id?: string
          insurance_expiration?: string | null
          insurance_on_file?: boolean
          license_expiration?: string | null
          license_number?: string | null
          notes?: string | null
          safety_rating?: string | null
          status?: string
          subcontractor_name?: string
          trade?: string | null
          updated_at?: string
          w9_on_file?: boolean
        }
        Relationships: []
      }
      submittal_logs: {
        Row: {
          closed: boolean
          created_at: string
          created_by: string | null
          date_received: string | null
          date_required: string | null
          description: string | null
          id: string
          issue_date: string | null
          notes: string | null
          project_id: string
          submittal_number: string | null
          updated_at: string
        }
        Insert: {
          closed?: boolean
          created_at?: string
          created_by?: string | null
          date_received?: string | null
          date_required?: string | null
          description?: string | null
          id?: string
          issue_date?: string | null
          notes?: string | null
          project_id: string
          submittal_number?: string | null
          updated_at?: string
        }
        Update: {
          closed?: boolean
          created_at?: string
          created_by?: string | null
          date_received?: string | null
          date_required?: string | null
          description?: string | null
          id?: string
          issue_date?: string | null
          notes?: string | null
          project_id?: string
          submittal_number?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "submittal_logs_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      toolbox_talks: {
        Row: {
          attendees: string | null
          created_at: string
          created_by: string | null
          id: string
          key_points: string | null
          location: string | null
          notes: string | null
          presenter: string | null
          talk_date: string
          topic: string
          updated_at: string
        }
        Insert: {
          attendees?: string | null
          created_at?: string
          created_by?: string | null
          id?: string
          key_points?: string | null
          location?: string | null
          notes?: string | null
          presenter?: string | null
          talk_date?: string
          topic: string
          updated_at?: string
        }
        Update: {
          attendees?: string | null
          created_at?: string
          created_by?: string | null
          id?: string
          key_points?: string | null
          location?: string | null
          notes?: string | null
          presenter?: string | null
          talk_date?: string
          topic?: string
          updated_at?: string
        }
        Relationships: []
      }
      trailer_inspections: {
        Row: {
          brakes_ok: boolean
          breakaway_ok: boolean
          coupler_ok: boolean
          created_at: string
          decking_ok: boolean
          defects: string | null
          frame_ok: boolean
          id: string
          inspected_by: string | null
          inspection_date: string
          inspector_name: string | null
          lights_ok: boolean
          safety_chains_ok: boolean
          status: string
          tie_downs_ok: boolean
          tires_ok: boolean
          trailer: string
          updated_at: string
          wheels_ok: boolean
        }
        Insert: {
          brakes_ok?: boolean
          breakaway_ok?: boolean
          coupler_ok?: boolean
          created_at?: string
          decking_ok?: boolean
          defects?: string | null
          frame_ok?: boolean
          id?: string
          inspected_by?: string | null
          inspection_date?: string
          inspector_name?: string | null
          lights_ok?: boolean
          safety_chains_ok?: boolean
          status?: string
          tie_downs_ok?: boolean
          tires_ok?: boolean
          trailer: string
          updated_at?: string
          wheels_ok?: boolean
        }
        Update: {
          brakes_ok?: boolean
          breakaway_ok?: boolean
          coupler_ok?: boolean
          created_at?: string
          decking_ok?: boolean
          defects?: string | null
          frame_ok?: boolean
          id?: string
          inspected_by?: string | null
          inspection_date?: string
          inspector_name?: string | null
          lights_ok?: boolean
          safety_chains_ok?: boolean
          status?: string
          tie_downs_ok?: boolean
          tires_ok?: boolean
          trailer?: string
          updated_at?: string
          wheels_ok?: boolean
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      vehicle_inspections: {
        Row: {
          blinkers_ok: boolean
          brake_lights_ok: boolean
          clearance_lights_ok: boolean
          controls_ok: boolean
          created_at: string
          defects: string | null
          fluids_ok: boolean
          guards_ok: boolean
          headlights_ok: boolean
          id: string
          inspected_by: string | null
          inspection_date: string
          inspector_name: string | null
          odometer: number | null
          running_lights_ok: boolean
          status: string
          tires_ok: boolean
          updated_at: string
          vehicle: string
        }
        Insert: {
          blinkers_ok?: boolean
          brake_lights_ok?: boolean
          clearance_lights_ok?: boolean
          controls_ok?: boolean
          created_at?: string
          defects?: string | null
          fluids_ok?: boolean
          guards_ok?: boolean
          headlights_ok?: boolean
          id?: string
          inspected_by?: string | null
          inspection_date?: string
          inspector_name?: string | null
          odometer?: number | null
          running_lights_ok?: boolean
          status?: string
          tires_ok?: boolean
          updated_at?: string
          vehicle: string
        }
        Update: {
          blinkers_ok?: boolean
          brake_lights_ok?: boolean
          clearance_lights_ok?: boolean
          controls_ok?: boolean
          created_at?: string
          defects?: string | null
          fluids_ok?: boolean
          guards_ok?: boolean
          headlights_ok?: boolean
          id?: string
          inspected_by?: string | null
          inspection_date?: string
          inspector_name?: string | null
          odometer?: number | null
          running_lights_ok?: boolean
          status?: string
          tires_ok?: boolean
          updated_at?: string
          vehicle?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      app_role: "admin" | "executive" | "project_manager" | "viewer"
      equipment_category:
        | "Excavator"
        | "Skid Steer"
        | "Dump Truck"
        | "Concrete Pump"
        | "Lift"
        | "Other"
      job_status: "active" | "closed"
      project_status:
        | "bid_pre_contract"
        | "bid_under_contract"
        | "active"
        | "complete"
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
      app_role: ["admin", "executive", "project_manager", "viewer"],
      equipment_category: [
        "Excavator",
        "Skid Steer",
        "Dump Truck",
        "Concrete Pump",
        "Lift",
        "Other",
      ],
      job_status: ["active", "closed"],
      project_status: [
        "bid_pre_contract",
        "bid_under_contract",
        "active",
        "complete",
      ],
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
