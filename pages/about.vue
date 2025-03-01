<template>
  <div class="max-w-4xl mx-auto px-4 py-12">
    <!-- 个人介绍部分 -->
    <div class="mb-16">
      <h1 class="text-4xl font-bold text-gray-900 dark:text-white mb-6">
        关于我
      </h1>
      <div class="flex flex-col md:flex-row gap-8 items-start">
        <!-- 个人照片 -->
        <div class="w-full md:w-1/3">
          <div class="aspect-square rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800">
            <img
              src="/image/avatar.png"
              alt="个人照片"
              class="w-full h-full object-cover"
            >
          </div>
        </div>
        
        <!-- 个人简介 -->
        <div class="w-full md:w-2/3">
          <p class="text-lg text-gray-600 dark:text-gray-300 mb-4">
            你好！我是一名全栈开发者，热衷于探索新技术和分享技术见解。
          </p>
          <p class="text-lg text-gray-600 dark:text-gray-300 mb-4">
            我专注于 Web 开发，特别是在 Vue.js、Node.js 和云服务方面有丰富经验。
          </p>
          <p class="text-lg text-gray-600 dark:text-gray-300">
            通过这个博客，我希望能与更多的开发者交流，分享我的学习心得和技术积累。
          </p>
        </div>
      </div>
    </div>

    <!-- 技能部分 -->
    <div class="mb-16">
      <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-6">
        技术栈
      </h2>
      <div class="grid grid-cols-2 md:grid-cols-3 gap-4">
        <div
          v-for="skill in skills"
          :key="skill.name"
          class="p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm"
        >
          <div class="flex items-center gap-3">
            <UIcon
              :name="skill.icon"
              class="w-6 h-6 text-primary-500"
            />
            <span class="font-medium text-gray-900 dark:text-white">
              {{ skill.name }}
            </span>
          </div>
          <div class="mt-2">
            <div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div
                class="bg-primary-500 h-2 rounded-full"
                :style="{ width: skill.level + '%' }"
              />
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 工作经历 -->
    <div class="mb-16">
      <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-6">
        工作经历
      </h2>
      <div class="space-y-8">
        <div
          v-for="experience in experiences"
          :key="experience.company"
          class="relative pl-8 before:absolute before:left-0 before:top-2 before:w-3 before:h-3 before:bg-primary-500 before:rounded-full"
        >
          <h3 class="text-xl font-semibold text-gray-900 dark:text-white">
            {{ experience.position }}
          </h3>
          <p class="text-primary-600 dark:text-primary-400 mb-2">
            {{ experience.company }} | {{ experience.period }}
          </p>
          <p class="text-gray-600 dark:text-gray-300">
            {{ experience.description }}
          </p>
        </div>
      </div>
    </div>

    <!-- 教育背景 -->
    <div>
      <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-6">
        教育背景
      </h2>
      <div class="space-y-6">
        <div
          v-for="education in educations"
          :key="education.school"
          class="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm"
        >
          <h3 class="text-xl font-semibold text-gray-900 dark:text-white">
            {{ education.school }}
          </h3>
          <p class="text-primary-600 dark:text-primary-400 mb-2">
            {{ education.degree }} | {{ education.period }}
          </p>
          <p class="text-gray-600 dark:text-gray-300">
            {{ education.description }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'default'
})

// 技能数据
const skills = [
  { name: 'Vue.js', icon: 'i-logos-vue', level: 90 },
  { name: 'TypeScript', icon: 'i-logos-typescript-icon', level: 85 },
  { name: 'Node.js', icon: 'i-logos-nodejs-icon', level: 80 },
  { name: 'Nuxt.js', icon: 'i-logos-nuxt-icon', level: 85 },
  { name: 'TailwindCSS', icon: 'i-logos-tailwindcss-icon', level: 90 },
  { name: 'PostgreSQL', icon: 'i-logos-postgresql', level: 75 }
]

// 工作经历
const experiences = [
  {
    position: '高级前端开发工程师',
    company: '某科技公司',
    period: '2020 - 至今',
    description: '负责公司核心产品的前端架构设计和开发，带领团队完成多个重要项目。'
  },
  {
    position: '全栈开发工程师',
    company: '某互联网公司',
    period: '2018 - 2020',
    description: '参与开发企业级 Web 应用，负责前后端开发工作。'
  }
]

// 教育背景
const educations = [
  {
    school: '某大学',
    degree: '计算机科学与技术 学士',
    period: '2014 - 2018',
    description: '主修计算机科学与技术，参与多个创新项目，获得优秀毕业生称号。'
  }
]
</script> 