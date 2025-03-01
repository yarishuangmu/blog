<template>
  <div>
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold text-gray-900 dark:text-white">文章管理</h1>
      <UButton
        to="/admin/new"
        color="primary"
        icon="i-heroicons-plus"
      >
        新建文章
      </UButton>
    </div>

    <!-- 文章列表 -->
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow">
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead class="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">标题</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">分类</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">状态</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">更新时间</th>
              <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">操作</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200 dark:divide-gray-600">
            <tr v-for="post in posts" :key="post.id" class="hover:bg-gray-50 dark:hover:bg-gray-700">
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm font-medium text-gray-900 dark:text-white">{{ post.title }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-500 dark:text-gray-400">{{ getCategoryName(post.category_id) }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span
                  class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
                  :class="post.published ? 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100' : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100'"
                >
                  {{ post.published ? '已发布' : '草稿' }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                {{ formatDate(post.updated_at) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <div class="flex justify-end gap-2">
                  <UButton
                    :to="'/admin/edit/' + post.id "
                    color="primary"
                    variant="ghost"
                    icon="i-heroicons-pencil-square"
                  >
                    编辑
                  </UButton>
                  <UButton
                    color="red"
                    variant="ghost"
                    icon="i-heroicons-trash"
                    @click="deletePost(post.id)"
                  >
                    删除
                  </UButton>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Post } from '~/types/supabase'
import { useToast } from '@/composables/useToast'

definePageMeta({
  layout: 'default',
  middleware: ['auth', 'admin']
})
const client = useSupabaseClient()
const toast = useToast()

// 获取文章列表
const posts = ref<Post[]>([])
const fetchPosts = async () => {
  try {
    const { data, error } = await client
      .from('posts')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw error
    posts.value = data
  } catch (error) {
    showToast('获取文章列表失败', 'error')
    console.error(error)
  }
}

// 删除文章
const deletePost = async (id: number) => {
  if (!window.confirm('确定要删除这篇文章吗？')) return

  try {
    const { error } = await client
      .from('posts')
      .delete()
      .eq('id', id)

    if (error) throw error
    
    showToast('文章已删除', 'success')
    await fetchPosts()
  } catch (error) {
    showToast('删除文章失败', 'error')
    console.error(error)
  }
}

// 获取分类名称
const categories = ref([])
const fetchCategories = async () => {
  try {
    const { data, error } = await client
      .from('categories')
      .select('*')

    if (error) throw error
    categories.value = data
  } catch (error) {
    console.error(error)
  }
}

const getCategoryName = (categoryId: string) => {
  const category = categories.value.find((c: any) => c.id === categoryId)
  return category ? category.name : ''
}

// 格式化日期
const formatDate = (dateStr: string) => {
  return new Date(dateStr).toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

// 初始化数据
onMounted(async () => {
  await Promise.all([fetchPosts(), fetchCategories()])
})
</script> 