<template>
  <div>
    <article class="max-w-3xl mx-auto">
      <header class="mb-8">
        <h1 class="text-4xl font-bold text-gray-900 mb-4">
          Sample Blog Post Title
        </h1>
        <div class="flex items-center space-x-4 text-gray-500">
          <div class="flex items-center space-x-2">
            <UAvatar
              src="https://avatars.githubusercontent.com/u/739984?v=4"
              alt="Author"
              size="sm"
            />
            <span>John Doe</span>
          </div>
          <span>•</span>
          <span>March 1, 2024</span>
          <span>•</span>
          <span>5 min read</span>
        </div>
      </header>

      <div class="prose prose-lg max-w-none">
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
        </p>
        <p>
          Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
        </p>
      </div>

      <div class="mt-12 pt-8 border-t">
        <h2 class="text-2xl font-bold text-gray-900 mb-6">Comments</h2>
        <div class="space-y-6">
          <div v-for="i in 3" :key="i" class="flex space-x-4">
            <UAvatar
              src="https://avatars.githubusercontent.com/u/739984?v=4"
              alt="Commenter"
              size="sm"
            />
            <div>
              <div class="flex items-center space-x-2 mb-1">
                <span class="font-medium text-gray-900">Jane Smith</span>
                <span class="text-gray-500">•</span>
                <span class="text-sm text-gray-500">2 hours ago</span>
              </div>
              <p class="text-gray-600">
                Great post! Thanks for sharing these insights.
              </p>
            </div>
          </div>
        </div>

        <form class="mt-8">
          <UTextarea
            placeholder="Write a comment..."
            rows="3"
            class="mb-4"
          />
          <UButton
            type="submit"
            color="primary"
            variant="solid"
          >
            Post Comment
          </UButton>
        </form>
      </div>
    </article>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'default'
})

const route = useRoute()
const id = route.params.id
</script> 