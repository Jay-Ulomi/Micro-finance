<template>
  <div
    v-if="isOpen"
    class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    @click.self="closeModal"
  >
    <div class="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-hidden">
      <!-- Modal Header -->
      <div class="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
        <h3 class="text-lg font-semibold text-gray-900">
          {{ isEditing ? 'Edit Lead' : 'Add New Lead' }}
        </h3>
        <button
          @click="closeModal"
          class="text-gray-400 hover:text-gray-600 transition-colors"
        >
          <XMarkIcon class="w-6 h-6" />
        </button>
      </div>

      <!-- Modal Body -->
      <div class="px-6 py-4 overflow-y-auto max-h-[calc(90vh-8rem)]">
        <form @submit.prevent="saveLead" class="space-y-6">
          <!-- Lead Status & Priority -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="form-label">Lead Status *</label>
              <select v-model="form.status" class="form-input" required>
                <option value="">Select Status</option>
                <option value="new">New</option>
                <option value="contacted">Contacted</option>
                <option value="qualified">Qualified</option>
                <option value="proposal">Proposal Sent</option>
                <option value="negotiation">In Negotiation</option>
                <option value="won">Won</option>
                <option value="lost">Lost</option>
              </select>
            </div>
            <div>
              <label class="form-label">Priority *</label>
              <select v-model="form.priority" class="form-input" required>
                <option value="">Select Priority</option>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="urgent">Urgent</option>
              </select>
            </div>
          </div>

          <!-- Lead Source & Value -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="form-label">Lead Source *</label>
              <select v-model="form.source" class="form-input" required>
                <option value="">Select Source</option>
                <option value="website">Website</option>
                <option value="referral">Referral</option>
                <option value="social_media">Social Media</option>
                <option value="advertisement">Advertisement</option>
                <option value="walk_in">Walk In</option>
                <option value="phone_inquiry">Phone Inquiry</option>
                <option value="email_campaign">Email Campaign</option>
                <option value="trade_show">Trade Show</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div>
              <label class="form-label">Estimated Value (TZS)</label>
              <input
                v-model.number="form.estimatedValue"
                type="number"
                min="0"
                step="1000"
                class="form-input"
                placeholder="0"
              />
            </div>
          </div>

          <!-- Lead Type -->
          <div>
            <label class="form-label">Lead Type *</label>
            <select v-model="form.type" class="form-input" required>
              <option value="">Select Type</option>
              <option value="individual">Individual Loan</option>
              <option value="group">Group Loan</option>
              <option value="business">Business Loan</option>
              <option value="savings">Savings Account</option>
              <option value="investment">Investment Product</option>
              <option value="other">Other</option>
            </select>
          </div>

          <!-- Contact Information -->
          <div class="space-y-4">
            <h4 class="text-sm font-medium text-gray-900">Contact Information</h4>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="form-label">Full Name *</label>
                <input
                  v-model="form.name"
                  type="text"
                  class="form-input"
                  required
                  placeholder="Enter full name"
                />
              </div>
              <div>
                <label class="form-label">Company/Organization</label>
                <input
                  v-model="form.company"
                  type="text"
                  class="form-input"
                  placeholder="Enter company name"
                />
              </div>
              <div>
                <label class="form-label">Email *</label>
                <input
                  v-model="form.email"
                  type="email"
                  class="form-input"
                  required
                  placeholder="Enter email address"
                />
              </div>
              <div>
                <label class="form-label">Phone *</label>
                <input
                  v-model="form.phone"
                  type="tel"
                  class="form-input"
                  required
                  placeholder="+255 XXX XXX XXX"
                />
              </div>
            </div>
          </div>

          <!-- Location -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="form-label">City</label>
              <input
                v-model="form.city"
                type="text"
                class="form-input"
                placeholder="Enter city"
              />
            </div>
            <div>
              <label class="form-label">Region</label>
              <input
                v-model="form.region"
                type="text"
                class="form-input"
                placeholder="Enter region"
              />
            </div>
          </div>

          <!-- Assignment & Follow-up -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="form-label">Assigned To</label>
              <select v-model="form.assignedTo" class="form-input">
                <option value="">Select Staff Member</option>
                <option value="staff1">Alice Mkamba</option>
                <option value="staff2">James Mwenda</option>
                <option value="staff3">Grace Ndege</option>
                <option value="staff4">Peter Kimaro</option>
              </select>
            </div>
            <div>
              <label class="form-label">Follow-up Date</label>
              <input
                v-model="form.followUpDate"
                type="date"
                class="form-input"
              />
            </div>
          </div>

          <!-- Tags -->
          <div>
            <label class="form-label">Tags</label>
            <div class="flex flex-wrap gap-2 mt-2">
              <button
                v-for="tag in availableTags"
                :key="tag"
                type="button"
                @click="toggleTag(tag)"
                :class="[
                  'px-3 py-1 rounded-full text-sm transition-colors',
                  form.tags.includes(tag)
                    ? 'bg-blue-100 text-blue-800'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                ]"
              >
                {{ tag }}
              </button>
            </div>
          </div>

          <!-- Description/Notes -->
          <div>
            <label class="form-label">Description/Notes</label>
            <textarea
              v-model="form.description"
              rows="3"
              class="form-input"
              placeholder="Add details about the lead, requirements, conversation notes..."
            ></textarea>
          </div>

          <!-- Error Message -->
          <div v-if="error" class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            {{ error }}
          </div>

          <!-- Form Actions -->
          <div class="flex justify-end space-x-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              @click="closeModal"
              class="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              :disabled="loading"
              class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
            >
              {{ loading ? 'Saving...' : (isEditing ? 'Update Lead' : 'Create Lead') }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import { XMarkIcon } from '@heroicons/vue/24/outline'

interface Lead {
  id?: string
  name: string
  email: string
  phone: string
  company?: string
  city?: string
  region?: string
  status: string
  priority: string
  source: string
  type: string
  estimatedValue?: number
  assignedTo?: string
  followUpDate?: string
  tags: string[]
  description?: string
}

interface Props {
  isOpen: boolean
  lead?: Lead | null
}

const props = defineProps<Props>()
const emit = defineEmits<{
  close: []
  saved: [lead: Lead]
}>()

const loading = ref(false)
const error = ref('')

const availableTags = ref([
  'Hot Lead', 'Qualified', 'Follow-up Required', 'High Value', 'Group Interest',
  'Business Loan', 'Personal Loan', 'Savings Interest', 'Investment', 'Referral'
])

const defaultForm: Lead = {
  name: '',
  email: '',
  phone: '',
  company: '',
  city: '',
  region: '',
  status: 'new',
  priority: 'medium',
  source: '',
  type: '',
  estimatedValue: undefined,
  assignedTo: '',
  followUpDate: '',
  tags: [],
  description: ''
}

const form = ref<Lead>({ ...defaultForm })

const isEditing = computed(() => props.lead && props.lead.id)

// Watch for lead changes
watch(() => props.lead, (newLead) => {
  if (newLead) {
    form.value = { ...newLead }
  } else {
    form.value = { ...defaultForm }
  }
}, { immediate: true })

// Reset form when modal opens
watch(() => props.isOpen, (isOpen) => {
  if (isOpen) {
    error.value = ''
    if (props.lead) {
      form.value = { ...props.lead }
    } else {
      form.value = { ...defaultForm }
    }
  }
})

const closeModal = () => {
  emit('close')
  form.value = { ...defaultForm }
  error.value = ''
}

const toggleTag = (tag: string) => {
  const index = form.value.tags.indexOf(tag)
  if (index === -1) {
    form.value.tags.push(tag)
  } else {
    form.value.tags.splice(index, 1)
  }
}

const saveLead = async () => {
  loading.value = true
  error.value = ''

  try {
    // Validate required fields
    if (!form.value.name.trim()) {
      throw new Error('Name is required')
    }
    if (!form.value.email.trim()) {
      throw new Error('Email is required')
    }
    if (!form.value.phone.trim()) {
      throw new Error('Phone is required')
    }
    if (!form.value.status) {
      throw new Error('Lead status is required')
    }
    if (!form.value.priority) {
      throw new Error('Priority is required')
    }
    if (!form.value.source) {
      throw new Error('Lead source is required')
    }
    if (!form.value.type) {
      throw new Error('Lead type is required')
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(form.value.email)) {
      throw new Error('Please enter a valid email address')
    }

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))

    // Generate ID for new leads
    if (!form.value.id) {
      form.value.id = 'lead_' + Date.now()
    }

    emit('saved', { ...form.value })
    closeModal()
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'An error occurred'
  } finally {
    loading.value = false
  }
}

defineOptions({
  name: 'LeadModal'
})
</script>