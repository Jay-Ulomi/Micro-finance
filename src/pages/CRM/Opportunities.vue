<template>
  <div class="space-y-6">
    <!-- Page Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Opportunities</h1>
        <p class="text-sm text-gray-600 mt-1">Track sales opportunities and revenue potential</p>
      </div>
      <div class="flex space-x-3">
        <button @click="exportOpportunities" class="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors">
          <ArrowDownTrayIcon class="w-4 h-4 mr-2" />
          Export
        </button>
        <button @click="createOpportunity" class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
          <PlusIcon class="w-4 h-4 mr-2" />
          New Opportunity
        </button>
      </div>
    </div>

    <!-- Opportunity Stats -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div class="flex items-center">
          <div class="flex-1">
            <p class="text-sm font-medium text-gray-600">Total Value</p>
            <p class="mt-2 text-3xl font-bold text-gray-900">TZS 45.2M</p>
          </div>
          <CurrencyDollarIcon class="w-8 h-8 text-green-600" />
        </div>
      </div>
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div class="flex items-center">
          <div class="flex-1">
            <p class="text-sm font-medium text-gray-600">Active Opportunities</p>
            <p class="mt-2 text-3xl font-bold text-gray-900">34</p>
          </div>
          <ChartBarIcon class="w-8 h-8 text-blue-600" />
        </div>
      </div>
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div class="flex items-center">
          <div class="flex-1">
            <p class="text-sm font-medium text-gray-600">Win Rate</p>
            <p class="mt-2 text-3xl font-bold text-gray-900">72%</p>
          </div>
          <TrophyIcon class="w-8 h-8 text-yellow-600" />
        </div>
      </div>
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div class="flex items-center">
          <div class="flex-1">
            <p class="text-sm font-medium text-gray-600">Avg Deal Size</p>
            <p class="mt-2 text-3xl font-bold text-gray-900">TZS 850K</p>
          </div>
          <PresentationChartBarIcon class="w-8 h-8 text-purple-600" />
        </div>
      </div>
    </div>

    <!-- Opportunities Placeholder -->
    <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-12">
      <div class="text-center">
        <PresentationChartLineIcon class="mx-auto h-16 w-16 text-gray-400" />
        <h3 class="mt-4 text-xl font-medium text-gray-900">Opportunity Pipeline</h3>
        <p class="mt-2 text-sm text-gray-600 max-w-sm mx-auto">
          Sales opportunity tracking, pipeline management, and revenue forecasting features will be implemented here.
        </p>
        <div class="mt-6 flex justify-center space-x-4">
          <button @click="goToLeads" class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            View Leads
          </button>
          <button @click="goToDashboard" class="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors">
            Dashboard
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
  ArrowDownTrayIcon,
  CurrencyDollarIcon,
  ChartBarIcon,
  TrophyIcon,
  PresentationChartBarIcon,
  PresentationChartLineIcon,
} from '@heroicons/vue/24/outline'

const router = useRouter()

const createOpportunity = () => {
  router.push('/crm/opportunities/add')
}

const exportOpportunities = () => {
  console.log('Exporting opportunities...')
}

const goToLeads = () => {
  router.push('/crm/leads')
}

const goToDashboard = () => {
  router.push('/crm')
}

defineOptions({
  name: "CRMOpportunities",
})
</script>