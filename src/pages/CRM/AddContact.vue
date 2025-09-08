<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Add Contact</h1>
        <p class="text-sm text-gray-600 mt-1">Create a new contact profile</p>
      </div>
      <button @click="$router.back()" class="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors">
        <ArrowLeftIcon class="w-4 h-4 mr-2 inline" />
        Back
      </button>
    </div>

    <form @submit.prevent="submitForm" class="space-y-8">
      <!-- Basic Information -->
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 class="text-lg font-semibold text-gray-900 mb-6">Basic Information</h2>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <!-- Contact Type -->
          <div>
            <label for="contactType" class="form-label">
              Contact Type <span class="text-red-500">*</span>
            </label>
            <select id="contactType" v-model="form.contactType" class="form-input" required>
              <option value="">Select Type</option>
              <option value="individual">Individual</option>
              <option value="business">Business</option>
              <option value="organization">Organization</option>
            </select>
          </div>

          <!-- Status -->
          <div>
            <label for="status" class="form-label">
              Status <span class="text-red-500">*</span>
            </label>
            <select id="status" v-model="form.status" class="form-input" required>
              <option value="">Select Status</option>
              <option value="lead">Lead</option>
              <option value="prospect">Prospect</option>
              <option value="customer">Customer</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>

          <!-- First Name -->
          <div>
            <label for="firstName" class="form-label">
              First Name <span class="text-red-500">*</span>
            </label>
            <input
              id="firstName"
              v-model="form.firstName"
              type="text"
              placeholder="Enter first name"
              class="form-input"
              required
            />
          </div>

          <!-- Last Name -->
          <div>
            <label for="lastName" class="form-label">
              Last Name <span class="text-red-500">*</span>
            </label>
            <input
              id="lastName"
              v-model="form.lastName"
              type="text"
              placeholder="Enter last name"
              class="form-input"
              required
            />
          </div>

          <!-- Email -->
          <div>
            <label for="email" class="form-label">
              Email <span class="text-red-500">*</span>
            </label>
            <input
              id="email"
              v-model="form.email"
              type="email"
              placeholder="Enter email address"
              class="form-input"
              required
            />
          </div>

          <!-- Phone -->
          <div>
            <label for="phone" class="form-label">
              Phone <span class="text-red-500">*</span>
            </label>
            <input
              id="phone"
              v-model="form.phone"
              type="tel"
              placeholder="Enter phone number"
              class="form-input"
              required
            />
          </div>

          <!-- Company -->
          <div>
            <label for="company" class="form-label">Company</label>
            <input
              id="company"
              v-model="form.company"
              type="text"
              placeholder="Enter company name"
              class="form-input"
            />
          </div>

          <!-- Job Title -->
          <div>
            <label for="jobTitle" class="form-label">Job Title</label>
            <input
              id="jobTitle"
              v-model="form.jobTitle"
              type="text"
              placeholder="Enter job title"
              class="form-input"
            />
          </div>
        </div>
      </div>

      <!-- Address Information -->
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 class="text-lg font-semibold text-gray-900 mb-6">Address Information</h2>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <!-- Street Address -->
          <div class="md:col-span-2">
            <label for="streetAddress" class="form-label">Street Address</label>
            <input
              id="streetAddress"
              v-model="form.streetAddress"
              type="text"
              placeholder="Enter street address"
              class="form-input"
            />
          </div>

          <!-- City -->
          <div>
            <label for="city" class="form-label">City</label>
            <input
              id="city"
              v-model="form.city"
              type="text"
              placeholder="Enter city"
              class="form-input"
            />
          </div>

          <!-- State/Province -->
          <div>
            <label for="state" class="form-label">State/Province</label>
            <input
              id="state"
              v-model="form.state"
              type="text"
              placeholder="Enter state/province"
              class="form-input"
            />
          </div>

          <!-- Postal Code -->
          <div>
            <label for="postalCode" class="form-label">Postal Code</label>
            <input
              id="postalCode"
              v-model="form.postalCode"
              type="text"
              placeholder="Enter postal code"
              class="form-input"
            />
          </div>

          <!-- Country -->
          <div>
            <label for="country" class="form-label">Country</label>
            <select id="country" v-model="form.country" class="form-input">
              <option value="">Select Country</option>
              <option value="TZ">Tanzania</option>
              <option value="KE">Kenya</option>
              <option value="UG">Uganda</option>
              <option value="RW">Rwanda</option>
              <option value="BI">Burundi</option>
            </select>
          </div>
        </div>
      </div>

      <!-- Additional Information -->
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 class="text-lg font-semibold text-gray-900 mb-6">Additional Information</h2>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <!-- Lead Source -->
          <div>
            <label for="leadSource" class="form-label">Lead Source</label>
            <select id="leadSource" v-model="form.leadSource" class="form-input">
              <option value="">Select Source</option>
              <option value="website">Website</option>
              <option value="referral">Referral</option>
              <option value="social_media">Social Media</option>
              <option value="email_campaign">Email Campaign</option>
              <option value="cold_call">Cold Call</option>
              <option value="event">Event</option>
              <option value="other">Other</option>
            </select>
          </div>

          <!-- Assigned To -->
          <div>
            <label for="assignedTo" class="form-label">Assigned To</label>
            <select id="assignedTo" v-model="form.assignedTo" class="form-input">
              <option value="">Select Staff Member</option>
              <option v-for="staff in staffMembers" :key="staff.id" :value="staff.id">
                {{ staff.name }}
              </option>
            </select>
          </div>

          <!-- Tags -->
          <div>
            <label for="tags" class="form-label">Tags</label>
            <select id="tags" v-model="form.tags" class="form-input" multiple>
              <option value="vip">VIP</option>
              <option value="high-value">High Value</option>
              <option value="new">New</option>
              <option value="at-risk">At Risk</option>
              <option value="partner">Partner</option>
            </select>
            <p class="text-sm text-gray-500 mt-1">Hold Ctrl/Cmd to select multiple</p>
          </div>

          <!-- Birthday -->
          <div>
            <label for="birthday" class="form-label">Birthday</label>
            <input
              id="birthday"
              v-model="form.birthday"
              type="date"
              class="form-input"
            />
          </div>

          <!-- Notes -->
          <div class="md:col-span-2">
            <label for="notes" class="form-label">Notes</label>
            <textarea
              id="notes"
              v-model="form.notes"
              rows="4"
              placeholder="Enter any additional notes..."
              class="form-input"
            ></textarea>
          </div>
        </div>
      </div>

      <!-- Social Media -->
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 class="text-lg font-semibold text-gray-900 mb-6">Social Media</h2>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <!-- LinkedIn -->
          <div>
            <label for="linkedin" class="form-label">LinkedIn</label>
            <input
              id="linkedin"
              v-model="form.linkedin"
              type="url"
              placeholder="LinkedIn profile URL"
              class="form-input"
            />
          </div>

          <!-- Twitter -->
          <div>
            <label for="twitter" class="form-label">Twitter</label>
            <input
              id="twitter"
              v-model="form.twitter"
              type="text"
              placeholder="@username"
              class="form-input"
            />
          </div>

          <!-- Facebook -->
          <div>
            <label for="facebook" class="form-label">Facebook</label>
            <input
              id="facebook"
              v-model="form.facebook"
              type="url"
              placeholder="Facebook profile URL"
              class="form-input"
            />
          </div>

          <!-- Website -->
          <div>
            <label for="website" class="form-label">Website</label>
            <input
              id="website"
              v-model="form.website"
              type="url"
              placeholder="https://example.com"
              class="form-input"
            />
          </div>
        </div>
      </div>

      <!-- Form Actions -->
      <div class="flex justify-end space-x-4">
        <button
          type="button"
          @click="$router.back()"
          class="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Save Contact
        </button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ArrowLeftIcon } from '@heroicons/vue/24/outline'

const router = useRouter()

interface ContactForm {
  contactType: string
  status: string
  firstName: string
  lastName: string
  email: string
  phone: string
  company: string
  jobTitle: string
  streetAddress: string
  city: string
  state: string
  postalCode: string
  country: string
  leadSource: string
  assignedTo: string
  tags: string[]
  birthday: string
  notes: string
  linkedin: string
  twitter: string
  facebook: string
  website: string
}

const form = ref<ContactForm>({
  contactType: '',
  status: '',
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  company: '',
  jobTitle: '',
  streetAddress: '',
  city: '',
  state: '',
  postalCode: '',
  country: '',
  leadSource: '',
  assignedTo: '',
  tags: [],
  birthday: '',
  notes: '',
  linkedin: '',
  twitter: '',
  facebook: '',
  website: ''
})

const staffMembers = ref([
  { id: '1', name: 'John Smith' },
  { id: '2', name: 'Jane Doe' },
  { id: '3', name: 'Mike Johnson' },
  { id: '4', name: 'Sarah Williams' }
])

const submitForm = async () => {
  try {
    // TODO: Implement API call to save contact
    console.log('Saving contact:', form.value)
    
    // Show success message
    alert('Contact created successfully!')
    
    // Navigate back to contacts list
    router.push('/crm/contacts')
  } catch (error) {
    console.error('Error saving contact:', error)
    alert('Error creating contact. Please try again.')
  }
}

onMounted(() => {
  // Load any necessary data
})
</script>