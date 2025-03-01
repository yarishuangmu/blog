<template>
  <div class="max-w-4xl mx-auto px-4 py-8">
    <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-8">博客文章</h1>

    <!-- 加载状态 -->
    <div v-if="loading" class="flex justify-center py-12">
      <UIcon name="i-heroicons-arrow-path" class="w-8 h-8 animate-spin text-gray-400" />
    </div>

    <!-- 文章列表 -->
    <div v-else class="space-y-8">
      <article v-for="post in posts" :key="post.id" class="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
        <NuxtLink :to="'/blog/' + post.id" class="block group">
          <h2 class="text-2xl font-bold text-gray-900 dark:text-white group-hover:text-primary-500 mb-2">
            {{ post.title }}
          </h2>
          <p class="text-gray-500 dark:text-gray-400 mb-4 line-clamp-2">
            {{ post.excerpt || truncate(post.content, 150) }}
          </p>
        </NuxtLink>
        
        <div class="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
          <div class="flex items-center gap-4">
            <span class="flex items-center gap-1">
              <UIcon name="i-heroicons-calendar" class="w-4 h-4" />
              {{ formatDate(post.created_at) }}
            </span>
            <span class="flex items-center gap-1">
              <UIcon name="i-heroicons-tag" class="w-4 h-4" />
              {{ getCategoryName(post.category_id) }}
            </span>
          </div>
          <div class="flex items-center gap-2">
            <span v-for="tag in post.tags" :key="tag" class="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded-full">
              {{ tag }}
            </span>
          </div>
        </div>
      </article>
    </div>

    <!-- 空状态 -->
    <div v-if="!loading && !posts.length" class="text-center py-12">
      <UIcon name="i-heroicons-document-text" class="w-12 h-12 mx-auto text-gray-400 mb-4" />
      <p class="text-gray-500 dark:text-gray-400">暂无文章</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Database } from '~/types/supabase'

type Post = Database['public']['Tables']['posts']['Row']
type Category = Database['public']['Tables']['categories']['Row']

const loading = ref(true)
const posts = ref<Post[]>([])
const categories = ref<Category[]>([])

// 获取文章列表
const fetchPosts = async () => {
  try {
    const client = useSupabaseClient<Database>()
    const { data: postsData, error: postsError } = await client
      .from('posts')
      .select('*')
      .eq('published', true)
      .order('created_at', { ascending: false })

    if (postsError) throw postsError
    posts.value = postsData

    // 获取分类数据
    const { data: categoriesData, error: categoriesError } = await client
      .from('categories')
      .select('*')

    if (categoriesError) throw categoriesError
    categories.value = categoriesData
  } catch (error) {
    console.error('获取文章列表失败:', error)
  } finally {
    loading.value = false
  }
}

// 获取分类名称
const getCategoryName = (categoryId: string) => {
  const category = categories.value.find(c => c.id === categoryId)
  return category?.name || '未分类'
}

// 格式化日期
const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

// 截断文本
const truncate = (text: string, length: number) => {
  if (text.length <= length) return text
  return text.slice(0, length) + '...'
}

// 在页面加载时获取数据
onMounted(() => {
  fetchPosts()
})
</script> 