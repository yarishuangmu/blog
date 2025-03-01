<template>
  <NuxtLayout>
    <!-- 将 LanguageSwitcher 放置在左下角 -->
    <!-- <div class="fixed top-4 left-4 z-50">
      <LanguageSwitcher />
    </div> -->
    <NuxtLoadingIndicator />
    <NuxtPage />
  </NuxtLayout>
</template>

<script setup lang="ts">
import { useAuthStore } from '~/stores/auth'

const authStore = useAuthStore()

// Initial auth check
onMounted(async () => {
  await authStore.fetchUser()
})
</script>