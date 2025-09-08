<template>
  <div class="space-y-6">
    <!-- Page Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">CRM Dashboard</h1>
        <p class="text-sm text-gray-600 mt-1">Customer relationship management overview</p>
      </div>
      <div class="flex space-x-3">
        <button @click="refreshData" class="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors">
          <ArrowPathIcon class="w-4 h-4 mr-2" />
          Refresh
        </button>
        <button @click="exportData" class="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors">
          <ArrowDownTrayIcon class="w-4 h-4 mr-2" />
          Export
        </button>
      </div>
    </div>

    <!-- Quick Stats -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <!-- Total Leads -->
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div class="flex items-center">
          <div class="flex-1">
            <p class="text-sm font-medium text-gray-600">Total Leads</p>
            <p class="mt-2 text-3xl font-bold text-gray-900">{{ stats.totalLeads }}</p>
            <p class="mt-2 text-sm">
              <span :class="stats.leadsGrowth >= 0 ? 'text-green-600' : 'text-red-600'">
                {{ stats.leadsGrowth >= 0 ? '↑' : '↓' }} {{ Math.abs(stats.leadsGrowth) }}%
              </span>
              <span class="text-gray-600 ml-1">from last month</span>
            </p>
          </div>
          <div class="ml-4">
            <div class="p-3 bg-blue-100 rounded-lg">
              <UserPlusIcon class="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>
      </div>

      <!-- Active Customers -->
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div class="flex items-center">
          <div class="flex-1">
            <p class="text-sm font-medium text-gray-600">Active Customers</p>
            <p class="mt-2 text-3xl font-bold text-gray-900">{{ stats.activeCustomers }}</p>
            <p class="mt-2 text-sm">
              <span class="text-green-600">{{ stats.conversionRate }}%</span>
              <span class="text-gray-600 ml-1">conversion rate</span>
            </p>
          </div>
          <div class="ml-4">
            <div class="p-3 bg-green-100 rounded-lg">
              <UsersIcon class="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>
      </div>

      <!-- Pending Tasks -->
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div class="flex items-center">
          <div class="flex-1">
            <p class="text-sm font-medium text-gray-600">Pending Tasks</p>
            <p class="mt-2 text-3xl font-bold text-gray-900">{{ stats.pendingTasks }}</p>
            <p class="mt-2 text-sm">
              <span class="text-yellow-600">{{ stats.dueTodayTasks }}</span>
              <span class="text-gray-600 ml-1">due today</span>
            </p>
          </div>
          <div class="ml-4">
            <div class="p-3 bg-yellow-100 rounded-lg">
              <ClipboardDocumentListIcon class="w-6 h-6 text-yellow-600" />
            </div>
          </div>
        </div>
      </div>

      <!-- Interactions Today -->
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div class="flex items-center">
          <div class="flex-1">
            <p class="text-sm font-medium text-gray-600">Interactions Today</p>
            <p class="mt-2 text-3xl font-bold text-gray-900">{{ stats.interactionsToday }}</p>
            <p class="mt-2 text-sm">
              <span class="text-purple-600">{{ stats.avgResponseTime }}</span>
              <span class="text-gray-600 ml-1">avg response</span>
            </p>
          </div>
          <div class="ml-4">
            <div class="p-3 bg-purple-100 rounded-lg">
              <ChatBubbleLeftRightIcon class="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Main Content Grid -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Lead Pipeline -->
      <div class="lg:col-span-2 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div class="mb-4">
          <h2 class="text-lg font-semibold text-gray-900">Lead Pipeline</h2>
          <p class="text-sm text-gray-600">Track leads through conversion stages</p>
        </div>
        
        <div class="space-y-4">
          <div v-for="stage in leadPipeline" :key="stage.name" class="relative">
            <div class="flex items-center justify-between mb-2">
              <span class="text-sm font-medium text-gray-700">{{ stage.name }}</span>
              <span class="text-sm text-gray-600">{{ stage.count }} leads</span>
            </div>
            <div class="overflow-hidden h-8 bg-gray-200 rounded-lg">
              <div 
                :style="`width: ${stage.percentage}%`" 
                :class="getStageColor(stage.name)"
                class="h-full rounded-lg transition-all duration-500 flex items-center justify-center"
              >
                <span class="text-xs font-medium text-white">{{ stage.percentage }}%</span>
              </div>
            </div>
          </div>
        </div>

        <div class="mt-6 pt-6 border-t border-gray-200">
          <div class="grid grid-cols-3 gap-4 text-center">
            <div>
              <p class="text-2xl font-bold text-gray-900">{{ pipelineMetrics.totalValue }}</p>
              <p class="text-xs text-gray-600">Pipeline Value</p>
            </div>
            <div>
              <p class="text-2xl font-bold text-gray-900">{{ pipelineMetrics.avgDealSize }}</p>
              <p class="text-xs text-gray-600">Avg Deal Size</p>
            </div>
            <div>
              <p class="text-2xl font-bold text-gray-900">{{ pipelineMetrics.winRate }}%</p>
              <p class="text-xs text-gray-600">Win Rate</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Recent Activities -->
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div class="mb-4">
          <h2 class="text-lg font-semibold text-gray-900">Recent Activities</h2>
          <p class="text-sm text-gray-600">Latest customer interactions</p>
        </div>
        
        <div class="space-y-4 max-h-96 overflow-y-auto">
          <div v-for="activity in recentActivities" :key="activity.id" class="flex items-start space-x-3">
            <div :class="getActivityIcon(activity.type).bgColor" class="p-2 rounded-lg flex-shrink-0">
              <component :is="getActivityIcon(activity.type).icon" class="w-4 h-4" :class="getActivityIcon(activity.type).color" />
            </div>
            <div class="flex-1 min-w-0">
              <p class="text-sm font-medium text-gray-900">{{ activity.title }}</p>
              <p class="text-xs text-gray-600">{{ activity.customer }}</p>
              <p class="text-xs text-gray-500 mt-1">{{ formatTime(activity.timestamp) }}</p>
            </div>
          </div>
        </div>

        <button @click="viewAllActivities" class="mt-4 w-full px-4 py-2 text-sm text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
          View All Activities
        </button>
      </div>
    </div>

    <!-- Tasks and Appointments -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Upcoming Tasks -->
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-lg font-semibold text-gray-900">Upcoming Tasks</h2>
          <button @click="addTask" class="text-sm text-blue-600 hover:text-blue-800">
            <PlusIcon class="w-4 h-4" />
          </button>
        </div>
        
        <div class="space-y-3">
          <div v-for="task in upcomingTasks" :key="task.id" class="p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
            <div class="flex items-start justify-between">
              <div class="flex-1">
                <div class="flex items-center">
                  <input 
                    type="checkbox" 
                    :checked="task.completed"
                    @change="toggleTask(task.id)"
                    class="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <p class="ml-3 text-sm font-medium text-gray-900" :class="{ 'line-through text-gray-500': task.completed }">
                    {{ task.title }}
                  </p>
                </div>
                <p class="ml-7 text-xs text-gray-600 mt-1">{{ task.customer }}</p>
                <div class="ml-7 mt-2 flex items-center space-x-4 text-xs text-gray-500">
                  <span class="flex items-center">
                    <CalendarIcon class="w-3 h-3 mr-1" />
                    {{ formatDate(task.dueDate) }}
                  </span>
                  <span :class="getPriorityColor(task.priority)">
                    {{ task.priority }} priority
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <button @click="viewAllTasks" class="mt-4 w-full px-4 py-2 text-sm text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
          View All Tasks
        </button>
      </div>

      <!-- Today's Appointments -->
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-lg font-semibold text-gray-900">Today's Appointments</h2>
          <button @click="addAppointment" class="text-sm text-blue-600 hover:text-blue-800">
            <PlusIcon class="w-4 h-4" />
          </button>
        </div>
        
        <div class="space-y-3">
          <div v-for="appointment in todayAppointments" :key="appointment.id" class="p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
            <div class="flex items-start justify-between">
              <div class="flex-1">
                <p class="text-sm font-medium text-gray-900">{{ appointment.title }}</p>
                <p class="text-xs text-gray-600 mt-1">{{ appointment.customer }}</p>
                <div class="mt-2 flex items-center space-x-4 text-xs text-gray-500">
                  <span class="flex items-center">
                    <ClockIcon class="w-3 h-3 mr-1" />
                    {{ appointment.time }}
                  </span>
                  <span class="flex items-center">
                    <MapPinIcon class="w-3 h-3 mr-1" />
                    {{ appointment.location }}
                  </span>
                </div>
              </div>
              <span :class="getStatusBadge(appointment.status)">
                {{ appointment.status }}
              </span>
            </div>
          </div>
        </div>

        <button @click="viewCalendar" class="mt-4 w-full px-4 py-2 text-sm text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
          View Calendar
        </button>
      </div>
    </div>

    <!-- Customer Satisfaction & Team Performance -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Customer Satisfaction -->
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div class="mb-4">
          <h2 class="text-lg font-semibold text-gray-900">Customer Satisfaction</h2>
          <p class="text-sm text-gray-600">Based on recent feedback</p>
        </div>
        
        <div class="flex items-center justify-center py-8">
          <div class="text-center">
            <div class="text-5xl font-bold text-green-600">{{ satisfaction.score }}</div>
            <div class="flex items-center justify-center mt-2">
              <StarIcon v-for="i in 5" :key="i" class="w-6 h-6" :class="i <= satisfaction.stars ? 'text-yellow-400 fill-current' : 'text-gray-300'" />
            </div>
            <p class="text-sm text-gray-600 mt-2">{{ satisfaction.totalReviews }} reviews</p>
          </div>
        </div>

        <div class="space-y-2">
          <div v-for="rating in satisfaction.breakdown" :key="rating.stars" class="flex items-center">
            <span class="text-xs text-gray-600 w-12">{{ rating.stars }} star</span>
            <div class="flex-1 mx-2">
              <div class="h-2 bg-gray-200 rounded-full overflow-hidden">
                <div :style="`width: ${rating.percentage}%`" class="h-full bg-yellow-400"></div>
              </div>
            </div>
            <span class="text-xs text-gray-600 w-10 text-right">{{ rating.percentage }}%</span>
          </div>
        </div>
      </div>

      <!-- Team Performance -->
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div class="mb-4">
          <h2 class="text-lg font-semibold text-gray-900">Team Performance</h2>
          <p class="text-sm text-gray-600">This month's top performers</p>
        </div>
        
        <div class="space-y-4">
          <div v-for="(member, index) in teamPerformance" :key="member.id" class="flex items-center space-x-3">
            <div class="flex-shrink-0">
              <div :class="getRankBadge(index + 1)" class="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold">
                {{ index + 1 }}
              </div>
            </div>
            <div class="flex-1">
              <p class="text-sm font-medium text-gray-900">{{ member.name }}</p>
              <p class="text-xs text-gray-600">{{ member.role }}</p>
            </div>
            <div class="text-right">
              <p class="text-sm font-bold text-gray-900">{{ member.deals }} deals</p>
              <p class="text-xs text-gray-600">TZS {{ formatCurrency(member.revenue) }}</p>
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
  ArrowPathIcon,
  ArrowDownTrayIcon,
  UserPlusIcon,
  UsersIcon,
  ClipboardDocumentListIcon,
  ChatBubbleLeftRightIcon,
  PlusIcon,
  CalendarIcon,
  ClockIcon,
  MapPinIcon,
  StarIcon,
  PhoneIcon,
  EnvelopeIcon,
  CheckCircleIcon,
  XCircleIcon,
} from '@heroicons/vue/24/outline'

const router = useRouter()

// Reactive data
const stats = ref({
  totalLeads: 248,
  leadsGrowth: 12.5,
  activeCustomers: 1847,
  conversionRate: 68,
  pendingTasks: 43,
  dueTodayTasks: 12,
  interactionsToday: 156,
  avgResponseTime: '2.3 hrs'
})

const leadPipeline = ref([
  { name: 'New Leads', count: 85, percentage: 35 },
  { name: 'Contacted', count: 62, percentage: 25 },
  { name: 'Qualified', count: 48, percentage: 20 },
  { name: 'Proposal', count: 31, percentage: 13 },
  { name: 'Negotiation', count: 15, percentage: 6 },
  { name: 'Closed Won', count: 7, percentage: 3 }
])

const pipelineMetrics = ref({
  totalValue: 'TZS 45.2M',
  avgDealSize: 'TZS 850K',
  winRate: 72
})

const recentActivities = ref([
  { id: 1, type: 'call', title: 'Call with John Doe', customer: 'Potential loan customer', timestamp: new Date() },
  { id: 2, type: 'email', title: 'Email sent to Jane Smith', customer: 'Savings account inquiry', timestamp: new Date(Date.now() - 3600000) },
  { id: 3, type: 'meeting', title: 'Meeting scheduled', customer: 'Business loan application', timestamp: new Date(Date.now() - 7200000) },
  { id: 4, type: 'note', title: 'Follow-up note added', customer: 'Group loan discussion', timestamp: new Date(Date.now() - 10800000) },
  { id: 5, type: 'task', title: 'Task completed', customer: 'Document verification', timestamp: new Date(Date.now() - 14400000) }
])

const upcomingTasks = ref([
  { id: 1, title: 'Follow up on loan application', customer: 'Michael Johnson', dueDate: new Date(), priority: 'high', completed: false },
  { id: 2, title: 'Send savings account documents', customer: 'Sarah Williams', dueDate: new Date(Date.now() + 86400000), priority: 'medium', completed: false },
  { id: 3, title: 'Schedule site visit', customer: 'ABC Company Ltd', dueDate: new Date(Date.now() + 172800000), priority: 'low', completed: false }
])

const todayAppointments = ref([
  { id: 1, title: 'Loan consultation', customer: 'Robert Brown', time: '10:00 AM', location: 'Main Office', status: 'confirmed' },
  { id: 2, title: 'Account opening', customer: 'Lisa Anderson', time: '2:00 PM', location: 'Branch A', status: 'pending' },
  { id: 3, title: 'Business review', customer: 'Tech Solutions Ltd', time: '4:30 PM', location: 'Virtual', status: 'confirmed' }
])

const satisfaction = ref({
  score: 4.6,
  stars: 5,
  totalReviews: 328,
  breakdown: [
    { stars: 5, percentage: 72 },
    { stars: 4, percentage: 18 },
    { stars: 3, percentage: 6 },
    { stars: 2, percentage: 3 },
    { stars: 1, percentage: 1 }
  ]
})

const teamPerformance = ref([
  { id: 1, name: 'Alice Mkamba', role: 'Senior Loan Officer', deals: 23, revenue: 12500000 },
  { id: 2, name: 'James Mwenda', role: 'Loan Officer', deals: 19, revenue: 9800000 },
  { id: 3, name: 'Grace Ndege', role: 'Customer Service', deals: 17, revenue: 7600000 },
  { id: 4, name: 'Peter Kimaro', role: 'Junior Officer', deals: 14, revenue: 5200000 }
])

// Methods
const getStageColor = (stage: string): string => {
  const colors = {
    'New Leads': 'bg-blue-500',
    'Contacted': 'bg-indigo-500',
    'Qualified': 'bg-purple-500',
    'Proposal': 'bg-yellow-500',
    'Negotiation': 'bg-orange-500',
    'Closed Won': 'bg-green-500'
  }
  return colors[stage] || 'bg-gray-500'
}

const getActivityIcon = (type: string) => {
  const icons = {
    call: { icon: PhoneIcon, color: 'text-blue-600', bgColor: 'bg-blue-100' },
    email: { icon: EnvelopeIcon, color: 'text-green-600', bgColor: 'bg-green-100' },
    meeting: { icon: UsersIcon, color: 'text-purple-600', bgColor: 'bg-purple-100' },
    note: { icon: ClipboardDocumentListIcon, color: 'text-yellow-600', bgColor: 'bg-yellow-100' },
    task: { icon: CheckCircleIcon, color: 'text-gray-600', bgColor: 'bg-gray-100' }
  }
  return icons[type] || icons.note
}

const getPriorityColor = (priority: string): string => {
  const colors = {
    high: 'text-red-600',
    medium: 'text-yellow-600',
    low: 'text-green-600'
  }
  return colors[priority] || 'text-gray-600'
}

const getStatusBadge = (status: string): string => {
  const badges = {
    confirmed: 'px-2 py-1 text-xs font-medium text-green-700 bg-green-100 rounded-full',
    pending: 'px-2 py-1 text-xs font-medium text-yellow-700 bg-yellow-100 rounded-full',
    cancelled: 'px-2 py-1 text-xs font-medium text-red-700 bg-red-100 rounded-full'
  }
  return badges[status] || badges.pending
}

const getRankBadge = (rank: number): string => {
  if (rank === 1) return 'bg-yellow-400 text-white'
  if (rank === 2) return 'bg-gray-400 text-white'
  if (rank === 3) return 'bg-orange-400 text-white'
  return 'bg-gray-200 text-gray-700'
}

const formatTime = (date: Date): string => {
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  const minutes = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  
  if (minutes < 60) return `${minutes} minutes ago`
  if (hours < 24) return `${hours} hours ago`
  return date.toLocaleDateString()
}

const formatDate = (date: Date): string => {
  return date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
}

const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount)
}

const refreshData = () => {
  console.log('Refreshing CRM data...')
  // Implement data refresh logic
}

const exportData = () => {
  console.log('Exporting CRM data...')
  // Implement export logic
}

const viewAllActivities = () => {
  router.push('/crm/activities')
}

const viewAllTasks = () => {
  router.push('/crm/tasks')
}

const viewCalendar = () => {
  router.push('/crm/calendar')
}

const addTask = () => {
  router.push('/crm/tasks/create')
}

const addAppointment = () => {
  router.push('/crm/appointments/create')
}

const toggleTask = (taskId: number) => {
  const task = upcomingTasks.value.find(t => t.id === taskId)
  if (task) {
    task.completed = !task.completed
  }
}

defineOptions({
  name: "CRMDashboard",
})

// Initialize
onMounted(() => {
  // Load CRM data
})
</script>

<style scoped>
/* Custom scrollbar for activity list */
.overflow-y-auto::-webkit-scrollbar {
  width: 6px;
}

.overflow-y-auto::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 3px;
}

.overflow-y-auto::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 3px;
}

.overflow-y-auto::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}
</style>