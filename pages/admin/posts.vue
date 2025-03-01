<template>
  <div class="max-w-6xl mx-auto px-4 py-8">
    <div class="flex justify-between items-center mb-8">
      <h1 class="text-3xl font-bold text-gray-900 dark:text-white">文章管理</h1>
      <UButton
        to="/admin/new"
        color="primary"
        icon="i-heroicons-plus"
      >
        新建文章
      </UButton>
    </div>

    <!-- 加载状态 -->
    <div v-if="loading" class="flex justify-center py-12">
      <UIcon name="i-heroicons-arrow-path" class="w-8 h-8 animate-spin text-gray-400" />
    </div>

    <!-- 文章列表 -->
    <div v-else>
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden">
        <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead class="bg-gray-50 dark:bg-gray-900">
            <tr>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                标题
              </th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                分类
              </th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                状态
              </th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                创建时间
              </th>
              <th scope="col" class="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                操作
              </th>
            </tr>
          </thead>
          <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            <tr v-for="post in posts" :key="post.id">
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm font-medium text-gray-900 dark:text-white">
                  {{ post.title }}
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-500 dark:text-gray-400">
                  {{ getCategoryName(post.category_id) }}
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span
                  class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
                  :class="post.published ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'"
                >
                  {{ post.published ? '已发布' : '草稿' }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                {{ formatDate(post.created_at) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-right text-sm">
                <div class="flex justify-end gap-2">
                  <UButton
                    :to="'/blog/' + post.id"
                    color="gray"
                    variant="ghost"
                    icon="i-heroicons-eye"
                    size="xs"
                  >
                    查看
                  </UButton>
                  <UButton
                    :to="'/admin/edit/' + post.id"
                    color="primary"
                    variant="ghost"
                    icon="i-heroicons-pencil-square"
                    size="xs"
                  >
                    编辑
                  </UButton>
                  <UButton
                    color="red"
                    variant="ghost"
                    icon="i-heroicons-trash"
                    size="xs"
                    :loading="deletingId === post.id"
                    @click="confirmDelete(post)"
                  >
                    删除
                  </UButton>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- 空状态 -->
      <div v-if="!posts.length" class="text-center py-12">
        <UIcon name="i-heroicons-document-text" class="w-12 h-12 mx-auto text-gray-400 mb-4" />
        <p class="text-gray-500 dark:text-gray-400">暂无文章</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useSupabaseClient } from '#imports'
import { useToast } from '@/composables/useToast'
import type { Database } from '~/types/supabase'

type Post = Database['public']['Tables']['posts']['Row']
type Category = Database['public']['Tables']['categories']['Row']

definePageMeta({
  layout: 'default',
  middleware: 'auth'
})

const { showToast } = useToast()
const loading = ref(true)
const posts = ref<Post[]>([])
const categories = ref<Category[]>([])
const deletingId = ref<string | null>(null)

// 获取文章列表
const fetchPosts = async () => {
  try {
    const client = useSupabaseClient<Database>()
    
    // 获取文章数据
    const { data: postsData, error: postsError } = await client
      .from('posts')
      .select('*')
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
    showToast('获取文章列表失败，请刷新重试', 'error')
  } finally {
    loading.value = false
  }
}

// 确认删除
const confirmDelete = async (post: Post) => {
  if (!window.confirm('确定要删除文章 "' + post.title + '" 吗？')) return
  
  deletingId.value = post.id
  try {
    const client = useSupabaseClient<Database>()
    const { error } = await client
      .from('posts')
      .delete()
      .eq('id', post.id)

    if (error) throw error

    showToast('文章删除成功', 'success')
    posts.value = posts.value.filter(p => p.id !== post.id)
  } catch (error) {
    console.error('删除文章失败:', error)
    showToast('删除文章失败，请重试', 'error')
  } finally {
    deletingId.value = null
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

// 在页面加载时获取数据
onMounted(() => {
  fetchPosts()
})
</script> 