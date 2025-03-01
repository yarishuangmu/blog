<template>
  <div>
    <div class="text-center mb-12">
      <h1 class="text-4xl font-bold text-gray-900 dark:text-white mb-4">欢迎来到我的博客</h1>
      <p class="text-xl text-gray-600 dark:text-gray-400">分享技术见解与个人心得</p>
    </div>

    <!-- 加载状态 -->
    <div v-if="loading" class="flex justify-center py-12">
      <UIcon name="i-heroicons-arrow-path" class="w-8 h-8 animate-spin text-gray-400" />
    </div>

    <!-- 文章列表 -->
    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div
        v-for="post in posts"
        :key="post.id"
        class="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
      >
        <div class="p-6">
          <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            {{ post.title }}
          </h2>
          <p class="text-gray-600 dark:text-gray-400 mb-4 line-clamp-3">
            {{ post.excerpt || truncate(post.content) }}
          </p>
          <div class="flex justify-between items-center">
            <div class="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
              <span class="flex items-center gap-1">
                <UIcon name="i-heroicons-calendar" class="w-4 h-4" />
                {{ formatDate(post.created_at) }}
              </span>
              <span class="flex items-center gap-1">
                <UIcon name="i-heroicons-tag" class="w-4 h-4" />
                {{ getCategoryName(post.category_id) }}
              </span>
            </div>
            <UButton
              :to="'/blog/' + post.id"
              color="primary"
              variant="solid"
            >
              阅读更多
            </UButton>
          </div>
        </div>
      </div>
    </div>

    <!-- 空状态 -->
    <div v-if="!loading && !posts.length" class="text-center py-12">
      <UIcon name="i-heroicons-document-text" class="w-12 h-12 mx-auto text-gray-400 mb-4" />
      <p class="text-gray-500 dark:text-gray-400">暂无文章</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useSupabaseClient } from '#imports'
import type { Database } from '~/types/supabase'

definePageMeta({
  layout: 'default'
})

type Post = Database['public']['Tables']['posts']['Row']
type Category = Database['public']['Tables']['categories']['Row']

const loading = ref(true)
const posts = ref<Post[]>([])
const categories = ref<Category[]>([])

// 获取文章列表和分类
const fetchData = async () => {
  try {
    const client = useSupabaseClient<Database>()
    
    // 获取已发布的文章
    const { data: postsData, error: postsError } = await client
      .from('posts')
      .select('*')
      .eq('published', true)
      .order('created_at', { ascending: false })
      .limit(6)

    if (postsError) throw postsError
    posts.value = postsData

    // 获取分类数据
    const { data: categoriesData, error: categoriesError } = await client
      .from('categories')
      .select('*')

    if (categoriesError) throw categoriesError
    categories.value = categoriesData
  } catch (error) {
    console.error('获取数据失败:', error)
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
const truncate = (text: string) => {
  const length = 100
  if (!text || text.length <= length) return text
  return text.slice(0, length) + '...'
}

// 根据时间自动切换暗黑模式
const initDarkMode = () => {
  const hour = new Date().getHours()
  const isDarkTime = hour < 6 || hour >= 18 // 晚上6点到早上6点使用暗黑模式
  
  // 设置颜色模式
  const colorMode = useColorMode()
  colorMode.preference = isDarkTime ? 'dark' : 'light'
}

onMounted(() => {
  fetchData()
  initDarkMode()
})
</script> 