<template>
  <div class="space-y-6">
    <!-- Page Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Contacts</h1>
        <p class="text-sm text-gray-600 mt-1">Manage your customer contacts and relationships</p>
      </div>
      <div class="flex space-x-3">
        <button @click="importContacts" class="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors">
          <ArrowUpTrayIcon class="w-4 h-4 mr-2" />
          Import
        </button>
        <button @click="exportContacts" class="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors">
          <ArrowDownTrayIcon class="w-4 h-4 mr-2" />
          Export
        </button>
        <button @click="addContact" class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
          <PlusIcon class="w-4 h-4 mr-2" />
          Add Contact
        </button>
      </div>
    </div>

    <!-- Filters and Search -->
    <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <!-- Search -->
        <div class="md:col-span-2">
          <label for="search" class="form-label">Search Contacts</label>
          <div class="relative">
            <MagnifyingGlassIcon class="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              id="search"
              v-model="searchQuery"
              type="text"
              placeholder="Search by name, email, phone..."
              class="form-input pl-10"
            />
          </div>
        </div>

        <!-- Contact Type -->
        <div>
          <label for="contactType" class="form-label">Contact Type</label>
          <select id="contactType" v-model="filters.contactType" class="form-input">
            <option value="">All Types</option>
            <option value="individual">Individual</option>
            <option value="business">Business</option>
            <option value="organization">Organization</option>
          </select>
        </div>

        <!-- Status -->
        <div>
          <label for="status" class="form-label">Status</label>
          <select id="status" v-model="filters.status" class="form-input">
            <option value="">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="prospect">Prospect</option>
            <option value="lead">Lead</option>
            <option value="customer">Customer</option>
          </select>
        </div>

        <!-- Tags -->
        <div>
          <label for="tags" class="form-label">Tags</label>
          <select id="tags" v-model="filters.tags" class="form-input">
            <option value="">All Tags</option>
            <option value="vip">VIP</option>
            <option value="high-value">High Value</option>
            <option value="new">New</option>
            <option value="at-risk">At Risk</option>
          </select>
        </div>

        <!-- Date Range -->
        <div>
          <label for="dateRange" class="form-label">Created Date</label>
          <select id="dateRange" v-model="filters.dateRange" class="form-input">
            <option value="">All Time</option>
            <option value="today">Today</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="quarter">This Quarter</option>
            <option value="year">This Year</option>
          </select>
        </div>

        <!-- Assigned To -->
        <div>
          <label for="assignedTo" class="form-label">Assigned To</label>
          <select id="assignedTo" v-model="filters.assignedTo" class="form-input">
            <option value="">All Staff</option>
            <option value="me">Me</option>
            <option value="unassigned">Unassigned</option>
            <option v-for="staff in staffMembers" :key="staff.id" :value="staff.id">
              {{ staff.name }}
            </option>
          </select>
        </div>

        <!-- Source -->
        <div>
          <label for="source" class="form-label">Source</label>
          <select id="source" v-model="filters.source" class="form-input">
            <option value="">All Sources</option>
            <option value="walk-in">Walk-in</option>
            <option value="referral">Referral</option>
            <option value="website">Website</option>
            <option value="social-media">Social Media</option>
            <option value="campaign">Campaign</option>
          </select>
        </div>
      </div>

      <div class="mt-4 flex justify-between items-center">
        <button @click="clearFilters" class="text-sm text-gray-600 hover:text-gray-900">
          Clear Filters
        </button>
        <div class="text-sm text-gray-600">
          Showing {{ filteredContacts.length }} of {{ totalContacts }} contacts
        </div>
      </div>
    </div>

    <!-- View Toggle and Bulk Actions -->
    <div class="flex items-center justify-between">
      <div class="flex items-center space-x-4">
        <div class="flex items-center space-x-2">
          <input
            type="checkbox"
            v-model="selectAll"
            @change="toggleSelectAll"
            class="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
          />
          <span class="text-sm text-gray-700">Select All</span>
        </div>
        <div v-if="selectedContacts.length > 0" class="flex items-center space-x-2">
          <span class="text-sm text-gray-600">{{ selectedContacts.length }} selected</span>
          <button @click="bulkAssign" class="text-sm text-blue-600 hover:text-blue-800">Assign</button>
          <button @click="bulkTag" class="text-sm text-blue-600 hover:text-blue-800">Tag</button>
          <button @click="bulkEmail" class="text-sm text-blue-600 hover:text-blue-800">Email</button>
          <button @click="bulkDelete" class="text-sm text-red-600 hover:text-red-800">Delete</button>
        </div>
      </div>
      
      <div class="flex items-center space-x-2">
        <button
          @click="viewMode = 'table'"
          :class="viewMode === 'table' ? 'bg-gray-200' : 'bg-white'"
          class="p-2 rounded-lg border border-gray-300 hover:bg-gray-100 transition-colors"
        >
          <TableCellsIcon class="w-4 h-4 text-gray-600" />
        </button>
        <button
          @click="viewMode = 'grid'"
          :class="viewMode === 'grid' ? 'bg-gray-200' : 'bg-white'"
          class="p-2 rounded-lg border border-gray-300 hover:bg-gray-100 transition-colors"
        >
          <Squares2X2Icon class="w-4 h-4 text-gray-600" />
        </button>
      </div>
    </div>

    <!-- Contacts Table View -->
    <div v-if="viewMode === 'table'" class="bg-white rounded-lg shadow-sm border border-gray-200">
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
                Contact
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Type
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Phone
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Email
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Assigned To
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Last Contact
              </th>
              <th class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="contact in paginatedContacts" :key="contact.id" class="hover:bg-gray-50">
              <td class="px-6 py-4">
                <input
                  type="checkbox"
                  :value="contact.id"
                  v-model="selectedContacts"
                  class="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
              </td>
              <td class="px-6 py-4">
                <div class="flex items-center">
                  <div class="flex-shrink-0 h-10 w-10">
                    <div v-if="contact.avatar" class="h-10 w-10 rounded-full overflow-hidden">
                      <img :src="contact.avatar" :alt="contact.name" class="h-full w-full object-cover" />
                    </div>
                    <div v-else class="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                      <span class="text-sm font-medium text-gray-600">{{ getInitials(contact.name) }}</span>
                    </div>
                  </div>
                  <div class="ml-4">
                    <div class="text-sm font-medium text-gray-900">{{ contact.name }}</div>
                    <div class="text-xs text-gray-500">{{ contact.company }}</div>
                    <div v-if="contact.tags.length > 0" class="flex gap-1 mt-1">
                      <span v-for="tag in contact.tags" :key="tag" class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                        {{ tag }}
                      </span>
                    </div>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span class="text-sm text-gray-900">{{ contact.type }}</span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span class="text-sm text-gray-900">{{ contact.phone }}</span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span class="text-sm text-gray-900">{{ contact.email }}</span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span :class="getStatusBadge(contact.status)">
                  {{ contact.status }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span class="text-sm text-gray-900">{{ contact.assignedTo }}</span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span class="text-sm text-gray-500">{{ formatDate(contact.lastContact) }}</span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-center">
                <div class="flex items-center justify-center space-x-2">
                  <button
                    @click="viewContact(contact.id)"
                    class="text-blue-600 hover:text-blue-900"
                    title="View"
                  >
                    <EyeIcon class="w-4 h-4" />
                  </button>
                  <button
                    @click="editContact(contact.id)"
                    class="text-yellow-600 hover:text-yellow-900"
                    title="Edit"
                  >
                    <PencilIcon class="w-4 h-4" />
                  </button>
                  <button
                    @click="callContact(contact.id)"
                    class="text-green-600 hover:text-green-900"
                    title="Call"
                  >
                    <PhoneIcon class="w-4 h-4" />
                  </button>
                  <button
                    @click="emailContact(contact.id)"
                    class="text-purple-600 hover:text-purple-900"
                    title="Email"
                  >
                    <EnvelopeIcon class="w-4 h-4" />
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
            Showing {{ startIndex }} to {{ endIndex }} of {{ totalContacts }} contacts
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

    <!-- Contacts Grid View -->
    <div v-if="viewMode === 'grid'" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      <div
        v-for="contact in paginatedContacts"
        :key="contact.id"
        class="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
      >
        <div class="p-6">
          <div class="flex items-start justify-between mb-4">
            <div class="flex items-center">
              <div v-if="contact.avatar" class="h-12 w-12 rounded-full overflow-hidden">
                <img :src="contact.avatar" :alt="contact.name" class="h-full w-full object-cover" />
              </div>
              <div v-else class="h-12 w-12 rounded-full bg-gray-200 flex items-center justify-center">
                <span class="text-lg font-medium text-gray-600">{{ getInitials(contact.name) }}</span>
              </div>
              <div class="ml-3">
                <h3 class="text-sm font-medium text-gray-900">{{ contact.name }}</h3>
                <p class="text-xs text-gray-500">{{ contact.company }}</p>
              </div>
            </div>
            <input
              type="checkbox"
              :value="contact.id"
              v-model="selectedContacts"
              class="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
          </div>

          <div class="space-y-2 mb-4">
            <div class="flex items-center text-xs text-gray-600">
              <PhoneIcon class="w-3 h-3 mr-2" />
              {{ contact.phone }}
            </div>
            <div class="flex items-center text-xs text-gray-600">
              <EnvelopeIcon class="w-3 h-3 mr-2" />
              {{ contact.email }}
            </div>
            <div class="flex items-center text-xs text-gray-600">
              <UserIcon class="w-3 h-3 mr-2" />
              {{ contact.assignedTo }}
            </div>
          </div>

          <div class="flex items-center justify-between mb-4">
            <span :class="getStatusBadge(contact.status)">
              {{ contact.status }}
            </span>
            <span class="text-xs text-gray-500">
              {{ formatDate(contact.lastContact) }}
            </span>
          </div>

          <div v-if="contact.tags.length > 0" class="flex flex-wrap gap-1 mb-4">
            <span v-for="tag in contact.tags" :key="tag" class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
              {{ tag }}
            </span>
          </div>

          <div class="flex items-center justify-between pt-4 border-t border-gray-200">
            <button @click="viewContact(contact.id)" class="text-sm text-blue-600 hover:text-blue-800">
              View Details
            </button>
            <div class="flex items-center space-x-2">
              <button @click="callContact(contact.id)" class="text-green-600 hover:text-green-900">
                <PhoneIcon class="w-4 h-4" />
              </button>
              <button @click="emailContact(contact.id)" class="text-purple-600 hover:text-purple-900">
                <EnvelopeIcon class="w-4 h-4" />
              </button>
              <button @click="editContact(contact.id)" class="text-yellow-600 hover:text-yellow-900">
                <PencilIcon class="w-4 h-4" />
              </button>
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
  ArrowUpTrayIcon,
  ArrowDownTrayIcon,
  MagnifyingGlassIcon,
  TableCellsIcon,
  Squares2X2Icon,
  EyeIcon,
  PencilIcon,
  PhoneIcon,
  EnvelopeIcon,
  UserIcon,
} from '@heroicons/vue/24/outline'

const router = useRouter()

// Reactive data
const viewMode = ref<'table' | 'grid'>('table')
const searchQuery = ref('')
const selectAll = ref(false)
const selectedContacts = ref<string[]>([])
const currentPage = ref(1)
const itemsPerPage = ref(20)

const filters = ref({
  contactType: '',
  status: '',
  tags: '',
  dateRange: '',
  assignedTo: '',
  source: ''
})

const staffMembers = ref([
  { id: 'staff1', name: 'Alice Mkamba' },
  { id: 'staff2', name: 'James Mwenda' },
  { id: 'staff3', name: 'Grace Ndege' },
  { id: 'staff4', name: 'Peter Kimaro' }
])

const contacts = ref([
  {
    id: 'C001',
    name: 'John Doe',
    company: 'ABC Trading Ltd',
    type: 'Business',
    phone: '+255 712 345 678',
    email: 'john.doe@abctrading.co.tz',
    status: 'customer',
    assignedTo: 'Alice Mkamba',
    lastContact: new Date(Date.now() - 86400000),
    tags: ['VIP', 'High Value'],
    avatar: null
  },
  {
    id: 'C002',
    name: 'Jane Smith',
    company: '',
    type: 'Individual',
    phone: '+255 754 321 098',
    email: 'jane.smith@email.com',
    status: 'lead',
    assignedTo: 'James Mwenda',
    lastContact: new Date(Date.now() - 172800000),
    tags: ['New'],
    avatar: null
  },
  {
    id: 'C003',
    name: 'Michael Johnson',
    company: 'Tech Solutions',
    type: 'Business',
    phone: '+255 789 456 123',
    email: 'michael@techsolutions.co.tz',
    status: 'prospect',
    assignedTo: 'Grace Ndege',
    lastContact: new Date(Date.now() - 259200000),
    tags: [],
    avatar: null
  },
  {
    id: 'C004',
    name: 'Sarah Williams',
    company: '',
    type: 'Individual',
    phone: '+255 765 432 109',
    email: 'sarah.w@email.com',
    status: 'active',
    assignedTo: 'Peter Kimaro',
    lastContact: new Date(),
    tags: ['At Risk'],
    avatar: null
  },
  {
    id: 'C005',
    name: 'Robert Brown',
    company: 'Brown Enterprises',
    type: 'Business',
    phone: '+255 713 579 246',
    email: 'robert@brownent.co.tz',
    status: 'customer',
    assignedTo: 'Alice Mkamba',
    lastContact: new Date(Date.now() - 432000000),
    tags: ['VIP'],
    avatar: null
  }
])

// Computed properties
const filteredContacts = computed(() => {
  let result = [...contacts.value]

  // Apply search
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    result = result.filter(contact =>
      contact.name.toLowerCase().includes(query) ||
      contact.email.toLowerCase().includes(query) ||
      contact.phone.includes(query) ||
      contact.company.toLowerCase().includes(query)
    )
  }

  // Apply filters
  if (filters.value.contactType) {
    result = result.filter(contact => contact.type.toLowerCase() === filters.value.contactType)
  }

  if (filters.value.status) {
    result = result.filter(contact => contact.status === filters.value.status)
  }

  if (filters.value.tags) {
    result = result.filter(contact => contact.tags.includes(filters.value.tags))
  }

  if (filters.value.assignedTo) {
    if (filters.value.assignedTo === 'me') {
      result = result.filter(contact => contact.assignedTo === 'Current User')
    } else if (filters.value.assignedTo === 'unassigned') {
      result = result.filter(contact => !contact.assignedTo)
    } else {
      const staff = staffMembers.value.find(s => s.id === filters.value.assignedTo)
      if (staff) {
        result = result.filter(contact => contact.assignedTo === staff.name)
      }
    }
  }

  return result
})

const totalContacts = computed(() => contacts.value.length)
const totalPages = computed(() => Math.ceil(filteredContacts.value.length / itemsPerPage.value))
const startIndex = computed(() => (currentPage.value - 1) * itemsPerPage.value + 1)
const endIndex = computed(() => Math.min(currentPage.value * itemsPerPage.value, filteredContacts.value.length))

const paginatedContacts = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value
  const end = start + itemsPerPage.value
  return filteredContacts.value.slice(start, end)
})

// Methods
const getInitials = (name: string): string => {
  return name
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

const getStatusBadge = (status: string): string => {
  const badges = {
    active: 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800',
    inactive: 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800',
    prospect: 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800',
    lead: 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800',
    customer: 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800'
  }
  return badges[status] || badges.inactive
}

const formatDate = (date: Date): string => {
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  const days = Math.floor(diff / 86400000)
  
  if (days === 0) return 'Today'
  if (days === 1) return 'Yesterday'
  if (days < 7) return `${days} days ago`
  
  return date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
}

const toggleSelectAll = () => {
  if (selectAll.value) {
    selectedContacts.value = paginatedContacts.value.map(c => c.id)
  } else {
    selectedContacts.value = []
  }
}

const clearFilters = () => {
  filters.value = {
    contactType: '',
    status: '',
    tags: '',
    dateRange: '',
    assignedTo: '',
    source: ''
  }
  searchQuery.value = ''
}

const addContact = () => {
  router.push('/crm/contacts/add')
}

const viewContact = (id: string) => {
  router.push(`/crm/contacts/${id}`)
}

const editContact = (id: string) => {
  router.push(`/crm/contacts/${id}/edit`)
}

const callContact = (id: string) => {
  console.log('Calling contact:', id)
  // Implement call functionality
}

const emailContact = (id: string) => {
  console.log('Emailing contact:', id)
  // Implement email functionality
}

const importContacts = () => {
  console.log('Importing contacts...')
  // Implement import functionality
}

const exportContacts = () => {
  console.log('Exporting contacts...')
  // Implement export functionality
}

const bulkAssign = () => {
  console.log('Bulk assign:', selectedContacts.value)
  // Implement bulk assign
}

const bulkTag = () => {
  console.log('Bulk tag:', selectedContacts.value)
  // Implement bulk tag
}

const bulkEmail = () => {
  console.log('Bulk email:', selectedContacts.value)
  // Implement bulk email
}

const bulkDelete = () => {
  if (confirm(`Are you sure you want to delete ${selectedContacts.value.length} contacts?`)) {
    console.log('Bulk delete:', selectedContacts.value)
    // Implement bulk delete
  }
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
  name: "CRMContacts",
})

// Initialize
onMounted(() => {
  // Load contacts data
})
</script>

<style scoped>
@media print {
  .btn,
  button {
    display: none !important;
  }
}
</style>