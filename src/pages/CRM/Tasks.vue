<template>
  <div class="space-y-6">
    <!-- Page Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Tasks</h1>
        <p class="text-sm text-gray-600 mt-1">Manage your tasks and follow-ups</p>
      </div>
      <div class="flex space-x-3">
        <button @click="syncTasks" class="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors">
          <ArrowPathIcon class="w-4 h-4 mr-2" />
          Sync
        </button>
        <button @click="createTask" class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
          <PlusIcon class="w-4 h-4 mr-2" />
          Create Task
        </button>
      </div>
    </div>

    <!-- Task Statistics -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div class="flex items-center">
          <div class="flex-1">
            <p class="text-sm font-medium text-gray-600">Total Tasks</p>
            <p class="mt-2 text-3xl font-bold text-gray-900">{{ taskStats.total }}</p>
            <p class="mt-2 text-sm text-blue-600">{{ taskStats.active }} active</p>
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
            <p class="text-sm font-medium text-gray-600">Due Today</p>
            <p class="mt-2 text-3xl font-bold text-gray-900">{{ taskStats.dueToday }}</p>
            <p class="mt-2 text-sm text-orange-600">{{ taskStats.overdue }} overdue</p>
          </div>
          <div class="ml-4">
            <div class="p-3 bg-orange-100 rounded-lg">
              <ClockIcon class="w-6 h-6 text-orange-600" />
            </div>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div class="flex items-center">
          <div class="flex-1">
            <p class="text-sm font-medium text-gray-600">Completed</p>
            <p class="mt-2 text-3xl font-bold text-gray-900">{{ taskStats.completed }}</p>
            <p class="mt-2 text-sm text-green-600">{{ taskStats.completionRate }}% rate</p>
          </div>
          <div class="ml-4">
            <div class="p-3 bg-green-100 rounded-lg">
              <CheckCircleIcon class="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div class="flex items-center">
          <div class="flex-1">
            <p class="text-sm font-medium text-gray-600">High Priority</p>
            <p class="mt-2 text-3xl font-bold text-gray-900">{{ taskStats.highPriority }}</p>
            <p class="mt-2 text-sm text-red-600">Needs attention</p>
          </div>
          <div class="ml-4">
            <div class="p-3 bg-red-100 rounded-lg">
              <ExclamationTriangleIcon class="w-6 h-6 text-red-600" />
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Task Views and Filters -->
    <div class="flex items-center justify-between">
      <div class="flex items-center space-x-4">
        <button
          @click="currentView = 'kanban'"
          :class="currentView === 'kanban' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700'"
          class="px-4 py-2 rounded-lg border border-gray-300 hover:bg-blue-50 transition-colors"
        >
          <ViewColumnsIcon class="w-4 h-4 mr-2" />
          Kanban
        </button>
        <button
          @click="currentView = 'list'"
          :class="currentView === 'list' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700'"
          class="px-4 py-2 rounded-lg border border-gray-300 hover:bg-blue-50 transition-colors"
        >
          <ListBulletIcon class="w-4 h-4 mr-2" />
          List
        </button>
        <button
          @click="currentView = 'calendar'"
          :class="currentView === 'calendar' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700'"
          class="px-4 py-2 rounded-lg border border-gray-300 hover:bg-blue-50 transition-colors"
        >
          <CalendarIcon class="w-4 h-4 mr-2" />
          Calendar
        </button>
      </div>

      <div class="flex items-center space-x-4">
        <select v-model="filters.priority" class="form-input text-sm">
          <option value="">All Priorities</option>
          <option value="high">High Priority</option>
          <option value="medium">Medium Priority</option>
          <option value="low">Low Priority</option>
        </select>
        <select v-model="filters.assignedTo" class="form-input text-sm">
          <option value="">All Assignees</option>
          <option value="me">My Tasks</option>
          <option v-for="member in teamMembers" :key="member.id" :value="member.id">
            {{ member.name }}
          </option>
        </select>
        <div class="relative">
          <MagnifyingGlassIcon class="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search tasks..."
            class="form-input pl-10 text-sm"
          />
        </div>
      </div>
    </div>

    <!-- Kanban View -->
    <div v-if="currentView === 'kanban'" class="flex space-x-4 overflow-x-auto pb-4">
      <div v-for="column in taskColumns" :key="column.id" class="flex-shrink-0 w-80">
        <div class="bg-gray-50 rounded-lg">
          <div class="px-4 py-3 border-b border-gray-200">
            <div class="flex items-center justify-between">
              <h3 class="text-sm font-medium text-gray-900">{{ column.name }}</h3>
              <span class="text-xs text-gray-500">{{ getTasksByStatus(column.id).length }} tasks</span>
            </div>
          </div>
          
          <div class="p-2 space-y-2 min-h-[500px] max-h-[600px] overflow-y-auto">
            <div
              v-for="task in getTasksByStatus(column.id)"
              :key="task.id"
              @click="viewTask(task.id)"
              class="bg-white rounded-lg shadow-sm border border-gray-200 p-4 cursor-pointer hover:shadow-md transition-shadow"
            >
              <div class="flex items-start justify-between mb-2">
                <h4 class="text-sm font-medium text-gray-900">{{ task.title }}</h4>
                <span :class="getPriorityBadge(task.priority)">
                  {{ task.priority }}
                </span>
              </div>
              
              <p class="text-xs text-gray-600 mb-3">{{ task.description }}</p>
              
              <div class="flex items-center justify-between text-xs text-gray-500">
                <div class="flex items-center">
                  <UserIcon class="w-3 h-3 mr-1" />
                  {{ task.customer }}
                </div>
                <div class="flex items-center">
                  <CalendarIcon class="w-3 h-3 mr-1" />
                  {{ formatDate(task.dueDate) }}
                </div>
              </div>
              
              <div class="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between">
                <div class="flex items-center">
                  <div class="h-6 w-6 rounded-full bg-gray-200 flex items-center justify-center">
                    <span class="text-xs font-medium text-gray-600">{{ getInitials(task.assignedTo) }}</span>
                  </div>
                  <span class="ml-2 text-xs text-gray-600">{{ task.assignedTo }}</span>
                </div>
                <div class="flex items-center space-x-1">
                  <button
                    @click.stop="completeTask(task.id)"
                    class="text-green-600 hover:text-green-800"
                    title="Mark Complete"
                  >
                    <CheckIcon class="w-4 h-4" />
                  </button>
                  <button
                    @click.stop="editTask(task.id)"
                    class="text-blue-600 hover:text-blue-800"
                    title="Edit"
                  >
                    <PencilIcon class="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
            
            <!-- Add Task Button -->
            <button
              @click="createTaskInColumn(column.id)"
              class="w-full py-2 border-2 border-dashed border-gray-300 rounded-lg text-sm text-gray-600 hover:border-gray-400 hover:text-gray-800 transition-colors"
            >
              <PlusIcon class="w-4 h-4 mx-auto" />
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- List View -->
    <div v-if="currentView === 'list'" class="bg-white rounded-lg shadow-sm border border-gray-200">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left">
                <input
                  type="checkbox"
                  v-model="selectAll"
                  @change="toggleSelectAll"
                  class="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Task
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Customer
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Priority
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Assigned To
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Due Date
              </th>
              <th class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="task in paginatedTasks" :key="task.id" class="hover:bg-gray-50">
              <td class="px-6 py-4">
                <input
                  type="checkbox"
                  :value="task.id"
                  v-model="selectedTasks"
                  class="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
              </td>
              <td class="px-6 py-4">
                <div>
                  <div class="text-sm font-medium text-gray-900">{{ task.title }}</div>
                  <div class="text-xs text-gray-500">{{ task.description }}</div>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span class="text-sm text-gray-900">{{ task.customer }}</span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span :class="getPriorityBadge(task.priority)">
                  {{ task.priority }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <select
                  :value="task.status"
                  @change="updateTaskStatus(task.id, $event.target.value)"
                  class="text-sm border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                >
                  <option v-for="column in taskColumns" :key="column.id" :value="column.id">
                    {{ column.name }}
                  </option>
                </select>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span class="text-sm text-gray-900">{{ task.assignedTo }}</span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span class="text-sm" :class="getDueDateClass(task.dueDate)">
                  {{ formatDate(task.dueDate) }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-center">
                <div class="flex items-center justify-center space-x-2">
                  <button
                    @click="viewTask(task.id)"
                    class="text-blue-600 hover:text-blue-900"
                    title="View"
                  >
                    <EyeIcon class="w-4 h-4" />
                  </button>
                  <button
                    @click="editTask(task.id)"
                    class="text-yellow-600 hover:text-yellow-900"
                    title="Edit"
                  >
                    <PencilIcon class="w-4 h-4" />
                  </button>
                  <button
                    @click="completeTask(task.id)"
                    class="text-green-600 hover:text-green-900"
                    title="Complete"
                  >
                    <CheckIcon class="w-4 h-4" />
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      <div class="px-6 py-4 border-t border-gray-200 bg-gray-50">
        <div class="flex items-center justify-between">
          <div class="text-sm text-gray-500">
            Showing {{ startIndex }} to {{ endIndex }} of {{ totalTasks }} tasks
          </div>
          <div class="flex items-center space-x-2">
            <button
              @click="previousPage"
              :disabled="currentPage === 1"
              class="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <span class="text-sm text-gray-700">
              Page {{ currentPage }} of {{ totalPages }}
            </span>
            <button
              @click="nextPage"
              :disabled="currentPage === totalPages"
              class="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Calendar View -->
    <div v-if="currentView === 'calendar'" class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div class="text-center py-12">
        <CalendarIcon class="mx-auto h-12 w-12 text-gray-400" />
        <h3 class="mt-4 text-lg font-medium text-gray-900">Calendar View</h3>
        <p class="mt-2 text-sm text-gray-600">
          Task calendar view will be implemented here
        </p>
        <button @click="currentView = 'kanban'" class="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
          Switch to Kanban View
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import {
  PlusIcon,
  ArrowPathIcon,
  MagnifyingGlassIcon,
  ViewColumnsIcon,
  ListBulletIcon,
  CalendarIcon,
  ClipboardDocumentListIcon,
  ClockIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  UserIcon,
  CheckIcon,
  PencilIcon,
  EyeIcon,
} from '@heroicons/vue/24/outline'

const router = useRouter()

// Reactive data
const currentView = ref<'kanban' | 'list' | 'calendar'>('kanban')
const searchQuery = ref('')
const selectAll = ref(false)
const selectedTasks = ref<string[]>([])
const currentPage = ref(1)
const itemsPerPage = ref(20)

const filters = ref({
  priority: '',
  assignedTo: ''
})

const taskStats = ref({
  total: 47,
  active: 32,
  dueToday: 8,
  overdue: 3,
  completed: 15,
  completionRate: 76,
  highPriority: 12
})

const taskColumns = ref([
  { id: 'todo', name: 'To Do' },
  { id: 'in_progress', name: 'In Progress' },
  { id: 'review', name: 'Review' },
  { id: 'completed', name: 'Completed' }
])

const teamMembers = ref([
  { id: 'tm1', name: 'Alice Mkamba' },
  { id: 'tm2', name: 'James Mwenda' },
  { id: 'tm3', name: 'Grace Ndege' },
  { id: 'tm4', name: 'Peter Kimaro' }
])

const tasks = ref([
  {
    id: 'T001',
    title: 'Follow up on loan application',
    description: 'Contact customer about missing documents',
    customer: 'John Doe',
    priority: 'high',
    status: 'todo',
    assignedTo: 'Alice Mkamba',
    dueDate: new Date(),
    createdAt: new Date(Date.now() - 86400000)
  },
  {
    id: 'T002',
    title: 'Prepare business loan proposal',
    description: 'Create detailed proposal for Tech Solutions loan request',
    customer: 'Tech Solutions Ltd',
    priority: 'medium',
    status: 'in_progress',
    assignedTo: 'James Mwenda',
    dueDate: new Date(Date.now() + 86400000),
    createdAt: new Date(Date.now() - 172800000)
  },
  {
    id: 'T003',
    title: 'Schedule site visit',
    description: 'Arrange visit to customer business location',
    customer: 'Green Farms',
    priority: 'medium',
    status: 'todo',
    assignedTo: 'Grace Ndege',
    dueDate: new Date(Date.now() + 172800000),
    createdAt: new Date(Date.now() - 259200000)
  },
  {
    id: 'T004',
    title: 'Review credit assessment',
    description: 'Final review of customer creditworthiness',
    customer: 'Retail Plus',
    priority: 'high',
    status: 'review',
    assignedTo: 'Alice Mkamba',
    dueDate: new Date(Date.now() + 259200000),
    createdAt: new Date(Date.now() - 345600000)
  },
  {
    id: 'T005',
    title: 'Send account statements',
    description: 'Monthly account statements to all customers',
    customer: 'All Customers',
    priority: 'low',
    status: 'completed',
    assignedTo: 'Peter Kimaro',
    dueDate: new Date(Date.now() - 86400000),
    createdAt: new Date(Date.now() - 432000000)
  }
])

// Computed properties
const filteredTasks = computed(() => {
  let result = [...tasks.value]

  // Apply search
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    result = result.filter(task =>
      task.title.toLowerCase().includes(query) ||
      task.description.toLowerCase().includes(query) ||
      task.customer.toLowerCase().includes(query)
    )
  }

  // Apply filters
  if (filters.value.priority) {
    result = result.filter(task => task.priority === filters.value.priority)
  }

  if (filters.value.assignedTo) {
    if (filters.value.assignedTo === 'me') {
      result = result.filter(task => task.assignedTo === 'Current User')
    } else {
      const member = teamMembers.value.find(m => m.id === filters.value.assignedTo)
      if (member) {
        result = result.filter(task => task.assignedTo === member.name)
      }
    }
  }

  return result.sort((a, b) => a.dueDate.getTime() - b.dueDate.getTime())
})

const totalTasks = computed(() => filteredTasks.value.length)
const totalPages = computed(() => Math.ceil(filteredTasks.value.length / itemsPerPage.value))
const startIndex = computed(() => (currentPage.value - 1) * itemsPerPage.value + 1)
const endIndex = computed(() => Math.min(currentPage.value * itemsPerPage.value, filteredTasks.value.length))

const paginatedTasks = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value
  const end = start + itemsPerPage.value
  return filteredTasks.value.slice(start, end)
})

// Methods
const getTasksByStatus = (statusId: string) => {
  return filteredTasks.value.filter(task => task.status === statusId)
}

const getInitials = (name: string): string => {
  return name
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

const getPriorityBadge = (priority: string): string => {
  const badges = {
    high: 'px-2 py-1 text-xs font-medium text-red-700 bg-red-100 rounded-full',
    medium: 'px-2 py-1 text-xs font-medium text-yellow-700 bg-yellow-100 rounded-full',
    low: 'px-2 py-1 text-xs font-medium text-green-700 bg-green-100 rounded-full'
  }
  return badges[priority] || badges.medium
}

const getDueDateClass = (dueDate: Date): string => {
  const now = new Date()
  const diff = dueDate.getTime() - now.getTime()
  const days = Math.floor(diff / 86400000)
  
  if (days < 0) return 'text-red-600 font-medium' // Overdue
  if (days === 0) return 'text-orange-600 font-medium' // Due today
  if (days <= 2) return 'text-yellow-600' // Due soon
  return 'text-gray-900' // Normal
}

const formatDate = (date: Date): string => {
  const now = new Date()
  const diff = date.getTime() - now.getTime()
  const days = Math.floor(diff / 86400000)
  
  if (days === 0) return 'Today'
  if (days === 1) return 'Tomorrow'
  if (days === -1) return 'Yesterday'
  if (days < -1) return `${Math.abs(days)} days overdue`
  
  return date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })
}

const toggleSelectAll = () => {
  if (selectAll.value) {
    selectedTasks.value = paginatedTasks.value.map(t => t.id)
  } else {
    selectedTasks.value = []
  }
}

const updateTaskStatus = (taskId: string, newStatus: string) => {
  const task = tasks.value.find(t => t.id === taskId)
  if (task) {
    task.status = newStatus
  }
}

const createTask = () => {
  router.push('/crm/tasks/add')
}

const createTaskInColumn = (statusId: string) => {
  router.push(`/crm/tasks/add?status=${statusId}`)
}

const viewTask = (id: string) => {
  router.push(`/crm/tasks/${id}`)
}

const editTask = (id: string) => {
  router.push(`/crm/tasks/${id}/edit`)
}

const completeTask = (id: string) => {
  const task = tasks.value.find(t => t.id === id)
  if (task) {
    task.status = 'completed'
  }
}

const syncTasks = () => {
  console.log('Syncing tasks...')
}

const previousPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--
  }
}

const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++
  }
}

defineOptions({
  name: "CRMTasks",
})

// Initialize
onMounted(() => {
  // Load tasks data
})
</script>

<style scoped>
/* Custom scrollbar for kanban columns */
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