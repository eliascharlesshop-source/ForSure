export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          name: string
          password_hash: string | null
          avatar_url: string | null
          bio: string | null
          role: 'user' | 'admin' | 'moderator'
          company: string | null
          location: string | null
          website: string | null
          github_username: string | null
          twitter_username: string | null
          linkedin_url: string | null
          skills: string[]
          preferences: Json
          is_verified: boolean
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          name: string
          password_hash?: string | null
          avatar_url?: string | null
          bio?: string | null
          role?: 'user' | 'admin' | 'moderator'
          company?: string | null
          location?: string | null
          website?: string | null
          github_username?: string | null
          twitter_username?: string | null
          linkedin_url?: string | null
          skills?: string[]
          preferences?: Json
          is_verified?: boolean
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          name?: string
          password_hash?: string | null
          avatar_url?: string | null
          bio?: string | null
          role?: 'user' | 'admin' | 'moderator'
          company?: string | null
          location?: string | null
          website?: string | null
          github_username?: string | null
          twitter_username?: string | null
          linkedin_url?: string | null
          skills?: string[]
          preferences?: Json
          is_verified?: boolean
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      projects: {
        Row: {
          id: string
          name: string
          description: string | null
          slug: string
          status: 'active' | 'archived' | 'draft' | 'completed'
          visibility: 'public' | 'private' | 'unlisted'
          owner_id: string
          repository_url: string | null
          demo_url: string | null
          documentation_url: string | null
          tech_stack: string[]
          tags: string[]
          priority: 'low' | 'medium' | 'high' | 'urgent'
          progress: number
          start_date: string | null
          end_date: string | null
          budget_allocated: number | null
          budget_spent: number
          metadata: Json
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          slug: string
          status?: 'active' | 'archived' | 'draft' | 'completed'
          visibility?: 'public' | 'private' | 'unlisted'
          owner_id: string
          repository_url?: string | null
          demo_url?: string | null
          documentation_url?: string | null
          tech_stack?: string[]
          tags?: string[]
          priority?: 'low' | 'medium' | 'high' | 'urgent'
          progress?: number
          start_date?: string | null
          end_date?: string | null
          budget_allocated?: number | null
          budget_spent?: number
          metadata?: Json
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          slug?: string
          status?: 'active' | 'archived' | 'draft' | 'completed'
          visibility?: 'public' | 'private' | 'unlisted'
          owner_id?: string
          repository_url?: string | null
          demo_url?: string | null
          documentation_url?: string | null
          tech_stack?: string[]
          tags?: string[]
          priority?: 'low' | 'medium' | 'high' | 'urgent'
          progress?: number
          start_date?: string | null
          end_date?: string | null
          budget_allocated?: number | null
          budget_spent?: number
          metadata?: Json
          created_at?: string
          updated_at?: string
        }
      }
      project_members: {
        Row: {
          id: string
          project_id: string
          user_id: string
          role: 'owner' | 'admin' | 'member' | 'viewer'
          permissions: string[]
          joined_at: string
        }
        Insert: {
          id?: string
          project_id: string
          user_id: string
          role?: 'owner' | 'admin' | 'member' | 'viewer'
          permissions?: string[]
          joined_at?: string
        }
        Update: {
          id?: string
          project_id?: string
          user_id?: string
          role?: 'owner' | 'admin' | 'member' | 'viewer'
          permissions?: string[]
          joined_at?: string
        }
      }
      tasks: {
        Row: {
          id: string
          project_id: string
          title: string
          description: string | null
          status: 'todo' | 'in_progress' | 'review' | 'done' | 'blocked'
          priority: 'low' | 'medium' | 'high' | 'urgent'
          assignee_id: string | null
          reporter_id: string | null
          due_date: string | null
          estimated_hours: number | null
          actual_hours: number | null
          tags: string[]
          metadata: Json
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          project_id: string
          title: string
          description?: string | null
          status?: 'todo' | 'in_progress' | 'review' | 'done' | 'blocked'
          priority?: 'low' | 'medium' | 'high' | 'urgent'
          assignee_id?: string | null
          reporter_id?: string | null
          due_date?: string | null
          estimated_hours?: number | null
          actual_hours?: number | null
          tags?: string[]
          metadata?: Json
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          project_id?: string
          title?: string
          description?: string | null
          status?: 'todo' | 'in_progress' | 'review' | 'done' | 'blocked'
          priority?: 'low' | 'medium' | 'high' | 'urgent'
          assignee_id?: string | null
          reporter_id?: string | null
          due_date?: string | null
          estimated_hours?: number | null
          actual_hours?: number | null
          tags?: string[]
          metadata?: Json
          created_at?: string
          updated_at?: string
        }
      }
      teams: {
        Row: {
          id: string
          name: string
          description: string | null
          slug: string
          owner_id: string
          avatar_url: string | null
          is_public: boolean
          settings: Json
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          slug: string
          owner_id: string
          avatar_url?: string | null
          is_public?: boolean
          settings?: Json
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          slug?: string
          owner_id?: string
          avatar_url?: string | null
          is_public?: boolean
          settings?: Json
          created_at?: string
          updated_at?: string
        }
      }
      team_members: {
        Row: {
          id: string
          team_id: string
          user_id: string
          role: 'owner' | 'admin' | 'member'
          joined_at: string
        }
        Insert: {
          id?: string
          team_id: string
          user_id: string
          role?: 'owner' | 'admin' | 'member'
          joined_at?: string
        }
        Update: {
          id?: string
          team_id?: string
          user_id?: string
          role?: 'owner' | 'admin' | 'member'
          joined_at?: string
        }
      }
      blog_posts: {
        Row: {
          id: string
          title: string
          slug: string
          content: string
          excerpt: string | null
          author_id: string
          status: 'draft' | 'published' | 'archived'
          featured_image_url: string | null
          tags: string[]
          seo_title: string | null
          seo_description: string | null
          view_count: number
          published_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          slug: string
          content: string
          excerpt?: string | null
          author_id: string
          status?: 'draft' | 'published' | 'archived'
          featured_image_url?: string | null
          tags?: string[]
          seo_title?: string | null
          seo_description?: string | null
          view_count?: number
          published_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          slug?: string
          content?: string
          excerpt?: string | null
          author_id?: string
          status?: 'draft' | 'published' | 'archived'
          featured_image_url?: string | null
          tags?: string[]
          seo_title?: string | null
          seo_description?: string | null
          view_count?: number
          published_at?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      templates: {
        Row: {
          id: string
          name: string
          description: string | null
          category: string
          content: Json
          preview_image_url: string | null
          creator_id: string
          is_public: boolean
          download_count: number
          tags: string[]
          version: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          category: string
          content: Json
          preview_image_url?: string | null
          creator_id: string
          is_public?: boolean
          download_count?: number
          tags?: string[]
          version?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          category?: string
          content?: Json
          preview_image_url?: string | null
          creator_id?: string
          is_public?: boolean
          download_count?: number
          tags?: string[]
          version?: string
          created_at?: string
          updated_at?: string
        }
      }
      file_uploads: {
        Row: {
          id: string
          filename: string
          original_filename: string
          file_size: number
          mime_type: string
          file_url: string
          uploader_id: string
          entity_type: string | null
          entity_id: string | null
          metadata: Json
          created_at: string
        }
        Insert: {
          id?: string
          filename: string
          original_filename: string
          file_size: number
          mime_type: string
          file_url: string
          uploader_id: string
          entity_type?: string | null
          entity_id?: string | null
          metadata?: Json
          created_at?: string
        }
        Update: {
          id?: string
          filename?: string
          original_filename?: string
          file_size?: number
          mime_type?: string
          file_url?: string
          uploader_id?: string
          entity_type?: string | null
          entity_id?: string | null
          metadata?: Json
          created_at?: string
        }
      }
      notifications: {
        Row: {
          id: string
          user_id: string
          type: string
          title: string
          message: string
          data: Json
          is_read: boolean
          action_url: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          type: string
          title: string
          message: string
          data?: Json
          is_read?: boolean
          action_url?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          type?: string
          title?: string
          message?: string
          data?: Json
          is_read?: boolean
          action_url?: string | null
          created_at?: string
        }
      }
      components: {
        Row: {
          id: string
          name: string
          slug: string
          description: string | null
          category: string
          tags: string[]
          prompt: string
          preview_image_url: string | null
          download_count: number
          stars: number
          is_public: boolean
          creator_id: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          slug: string
          description?: string | null
          category: string
          tags?: string[]
          prompt: string
          preview_image_url?: string | null
          download_count?: number
          stars?: number
          is_public?: boolean
          creator_id: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          slug?: string
          description?: string | null
          category?: string
          tags?: string[]
          prompt?: string
          preview_image_url?: string | null
          download_count?: number
          stars?: number
          is_public?: boolean
          creator_id?: string
          created_at?: string
          updated_at?: string
        }
      }
      audit_logs: {
        Row: {
          id: string
          user_id: string | null
          action: string
          entity_type: string
          entity_id: string | null
          old_values: Json | null
          new_values: Json | null
          ip_address: string | null
          user_agent: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id?: string | null
          action: string
          entity_type: string
          entity_id?: string | null
          old_values?: Json | null
          new_values?: Json | null
          ip_address?: string | null
          user_agent?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string | null
          action?: string
          entity_type?: string
          entity_id?: string | null
          old_values?: Json | null
          new_values?: Json | null
          ip_address?: string | null
          user_agent?: string | null
          created_at?: string
        }
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
  }
}
