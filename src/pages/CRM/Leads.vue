<template>
  <div class="space-y-6">
    <!-- Page Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Leads</h1>
        <p class="text-sm text-gray-600 mt-1">Manage and convert your sales leads</p>
      </div>
      <div class="flex space-x-3">
        <button 
          v-if="selectedLeads.length > 0"
          @click="bulkConvertLeads" 
          class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
        >
          <ArrowRightCircleIcon class="w-4 h-4 mr-2" />
          Convert Selected ({{ selectedLeads.length }})
        </button>
        <button @click="importLeads" class="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors">
          <ArrowUpTrayIcon class="w-4 h-4 mr-2" />
          Import
        </button>
        <button @click="exportLeads" class="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors">
          <ArrowDownTrayIcon class="w-4 h-4 mr-2" />
          Export
        </button>
        <button @click="addLead" class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
          <PlusIcon class="w-4 h-4 mr-2" />
          Add Lead
        </button>
      </div>
    </div>

    <!-- Lead Statistics -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-xs font-medium text-gray-600">New Leads</p>
            <p class="mt-1 text-2xl font-bold text-gray-900">{{ leadStats.new }}</p>
          </div>
          <div class="p-2 bg-blue-100 rounded-lg">
            <UserPlusIcon class="w-5 h-5 text-blue-600" />
          </div>
        </div>
      </div>

      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-xs font-medium text-gray-600">Contacted</p>
            <p class="mt-1 text-2xl font-bold text-gray-900">{{ leadStats.contacted }}</p>
          </div>
          <div class="p-2 bg-purple-100 rounded-lg">
            <PhoneIcon class="w-5 h-5 text-purple-600" />
          </div>
        </div>
      </div>

      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-xs font-medium text-gray-600">Qualified</p>
            <p class="mt-1 text-2xl font-bold text-gray-900">{{ leadStats.qualified }}</p>
          </div>
          <div class="p-2 bg-yellow-100 rounded-lg">
            <CheckBadgeIcon class="w-5 h-5 text-yellow-600" />
          </div>
        </div>
      </div>

      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-xs font-medium text-gray-600">Converted</p>
            <p class="mt-1 text-2xl font-bold text-gray-900">{{ leadStats.converted }}</p>
          </div>
          <div class="p-2 bg-green-100 rounded-lg">
            <CheckCircleIcon class="w-5 h-5 text-green-600" />
          </div>
        </div>
      </div>

      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-xs font-medium text-gray-600">Lost</p>
            <p class="mt-1 text-2xl font-bold text-gray-900">{{ leadStats.lost }}</p>
          </div>
          <div class="p-2 bg-red-100 rounded-lg">
            <XCircleIcon class="w-5 h-5 text-red-600" />
          </div>
        </div>
      </div>
    </div>

    <!-- Kanban View / List View Toggle -->
    <div class="flex items-center justify-between">
      <div class="flex items-center space-x-4">
        <button
          @click="viewMode = 'kanban'"
          :class="viewMode === 'kanban' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700'"
          class="px-4 py-2 rounded-lg border border-gray-300 hover:bg-blue-50 transition-colors"
        >
          <ViewColumnsIcon class="w-4 h-4 mr-2" />
          Kanban View
        </button>
        <button
          @click="viewMode = 'list'"
          :class="viewMode === 'list' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700'"
          class="px-4 py-2 rounded-lg border border-gray-300 hover:bg-blue-50 transition-colors"
        >
          <ListBulletIcon class="w-4 h-4 mr-2" />
          List View
        </button>
      </div>

      <div class="flex items-center space-x-4">
        <select v-model="filters.source" class="form-input text-sm">
          <option value="">All Sources</option>
          <option value="website">Website</option>
          <option value="referral">Referral</option>
          <option value="social">Social Media</option>
          <option value="campaign">Campaign</option>
          <option value="walk-in">Walk-in</option>
        </select>
        <select v-model="filters.status" class="form-input text-sm">
          <option value="">All Status</option>
          <option value="convertible">Convertible Only</option>
          <option value="converted">Converted</option>
          <option value="lost">Lost</option>
        </select>
        <select v-model="filters.assignedTo" class="form-input text-sm">
          <option value="">All Assignees</option>
          <option value="me">Assigned to Me</option>
          <option value="unassigned">Unassigned</option>
          <option v-for="member in teamMembers" :key="member.id" :value="member.id">
            {{ member.name }}
          </option>
        </select>
        <div class="relative">
          <MagnifyingGlassIcon class="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search leads..."
            class="form-input pl-10 text-sm"
          />
        </div>
      </div>
    </div>

    <!-- Kanban View -->
    <div v-if="viewMode === 'kanban'" class="flex space-x-4 overflow-x-auto pb-4">
      <div v-for="stage in leadStages" :key="stage.id" class="flex-shrink-0 w-80">
        <div class="bg-gray-50 rounded-lg">
          <div class="px-4 py-3 border-b border-gray-200">
            <div class="flex items-center justify-between">
              <h3 class="text-sm font-medium text-gray-900">{{ stage.name }}</h3>
              <span class="text-xs text-gray-500">{{ getLeadsByStage(stage.id).length }} leads</span>
            </div>
          </div>
          
          <div class="p-2 space-y-2 min-h-[400px] max-h-[600px] overflow-y-auto">
            <div
              v-for="lead in getLeadsByStage(stage.id)"
              :key="lead.id"
              @click="viewLead(lead.id)"
              class="bg-white rounded-lg shadow-sm border border-gray-200 p-4 cursor-pointer hover:shadow-md transition-shadow"
              draggable="true"
              @dragstart="onDragStart(lead, $event)"
              @dragover.prevent
              @drop="onDrop(stage.id, $event)"
            >
              <div class="flex items-start justify-between mb-2">
                <h4 class="text-sm font-medium text-gray-900">{{ lead.name }}</h4>
                <span :class="getScoreBadge(lead.score)">
                  {{ lead.score }}
                </span>
              </div>
              
              <p class="text-xs text-gray-600 mb-2">{{ lead.company }}</p>
              
              <div class="space-y-1 text-xs text-gray-500">
                <div class="flex items-center">
                  <EnvelopeIcon class="w-3 h-3 mr-1" />
                  {{ lead.email }}
                </div>
                <div class="flex items-center">
                  <PhoneIcon class="w-3 h-3 mr-1" />
                  {{ lead.phone }}
                </div>
                <div class="flex items-center">
                  <CurrencyDollarIcon class="w-3 h-3 mr-1" />
                  TZS {{ formatCurrency(lead.value) }}
                </div>
              </div>
              
              <div class="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between">
                <div class="flex items-center">
                  <div class="h-6 w-6 rounded-full bg-gray-200 flex items-center justify-center">
                    <span class="text-xs font-medium text-gray-600">{{ getInitials(lead.assignedTo) }}</span>
                  </div>
                  <span class="ml-2 text-xs text-gray-600">{{ lead.assignedTo }}</span>
                </div>
                <span class="text-xs text-gray-500">{{ formatDate(lead.createdAt) }}</span>
              </div>
            </div>
            
            <!-- Add Lead Button -->
            <button
              @click="addLeadToStage(stage.id)"
              class="w-full py-2 border-2 border-dashed border-gray-300 rounded-lg text-sm text-gray-600 hover:border-gray-400 hover:text-gray-800 transition-colors"
            >
              <PlusIcon class="w-4 h-4 mx-auto" />
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- List View -->
    <div v-if="viewMode === 'list'" class="bg-white rounded-lg shadow-sm border border-gray-200">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-12">
                <input
                  type="checkbox"
                  :checked="allLeadsSelected"
                  @change="toggleAllLeads"
                  class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Lead
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Contact
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Stage
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Value
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Score
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Source
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Assigned To
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Created
              </th>
              <th class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="lead in paginatedLeads" :key="lead.id" class="hover:bg-gray-50" :class="{ 'bg-blue-50': selectedLeads.includes(lead.id) }">
              <td class="px-6 py-4">
                <input
                  type="checkbox"
                  :value="lead.id"
                  v-model="selectedLeads"
                  class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
              </td>
              <td class="px-6 py-4">
                <div>
                  <div class="text-sm font-medium text-gray-900">{{ lead.name }}</div>
                  <div class="text-xs text-gray-500">{{ lead.company }}</div>
                </div>
              </td>
              <td class="px-6 py-4">
                <div class="text-xs">
                  <div class="text-gray-900">{{ lead.email }}</div>
                  <div class="text-gray-600">{{ lead.phone }}</div>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <select
                  :value="lead.stage"
                  @change="updateLeadStage(lead.id, $event.target.value)"
                  class="text-sm border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                >
                  <option v-for="stage in leadStages" :key="stage.id" :value="stage.id">
                    {{ stage.name }}
                  </option>
                </select>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span class="text-sm text-gray-900">TZS {{ formatCurrency(lead.value) }}</span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span :class="getScoreBadge(lead.score)">
                  {{ lead.score }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span class="text-sm text-gray-900">{{ lead.source }}</span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span class="text-sm text-gray-900">{{ lead.assignedTo }}</span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span class="text-sm text-gray-500">{{ formatDate(lead.createdAt) }}</span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-center">
                <div class="flex items-center justify-center space-x-2">
                  <button
                    @click="viewLead(lead.id)"
                    class="text-blue-600 hover:text-blue-900"
                    title="View"
                  >
                    <EyeIcon class="w-4 h-4" />
                  </button>
                  <button
                    @click="editLead(lead.id)"
                    class="text-yellow-600 hover:text-yellow-900"
                    title="Edit"
                  >
                    <PencilIcon class="w-4 h-4" />
                  </button>
                  <button
                    v-if="lead.stage !== 'converted' && lead.stage !== 'lost'"
                    @click="convertLead(lead.id)"
                    class="text-green-600 hover:text-green-900"
                    title="Convert to Opportunity"
                  >
                    <ArrowRightCircleIcon class="w-4 h-4" />
                  </button>
                  <span
                    v-else
                    class="text-xs px-2 py-1 rounded-full"
                    :class="lead.stage === 'converted' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'"
                  >
                    {{ lead.stage === 'converted' ? 'Converted' : 'Lost' }}
                  </span>
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
            Showing {{ startIndex }} to {{ endIndex }} of {{ totalLeads }} leads
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
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import {
  PlusIcon,
  ArrowUpTrayIcon,
  ArrowDownTrayIcon,
  MagnifyingGlassIcon,
  ViewColumnsIcon,
  ListBulletIcon,
  UserPlusIcon,
  PhoneIcon,
  CheckBadgeIcon,
  CheckCircleIcon,
  XCircleIcon,
  EnvelopeIcon,
  CurrencyDollarIcon,
  EyeIcon,
  PencilIcon,
  ArrowRightCircleIcon,
} from '@heroicons/vue/24/outline'

const router = useRouter()

// Reactive data
const viewMode = ref<'kanban' | 'list'>('kanban')
const searchQuery = ref('')
const currentPage = ref(1)
const itemsPerPage = ref(20)
const draggedLead = ref(null)
const selectedLeads = ref<string[]>([])

const filters = ref({
  source: '',
  assignedTo: '',
  status: ''
})

const leadStats = ref({
  new: 85,
  contacted: 62,
  qualified: 48,
  converted: 31,
  lost: 15
})

const leadStages = ref([
  { id: 'new', name: 'New Leads' },
  { id: 'contacted', name: 'Contacted' },
  { id: 'qualified', name: 'Qualified' },
  { id: 'proposal', name: 'Proposal' },
  { id: 'negotiation', name: 'Negotiation' },
  { id: 'converted', name: 'Converted' },
  { id: 'lost', name: 'Lost' }
])

const teamMembers = ref([
  { id: 'tm1', name: 'Alice Mkamba' },
  { id: 'tm2', name: 'James Mwenda' },
  { id: 'tm3', name: 'Grace Ndege' }
])

const leads = ref([
  {
    id: 'L001',
    name: 'John Doe',
    company: 'ABC Trading Ltd',
    email: 'john@abctrading.co.tz',
    phone: '+255 712 345 678',
    stage: 'new',
    value: 500000,
    score: 85,
    source: 'Website',
    assignedTo: 'Alice Mkamba',
    createdAt: new Date(Date.now() - 86400000)
  },
  {
    id: 'L002',
    name: 'Jane Smith',
    company: 'Tech Solutions',
    email: 'jane@techsolutions.co.tz',
    phone: '+255 754 321 098',
    stage: 'contacted',
    value: 750000,
    score: 72,
    source: 'Referral',
    assignedTo: 'James Mwenda',
    createdAt: new Date(Date.now() - 172800000)
  },
  {
    id: 'L003',
    name: 'Michael Johnson',
    company: 'Green Farms',
    email: 'michael@greenfarms.co.tz',
    phone: '+255 789 456 123',
    stage: 'qualified',
    value: 1200000,
    score: 90,
    source: 'Campaign',
    assignedTo: 'Grace Ndege',
    createdAt: new Date(Date.now() - 259200000)
  },
  {
    id: 'L004',
    name: 'Sarah Williams',
    company: 'Retail Plus',
    email: 'sarah@retailplus.co.tz',
    phone: '+255 765 432 109',
    stage: 'proposal',
    value: 450000,
    score: 65,
    source: 'Social Media',
    assignedTo: 'Alice Mkamba',
    createdAt: new Date(Date.now() - 345600000)
  },
  {
    id: 'L005',
    name: 'Robert Brown',
    company: 'Brown Enterprises',
    email: 'robert@brownent.co.tz',
    phone: '+255 713 579 246',
    stage: 'negotiation',
    value: 2000000,
    score: 88,
    source: 'Walk-in',
    assignedTo: 'James Mwenda',
    createdAt: new Date(Date.now() - 432000000)
  }
])

// Computed properties
const filteredLeads = computed(() => {
  let result = [...leads.value]

  // Apply search
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    result = result.filter(lead =>
      lead.name.toLowerCase().includes(query) ||
      lead.company.toLowerCase().includes(query) ||
      lead.email.toLowerCase().includes(query) ||
      lead.phone.includes(query)
    )
  }

  // Apply filters
  if (filters.value.source) {
    result = result.filter(lead => lead.source.toLowerCase() === filters.value.source)
  }

  if (filters.value.assignedTo) {
    if (filters.value.assignedTo === 'me') {
      result = result.filter(lead => lead.assignedTo === 'Current User')
    } else if (filters.value.assignedTo === 'unassigned') {
      result = result.filter(lead => !lead.assignedTo)
    } else {
      const member = teamMembers.value.find(m => m.id === filters.value.assignedTo)
      if (member) {
        result = result.filter(lead => lead.assignedTo === member.name)
      }
    }
  }

  if (filters.value.status) {
    if (filters.value.status === 'convertible') {
      result = result.filter(lead => lead.stage !== 'converted' && lead.stage !== 'lost')
    } else if (filters.value.status === 'converted') {
      result = result.filter(lead => lead.stage === 'converted')
    } else if (filters.value.status === 'lost') {
      result = result.filter(lead => lead.stage === 'lost')
    }
  }

  return result
})

const totalLeads = computed(() => filteredLeads.value.length)
const totalPages = computed(() => Math.ceil(filteredLeads.value.length / itemsPerPage.value))
const startIndex = computed(() => (currentPage.value - 1) * itemsPerPage.value + 1)
const endIndex = computed(() => Math.min(currentPage.value * itemsPerPage.value, filteredLeads.value.length))

const paginatedLeads = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value
  const end = start + itemsPerPage.value
  return filteredLeads.value.slice(start, end)
})

const allLeadsSelected = computed(() => {
  return paginatedLeads.value.length > 0 && paginatedLeads.value.every(lead => selectedLeads.value.includes(lead.id))
})

// Methods
const getLeadsByStage = (stageId: string) => {
  return filteredLeads.value.filter(lead => lead.stage === stageId)
}

const getInitials = (name: string): string => {
  return name
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

const getScoreBadge = (score: number): string => {
  if (score >= 80) return 'px-2 py-1 text-xs font-medium text-green-700 bg-green-100 rounded-full'
  if (score >= 60) return 'px-2 py-1 text-xs font-medium text-yellow-700 bg-yellow-100 rounded-full'
  if (score >= 40) return 'px-2 py-1 text-xs font-medium text-orange-700 bg-orange-100 rounded-full'
  return 'px-2 py-1 text-xs font-medium text-red-700 bg-red-100 rounded-full'
}

const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount)
}

const formatDate = (date: Date): string => {
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  const days = Math.floor(diff / 86400000)
  
  if (days === 0) return 'Today'
  if (days === 1) return 'Yesterday'
  if (days < 7) return `${days} days ago`
  
  return date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })
}

const onDragStart = (lead: any, event: DragEvent) => {
  draggedLead.value = lead
  event.dataTransfer!.effectAllowed = 'move'
}

const onDrop = (stageId: string, event: DragEvent) => {
  event.preventDefault()
  if (draggedLead.value) {
    draggedLead.value.stage = stageId
    draggedLead.value = null
  }
}

const updateLeadStage = (leadId: string, newStage: string) => {
  const lead = leads.value.find(l => l.id === leadId)
  if (lead) {
    lead.stage = newStage
  }
}

const addLead = () => {
  router.push('/crm/leads/add')
}

const addLeadToStage = (stageId: string) => {
  router.push(`/crm/leads/add?stage=${stageId}`)
}

const viewLead = (id: string) => {
  router.push(`/crm/leads/${id}`)
}

const editLead = (id: string) => {
  router.push(`/crm/leads/${id}/edit`)
}

const convertLead = (id: string) => {
  router.push(`/crm/leads/${id}/convert`)
}

const toggleAllLeads = () => {
  if (allLeadsSelected.value) {
    // Deselect all current page leads
    selectedLeads.value = selectedLeads.value.filter(id => !paginatedLeads.value.some(lead => lead.id === id))
  } else {
    // Select all current page leads
    const currentPageIds = paginatedLeads.value.map(lead => lead.id)
    const newSelections = currentPageIds.filter(id => !selectedLeads.value.includes(id))
    selectedLeads.value = [...selectedLeads.value, ...newSelections]
  }
}

const bulkConvertLeads = () => {
  if (selectedLeads.value.length === 0) return
  
  const leadNames = selectedLeads.value
    .map(id => {
      const lead = leads.value.find(l => l.id === id)
      return lead ? lead.name : 'Unknown'
    })
    .join(', ')
  
  const confirmMessage = `Are you sure you want to convert ${selectedLeads.value.length} selected lead(s) to opportunities?\n\nLeads: ${leadNames}`
  
  if (confirm(confirmMessage)) {
    // TODO: Implement bulk conversion API call
    console.log('Bulk converting leads:', selectedLeads.value)
    
    // For now, just show success message and clear selection
    alert(`Successfully converted ${selectedLeads.value.length} lead(s) to opportunities!`)
    selectedLeads.value = []
    
    // In a real app, you would:
    // 1. Call API to bulk convert leads
    // 2. Update leads status to 'converted'
    // 3. Refresh the leads list
    // 4. Navigate to opportunities page or show summary
  }
}

const importLeads = () => {
  console.log('Importing leads...')
}

const exportLeads = () => {
  console.log('Exporting leads...')
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
  name: "CRMLeads",
})

// Initialize
onMounted(() => {
  // Load leads data
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

/* Drag and drop styles */
[draggable="true"] {
  cursor: move;
}

[draggable="true"]:active {
  opacity: 0.5;
}
</style>