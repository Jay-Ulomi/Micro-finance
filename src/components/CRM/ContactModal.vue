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
          {{ isEditing ? 'Edit Contact' : 'Add New Contact' }}
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
        <form @submit.prevent="saveContact" class="space-y-6">
          <!-- Contact Type -->
          <div>
            <label class="form-label">Contact Type *</label>
            <select v-model="form.type" class="form-input" required>
              <option value="">Select Type</option>
              <option value="individual">Individual</option>
              <option value="business">Business</option>
              <option value="organization">Organization</option>
            </select>
          </div>

          <!-- Basic Information -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div v-if="form.type === 'individual'">
              <label class="form-label">First Name *</label>
              <input
                v-model="form.firstName"
                type="text"
                class="form-input"
                required
                placeholder="Enter first name"
              />
            </div>
            <div v-if="form.type === 'individual'">
              <label class="form-label">Last Name *</label>
              <input
                v-model="form.lastName"
                type="text"
                class="form-input"
                required
                placeholder="Enter last name"
              />
            </div>
            <div v-if="form.type !== 'individual'" class="md:col-span-2">
              <label class="form-label">{{ form.type === 'business' ? 'Business Name' : 'Organization Name' }} *</label>
              <input
                v-model="form.companyName"
                type="text"
                class="form-input"
                required
                placeholder="Enter name"
              />
            </div>
          </div>

          <!-- Contact Information -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
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
            <div>
              <label class="form-label">Mobile</label>
              <input
                v-model="form.mobile"
                type="tel"
                class="form-input"
                placeholder="+255 XXX XXX XXX"
              />
            </div>
            <div v-if="form.type !== 'individual'">
              <label class="form-label">Website</label>
              <input
                v-model="form.website"
                type="url"
                class="form-input"
                placeholder="https://example.com"
              />
            </div>
          </div>

          <!-- Job Information (for individuals) -->
          <div v-if="form.type === 'individual'" class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="form-label">Job Title</label>
              <input
                v-model="form.jobTitle"
                type="text"
                class="form-input"
                placeholder="Enter job title"
              />
            </div>
            <div>
              <label class="form-label">Company</label>
              <input
                v-model="form.companyName"
                type="text"
                class="form-input"
                placeholder="Enter company name"
              />
            </div>
          </div>

          <!-- Address -->
          <div class="space-y-4">
            <h4 class="text-sm font-medium text-gray-900">Address</h4>
            <div>
              <label class="form-label">Street Address</label>
              <input
                v-model="form.address.street"
                type="text"
                class="form-input"
                placeholder="Enter street address"
              />
            </div>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label class="form-label">City</label>
                <input
                  v-model="form.address.city"
                  type="text"
                  class="form-input"
                  placeholder="Enter city"
                />
              </div>
              <div>
                <label class="form-label">State/Region</label>
                <input
                  v-model="form.address.state"
                  type="text"
                  class="form-input"
                  placeholder="Enter state"
                />
              </div>
              <div>
                <label class="form-label">Postal Code</label>
                <input
                  v-model="form.address.postalCode"
                  type="text"
                  class="form-input"
                  placeholder="Enter postal code"
                />
              </div>
            </div>
            <div>
              <label class="form-label">Country</label>
              <select v-model="form.address.country" class="form-input">
                <option value="">Select Country</option>
                <option value="Tanzania">Tanzania</option>
                <option value="Kenya">Kenya</option>
                <option value="Uganda">Uganda</option>
                <option value="Rwanda">Rwanda</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          <!-- Additional Information -->
          <div class="space-y-4">
            <h4 class="text-sm font-medium text-gray-900">Additional Information</h4>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="form-label">Source</label>
                <select v-model="form.source" class="form-input">
                  <option value="">Select Source</option>
                  <option value="website">Website</option>
                  <option value="referral">Referral</option>
                  <option value="social_media">Social Media</option>
                  <option value="advertisement">Advertisement</option>
                  <option value="walk_in">Walk In</option>
                  <option value="phone_inquiry">Phone Inquiry</option>
                  <option value="other">Other</option>
                </select>
              </div>
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

            <!-- Notes -->
            <div>
              <label class="form-label">Notes</label>
              <textarea
                v-model="form.notes"
                rows="3"
                class="form-input"
                placeholder="Add any additional notes..."
              ></textarea>
            </div>
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
              {{ loading ? 'Saving...' : (isEditing ? 'Update Contact' : 'Create Contact') }}
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

interface Contact {
  id?: string
  type: string
  firstName?: string
  lastName?: string
  companyName?: string
  email: string
  phone: string
  mobile?: string
  website?: string
  jobTitle?: string
  address: {
    street?: string
    city?: string
    state?: string
    postalCode?: string
    country?: string
  }
  source?: string
  assignedTo?: string
  tags: string[]
  notes?: string
}

interface Props {
  isOpen: boolean
  contact?: Contact | null
}

const props = defineProps<Props>()
const emit = defineEmits<{
  close: []
  saved: [contact: Contact]
}>()

const loading = ref(false)
const error = ref('')

const availableTags = ref([
  'VIP', 'High Value', 'New', 'Hot Lead', 'Existing Customer', 
  'Referral', 'Corporate', 'Individual', 'At Risk', 'Potential'
])

const defaultForm: Contact = {
  type: '',
  firstName: '',
  lastName: '',
  companyName: '',
  email: '',
  phone: '',
  mobile: '',
  website: '',
  jobTitle: '',
  address: {
    street: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'Tanzania'
  },
  source: '',
  assignedTo: '',
  tags: [],
  notes: ''
}

const form = ref<Contact>({ ...defaultForm })

const isEditing = computed(() => props.contact && props.contact.id)

// Watch for contact changes
watch(() => props.contact, (newContact) => {
  if (newContact) {
    form.value = { ...newContact }
  } else {
    form.value = { ...defaultForm }
  }
}, { immediate: true })

// Reset form when modal opens
watch(() => props.isOpen, (isOpen) => {
  if (isOpen) {
    error.value = ''
    if (props.contact) {
      form.value = { ...props.contact }
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

const saveContact = async () => {
  loading.value = true
  error.value = ''

  try {
    // Validate required fields
    if (!form.value.type) {
      throw new Error('Contact type is required')
    }
    if (!form.value.email) {
      throw new Error('Email is required')
    }
    if (!form.value.phone) {
      throw new Error('Phone is required')
    }
    if (form.value.type === 'individual' && (!form.value.firstName || !form.value.lastName)) {
      throw new Error('First name and last name are required for individuals')
    }
    if (form.value.type !== 'individual' && !form.value.companyName) {
      throw new Error('Company/Organization name is required')
    }

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))

    // Generate ID for new contacts
    if (!form.value.id) {
      form.value.id = 'contact_' + Date.now()
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
  name: 'ContactModal'
})
</script>