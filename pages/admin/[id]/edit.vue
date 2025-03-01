<template>
  <div class="max-w-4xl mx-auto">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold text-gray-900 dark:text-white">
        {{ isNew ? '新建文章' : '编辑文章' }}
      </h1>
      <div class="flex gap-2">
        <UButton
          color="gray"
          variant="ghost"
          to="/admin/posts"
          icon="i-heroicons-arrow-left"
        >
          返回
        </UButton>
        <UButton
          color="primary"
          icon="i-heroicons-check"
          :loading="saving"
          @click="savePost"
        >
          保存
        </UButton>
      </div>
    </div>

    <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
      <form @submit.prevent="savePost">
        <!-- 标题 -->
        <div class="mb-6">
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            文章标题
          </label>
          <input
            v-model="form.title"
            type="text"
            class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600"
            required
          />
        </div>

        <!-- 分类 -->
        <div class="mb-6">
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            分类
          </label>
          <select
            v-model="form.category_id"
            class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600"
            required
          >
            <option v-for="category in categories" :key="category.id" :value="category.id">
              {{ category.name }}
            </option>
          </select>
        </div>

        <!-- 标签 -->
        <div class="mb-6">
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            标签（用逗号分隔）
          </label>
          <input
            v-model="tagsInput"
            type="text"
            class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600"
            placeholder="标签1, 标签2, 标签3"
          />
        </div>

        <!-- 摘要 -->
        <div class="mb-6">
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            摘要
          </label>
          <textarea
            v-model="form.excerpt"
            rows="3"
            class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600"
            required
          ></textarea>
        </div>

        <!-- 内容 -->
        <div class="mb-6">
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            内容
          </label>
          <textarea
            v-model="form.content"
            rows="12"
            class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600"
            required
          ></textarea>
        </div>

        <!-- 发布状态 -->
        <div class="flex items-center mb-6">
          <label class="flex items-center">
            <input
              v-model="form.published"
              type="checkbox"
              class="form-checkbox h-4 w-4 text-primary-500"
            />
            <span class="ml-2 text-sm text-gray-700 dark:text-gray-300">发布</span>
          </label>
        </div>
      </form>
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

const route = useRoute()
const router = useRouter()
const client = useSupabaseClient()
const user = useSupabaseUser()
const { showToast } = useToast()

const isNew = computed(() => route.params.id === 'new')
const saving = ref(false)

// 表单数据
const form = ref<Partial<Post>>({
  title: '',
  content: '',
  excerpt: '',
  category_id: '',
  tags: [],
  published: false,
  author_id: user.value?.id
})

// 标签输入
const tagsInput = ref('')
watch(tagsInput, (val) => {
  form.value.tags = val.split(',').map(tag => tag.trim()).filter(Boolean)
})

// 获取分类列表
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

// 获取文章数据
const fetchPost = async () => {
  if (isNew.value) return

  try {
    const { data, error } = await client
      .from('posts')
      .select('*')
      .eq('id', route.params.id)
      .single()

    if (error) throw error
    if (data) {
      form.value = data
      tagsInput.value = data.tags.join(', ')
    }
  } catch (error) {
    showToast('获取文章失败', 'error')
    console.error(error)
  }
}

// 保存文章
const savePost = async () => {
  saving.value = true

  try {
    const postData = {
      ...form.value,
      updated_at: new Date().toISOString()
    }

    const { error } = isNew.value
      ? await client.from('posts').insert(postData)
      : await client.from('posts').update(postData).eq('id', route.params.id)

    if (error) throw error

    showToast(isNew.value ? '文章已创建' : '文章已更新', 'success')
    router.push('/admin/posts')
  } catch (error) {
    showToast('保存文章失败', 'error')
    console.error(error)
  } finally {
    saving.value = false
  }
}

// 初始化数据
onMounted(async () => {
  await Promise.all([fetchCategories(), fetchPost()])
})
</script> 