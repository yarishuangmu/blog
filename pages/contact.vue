<template>
  <div class="max-w-4xl mx-auto px-4 py-12">
    <h1 class="text-4xl font-bold text-gray-900 dark:text-white mb-8">
      联系我
    </h1>

    <!-- 社交媒体链接 -->
    <div class="mb-16">
      <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-6">
        社交媒体
      </h2>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <a
          v-for="social in socials"
          :key="social.name"
          :href="social.url"
          target="_blank"
          rel="noopener noreferrer"
          class="flex items-center gap-4 p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-md transition-shadow"
        >
          <UIcon
            :name="social.icon"
            class="w-8 h-8 text-primary-500"
          />
          <div>
            <h3 class="font-medium text-gray-900 dark:text-white">
              {{ social.name }}
            </h3>
            <p class="text-sm text-gray-500 dark:text-gray-400">
              {{ social.description }}
            </p>
          </div>
        </a>
      </div>
    </div>

    <!-- 联系表单 -->
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
      <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-6">
        发送消息
      </h2>
      <form @submit.prevent="handleSubmit" class="space-y-6">
        <div>
          <UFormGroup label="姓名">
            <UInput
              v-model="form.name"
              placeholder="请输入您的姓名"
              required
            />
          </UFormGroup>
        </div>

        <div>
          <UFormGroup label="邮箱">
            <UInput
              v-model="form.email"
              type="email"
              placeholder="请输入您的邮箱"
              required
            />
          </UFormGroup>
        </div>

        <div>
          <UFormGroup label="主题">
            <UInput
              v-model="form.subject"
              placeholder="请输入消息主题"
              required
            />
          </UFormGroup>
        </div>

        <div>
          <UFormGroup label="消息内容">
            <UTextarea
              v-model="form.message"
              placeholder="请输入您的消息内容"
              :rows="6"
              required
            />
          </UFormGroup>
        </div>

        <div>
          <UButton
            type="submit"
            color="primary"
            :loading="loading"
            block
          >
            发送消息
          </UButton>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useToast } from '@/composables/useToast'

definePageMeta({
  layout: 'default'
})

// 社交媒体数据
const socials = [
  {
    name: 'GitHub',
    icon: 'i-logos-github-icon',
    url: 'https://github.com/yourusername',
    description: '查看我的开源项目'
  },
  {
    name: '微信',
    icon: 'i-logos-wechat',
    url: '#',
    description: '添加我的微信'
  },
  {
    name: '邮箱',
    icon: 'i-heroicons-envelope',
    url: 'mailto:your.email@example.com',
    description: '发送邮件给我'
  }
]

// 表单数据
const form = reactive({
  name: '',
  email: '',
  subject: '',
  message: ''
})

const loading = ref(false)
const { showToast } = useToast()

// 处理表单提交
const handleSubmit = async () => {
  loading.value = true
  
  try {
    // 这里添加发送消息的逻辑
    // 可以使用 Supabase 或其他服务来存储消息
    await new Promise(resolve => setTimeout(resolve, 1000)) // 模拟请求
    
    showToast('消息已发送，我会尽快回复您', 'success')
    // 重置表单
    form.name = ''
    form.email = ''
    form.subject = ''
    form.message = ''
  } catch (error) {
    showToast('发送失败，请稍后重试', 'error')
  } finally {
    loading.value = false
  }
}
</script> 