<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Convert Lead to Opportunity</h1>
        <p class="text-sm text-gray-600 mt-1">Convert qualified lead to sales opportunity</p>
      </div>
      <button @click="$router.back()" class="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors">
        <ArrowLeftIcon class="w-4 h-4 mr-2 inline" />
        Back
      </button>
    </div>

    <div v-if="!lead" class="text-center py-12">
      <ExclamationCircleIcon class="mx-auto h-12 w-12 text-red-400" />
      <h2 class="mt-2 text-lg font-medium text-gray-900">Lead not found</h2>
      <p class="mt-1 text-sm text-gray-500">The lead you're trying to convert could not be found.</p>
    </div>

    <form v-else @submit.prevent="convertLead" class="space-y-8">
      <!-- Lead Information Review -->
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 class="text-lg font-semibold text-gray-900 mb-6">Lead Information</h2>
        
        <div class="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <h3 class="font-medium text-blue-900 mb-2">{{ lead.firstName }} {{ lead.lastName }}</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <span class="font-medium text-blue-800">Company:</span>
              <span class="ml-2 text-blue-700">{{ lead.company || 'N/A' }}</span>
            </div>
            <div>
              <span class="font-medium text-blue-800">Email:</span>
              <span class="ml-2 text-blue-700">{{ lead.email }}</span>
            </div>
            <div>
              <span class="font-medium text-blue-800">Phone:</span>
              <span class="ml-2 text-blue-700">{{ lead.phone }}</span>
            </div>
            <div>
              <span class="font-medium text-blue-800">Status:</span>
              <span class="ml-2 text-blue-700">{{ lead.status }}</span>
            </div>
            <div>
              <span class="font-medium text-blue-800">Source:</span>
              <span class="ml-2 text-blue-700">{{ lead.source }}</span>
            </div>
            <div>
              <span class="font-medium text-blue-800">Score:</span>
              <span class="ml-2 text-blue-700">{{ lead.score }}/100</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Opportunity Information -->
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 class="text-lg font-semibold text-gray-900 mb-6">Opportunity Details</h2>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <!-- Opportunity Name -->
          <div class="md:col-span-2">
            <label for="opportunityName" class="form-label">
              Opportunity Name <span class="text-red-500">*</span>
            </label>
            <input
              id="opportunityName"
              v-model="opportunityForm.opportunityName"
              type="text"
              :placeholder="`${lead.company || lead.firstName + ' ' + lead.lastName} - Loan Application`"
              class="form-input"
              required
            />
          </div>

          <!-- Stage -->
          <div>
            <label for="stage" class="form-label">
              Initial Stage <span class="text-red-500">*</span>
            </label>
            <select id="stage" v-model="opportunityForm.stage" class="form-input" required>
              <option value="">Select Stage</option>
              <option value="prospecting">Prospecting</option>
              <option value="qualification">Qualification</option>
              <option value="needs_analysis">Needs Analysis</option>
              <option value="value_proposition">Value Proposition</option>
              <option value="proposal">Proposal</option>
              <option value="negotiation">Negotiation</option>
            </select>
          </div>

          <!-- Amount -->
          <div>
            <label for="amount" class="form-label">
              Expected Amount <span class="text-red-500">*</span>
            </label>
            <div class="relative">
              <span class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
              <input
                id="amount"
                v-model.number="opportunityForm.amount"
                type="number"
                step="0.01"
                min="0"
                placeholder="0.00"
                class="form-input pl-8"
                required
              />
            </div>
          </div>

          <!-- Currency -->
          <div>
            <label for="currency" class="form-label">Currency</label>
            <select id="currency" v-model="opportunityForm.currency" class="form-input">
              <option value="USD">USD</option>
              <option value="TZS">TZS</option>
              <option value="KES">KES</option>
              <option value="UGX">UGX</option>
              <option value="RWF">RWF</option>
              <option value="BIF">BIF</option>
            </select>
          </div>

          <!-- Close Date -->
          <div>
            <label for="closeDate" class="form-label">
              Expected Close Date <span class="text-red-500">*</span>
            </label>
            <input
              id="closeDate"
              v-model="opportunityForm.closeDate"
              type="date"
              class="form-input"
              required
            />
          </div>

          <!-- Probability -->
          <div>
            <label for="probability" class="form-label">
              Success Probability (%) <span class="text-red-500">*</span>
            </label>
            <input
              id="probability"
              v-model.number="opportunityForm.probability"
              type="number"
              min="0"
              max="100"
              :placeholder="getSuggestedProbability()"
              class="form-input"
              required
            />
          </div>

          <!-- Product/Service -->
          <div>
            <label for="product" class="form-label">Primary Product/Service</label>
            <select id="product" v-model="opportunityForm.product" class="form-input">
              <option value="">Select Product</option>
              <option value="micro_loan">Micro Loan</option>
              <option value="business_loan">Business Loan</option>
              <option value="personal_loan">Personal Loan</option>
              <option value="savings_account">Savings Account</option>
              <option value="investment_plan">Investment Plan</option>
              <option value="insurance">Insurance</option>
            </select>
          </div>

          <!-- Assigned To -->
          <div>
            <label for="assignedTo" class="form-label">
              Assigned To <span class="text-red-500">*</span>
            </label>
            <select id="assignedTo" v-model="opportunityForm.assignedTo" class="form-input" required>
              <option value="">Select Sales Rep</option>
              <option v-for="rep in salesReps" :key="rep.id" :value="rep.id">
                {{ rep.name }}
              </option>
            </select>
          </div>
        </div>
      </div>

      <!-- Conversion Options -->
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 class="text-lg font-semibold text-gray-900 mb-6">Conversion Options</h2>
        
        <div class="space-y-6">
          <!-- Create Contact -->
          <div class="flex items-start">
            <input
              id="createContact"
              v-model="conversionOptions.createContact"
              type="checkbox"
              class="h-4 w-4 mt-1 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <div class="ml-3">
              <label for="createContact" class="block text-sm font-medium text-gray-700">
                Create Contact Record
              </label>
              <p class="text-sm text-gray-500">
                Create a contact record from this lead information
              </p>
            </div>
          </div>

          <!-- Create Account -->
          <div class="flex items-start">
            <input
              id="createAccount"
              v-model="conversionOptions.createAccount"
              type="checkbox"
              class="h-4 w-4 mt-1 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <div class="ml-3">
              <label for="createAccount" class="block text-sm font-medium text-gray-700">
                Create Account Record
              </label>
              <p class="text-sm text-gray-500">
                Create an account record for {{ lead.company || 'this lead' }}
              </p>
            </div>
          </div>

          <!-- Mark Lead as Converted -->
          <div class="flex items-start">
            <input
              id="markConverted"
              v-model="conversionOptions.markConverted"
              type="checkbox"
              class="h-4 w-4 mt-1 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <div class="ml-3">
              <label for="markConverted" class="block text-sm font-medium text-gray-700">
                Mark Lead as Converted
              </label>
              <p class="text-sm text-gray-500">
                Update the lead status to "Converted" and hide from active leads
              </p>
            </div>
          </div>

          <!-- Send Notification -->
          <div class="flex items-start">
            <input
              id="sendNotification"
              v-model="conversionOptions.sendNotification"
              type="checkbox"
              class="h-4 w-4 mt-1 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <div class="ml-3">
              <label for="sendNotification" class="block text-sm font-medium text-gray-700">
                Send Notification to Assigned Rep
              </label>
              <p class="text-sm text-gray-500">
                Notify the assigned sales representative about the new opportunity
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- Additional Notes -->
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 class="text-lg font-semibold text-gray-900 mb-6">Additional Information</h2>
        
        <div class="space-y-6">
          <!-- Conversion Notes -->
          <div>
            <label for="conversionNotes" class="form-label">Conversion Notes</label>
            <textarea
              id="conversionNotes"
              v-model="opportunityForm.notes"
              rows="4"
              placeholder="Enter any additional notes about this conversion..."
              class="form-input"
            ></textarea>
          </div>

          <!-- Next Steps -->
          <div>
            <label for="nextSteps" class="form-label">Next Steps</label>
            <textarea
              id="nextSteps"
              v-model="opportunityForm.nextSteps"
              rows="3"
              placeholder="What are the immediate next steps for this opportunity?"
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
          :disabled="isConverting"
          class="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
        >
          <span v-if="isConverting">Converting...</span>
          <span v-else>Convert to Opportunity</span>
        </button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ArrowLeftIcon, ExclamationCircleIcon } from '@heroicons/vue/24/outline'

const router = useRouter()
const route = useRoute()

interface Lead {
  id: string
  firstName: string
  lastName: string
  email: string
  phone: string
  company?: string
  status: string
  source: string
  score: number
  industry?: string
  jobTitle?: string
  createdDate: string
}

interface OpportunityForm {
  opportunityName: string
  stage: string
  amount: number
  currency: string
  closeDate: string
  probability: number
  product: string
  assignedTo: string
  notes: string
  nextSteps: string
}

interface ConversionOptions {
  createContact: boolean
  createAccount: boolean
  markConverted: boolean
  sendNotification: boolean
}

const lead = ref<Lead | null>(null)
const isConverting = ref(false)

const opportunityForm = ref<OpportunityForm>({
  opportunityName: '',
  stage: 'qualification',
  amount: 0,
  currency: 'USD',
  closeDate: '',
  probability: 50,
  product: '',
  assignedTo: '',
  notes: '',
  nextSteps: ''
})

const conversionOptions = ref<ConversionOptions>({
  createContact: true,
  createAccount: false,
  markConverted: true,
  sendNotification: true
})

const salesReps = ref([
  { id: '1', name: 'John Smith' },
  { id: '2', name: 'Jane Doe' },
  { id: '3', name: 'Mike Johnson' },
  { id: '4', name: 'Sarah Williams' }
])

// Mock leads data - in real app, this would come from a store or API
const mockLeads = [
  {
    id: '1',
    firstName: 'Alice',
    lastName: 'Johnson',
    email: 'alice.johnson@email.com',
    phone: '+1-234-567-8901',
    company: 'Tech Solutions Inc',
    status: 'qualified',
    source: 'website',
    score: 85,
    industry: 'Technology',
    jobTitle: 'CTO',
    createdDate: '2024-01-15'
  },
  {
    id: '2',
    firstName: 'Bob',
    lastName: 'Wilson',
    email: 'bob.wilson@email.com',
    phone: '+1-234-567-8902',
    company: 'Manufacturing Corp',
    status: 'contacted',
    source: 'referral',
    score: 72,
    industry: 'Manufacturing',
    jobTitle: 'Operations Manager',
    createdDate: '2024-01-18'
  }
]

const getSuggestedProbability = () => {
  if (!lead.value) return '50'
  
  // Suggest probability based on lead score and status
  if (lead.value.score >= 80) return '75'
  if (lead.value.score >= 60) return '60'
  if (lead.value.score >= 40) return '45'
  return '30'
}

const loadLead = () => {
  const leadId = route.params.id as string
  // In a real app, this would be an API call
  lead.value = mockLeads.find(l => l.id === leadId) || null
  
  if (lead.value) {
    // Pre-populate opportunity form with lead data
    opportunityForm.value.opportunityName = `${lead.value.company || lead.value.firstName + ' ' + lead.value.lastName} - Loan Application`
    opportunityForm.value.assignedTo = salesReps.value[0]?.id || ''
    
    // Set default close date to 30 days from now
    const futureDate = new Date()
    futureDate.setDate(futureDate.getDate() + 30)
    opportunityForm.value.closeDate = futureDate.toISOString().split('T')[0]
    
    // Set probability based on lead score
    opportunityForm.value.probability = parseInt(getSuggestedProbability())
    
    // Set account creation option based on company
    conversionOptions.value.createAccount = !!lead.value.company
  }
}

const convertLead = async () => {
  if (!lead.value) return
  
  isConverting.value = true
  
  try {
    // TODO: Implement API calls for:
    // 1. Create opportunity
    // 2. Create contact (if selected)
    // 3. Create account (if selected)
    // 4. Update lead status (if selected)
    // 5. Send notification (if selected)
    
    console.log('Converting lead to opportunity:', {
      lead: lead.value,
      opportunity: opportunityForm.value,
      options: conversionOptions.value
    })
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    // Show success message
    alert(`Lead "${lead.value.firstName} ${lead.value.lastName}" has been successfully converted to an opportunity!`)
    
    // Navigate to the new opportunity (or opportunities list)
    router.push('/crm/opportunities')
    
  } catch (error) {
    console.error('Error converting lead:', error)
    alert('Error converting lead. Please try again.')
  } finally {
    isConverting.value = false
  }
}

onMounted(() => {
  loadLead()
})
</script>