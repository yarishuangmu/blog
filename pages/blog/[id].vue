<template>
  <div class="max-w-4xl mx-auto px-4 py-8">
    <!-- 加载状态 -->
    <div v-if="loading" class="flex justify-center py-12">
      <UIcon name="i-heroicons-arrow-path" class="w-8 h-8 animate-spin text-gray-400" />
    </div>

    <!-- 文章内容 -->
    <article v-else-if="post" class="prose dark:prose-invert max-w-none">
      <header class="mb-8 not-prose">
        <h1 class="text-4xl font-bold text-gray-900 dark:text-white mb-4">
          {{ post.title }}
        </h1>
        <div class="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
          <span class="flex items-center gap-1">
            <UIcon name="i-heroicons-calendar" class="w-4 h-4" />
            {{ formatDate(post.created_at) }}
          </span>
          <span class="flex items-center gap-1">
            <UIcon name="i-heroicons-tag" class="w-4 h-4" />
            {{ getCategoryName(post.category_id) }}
          </span>
          <div class="flex items-center gap-2">
            <span v-for="tag in post.tags" :key="tag" class="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded-full">
              {{ tag }}
            </span>
          </div>
        </div>
      </header>

      <!-- 文章摘要 -->
      <div v-if="post.excerpt" class="bg-gray-50 dark:bg-gray-800 border-l-4 border-primary-500 p-4 mb-8 not-prose">
        <p class="text-gray-600 dark:text-gray-300">{{ post.excerpt }}</p>
      </div>

      <!-- 文章内容 -->
      <div class="markdown-body" v-html="renderedContent"></div>
    </article>

    <!-- 404 状态 -->
    <div v-else class="text-center py-12">
      <UIcon name="i-heroicons-exclamation-triangle" class="w-12 h-12 mx-auto text-gray-400 mb-4" />
      <h2 class="text-xl font-bold text-gray-900 dark:text-white mb-2">文章不存在</h2>
      <p class="text-gray-500 dark:text-gray-400 mb-4">该文章可能已被删除或尚未发布</p>
      <UButton to="/blog" color="primary">
        返回文章列表
      </UButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import { marked } from 'marked'
import type { Database } from '~/types/supabase'

type Post = Database['public']['Tables']['posts']['Row']
type Category = Database['public']['Tables']['categories']['Row']

const route = useRoute()
const loading = ref(true)
const post = ref<Post | null>(null)
const categories = ref<Category[]>([])

// 获取文章详情
const fetchPost = async () => {
  try {
    const client = useSupabaseClient<Database>()
    
    // 获取文章数据
    const { data: postData, error: postError } = await client
      .from('posts')
      .select('*')
      .eq('id', route.params.id)
      .single()

    if (postError) throw postError
    
    // 如果文章未发布且不是作者，则不显示
    if (!postData.published) {
      const user = useSupabaseUser()
      if (!user.value || user.value.id !== postData.author_id) {
        post.value = null
        return
      }
    }
    
    post.value = postData

    // 获取分类数据
    const { data: categoriesData, error: categoriesError } = await client
      .from('categories')
      .select('*')

    if (categoriesError) throw categoriesError
    categories.value = categoriesData
  } catch (error) {
    console.error('获取文章详情失败:', error)
    post.value = null
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

// 渲染 Markdown 内容
const renderedContent = computed(() => {
  if (!post.value?.content) return ''
  return marked(post.value.content)
})

// 在页面加载时获取数据
onMounted(() => {
  fetchPost()
})
</script>

<style>
.markdown-body {
  @apply text-gray-900 dark:text-gray-100;
}

.markdown-body h1,
.markdown-body h2,
.markdown-body h3,
.markdown-body h4,
.markdown-body h5,
.markdown-body h6 {
  @apply font-bold text-gray-900 dark:text-white mt-8 mb-4;
}

.markdown-body h1 { @apply text-3xl; }
.markdown-body h2 { @apply text-2xl; }
.markdown-body h3 { @apply text-xl; }
.markdown-body h4 { @apply text-lg; }
.markdown-body h5,
.markdown-body h6 { @apply text-base; }

.markdown-body p {
  @apply mb-4 leading-relaxed;
}

.markdown-body a {
  @apply text-primary-500 hover:underline;
}

.markdown-body ul,
.markdown-body ol {
  @apply mb-4 pl-6;
}

.markdown-body ul { @apply list-disc; }
.markdown-body ol { @apply list-decimal; }

.markdown-body code {
  @apply bg-gray-100 dark:bg-gray-800 px-1 py-0.5 rounded text-sm font-mono;
}

.markdown-body pre {
  @apply bg-gray-100 dark:bg-gray-800 p-4 rounded-lg mb-4 overflow-x-auto;
}

.markdown-body pre code {
  @apply bg-transparent p-0;
}

.markdown-body blockquote {
  @apply border-l-4 border-gray-200 dark:border-gray-700 pl-4 italic my-4;
}

.markdown-body img {
  @apply max-w-full rounded-lg my-4;
}

.markdown-body hr {
  @apply my-8 border-gray-200 dark:border-gray-700;
}

.markdown-body table {
  @apply w-full mb-4 border-collapse;
}

.markdown-body th,
.markdown-body td {
  @apply border border-gray-200 dark:border-gray-700 px-4 py-2;
}

.markdown-body th {
  @apply bg-gray-50 dark:bg-gray-800;
}
</style> 