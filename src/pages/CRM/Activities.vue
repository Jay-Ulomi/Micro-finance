<template>
  <div class="space-y-6">
    <!-- Page Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Activities</h1>
        <p class="text-sm text-gray-600 mt-1">Track customer interactions and engagement history</p>
      </div>
      <div class="flex space-x-3">
        <button @click="exportActivities" class="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors">
          <ArrowDownTrayIcon class="w-4 h-4 mr-2" />
          Export
        </button>
        <button @click="logActivity" class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
          <PlusIcon class="w-4 h-4 mr-2" />
          Log Activity
        </button>
      </div>
    </div>

    <!-- Activity Statistics -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div class="flex items-center">
          <div class="flex-1">
            <p class="text-sm font-medium text-gray-600">Today's Activities</p>
            <p class="mt-2 text-3xl font-bold text-gray-900">{{ stats.today }}</p>
            <p class="mt-2 text-sm text-green-600">↑ {{ stats.todayGrowth }}% from yesterday</p>
          </div>
          <div class="ml-4">
            <div class="p-3 bg-blue-100 rounded-lg">
              <ClipboardDocumentListIcon class="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div class="flex items-center">
          <div class="flex-1">
            <p class="text-sm font-medium text-gray-600">This Week</p>
            <p class="mt-2 text-3xl font-bold text-gray-900">{{ stats.week }}</p>
            <p class="mt-2 text-sm text-blue-600">{{ stats.weekAvg }} avg per day</p>
          </div>
          <div class="ml-4">
            <div class="p-3 bg-green-100 rounded-lg">
              <CalendarIcon class="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div class="flex items-center">
          <div class="flex-1">
            <p class="text-sm font-medium text-gray-600">Pending Follow-ups</p>
            <p class="mt-2 text-3xl font-bold text-gray-900">{{ stats.pending }}</p>
            <p class="mt-2 text-sm text-red-600">{{ stats.overdue }} overdue</p>
          </div>
          <div class="ml-4">
            <div class="p-3 bg-yellow-100 rounded-lg">
              <ClockIcon class="w-6 h-6 text-yellow-600" />
            </div>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div class="flex items-center">
          <div class="flex-1">
            <p class="text-sm font-medium text-gray-600">Response Rate</p>
            <p class="mt-2 text-3xl font-bold text-gray-900">{{ stats.responseRate }}%</p>
            <p class="mt-2 text-sm text-green-600">Above target</p>
          </div>
          <div class="ml-4">
            <div class="p-3 bg-purple-100 rounded-lg">
              <ChartBarIcon class="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Filters -->
    <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h2 class="text-lg font-semibold text-gray-900 mb-4">Filter Activities</h2>
      
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <label for="activityType" class="form-label">Activity Type</label>
          <select id="activityType" v-model="filters.type" class="form-input">
            <option value="">All Types</option>
            <option value="call">Phone Call</option>
            <option value="email">Email</option>
            <option value="meeting">Meeting</option>
            <option value="note">Note</option>
            <option value="task">Task</option>
            <option value="sms">SMS</option>
          </select>
        </div>

        <div>
          <label for="dateRange" class="form-label">Date Range</label>
          <select id="dateRange" v-model="filters.dateRange" class="form-input">
            <option value="">All Time</option>
            <option value="today">Today</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="quarter">This Quarter</option>
          </select>
        </div>

        <div>
          <label for="assignedTo" class="form-label">Staff Member</label>
          <select id="assignedTo" v-model="filters.assignedTo" class="form-input">
            <option value="">All Staff</option>
            <option value="me">My Activities</option>
            <option v-for="staff in staffMembers" :key="staff.id" :value="staff.id">
              {{ staff.name }}
            </option>
          </select>
        </div>

        <div>
          <label for="search" class="form-label">Search</label>
          <div class="relative">
            <MagnifyingGlassIcon class="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              id="search"
              v-model="searchQuery"
              type="text"
              placeholder="Search activities..."
              class="form-input pl-10"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- Activities Timeline -->
    <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h2 class="text-lg font-semibold text-gray-900 mb-6">Activity Timeline</h2>
      
      <div class="space-y-6">
        <div v-for="activity in paginatedActivities" :key="activity.id" class="relative">
          <!-- Timeline line -->
          <div v-if="activity.id !== paginatedActivities[paginatedActivities.length - 1].id" 
               class="absolute left-4 top-12 h-full w-0.5 bg-gray-200"></div>
          
          <div class="flex items-start space-x-4">
            <!-- Activity Icon -->
            <div :class="getActivityIcon(activity.type).bgColor" class="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center relative z-10">
              <component :is="getActivityIcon(activity.type).icon" class="w-4 h-4" :class="getActivityIcon(activity.type).color" />
            </div>
            
            <!-- Activity Content -->
            <div class="flex-1 min-w-0">
              <div class="flex items-start justify-between">
                <div class="flex-1">
                  <p class="text-sm font-medium text-gray-900">{{ activity.title }}</p>
                  <p class="text-xs text-gray-600 mt-1">{{ activity.description }}</p>
                  
                  <!-- Customer/Contact Info -->
                  <div class="mt-2 flex items-center space-x-4">
                    <div class="flex items-center text-xs text-gray-500">
                      <UserIcon class="w-3 h-3 mr-1" />
                      {{ activity.customer }}
                    </div>
                    <div class="flex items-center text-xs text-gray-500">
                      <ClockIcon class="w-3 h-3 mr-1" />
                      {{ formatDateTime(activity.timestamp) }}
                    </div>
                    <div class="flex items-center text-xs text-gray-500">
                      <UserCircleIcon class="w-3 h-3 mr-1" />
                      {{ activity.staff }}
                    </div>
                  </div>

                  <!-- Activity Metadata -->
                  <div v-if="activity.metadata" class="mt-2 p-2 bg-gray-50 rounded text-xs text-gray-600">
                    <div v-if="activity.type === 'call'">
                      Duration: {{ activity.metadata.duration }} | 
                      Status: {{ activity.metadata.status }}
                    </div>
                    <div v-else-if="activity.type === 'email'">
                      Subject: {{ activity.metadata.subject }}
                    </div>
                    <div v-else-if="activity.type === 'meeting'">
                      Location: {{ activity.metadata.location }} | 
                      Duration: {{ activity.metadata.duration }}
                    </div>
                  </div>
                </div>
                
                <!-- Action Menu -->
                <div class="flex items-center space-x-2">
                  <span :class="getPriorityBadge(activity.priority)">
                    {{ activity.priority }}
                  </span>
                  <button @click="editActivity(activity.id)" class="text-blue-600 hover:text-blue-800">
                    <PencilIcon class="w-4 h-4" />
                  </button>
                </div>
              </div>

              <!-- Follow-up Actions -->
              <div v-if="activity.followUp" class="mt-3 p-3 bg-yellow-50 border-l-4 border-yellow-400">
                <div class="flex items-center justify-between">
                  <div>
                    <p class="text-sm font-medium text-yellow-800">Follow-up Required</p>
                    <p class="text-xs text-yellow-600">{{ activity.followUp.description }}</p>
                    <p class="text-xs text-yellow-600">Due: {{ formatDate(activity.followUp.dueDate) }}</p>
                  </div>
                  <button @click="completeFollowUp(activity.id)" class="text-xs px-3 py-1 bg-yellow-600 text-white rounded hover:bg-yellow-700">
                    Mark Complete
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Load More / Pagination -->
      <div class="mt-6 pt-6 border-t border-gray-200">
        <div class="flex items-center justify-between">
          <div class="text-sm text-gray-500">
            Showing {{ startIndex }} to {{ endIndex }} of {{ totalActivities }} activities
          </div>
          <div class="flex items-center space-x-2">
            <button
              @click="loadMore"
              v-if="hasMore"
              class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Load More Activities
            </button>
            <div v-if="!hasMore" class="text-sm text-gray-500">
              All activities loaded
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import {
  PlusIcon,
  ArrowDownTrayIcon,
  MagnifyingGlassIcon,
  ClipboardDocumentListIcon,
  CalendarIcon,
  ClockIcon,
  ChartBarIcon,
  PhoneIcon,
  EnvelopeIcon,
  UsersIcon,
  DocumentTextIcon,
  ChatBubbleLeftIcon,
  UserIcon,
  UserCircleIcon,
  PencilIcon,
} from '@heroicons/vue/24/outline'

const router = useRouter()

// Reactive data
const searchQuery = ref('')
const currentPage = ref(1)
const itemsPerPage = ref(10)

const filters = ref({
  type: '',
  dateRange: '',
  assignedTo: ''
})

const stats = ref({
  today: 28,
  todayGrowth: 15,
  week: 156,
  weekAvg: 22,
  pending: 12,
  overdue: 3,
  responseRate: 85
})

const staffMembers = ref([
  { id: 'staff1', name: 'Alice Mkamba' },
  { id: 'staff2', name: 'James Mwenda' },
  { id: 'staff3', name: 'Grace Ndege' },
  { id: 'staff4', name: 'Peter Kimaro' }
])

const activities = ref([
  {
    id: 'A001',
    type: 'call',
    title: 'Follow-up call with John Doe',
    description: 'Discussed loan application status and next steps',
    customer: 'John Doe - ABC Trading Ltd',
    staff: 'Alice Mkamba',
    timestamp: new Date(),
    priority: 'high',
    metadata: {
      duration: '15 mins',
      status: 'Successful'
    },
    followUp: {
      description: 'Send loan documents for review',
      dueDate: new Date(Date.now() + 86400000)
    }
  },
  {
    id: 'A002',
    type: 'email',
    title: 'Welcome email sent to new customer',
    description: 'Sent welcome package and account setup instructions',
    customer: 'Jane Smith',
    staff: 'James Mwenda',
    timestamp: new Date(Date.now() - 3600000),
    priority: 'medium',
    metadata: {
      subject: 'Welcome to Our Services - Next Steps'
    },
    followUp: null
  },
  {
    id: 'A003',
    type: 'meeting',
    title: 'Business consultation meeting',
    description: 'Discussed business loan requirements and eligibility',
    customer: 'Michael Johnson - Tech Solutions',
    staff: 'Grace Ndege',
    timestamp: new Date(Date.now() - 7200000),
    priority: 'high',
    metadata: {
      location: 'Main Office',
      duration: '45 mins'
    },
    followUp: {
      description: 'Prepare loan proposal document',
      dueDate: new Date(Date.now() + 172800000)
    }
  },
  {
    id: 'A004',
    type: 'note',
    title: 'Customer inquiry note',
    description: 'Customer asked about savings account interest rates',
    customer: 'Sarah Williams',
    staff: 'Peter Kimaro',
    timestamp: new Date(Date.now() - 10800000),
    priority: 'low',
    metadata: null,
    followUp: null
  },
  {
    id: 'A005',
    type: 'sms',
    title: 'Payment reminder sent',
    description: 'Sent SMS reminder for upcoming loan payment',
    customer: 'Robert Brown - Brown Enterprises',
    staff: 'Alice Mkamba',
    timestamp: new Date(Date.now() - 14400000),
    priority: 'medium',
    metadata: {
      message: 'Your loan payment of TZS 50,000 is due tomorrow'
    },
    followUp: null
  }
])

// Computed properties
const filteredActivities = computed(() => {
  let result = [...activities.value]

  // Apply search
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    result = result.filter(activity =>
      activity.title.toLowerCase().includes(query) ||
      activity.description.toLowerCase().includes(query) ||
      activity.customer.toLowerCase().includes(query)
    )
  }

  // Apply filters
  if (filters.value.type) {
    result = result.filter(activity => activity.type === filters.value.type)
  }

  if (filters.value.assignedTo) {
    if (filters.value.assignedTo === 'me') {
      result = result.filter(activity => activity.staff === 'Current User')
    } else {
      const staff = staffMembers.value.find(s => s.id === filters.value.assignedTo)
      if (staff) {
        result = result.filter(activity => activity.staff === staff.name)
      }
    }
  }

  // Apply date range filter
  if (filters.value.dateRange) {
    const now = new Date()
    const filterDate = new Date()

    switch (filters.value.dateRange) {
      case 'today':
        filterDate.setHours(0, 0, 0, 0)
        result = result.filter(activity => activity.timestamp >= filterDate)
        break
      case 'week':
        filterDate.setDate(now.getDate() - 7)
        result = result.filter(activity => activity.timestamp >= filterDate)
        break
      case 'month':
        filterDate.setMonth(now.getMonth() - 1)
        result = result.filter(activity => activity.timestamp >= filterDate)
        break
    }
  }

  return result.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
})

const totalActivities = computed(() => filteredActivities.value.length)
const startIndex = computed(() => (currentPage.value - 1) * itemsPerPage.value + 1)
const endIndex = computed(() => Math.min(currentPage.value * itemsPerPage.value, totalActivities.value))
const hasMore = computed(() => endIndex.value < totalActivities.value)

const paginatedActivities = computed(() => {
  const end = currentPage.value * itemsPerPage.value
  return filteredActivities.value.slice(0, end)
})

// Methods
const getActivityIcon = (type: string) => {
  const icons = {
    call: { icon: PhoneIcon, color: 'text-blue-600', bgColor: 'bg-blue-100' },
    email: { icon: EnvelopeIcon, color: 'text-green-600', bgColor: 'bg-green-100' },
    meeting: { icon: UsersIcon, color: 'text-purple-600', bgColor: 'bg-purple-100' },
    note: { icon: DocumentTextIcon, color: 'text-yellow-600', bgColor: 'bg-yellow-100' },
    sms: { icon: ChatBubbleLeftIcon, color: 'text-pink-600', bgColor: 'bg-pink-100' },
    task: { icon: ClipboardDocumentListIcon, color: 'text-gray-600', bgColor: 'bg-gray-100' }
  }
  return icons[type] || icons.note
}

const getPriorityBadge = (priority: string): string => {
  const badges = {
    high: 'px-2 py-1 text-xs font-medium text-red-700 bg-red-100 rounded-full',
    medium: 'px-2 py-1 text-xs font-medium text-yellow-700 bg-yellow-100 rounded-full',
    low: 'px-2 py-1 text-xs font-medium text-green-700 bg-green-100 rounded-full'
  }
  return badges[priority] || badges.medium
}

const formatDateTime = (date: Date): string => {
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  const minutes = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days = Math.floor(diff / 86400000)
  
  if (minutes < 60) return `${minutes} minutes ago`
  if (hours < 24) return `${hours} hours ago`
  if (days < 7) return `${days} days ago`
  
  return date.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const formatDate = (date: Date): string => {
  return date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
}

const logActivity = () => {
  router.push('/crm/activities/add')
}

const editActivity = (id: string) => {
  router.push(`/crm/activities/${id}/edit`)
}

const completeFollowUp = (activityId: string) => {
  const activity = activities.value.find(a => a.id === activityId)
  if (activity) {
    activity.followUp = null
  }
}

const exportActivities = () => {
  console.log('Exporting activities...')
}

const loadMore = () => {
  currentPage.value++
}

defineOptions({
  name: "CRMActivities",
})

// Initialize
onMounted(() => {
  // Load activities data
})
</script>

<style scoped>
/* Timeline styles */
.relative::before {
  content: '';
  position: absolute;
  left: 1rem;
  top: 2rem;
  bottom: -1rem;
  width: 2px;
  background-color: #e5e7eb;
  z-index: 1;
}

.relative:last-child::before {
  display: none;
}
</style>