<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Add Lead</h1>
        <p class="text-sm text-gray-600 mt-1">Create a new lead entry</p>
      </div>
      <button @click="$router.back()" class="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors">
        <ArrowLeftIcon class="w-4 h-4 mr-2 inline" />
        Back
      </button>
    </div>

    <form @submit.prevent="submitForm" class="space-y-8">
      <!-- Lead Information -->
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 class="text-lg font-semibold text-gray-900 mb-6">Lead Information</h2>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <!-- Lead Status -->
          <div>
            <label for="leadStatus" class="form-label">
              Lead Status <span class="text-red-500">*</span>
            </label>
            <select id="leadStatus" v-model="form.leadStatus" class="form-input" required>
              <option value="">Select Status</option>
              <option value="new">New</option>
              <option value="contacted">Contacted</option>
              <option value="qualified">Qualified</option>
              <option value="proposal">Proposal</option>
              <option value="negotiation">Negotiation</option>
              <option value="converted">Converted</option>
              <option value="lost">Lost</option>
            </select>
          </div>

          <!-- Lead Source -->
          <div>
            <label for="leadSource" class="form-label">
              Lead Source <span class="text-red-500">*</span>
            </label>
            <select id="leadSource" v-model="form.leadSource" class="form-input" required>
              <option value="">Select Source</option>
              <option value="website">Website</option>
              <option value="referral">Referral</option>
              <option value="social_media">Social Media</option>
              <option value="email_campaign">Email Campaign</option>
              <option value="cold_call">Cold Call</option>
              <option value="trade_show">Trade Show</option>
              <option value="advertisement">Advertisement</option>
              <option value="partner">Partner</option>
              <option value="other">Other</option>
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
            <label for="company" class="form-label">
              Company <span class="text-red-500">*</span>
            </label>
            <input
              id="company"
              v-model="form.company"
              type="text"
              placeholder="Enter company name"
              class="form-input"
              required
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

          <!-- Industry -->
          <div>
            <label for="industry" class="form-label">Industry</label>
            <select id="industry" v-model="form.industry" class="form-input">
              <option value="">Select Industry</option>
              <option value="technology">Technology</option>
              <option value="finance">Finance</option>
              <option value="healthcare">Healthcare</option>
              <option value="retail">Retail</option>
              <option value="manufacturing">Manufacturing</option>
              <option value="education">Education</option>
              <option value="real_estate">Real Estate</option>
              <option value="hospitality">Hospitality</option>
              <option value="other">Other</option>
            </select>
          </div>

          <!-- Number of Employees -->
          <div>
            <label for="employees" class="form-label">Number of Employees</label>
            <select id="employees" v-model="form.employees" class="form-input">
              <option value="">Select Range</option>
              <option value="1-10">1-10</option>
              <option value="11-50">11-50</option>
              <option value="51-200">51-200</option>
              <option value="201-500">201-500</option>
              <option value="501-1000">501-1000</option>
              <option value="1000+">1000+</option>
            </select>
          </div>
        </div>
      </div>

      <!-- Lead Qualification -->
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 class="text-lg font-semibold text-gray-900 mb-6">Lead Qualification</h2>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <!-- Budget -->
          <div>
            <label for="budget" class="form-label">Budget Range</label>
            <select id="budget" v-model="form.budget" class="form-input">
              <option value="">Select Budget</option>
              <option value="<10k">Less than $10,000</option>
              <option value="10k-50k">$10,000 - $50,000</option>
              <option value="50k-100k">$50,000 - $100,000</option>
              <option value="100k-500k">$100,000 - $500,000</option>
              <option value="500k-1m">$500,000 - $1,000,000</option>
              <option value=">1m">More than $1,000,000</option>
            </select>
          </div>

          <!-- Timeline -->
          <div>
            <label for="timeline" class="form-label">Purchase Timeline</label>
            <select id="timeline" v-model="form.timeline" class="form-input">
              <option value="">Select Timeline</option>
              <option value="immediate">Immediate</option>
              <option value="1_month">Within 1 month</option>
              <option value="3_months">Within 3 months</option>
              <option value="6_months">Within 6 months</option>
              <option value="1_year">Within 1 year</option>
              <option value="future">Future consideration</option>
            </select>
          </div>

          <!-- Lead Score -->
          <div>
            <label for="leadScore" class="form-label">Lead Score</label>
            <select id="leadScore" v-model="form.leadScore" class="form-input">
              <option value="">Select Score</option>
              <option value="hot">Hot (80-100)</option>
              <option value="warm">Warm (60-79)</option>
              <option value="cool">Cool (40-59)</option>
              <option value="cold">Cold (0-39)</option>
            </select>
          </div>

          <!-- Priority -->
          <div>
            <label for="priority" class="form-label">Priority</label>
            <select id="priority" v-model="form.priority" class="form-input">
              <option value="">Select Priority</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>

          <!-- Products/Services Interest -->
          <div class="md:col-span-2">
            <label for="interests" class="form-label">Products/Services Interest</label>
            <input
              id="interests"
              v-model="form.interests"
              type="text"
              placeholder="Enter products or services of interest"
              class="form-input"
            />
          </div>

          <!-- Campaign -->
          <div>
            <label for="campaign" class="form-label">Campaign</label>
            <input
              id="campaign"
              v-model="form.campaign"
              type="text"
              placeholder="Enter campaign name"
              class="form-input"
            />
          </div>

          <!-- Assigned To -->
          <div>
            <label for="assignedTo" class="form-label">
              Assigned To <span class="text-red-500">*</span>
            </label>
            <select id="assignedTo" v-model="form.assignedTo" class="form-input" required>
              <option value="">Select Sales Rep</option>
              <option v-for="rep in salesReps" :key="rep.id" :value="rep.id">
                {{ rep.name }}
              </option>
            </select>
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

      <!-- Notes & Description -->
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 class="text-lg font-semibold text-gray-900 mb-6">Additional Information</h2>
        
        <div class="space-y-6">
          <!-- Description -->
          <div>
            <label for="description" class="form-label">Description</label>
            <textarea
              id="description"
              v-model="form.description"
              rows="4"
              placeholder="Enter lead description..."
              class="form-input"
            ></textarea>
          </div>

          <!-- Notes -->
          <div>
            <label for="notes" class="form-label">Internal Notes</label>
            <textarea
              id="notes"
              v-model="form.notes"
              rows="4"
              placeholder="Enter internal notes..."
              class="form-input"
            ></textarea>
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
          Save Lead
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

interface LeadForm {
  leadStatus: string
  leadSource: string
  firstName: string
  lastName: string
  email: string
  phone: string
  company: string
  jobTitle: string
  industry: string
  employees: string
  budget: string
  timeline: string
  leadScore: string
  priority: string
  interests: string
  campaign: string
  assignedTo: string
  streetAddress: string
  city: string
  state: string
  postalCode: string
  country: string
  description: string
  notes: string
}

const form = ref<LeadForm>({
  leadStatus: '',
  leadSource: '',
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  company: '',
  jobTitle: '',
  industry: '',
  employees: '',
  budget: '',
  timeline: '',
  leadScore: '',
  priority: '',
  interests: '',
  campaign: '',
  assignedTo: '',
  streetAddress: '',
  city: '',
  state: '',
  postalCode: '',
  country: '',
  description: '',
  notes: ''
})

const salesReps = ref([
  { id: '1', name: 'John Smith' },
  { id: '2', name: 'Jane Doe' },
  { id: '3', name: 'Mike Johnson' },
  { id: '4', name: 'Sarah Williams' }
])

const submitForm = async () => {
  try {
    // TODO: Implement API call to save lead
    console.log('Saving lead:', form.value)
    
    // Show success message
    alert('Lead created successfully!')
    
    // Navigate back to leads list
    router.push('/crm/leads')
  } catch (error) {
    console.error('Error saving lead:', error)
    alert('Error creating lead. Please try again.')
  }
}

onMounted(() => {
  // Load any necessary data
})
</script>