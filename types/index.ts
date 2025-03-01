export * from './supabase'

export interface Post {
  id?: string
  title: string
  content: string
  excerpt: string
  category_id: string
  tags: string[]
  published: boolean
  author_id: string
  created_at?: string
  updated_at?: string
}

export interface PostForm {
  title: string
  content: string
  excerpt: string
  category_id: string
  tags: string // 用于表单输入
  published: boolean
  author_id?: string
}

export interface User {
  id: string
  name: string
  email: string
  role: 'user' | 'admin'
  created_at: string
  updated_at: string
}

export interface Comment {
  id: string
  content: string
  post_id: string
  author_id: string
  created_at: string
  updated_at: string
}

export interface Category {
  id: string
  name: string
  created_at?: string
} 