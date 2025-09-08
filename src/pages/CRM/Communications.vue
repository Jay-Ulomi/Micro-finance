<template>
  <div class="space-y-6">
    <!-- Page Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Communications</h1>
        <p class="text-sm text-gray-600 mt-1">Manage email campaigns, SMS, and customer communications</p>
      </div>
      <div class="flex space-x-3">
        <button @click="addCommunication" class="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors">
          <PlusIcon class="w-4 h-4 mr-2" />
          Add Communication
        </button>
        <button @click="createCampaign" class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
          <PlusIcon class="w-4 h-4 mr-2" />
          New Campaign
        </button>
      </div>
    </div>

    <!-- Communication Stats -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div class="flex items-center">
          <div class="flex-1">
            <p class="text-sm font-medium text-gray-600">Emails Sent</p>
            <p class="mt-2 text-3xl font-bold text-gray-900">2,847</p>
          </div>
          <EnvelopeIcon class="w-8 h-8 text-blue-600" />
        </div>
      </div>
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div class="flex items-center">
          <div class="flex-1">
            <p class="text-sm font-medium text-gray-600">SMS Sent</p>
            <p class="mt-2 text-3xl font-bold text-gray-900">1,234</p>
          </div>
          <ChatBubbleLeftIcon class="w-8 h-8 text-green-600" />
        </div>
      </div>
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div class="flex items-center">
          <div class="flex-1">
            <p class="text-sm font-medium text-gray-600">Open Rate</p>
            <p class="mt-2 text-3xl font-bold text-gray-900">64%</p>
          </div>
          <EyeIcon class="w-8 h-8 text-purple-600" />
        </div>
      </div>
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div class="flex items-center">
          <div class="flex-1">
            <p class="text-sm font-medium text-gray-600">Click Rate</p>
            <p class="mt-2 text-3xl font-bold text-gray-900">28%</p>
          </div>
          <CursorArrowRaysIcon class="w-8 h-8 text-orange-600" />
        </div>
      </div>
    </div>

    <!-- Communications Placeholder -->
    <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-12">
      <div class="text-center">
        <ChatBubbleLeftRightIcon class="mx-auto h-16 w-16 text-gray-400" />
        <h3 class="mt-4 text-xl font-medium text-gray-900">Communication Center</h3>
        <p class="mt-2 text-sm text-gray-600 max-w-sm mx-auto">
          Email campaigns, SMS marketing, and communication tracking features will be implemented here.
        </p>
        <div class="mt-6 flex justify-center space-x-4">
          <button @click="goToContacts" class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            View Contacts
          </button>
          <button @click="goToActivities" class="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors">
            View Activities
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import {
  PlusIcon,
  EnvelopeIcon,
  ChatBubbleLeftIcon,
  ChatBubbleLeftRightIcon,
  EyeIcon,
  CursorArrowRaysIcon,
} from '@heroicons/vue/24/outline'

const router = useRouter()

const addCommunication = () => {
  router.push('/crm/communications/add')
}

const createCampaign = () => {
  router.push('/crm/communications/create')
}

const goToContacts = () => {
  router.push('/crm/contacts')
}

const goToActivities = () => {
  router.push('/crm/activities')
}

defineOptions({
  name: "CRMCommunications",
})
</script>