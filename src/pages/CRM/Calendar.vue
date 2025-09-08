<template>
  <div class="space-y-6">
    <!-- Page Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">CRM Calendar</h1>
        <p class="text-sm text-gray-600 mt-1">Manage appointments, meetings, and follow-ups</p>
      </div>
      <div class="flex space-x-3">
        <button @click="syncCalendar" class="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors">
          <ArrowPathIcon class="w-4 h-4 mr-2" />
          Sync
        </button>
        <button @click="addEvent" class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
          <PlusIcon class="w-4 h-4 mr-2" />
          Add Event
        </button>
      </div>
    </div>

    <!-- Calendar Implementation Placeholder -->
    <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-12">
      <div class="text-center">
        <CalendarIcon class="mx-auto h-16 w-16 text-gray-400" />
        <h3 class="mt-4 text-xl font-medium text-gray-900">Calendar View</h3>
        <p class="mt-2 text-sm text-gray-600 max-w-sm mx-auto">
          Full calendar integration with appointments, meetings, and task scheduling will be implemented here.
        </p>
        <div class="mt-6">
          <button @click="goToTasks" class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            View Tasks Instead
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import {
  CalendarIcon,
  PlusIcon,
  ArrowPathIcon,
} from '@heroicons/vue/24/outline'

const router = useRouter()

const syncCalendar = () => {
  console.log('Syncing calendar...')
}

const addEvent = () => {
  router.push('/crm/calendar/create')
}

const goToTasks = () => {
  router.push('/crm/tasks')
}

defineOptions({
  name: "CRMCalendar",
})
</script>