<template>
  <div class="max-w-3xl mx-auto">
    <div class="flex justify-between items-center mb-8">
      <h1 class="text-3xl font-bold text-gray-900 dark:text-white">新建文章</h1>
      <div class="flex space-x-2">
        <UButton
          to="/admin/posts"
          color="gray"
          variant="ghost"
        >
          取消
        </UButton>
        <UButton
          color="primary"
          variant="solid"
          :loading="loading"
          @click="createPost"
        >
          发布文章
        </UButton>
      </div>
    </div>

    <form @submit.prevent="createPost" class="space-y-6">
      <div>
        <UFormGroup label="标题">
          <UInput
            v-model="post.title"
            placeholder="请输入文章标题"
            required
          />
        </UFormGroup>
      </div>

      <div class="grid grid-cols-2 gap-4">
        <UFormGroup label="分类">
          <USelect
            v-model="post.category_id"
            :options="categories"
            option-attribute="name"
            value-attribute="id"
            placeholder="选择文章分类"
            :loading="loadingCategories"
            :disabled="loadingCategories"
            required
          >
            <template #loading>
              <div class="flex items-center gap-2">
                <UIcon name="i-heroicons-arrow-path" class="animate-spin" />
                <span>加载分类中...</span>
              </div>
            </template>
            <template #empty>
              <div class="p-2 text-sm text-gray-500">
                暂无可用分类
              </div>
            </template>
          </USelect>
        </UFormGroup>

        <UFormGroup label="标签">
          <UInput
            v-model="post.tags"
            placeholder="使用逗号分隔多个标签"
          />
        </UFormGroup>
      </div>

      <div>
        <UFormGroup label="摘要">
          <UTextarea
            v-model="post.excerpt"
            placeholder="请输入文章摘要..."
            :rows="3"
          />
        </UFormGroup>
      </div>

      <div>
        <UFormGroup label="内容">
          <UTextarea
            v-model="post.content"
            placeholder="请输入文章内容..."
            :rows="10"
          />
        </UFormGroup>
      </div>

      <div>
        <UFormGroup>
          <UCheckbox
            v-model="post.published"
            label="立即发布这篇文章"
          />
        </UFormGroup>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { useToast } from '@/composables/useToast'
import { useAuthStore } from '@/stores/auth'
import type { Post, PostForm, Category } from '~/types'
import type { Database } from '~/types/supabase'

definePageMeta({
  layout: 'default',
  middleware: 'auth'
})

const { showToast } = useToast()
const authStore = useAuthStore()
const loading = ref(false)
const categories = ref<Category[]>([])
const loadingCategories = ref(true)

// 文章表单数据
const post = ref<PostForm>({
  title: '',
  content: '',
  excerpt: '',
  category_id: '',
  tags: '',
  published: false,
  author_id: authStore.user?.id
})

// 获取分类列表
const fetchCategories = async () => {
  try {
    const client = useSupabaseClient<Database>()
    const { data, error } = await client
      .from('categories')
      .select('*')
      .order('name')

    if (error) throw error

    categories.value = data
  } catch (error: any) {
    console.error('获取分类失败:', error)
    showToast('获取分类失败，请刷新页面重试', 'error')
  } finally {
    loadingCategories.value = false
  }
}

// 在页面加载时获取分类
onMounted(() => {
  fetchCategories()
})

// 创建文章
const createPost = async () => {
  if (loadingCategories.value) {
    showToast('正在加载分类信息，请稍候', 'warning')
    return
  }

  if (!categories.value.length) {
    showToast('没有可用的文章分类，请先创建分类', 'error')
    return
  }

  if (!post.value.title || !post.value.content || !post.value.category_id) {
    showToast('请填写必要的文章信息', 'warning')
    return
  }

  if (!authStore.user?.id) {
    showToast('请先登录', 'error')
    return
  }

  // 验证选择的分类是否存在
  const categoryExists = categories.value.some(cat => cat.id === post.value.category_id)
  if (!categoryExists) {
    showToast('请选择有效的文章分类', 'error')
    return
  }

  loading.value = true
  
  try {
    const client = useSupabaseClient<Database>()
    
    // 处理标签
    const tags = post.value.tags
      ? post.value.tags.split(',').map(tag => tag.trim())
      : []

    // 创建文章数据
    const postData: Database['public']['Tables']['posts']['Insert'] = {
      title: post.value.title,
      content: post.value.content,
      excerpt: post.value.excerpt || '',
      category_id: post.value.category_id,
      tags,
      published: post.value.published,
      author_id: authStore.user.id,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }

    // 创建文章
    const { data, error } = await client
      .from('posts')
      .insert(postData)
      .select()
      .single()

    if (error) throw error

    showToast('文章创建成功！', 'success')
    // 跳转到文章列表页
    navigateTo('posts')
  } catch (error: any) {
    console.error('创建文章失败:', error)
    showToast(error.message || '创建文章失败，请重试', 'error')
  } finally {
    loading.value = false
  }
}
</script> 