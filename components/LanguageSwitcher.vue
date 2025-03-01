<template>
  <div class="relative inline-block">
    <button
      @click="isOpen = !isOpen"
      class="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
    >
      <i class="i-heroicons-language text-lg"></i>
      <span>{{ currentLocaleName }}</span>
    </button>

    <!-- 下拉菜单 -->
    <div
      v-if="isOpen"
      class="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700"
    >
      <div class="py-1">
        <button
          v-for="item in availableLocales"
          :key="item.code"
          class="flex items-center gap-2 w-full px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700"
          :class="[
            item.code === locale ? 'text-primary-500 dark:text-primary-400' : 'text-gray-700 dark:text-gray-200'
          ]"
          @click="switchLanguage(item.code)"
        >
          <span>{{ item.name }}</span>
          <i v-if="item.code === locale" class="i-heroicons-check ml-auto"></i>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import { useSwitchLocalePath } from '#i18n'

// 控制下拉菜单显示
const isOpen = ref(false)

// 定义语言代码类型
type LocaleCode = 'en' | 'zh'

// 定义语言项的接口
interface LocaleItem {
  code: LocaleCode
  name: string
}

// 使用 i18n 和路由工具
const { locale, t } = useI18n()
const switchLocalePath = useSwitchLocalePath()
const router = useRouter()

// 定义可用的语言项
const availableLocales: LocaleItem[] = [
  { code: 'en', name: t('English') },
  { code: 'zh', name: t('中文') }
]

// 计算当前语言的名称
const currentLocaleName = computed(() => {
  const current = availableLocales.find(l => l.code === locale.value)
  return current?.name || t('common.english')
})

// 切换语言的方法
const switchLanguage = async (code: LocaleCode) => {
  locale.value = code // 更新当前语言
  const path = switchLocalePath(code) // 获取切换语言后的路径
  isOpen.value = false // 关闭下拉菜单
  if (path) {
    await router.push(path) // 跳转到新路径
  }
}

// 点击外部关闭下拉菜单
onMounted(() => {
  document.addEventListener('click', (e: MouseEvent) => {
    const target = e.target as HTMLElement
    if (!target.closest('.relative')) {
      isOpen.value = false
    }
  })
})
</script>