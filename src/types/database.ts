/**
 * Supabase Database Type Definitions
 * Auto-generated types for database tables
 */

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          email: string;
          name: string | null;
          avatar_url: string | null;
          preferred_vibes: string[];
          created_at: string;
        };
        Insert: {
          id?: string;
          email: string;
          name?: string | null;
          avatar_url?: string | null;
          preferred_vibes?: string[];
          created_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          name?: string | null;
          avatar_url?: string | null;
          preferred_vibes?: string[];
          created_at?: string;
        };
      };
      locations: {
        Row: {
          id: string;
          name: string;
          description: string | null;
          address: string;
          city: string;
          latitude: number;
          longitude: number;
          vibes: string[];
          category: string;
          price_level: number | null;
          rating: number | null;
          photos: string[];
          hours: Json | null;
          is_expert_pick: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          description?: string | null;
          address: string;
          city: string;
          latitude: number;
          longitude: number;
          vibes?: string[];
          category: string;
          price_level?: number | null;
          rating?: number | null;
          photos?: string[];
          hours?: Json | null;
          is_expert_pick?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          description?: string | null;
          address?: string;
          city?: string;
          latitude?: number;
          longitude?: number;
          vibes?: string[];
          category?: string;
          price_level?: number | null;
          rating?: number | null;
          photos?: string[];
          hours?: Json | null;
          is_expert_pick?: boolean;
          created_at?: string;
        };
      };
      saves: {
        Row: {
          id: string;
          user_id: string;
          location_id: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          location_id: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          location_id?: string;
          created_at?: string;
        };
      };
      experts: {
        Row: {
          id: string;
          user_id: string;
          status: string;
          specialties: string[];
          cities: string[];
          recommendation_count: number;
          average_rating: number | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          status?: string;
          specialties?: string[];
          cities?: string[];
          recommendation_count?: number;
          average_rating?: number | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          status?: string;
          specialties?: string[];
          cities?: string[];
          recommendation_count?: number;
          average_rating?: number | null;
          created_at?: string;
        };
      };
      reviews: {
        Row: {
          id: string;
          user_id: string;
          location_id: string;
          rating: number;
          text: string | null;
          photos: string[];
          helpful_count: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          location_id: string;
          rating: number;
          text?: string | null;
          photos?: string[];
          helpful_count?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          location_id?: string;
          rating?: number;
          text?: string | null;
          photos?: string[];
          helpful_count?: number;
          created_at?: string;
        };
      };
      lists: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          description: string | null;
          privacy: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          name: string;
          description?: string | null;
          privacy?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          name?: string;
          description?: string | null;
          privacy?: string;
          created_at?: string;
        };
      };
      list_items: {
        Row: {
          id: string;
          list_id: string;
          location_id: string;
          added_by: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          list_id: string;
          location_id: string;
          added_by: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          list_id?: string;
          location_id?: string;
          added_by?: string;
          created_at?: string;
        };
      };
      follows: {
        Row: {
          id: string;
          follower_id: string;
          following_id: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          follower_id: string;
          following_id: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          follower_id?: string;
          following_id?: string;
          created_at?: string;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
  };
}
