<template>
  <div>
    <div class="flex justify-between items-center mb-8">
      <h1 class="text-3xl font-bold text-gray-900">Blog Posts</h1>
      <UButton
        to="/admin/posts/new"
        color="primary"
        variant="solid"
        icon="i-heroicons-plus"
      >
        New Post
      </UButton>
    </div>

    <div class="space-y-6">
      <div v-for="i in 5" :key="i" class="bg-white rounded-lg shadow p-6">
        <div class="flex justify-between items-start">
          <div>
            <h2 class="text-xl font-semibold text-gray-900 mb-2">
              Sample Blog Post Title
            </h2>
            <p class="text-gray-600 mb-4">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
            </p>
            <div class="flex items-center space-x-4 text-sm text-gray-500">
              <span>March 1, 2024</span>
              <span>•</span>
              <span>5 min read</span>
            </div>
          </div>
          <div class="flex space-x-2">
            <UButton
              to="/posts/1"
              color="gray"
              variant="ghost"
              icon="i-heroicons-eye"
            >
              View
            </UButton>
            <UButton
              to="/admin/posts/1/edit"
              color="primary"
              variant="ghost"
              icon="i-heroicons-pencil"
            >
              Edit
            </UButton>
            <UButton
              color="red"
              variant="ghost"
              icon="i-heroicons-trash"
            >
              Delete
            </UButton>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'default'
})
</script> 