<template>
  <TransitionGroup
    tag="div"
    enter-active-class="transition duration-300 ease-out"
    enter-from-class="transform translate-y-2 opacity-0"
    enter-to-class="transform translate-y-0 opacity-100"
    leave-active-class="transition duration-200 ease-in"
    leave-from-class="transform translate-y-0 opacity-100"
    leave-to-class="transform translate-y-2 opacity-0"
    class="fixed bottom-4 right-4 z-50 space-y-2"
  >
    <div
      v-for="toast in toasts"
      :key="toast.id"
      class="flex items-center gap-2 px-4 py-2 rounded-lg shadow-lg text-white"
      :class="toastClasses[toast.type]"
    >
      <UIcon
        :name="toastIcons[toast.type]"
        class="w-5 h-5"
      />
      <span>{{ toast.message }}</span>
      <button
        class="ml-2 hover:opacity-75"
        @click="removeToast(toast.id)"
      >
        <UIcon
          name="i-heroicons-x-mark"
          class="w-4 h-4"
        />
      </button>
    </div>
  </TransitionGroup>
</template>

<script setup lang="ts">
import { useToast } from '@/composables/useToast'

const { toasts, removeToast } = useToast()

const toastClasses = {
  success: 'bg-green-500',
  error: 'bg-red-500',
  info: 'bg-blue-500',
  warning: 'bg-yellow-500'
}

const toastIcons = {
  success: 'i-heroicons-check-circle',
  error: 'i-heroicons-x-circle',
  info: 'i-heroicons-information-circle',
  warning: 'i-heroicons-exclamation-triangle'
}
</script> 