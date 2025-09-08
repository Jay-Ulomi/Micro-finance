<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Add Communication</h1>
        <p class="text-sm text-gray-600 mt-1">Create a new communication record</p>
      </div>
      <button @click="$router.back()" class="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors">
        <ArrowLeftIcon class="w-4 h-4 mr-2 inline" />
        Back
      </button>
    </div>

    <form @submit.prevent="submitForm" class="space-y-8">
      <!-- Communication Information -->
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 class="text-lg font-semibold text-gray-900 mb-6">Communication Information</h2>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <!-- Communication Type -->
          <div>
            <label for="communicationType" class="form-label">
              Communication Type <span class="text-red-500">*</span>
            </label>
            <select id="communicationType" v-model="form.communicationType" class="form-input" required>
              <option value="">Select Type</option>
              <option value="email">Email</option>
              <option value="phone">Phone Call</option>
              <option value="sms">SMS</option>
              <option value="whatsapp">WhatsApp</option>
              <option value="letter">Letter</option>
              <option value="fax">Fax</option>
              <option value="social_media">Social Media</option>
              <option value="in_person">In Person</option>
              <option value="other">Other</option>
            </select>
          </div>

          <!-- Direction -->
          <div>
            <label for="direction" class="form-label">
              Direction <span class="text-red-500">*</span>
            </label>
            <select id="direction" v-model="form.direction" class="form-input" required>
              <option value="">Select Direction</option>
              <option value="inbound">Inbound (Received)</option>
              <option value="outbound">Outbound (Sent)</option>
            </select>
          </div>

          <!-- Subject -->
          <div class="md:col-span-2">
            <label for="subject" class="form-label">
              Subject <span class="text-red-500">*</span>
            </label>
            <input
              id="subject"
              v-model="form.subject"
              type="text"
              placeholder="Enter communication subject"
              class="form-input"
              required
            />
          </div>

          <!-- Date -->
          <div>
            <label for="communicationDate" class="form-label">
              Date <span class="text-red-500">*</span>
            </label>
            <input
              id="communicationDate"
              v-model="form.communicationDate"
              type="date"
              class="form-input"
              required
            />
          </div>

          <!-- Time -->
          <div>
            <label for="communicationTime" class="form-label">Time</label>
            <input
              id="communicationTime"
              v-model="form.communicationTime"
              type="time"
              class="form-input"
            />
          </div>

          <!-- Status -->
          <div>
            <label for="status" class="form-label">
              Status <span class="text-red-500">*</span>
            </label>
            <select id="status" v-model="form.status" class="form-input" required>
              <option value="">Select Status</option>
              <option value="completed">Completed</option>
              <option value="pending">Pending</option>
              <option value="failed">Failed</option>
              <option value="scheduled">Scheduled</option>
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
        </div>
      </div>

      <!-- Contact Information -->
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 class="text-lg font-semibold text-gray-900 mb-6">Contact Information</h2>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <!-- Related To Type -->
          <div>
            <label for="relatedToType" class="form-label">
              Related To <span class="text-red-500">*</span>
            </label>
            <select id="relatedToType" v-model="form.relatedToType" class="form-input" required @change="clearRelatedToId">
              <option value="">Select Record Type</option>
              <option value="contact">Contact</option>
              <option value="lead">Lead</option>
              <option value="opportunity">Opportunity</option>
              <option value="account">Account</option>
            </select>
          </div>

          <!-- Related Record -->
          <div v-if="form.relatedToType">
            <label for="relatedToId" class="form-label">
              Select {{ form.relatedToType }} <span class="text-red-500">*</span>
            </label>
            <select id="relatedToId" v-model="form.relatedToId" class="form-input" required>
              <option value="">Select {{ form.relatedToType }}</option>
              <option 
                v-for="record in getRelatedRecords(form.relatedToType)" 
                :key="record.id" 
                :value="record.id"
              >
                {{ record.name }}
              </option>
            </select>
          </div>

          <!-- Contact Method -->
          <div v-if="form.communicationType !== 'in_person'">
            <label for="contactMethod" class="form-label">
              Contact Method <span class="text-red-500">*</span>
            </label>
            <input
              id="contactMethod"
              v-model="form.contactMethod"
              type="text"
              :placeholder="getContactMethodPlaceholder()"
              class="form-input"
              required
            />
          </div>

          <!-- Duration (for calls) -->
          <div v-if="form.communicationType === 'phone'">
            <label for="duration" class="form-label">Duration (minutes)</label>
            <input
              id="duration"
              v-model.number="form.duration"
              type="number"
              min="1"
              placeholder="5"
              class="form-input"
            />
          </div>

          <!-- Owner -->
          <div>
            <label for="owner" class="form-label">
              Owner <span class="text-red-500">*</span>
            </label>
            <select id="owner" v-model="form.owner" class="form-input" required>
              <option value="">Select Owner</option>
              <option v-for="user in users" :key="user.id" :value="user.id">
                {{ user.name }}
              </option>
            </select>
          </div>

          <!-- Additional Participants -->
          <div>
            <label for="participants" class="form-label">Additional Participants</label>
            <select id="participants" v-model="form.participants" class="form-input" multiple>
              <option v-for="user in users" :key="user.id" :value="user.id">
                {{ user.name }}
              </option>
            </select>
            <p class="text-sm text-gray-500 mt-1">Hold Ctrl/Cmd to select multiple</p>
          </div>
        </div>
      </div>

      <!-- Communication Content -->
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 class="text-lg font-semibold text-gray-900 mb-6">Communication Content</h2>
        
        <div class="space-y-6">
          <!-- Message/Content -->
          <div>
            <label for="content" class="form-label">
              Message/Content <span class="text-red-500">*</span>
            </label>
            <textarea
              id="content"
              v-model="form.content"
              rows="6"
              placeholder="Enter communication content..."
              class="form-input"
              required
            ></textarea>
          </div>

          <!-- Summary -->
          <div>
            <label for="summary" class="form-label">Summary</label>
            <textarea
              id="summary"
              v-model="form.summary"
              rows="3"
              placeholder="Enter a brief summary..."
              class="form-input"
            ></textarea>
          </div>

          <!-- Outcome -->
          <div>
            <label for="outcome" class="form-label">Outcome</label>
            <select id="outcome" v-model="form.outcome" class="form-input">
              <option value="">Select Outcome</option>
              <option value="successful">Successful</option>
              <option value="no_response">No Response</option>
              <option value="callback_requested">Callback Requested</option>
              <option value="meeting_scheduled">Meeting Scheduled</option>
              <option value="information_sent">Information Sent</option>
              <option value="follow_up_required">Follow-up Required</option>
              <option value="not_interested">Not Interested</option>
              <option value="wrong_contact">Wrong Contact</option>
              <option value="other">Other</option>
            </select>
          </div>

          <!-- Notes -->
          <div>
            <label for="notes" class="form-label">Internal Notes</label>
            <textarea
              id="notes"
              v-model="form.notes"
              rows="3"
              placeholder="Enter internal notes..."
              class="form-input"
            ></textarea>
          </div>
        </div>
      </div>

      <!-- Campaign & Tracking -->
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 class="text-lg font-semibold text-gray-900 mb-6">Campaign & Tracking</h2>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <!-- Campaign -->
          <div>
            <label for="campaign" class="form-label">Campaign</label>
            <select id="campaign" v-model="form.campaign" class="form-input">
              <option value="">Select Campaign</option>
              <option value="q1_promo">Q1 Promotion</option>
              <option value="newsletter">Newsletter</option>
              <option value="follow_up">Follow Up Campaign</option>
              <option value="product_launch">Product Launch</option>
              <option value="customer_retention">Customer Retention</option>
            </select>
          </div>

          <!-- Tags -->
          <div>
            <label for="tags" class="form-label">Tags</label>
            <select id="tags" v-model="form.tags" class="form-input" multiple>
              <option value="urgent">Urgent</option>
              <option value="proposal">Proposal</option>
              <option value="quote">Quote</option>
              <option value="complaint">Complaint</option>
              <option value="support">Support</option>
              <option value="sales">Sales</option>
              <option value="follow_up">Follow Up</option>
            </select>
            <p class="text-sm text-gray-500 mt-1">Hold Ctrl/Cmd to select multiple</p>
          </div>

          <!-- Response Required -->
          <div class="md:col-span-2">
            <div class="flex items-center">
              <input
                id="responseRequired"
                v-model="form.responseRequired"
                type="checkbox"
                class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label for="responseRequired" class="ml-2 block text-sm font-medium text-gray-700">
                Response Required
              </label>
            </div>
            
            <div v-if="form.responseRequired" class="mt-3 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label for="responseByDate" class="form-label">Response By Date</label>
                <input
                  id="responseByDate"
                  v-model="form.responseByDate"
                  type="date"
                  class="form-input"
                />
              </div>
              <div>
                <label for="responseAssignedTo" class="form-label">Assigned To</label>
                <select id="responseAssignedTo" v-model="form.responseAssignedTo" class="form-input">
                  <option value="">Select Person</option>
                  <option v-for="user in users" :key="user.id" :value="user.id">
                    {{ user.name }}
                  </option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Follow-up -->
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 class="text-lg font-semibold text-gray-900 mb-6">Follow-up</h2>
        
        <div class="space-y-6">
          <div class="flex items-center">
            <input
              id="createFollowUp"
              v-model="form.createFollowUp"
              type="checkbox"
              class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label for="createFollowUp" class="ml-2 block text-sm font-medium text-gray-700">
              Create Follow-up Communication
            </label>
          </div>
          
          <div v-if="form.createFollowUp" class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label for="followUpType" class="form-label">Follow-up Type</label>
              <select id="followUpType" v-model="form.followUpType" class="form-input">
                <option value="">Select Type</option>
                <option value="email">Email</option>
                <option value="phone">Phone Call</option>
                <option value="sms">SMS</option>
                <option value="meeting">Meeting</option>
              </select>
            </div>
            
            <div>
              <label for="followUpDate" class="form-label">Follow-up Date</label>
              <input
                id="followUpDate"
                v-model="form.followUpDate"
                type="date"
                class="form-input"
              />
            </div>
            
            <div class="md:col-span-2">
              <label for="followUpNotes" class="form-label">Follow-up Notes</label>
              <textarea
                id="followUpNotes"
                v-model="form.followUpNotes"
                rows="2"
                placeholder="Enter follow-up notes..."
                class="form-input"
              ></textarea>
            </div>
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
          Save Communication
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

interface CommunicationForm {
  communicationType: string
  direction: string
  subject: string
  communicationDate: string
  communicationTime: string
  status: string
  priority: string
  relatedToType: string
  relatedToId: string
  contactMethod: string
  duration: number | null
  owner: string
  participants: string[]
  content: string
  summary: string
  outcome: string
  notes: string
  campaign: string
  tags: string[]
  responseRequired: boolean
  responseByDate: string
  responseAssignedTo: string
  createFollowUp: boolean
  followUpType: string
  followUpDate: string
  followUpNotes: string
}

const form = ref<CommunicationForm>({
  communicationType: '',
  direction: '',
  subject: '',
  communicationDate: '',
  communicationTime: '',
  status: '',
  priority: '',
  relatedToType: '',
  relatedToId: '',
  contactMethod: '',
  duration: null,
  owner: '',
  participants: [],
  content: '',
  summary: '',
  outcome: '',
  notes: '',
  campaign: '',
  tags: [],
  responseRequired: false,
  responseByDate: '',
  responseAssignedTo: '',
  createFollowUp: false,
  followUpType: '',
  followUpDate: '',
  followUpNotes: ''
})

const users = ref([
  { id: '1', name: 'John Smith' },
  { id: '2', name: 'Jane Doe' },
  { id: '3', name: 'Mike Johnson' },
  { id: '4', name: 'Sarah Williams' }
])

const contacts = ref([
  { id: '1', name: 'Alice Johnson' },
  { id: '2', name: 'Bob Wilson' },
  { id: '3', name: 'Carol Davis' }
])

const leads = ref([
  { id: '1', name: 'Tech Corp Lead' },
  { id: '2', name: 'StartUp Inc Lead' },
  { id: '3', name: 'Enterprise Solutions Lead' }
])

const opportunities = ref([
  { id: '1', name: 'Q4 Enterprise Deal' },
  { id: '2', name: 'Expansion Opportunity' },
  { id: '3', name: 'New Market Entry' }
])

const accounts = ref([
  { id: '1', name: 'ABC Corporation' },
  { id: '2', name: 'XYZ Limited' },
  { id: '3', name: 'Tech Solutions Inc' }
])

const getContactMethodPlaceholder = () => {
  switch (form.value.communicationType) {
    case 'email':
      return 'Enter email address'
    case 'phone':
      return 'Enter phone number'
    case 'sms':
      return 'Enter mobile number'
    case 'whatsapp':
      return 'Enter WhatsApp number'
    case 'social_media':
      return 'Enter social media handle'
    default:
      return 'Enter contact method'
  }
}

const getRelatedRecords = (type: string) => {
  switch (type) {
    case 'contact':
      return contacts.value
    case 'lead':
      return leads.value
    case 'opportunity':
      return opportunities.value
    case 'account':
      return accounts.value
    default:
      return []
  }
}

const clearRelatedToId = () => {
  form.value.relatedToId = ''
}

const submitForm = async () => {
  try {
    // TODO: Implement API call to save communication
    console.log('Saving communication:', form.value)
    
    // Show success message
    alert('Communication record created successfully!')
    
    // Navigate back to communications list
    router.push('/crm/communications')
  } catch (error) {
    console.error('Error saving communication:', error)
    alert('Error creating communication. Please try again.')
  }
}

onMounted(() => {
  // Set default owner to first user (would be current user in real app)
  form.value.owner = users.value[0]?.id || ''
  
  // Set default communication date to today
  const today = new Date()
  form.value.communicationDate = today.toISOString().split('T')[0]
  
  // Set current time
  const now = new Date()
  form.value.communicationTime = now.toTimeString().slice(0, 5)
  
  // Set default status
  form.value.status = 'completed'
})
</script>