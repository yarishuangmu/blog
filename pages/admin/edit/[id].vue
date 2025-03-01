<template>
  <div class="max-w-3xl mx-auto">
    <!-- 加载状态 -->
    <div v-if="loading" class="flex justify-center py-12">
      <UIcon name="i-heroicons-arrow-path" class="w-8 h-8 animate-spin text-gray-400" />
    </div>

    <template v-else>
      <div class="flex justify-between items-center mb-8">
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white">编辑文章</h1>
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
            :loading="saving"
            @click="updatePost"
          >
            保存文章
          </UButton>
        </div>
      </div>

      <form @submit.prevent="updatePost" class="space-y-6">
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
              label="发布这篇文章"
            />
          </UFormGroup>
        </div>
      </form>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useSupabaseClient } from '#imports'
import { useToast } from '@/composables/useToast'
import { useAuthStore } from '@/stores/auth'
import type { Database } from '~/types/supabase'
import type { PostForm } from '~/types'

definePageMeta({
  layout: 'default',
  middleware: 'auth'
})

const route = useRoute()
const router = useRouter()
const { showToast } = useToast()
const authStore = useAuthStore()

const loading = ref(true)
const saving = ref(false)
const loadingCategories = ref(true)
const categories = ref<Database['public']['Tables']['categories']['Row'][]>([])

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

// 获取文章数据
const fetchPost = async () => {
  try {
    const client = useSupabaseClient<Database>()
    const { data, error } = await client
      .from('posts')
      .select('*')
      .eq('id', route.params.id)
      .single()

    if (error) throw error

    // 检查是否有权限编辑
    if (data.author_id !== authStore.user?.id) {
      showToast('您没有权限编辑这篇文章', 'error')
      router.push('/admin/posts')
      return
    }

    // 转换数据格式
    post.value = {
      ...data,
      tags: data.tags?.join(',') || ''
    }
  } catch (error: any) {
    console.error('获取文章失败:', error)
    showToast('获取文章失败，请重试', 'error')
    router.push('/admin/posts')
  } finally {
    loading.value = false
  }
}

// 更新文章
const updatePost = async () => {
  if (!post.value.title || !post.value.content || !post.value.category_id) {
    showToast('请填写必要的文章信息', 'warning')
    return
  }

  saving.value = true
  
  try {
    const client = useSupabaseClient<Database>()
    
    // 处理标签
    const tags = post.value.tags
      ? post.value.tags.split(',').map(tag => tag.trim())
      : []

    // 更新文章数据
    const { error } = await client
      .from('posts')
      .update({
        title: post.value.title,
        content: post.value.content,
        excerpt: post.value.excerpt || '',
        category_id: post.value.category_id,
        tags,
        published: post.value.published,
        updated_at: new Date().toISOString()
      })
      .eq('id', route.params.id)

    if (error) throw error

    showToast('文章更新成功！', 'success')
    router.push('/admin/posts')
  } catch (error: any) {
    console.error('更新文章失败:', error)
    showToast(error.message || '更新文章失败，请重试', 'error')
  } finally {
    saving.value = false
  }
}

// 在页面加载时获取数据
onMounted(async () => {
  await Promise.all([fetchCategories(), fetchPost()])
})
</script> 