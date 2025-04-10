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
      amenities: {
        Row: {
          category: string
          created_at: string
          description: string | null
          icon: string | null
          id: string
          name: string
          updated_at: string
          weight: number | null
        }
        Insert: {
          category: string
          created_at?: string
          description?: string | null
          icon?: string | null
          id?: string
          name: string
          updated_at?: string
          weight?: number | null
        }
        Update: {
          category?: string
          created_at?: string
          description?: string | null
          icon?: string | null
          id?: string
          name?: string
          updated_at?: string
          weight?: number | null
        }
        Relationships: []
      }
      image_matches: {
        Row: {
          created_at: string | null
          id: string
          image_url: string
          listing_id: string | null
          match_details: Json | null
          quality_score: number | null
          style_scores: Json | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          image_url: string
          listing_id?: string | null
          match_details?: Json | null
          quality_score?: number | null
          style_scores?: Json | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          image_url?: string
          listing_id?: string | null
          match_details?: Json | null
          quality_score?: number | null
          style_scores?: Json | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      listing_images: {
        Row: {
          caption: string | null
          created_at: string
          id: string
          listing_id: string
          metadata: Json | null
          order_index: number | null
          updated_at: string
          url: string
        }
        Insert: {
          caption?: string | null
          created_at?: string
          id?: string
          listing_id: string
          metadata?: Json | null
          order_index?: number | null
          updated_at?: string
          url: string
        }
        Update: {
          caption?: string | null
          created_at?: string
          id?: string
          listing_id?: string
          metadata?: Json | null
          order_index?: number | null
          updated_at?: string
          url?: string
        }
        Relationships: [
          {
            foreignKeyName: "listing_images_listing_id_fkey"
            columns: ["listing_id"]
            isOneToOne: false
            referencedRelation: "listings"
            referencedColumns: ["id"]
          },
        ]
      }
      listings: {
        Row: {
          address: string | null
          airbnb_id: string | null
          amenities: string[] | null
          city: string | null
          country: string | null
          created_at: string
          description: string | null
          embedding: string | null
          features: Json | null
          host_avatar: string | null
          host_id: string | null
          host_name: string | null
          host_rating: number | null
          id: string
          image_analysis: Json[] | null
          images: Json[] | null
          latitude: number | null
          longitude: number | null
          metadata: Json | null
          person_capacity: number | null
          price: number
          state: string | null
          style_embedding: string | null
          styles: string[] | null
          title: string
          updated_at: string
          zip_code: string | null
        }
        Insert: {
          address?: string | null
          airbnb_id?: string | null
          amenities?: string[] | null
          city?: string | null
          country?: string | null
          created_at?: string
          description?: string | null
          embedding?: string | null
          features?: Json | null
          host_avatar?: string | null
          host_id?: string | null
          host_name?: string | null
          host_rating?: number | null
          id?: string
          image_analysis?: Json[] | null
          images?: Json[] | null
          latitude?: number | null
          longitude?: number | null
          metadata?: Json | null
          person_capacity?: number | null
          price: number
          state?: string | null
          style_embedding?: string | null
          styles?: string[] | null
          title: string
          updated_at?: string
          zip_code?: string | null
        }
        Update: {
          address?: string | null
          airbnb_id?: string | null
          amenities?: string[] | null
          city?: string | null
          country?: string | null
          created_at?: string
          description?: string | null
          embedding?: string | null
          features?: Json | null
          host_avatar?: string | null
          host_id?: string | null
          host_name?: string | null
          host_rating?: number | null
          id?: string
          image_analysis?: Json[] | null
          images?: Json[] | null
          latitude?: number | null
          longitude?: number | null
          metadata?: Json | null
          person_capacity?: number | null
          price?: number
          state?: string | null
          style_embedding?: string | null
          styles?: string[] | null
          title?: string
          updated_at?: string
          zip_code?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          email: string
          full_name: string | null
          has_completed_onboarding: boolean | null
          id: string
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          email: string
          full_name?: string | null
          has_completed_onboarding?: boolean | null
          id: string
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          email?: string
          full_name?: string | null
          has_completed_onboarding?: boolean | null
          id?: string
          updated_at?: string
        }
        Relationships: []
      }
      swipes: {
        Row: {
          action: string
          created_at: string
          id: string
          listing_id: string
          timestamp: string
          updated_at: string
          user_id: string
        }
        Insert: {
          action: string
          created_at?: string
          id?: string
          listing_id: string
          timestamp?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          action?: string
          created_at?: string
          id?: string
          listing_id?: string
          timestamp?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      taste_profiles: {
        Row: {
          amenity_preferences: string[] | null
          created_at: string
          created_by: string | null
          gallery_embedding: string | null
          history: Json | null
          id: string
          image_gallery: Json[] | null
          is_active: boolean
          location_preferences: Json | null
          mood_board_embedding: string | null
          mood_board_images: Json[] | null
          perfect_space_image: string | null
          preferences: Json | null
          profile_name: string
          room_urls: Json | null
          shareable_link: string | null
          slider_preferences: Json | null
          style_description: string | null
          taste_vector: string | null
          updated_at: string
          user_id: string
          wishlist_urls: Json | null
        }
        Insert: {
          amenity_preferences?: string[] | null
          created_at?: string
          created_by?: string | null
          gallery_embedding?: string | null
          history?: Json | null
          id?: string
          image_gallery?: Json[] | null
          is_active?: boolean
          location_preferences?: Json | null
          mood_board_embedding?: string | null
          mood_board_images?: Json[] | null
          perfect_space_image?: string | null
          preferences?: Json | null
          profile_name?: string
          room_urls?: Json | null
          shareable_link?: string | null
          slider_preferences?: Json | null
          style_description?: string | null
          taste_vector?: string | null
          updated_at?: string
          user_id: string
          wishlist_urls?: Json | null
        }
        Update: {
          amenity_preferences?: string[] | null
          created_at?: string
          created_by?: string | null
          gallery_embedding?: string | null
          history?: Json | null
          id?: string
          image_gallery?: Json[] | null
          is_active?: boolean
          location_preferences?: Json | null
          mood_board_embedding?: string | null
          mood_board_images?: Json[] | null
          perfect_space_image?: string | null
          preferences?: Json | null
          profile_name?: string
          room_urls?: Json | null
          shareable_link?: string | null
          slider_preferences?: Json | null
          style_description?: string | null
          taste_vector?: string | null
          updated_at?: string
          user_id?: string
          wishlist_urls?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "taste_profiles_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "taste_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      todos: {
        Row: {
          created_at: string
          description: string | null
          id: string
          is_complete: boolean | null
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          is_complete?: boolean | null
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          is_complete?: boolean | null
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_preferences: {
        Row: {
          analysis: Json | null
          comparisons: Json | null
          created_at: string
          disliked_images: string[] | null
          id: string
          liked_images: string[] | null
          must_have_features: string[] | null
          style_description: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          analysis?: Json | null
          comparisons?: Json | null
          created_at?: string
          disliked_images?: string[] | null
          id?: string
          liked_images?: string[] | null
          must_have_features?: string[] | null
          style_description?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          analysis?: Json | null
          comparisons?: Json | null
          created_at?: string
          disliked_images?: string[] | null
          id?: string
          liked_images?: string[] | null
          must_have_features?: string[] | null
          style_description?: string | null
          updated_at?: string
          user_id?: string
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
          role?: Database["public"]["Enums"]["app_role"]
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
      wishlists: {
        Row: {
          amenities: string[] | null
          created_at: string | null
          currency: string
          description: string | null
          id: string
          listing_id: string
          location: Json
          photos: string[] | null
          price: number
          title: string
          updated_at: string | null
          url: string
          user_id: string
        }
        Insert: {
          amenities?: string[] | null
          created_at?: string | null
          currency: string
          description?: string | null
          id?: string
          listing_id: string
          location: Json
          photos?: string[] | null
          price: number
          title: string
          updated_at?: string | null
          url: string
          user_id: string
        }
        Update: {
          amenities?: string[] | null
          created_at?: string | null
          currency?: string
          description?: string | null
          id?: string
          listing_id?: string
          location?: Json
          photos?: string[] | null
          price?: number
          title?: string
          updated_at?: string | null
          url?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      binary_quantize: {
        Args: { "": unknown } | { "": string }
        Returns: unknown
      }
      check_jsonb_array_objects: {
        Args: { arr: Json[] }
        Returns: boolean
      }
      find_similar_profiles: {
        Args: {
          query_vector: string
          match_threshold?: number
          match_limit?: number
        }
        Returns: {
          user_id: string
          similarity: number
        }[]
      }
      halfvec_avg: {
        Args: { "": number[] }
        Returns: unknown
      }
      halfvec_out: {
        Args: { "": unknown }
        Returns: unknown
      }
      halfvec_send: {
        Args: { "": unknown }
        Returns: string
      }
      halfvec_typmod_in: {
        Args: { "": unknown[] }
        Returns: number
      }
      has_role: {
        Args: { role: Database["public"]["Enums"]["app_role"] }
        Returns: boolean
      }
      hnsw_bit_support: {
        Args: { "": unknown }
        Returns: unknown
      }
      hnsw_halfvec_support: {
        Args: { "": unknown }
        Returns: unknown
      }
      hnsw_sparsevec_support: {
        Args: { "": unknown }
        Returns: unknown
      }
      hnswhandler: {
        Args: { "": unknown }
        Returns: unknown
      }
      ivfflat_bit_support: {
        Args: { "": unknown }
        Returns: unknown
      }
      ivfflat_halfvec_support: {
        Args: { "": unknown }
        Returns: unknown
      }
      ivfflathandler: {
        Args: { "": unknown }
        Returns: unknown
      }
      l2_norm: {
        Args: { "": unknown } | { "": unknown }
        Returns: number
      }
      l2_normalize: {
        Args: { "": unknown } | { "": unknown } | { "": string }
        Returns: unknown
      }
      match_listings: {
        Args: {
          query_vector: string
          match_threshold?: number
          match_limit?: number
        }
        Returns: {
          id: string
          similarity: number
        }[]
      }
      sparsevec_out: {
        Args: { "": unknown }
        Returns: unknown
      }
      sparsevec_send: {
        Args: { "": unknown }
        Returns: string
      }
      sparsevec_typmod_in: {
        Args: { "": unknown[] }
        Returns: number
      }
      vector_avg: {
        Args: { "": number[] }
        Returns: string
      }
      vector_dims: {
        Args: { "": unknown } | { "": string }
        Returns: number
      }
      vector_norm: {
        Args: { "": string }
        Returns: number
      }
      vector_out: {
        Args: { "": string }
        Returns: unknown
      }
      vector_send: {
        Args: { "": string }
        Returns: string
      }
      vector_typmod_in: {
        Args: { "": unknown[] }
        Returns: number
      }
    }
    Enums: {
      app_role: "admin" | "user"
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
    Enums: {
      app_role: ["admin", "user"],
    },
  },
} as const
