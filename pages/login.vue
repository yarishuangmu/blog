<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8">
      <div>
        <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Sign in to your account
        </h2>
        <p class="mt-2 text-center text-sm text-gray-600">
          Or
          <NuxtLink to="/register" class="font-medium text-primary-600 hover:text-primary-500">
            create a new account
          </NuxtLink>
        </p>
      </div>

      <form class="mt-8 space-y-6" @submit.prevent="handleLogin">
        <div class="rounded-md shadow-sm space-y-4">
          <div>
            <UFormGroup label="Email address">
              <UInput
                v-model="email"
                type="email"
                required
                placeholder="Enter your email"
              />
            </UFormGroup>
          </div>
          <div>
            <UFormGroup label="Password">
              <UInput
                v-model="password"
                type="password"
                required
                placeholder="Enter your password"
              />
            </UFormGroup>
          </div>
        </div>

        <div class="flex items-center justify-between">
          <UCheckbox
            v-model="rememberMe"
            label="Remember me"
          />
          <div class="text-sm">
            <NuxtLink to="/forgot-password" class="font-medium text-primary-600 hover:text-primary-500">
              Forgot your password?
            </NuxtLink>
          </div>
        </div>

        <div>
          <UButton
            type="submit"
            color="primary"
            variant="solid"
            block
            :loading="authStore.loading"
          >
            Sign in
          </UButton>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '~/stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const email = ref('')
const password = ref('')
const rememberMe = ref(false)

const handleLogin = async () => {
  await authStore.login(email.value, password.value)
  if (!authStore.error) {
    router.push('/')
  }
}
</script> 