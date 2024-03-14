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
      group: {
        Row: {
          created_at: string
          group_name: string | null
          id: number
          id_user_creator: string | null
        }
        Insert: {
          created_at?: string
          group_name?: string | null
          id?: number
          id_user_creator?: string | null
        }
        Update: {
          created_at?: string
          group_name?: string | null
          id?: number
          id_user_creator?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "public_group_id_user_creator_fkey"
            columns: ["id_user_creator"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      message: {
        Row: {
          content: string | null
          created_at: string
          id: number
          id_group: number | null
          id_user: string | null
          send_at: string | null
        }
        Insert: {
          content?: string | null
          created_at?: string
          id?: number
          id_group?: number | null
          id_user?: string | null
          send_at?: string | null
        }
        Update: {
          content?: string | null
          created_at?: string
          id?: number
          id_group?: number | null
          id_user?: string | null
          send_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "public_message_id_group_fkey"
            columns: ["id_group"]
            isOneToOne: false
            referencedRelation: "group"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "public_message_id_user_fkey"
            columns: ["id_user"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      user_group: {
        Row: {
          created_at: string
          id: number
          id_group: number | null
          id_user: string | null
          last_check: string | null
          state_invitation: number | null
        }
        Insert: {
          created_at?: string
          id?: number
          id_group?: number | null
          id_user?: string | null
          last_check?: string | null
          state_invitation?: number | null
        }
        Update: {
          created_at?: string
          id?: number
          id_group?: number | null
          id_user?: string | null
          last_check?: string | null
          state_invitation?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "public_user_group_id_group_fkey"
            columns: ["id_group"]
            isOneToOne: false
            referencedRelation: "group"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "public_user_group_id_user_fkey"
            columns: ["id_user"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      user_relation: {
        Row: {
          created_at: string
          id_other_user: string
          id_user: string
          state_relation: number | null
        }
        Insert: {
          created_at?: string
          id_other_user?: string
          id_user?: string
          state_relation?: number | null
        }
        Update: {
          created_at?: string
          id_other_user?: string
          id_user?: string
          state_relation?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "public_user_relation_id_other_user_fkey"
            columns: ["id_other_user"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "public_user_relation_id_user_fkey"
            columns: ["id_user"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      users: {
        Row: {
          id: string
          user_created_at: string
          user_profile_picture: string | null
          user_pseudo: string | null
          user_state: number | null
        }
        Insert: {
          id?: string
          user_created_at?: string
          user_profile_picture?: string | null
          user_pseudo?: string | null
          user_state?: number | null
        }
        Update: {
          id?: string
          user_created_at?: string
          user_profile_picture?: string | null
          user_pseudo?: string | null
          user_state?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "public_User_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
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
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (Database["public"]["Tables"] & Database["public"]["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (Database["public"]["Tables"] &
      Database["public"]["Views"])
  ? (Database["public"]["Tables"] &
      Database["public"]["Views"])[PublicTableNameOrOptions] extends {
      Row: infer R
    }
    ? R
    : never
  : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof Database["public"]["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof Database["public"]["Tables"]
  ? Database["public"]["Tables"][PublicTableNameOrOptions] extends {
      Insert: infer I
    }
    ? I
    : never
  : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof Database["public"]["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof Database["public"]["Tables"]
  ? Database["public"]["Tables"][PublicTableNameOrOptions] extends {
      Update: infer U
    }
    ? U
    : never
  : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof Database["public"]["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof Database["public"]["Enums"]
  ? Database["public"]["Enums"][PublicEnumNameOrOptions]
  : never

export type Message = {id: number, content: string, id_user: string, id_group: number, send_at: string, created_at: string};
export type UserMetadata = {id: string, user_pseudo:string, user_profile_picture:string, user_state:number, user_created_at:string};
export type Group = {id: number, created_at: string, group_name: string, id_user_creator: string}
export type User_Group = {id: number, id_user: string, id_group: number, last_check:string, state_invitation:number, created_at:string}
export type User_Relation = {id_user:string, id_other_user: string, state_relation:number, created_at:string}