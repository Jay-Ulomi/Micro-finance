<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Add Activity</h1>
        <p class="text-sm text-gray-600 mt-1">Create a new activity record</p>
      </div>
      <button @click="$router.back()" class="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors">
        <ArrowLeftIcon class="w-4 h-4 mr-2 inline" />
        Back
      </button>
    </div>

    <form @submit.prevent="submitForm" class="space-y-8">
      <!-- Activity Information -->
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 class="text-lg font-semibold text-gray-900 mb-6">Activity Information</h2>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <!-- Activity Type -->
          <div>
            <label for="activityType" class="form-label">
              Activity Type <span class="text-red-500">*</span>
            </label>
            <select id="activityType" v-model="form.activityType" class="form-input" required>
              <option value="">Select Type</option>
              <option value="call">Phone Call</option>
              <option value="meeting">Meeting</option>
              <option value="email">Email</option>
              <option value="demo">Demo</option>
              <option value="presentation">Presentation</option>
              <option value="lunch">Lunch/Dinner</option>
              <option value="site_visit">Site Visit</option>
              <option value="conference">Conference</option>
              <option value="training">Training</option>
              <option value="other">Other</option>
            </select>
          </div>

          <!-- Subject -->
          <div>
            <label for="subject" class="form-label">
              Subject <span class="text-red-500">*</span>
            </label>
            <input
              id="subject"
              v-model="form.subject"
              type="text"
              placeholder="Enter activity subject"
              class="form-input"
              required
            />
          </div>

          <!-- Status -->
          <div>
            <label for="status" class="form-label">
              Status <span class="text-red-500">*</span>
            </label>
            <select id="status" v-model="form.status" class="form-input" required>
              <option value="">Select Status</option>
              <option value="planned">Planned</option>
              <option value="in_progress">In Progress</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
              <option value="rescheduled">Rescheduled</option>
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

          <!-- Date -->
          <div>
            <label for="activityDate" class="form-label">
              Activity Date <span class="text-red-500">*</span>
            </label>
            <input
              id="activityDate"
              v-model="form.activityDate"
              type="date"
              class="form-input"
              required
            />
          </div>

          <!-- Start Time -->
          <div>
            <label for="startTime" class="form-label">Start Time</label>
            <input
              id="startTime"
              v-model="form.startTime"
              type="time"
              class="form-input"
            />
          </div>

          <!-- End Time -->
          <div>
            <label for="endTime" class="form-label">End Time</label>
            <input
              id="endTime"
              v-model="form.endTime"
              type="time"
              class="form-input"
            />
          </div>

          <!-- Duration -->
          <div>
            <label for="duration" class="form-label">Duration (hours)</label>
            <input
              id="duration"
              v-model.number="form.duration"
              type="number"
              step="0.25"
              min="0"
              placeholder="0.5"
              class="form-input"
            />
          </div>
        </div>
      </div>

      <!-- Location & Participants -->
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 class="text-lg font-semibold text-gray-900 mb-6">Location & Participants</h2>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <!-- Location Type -->
          <div>
            <label for="locationType" class="form-label">Location Type</label>
            <select id="locationType" v-model="form.locationType" class="form-input" @change="clearLocation">
              <option value="">Select Location Type</option>
              <option value="office">Office</option>
              <option value="client_site">Client Site</option>
              <option value="virtual">Virtual/Online</option>
              <option value="phone">Phone Call</option>
              <option value="other">Other</option>
            </select>
          </div>

          <!-- Location Details -->
          <div v-if="form.locationType && form.locationType !== 'phone'">
            <label for="location" class="form-label">
              Location Details
              <span v-if="form.locationType === 'virtual'">*</span>
            </label>
            <input
              id="location"
              v-model="form.location"
              type="text"
              :placeholder="getLocationPlaceholder()"
              class="form-input"
              :required="form.locationType === 'virtual'"
            />
          </div>

          <!-- Assigned To -->
          <div>
            <label for="assignedTo" class="form-label">
              Owner <span class="text-red-500">*</span>
            </label>
            <select id="assignedTo" v-model="form.assignedTo" class="form-input" required>
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

      <!-- Related Records -->
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 class="text-lg font-semibold text-gray-900 mb-6">Related Records</h2>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <!-- Related To Type -->
          <div>
            <label for="relatedToType" class="form-label">Related To</label>
            <select id="relatedToType" v-model="form.relatedToType" class="form-input" @change="clearRelatedToId">
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
              Select {{ form.relatedToType }}
            </label>
            <select id="relatedToId" v-model="form.relatedToId" class="form-input">
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
        </div>
      </div>

      <!-- Activity Details -->
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 class="text-lg font-semibold text-gray-900 mb-6">Activity Details</h2>
        
        <div class="space-y-6">
          <!-- Description -->
          <div>
            <label for="description" class="form-label">
              Description <span class="text-red-500">*</span>
            </label>
            <textarea
              id="description"
              v-model="form.description"
              rows="4"
              placeholder="Enter activity description..."
              class="form-input"
              required
            ></textarea>
          </div>

          <!-- Agenda -->
          <div>
            <label for="agenda" class="form-label">Agenda</label>
            <textarea
              id="agenda"
              v-model="form.agenda"
              rows="3"
              placeholder="Enter meeting agenda or call topics..."
              class="form-input"
            ></textarea>
          </div>

          <!-- Outcome -->
          <div>
            <label for="outcome" class="form-label">Outcome/Result</label>
            <textarea
              id="outcome"
              v-model="form.outcome"
              rows="3"
              placeholder="Enter activity outcome or results..."
              class="form-input"
            ></textarea>
          </div>

          <!-- Action Items -->
          <div>
            <label for="actionItems" class="form-label">Action Items</label>
            <textarea
              id="actionItems"
              v-model="form.actionItems"
              rows="3"
              placeholder="Enter follow-up action items..."
              class="form-input"
            ></textarea>
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
              Create Follow-up Activity
            </label>
          </div>
          
          <div v-if="form.createFollowUp" class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label for="followUpType" class="form-label">Follow-up Type</label>
              <select id="followUpType" v-model="form.followUpType" class="form-input">
                <option value="">Select Type</option>
                <option value="call">Phone Call</option>
                <option value="meeting">Meeting</option>
                <option value="email">Email</option>
                <option value="demo">Demo</option>
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
          Save Activity
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

interface ActivityForm {
  activityType: string
  subject: string
  status: string
  priority: string
  activityDate: string
  startTime: string
  endTime: string
  duration: number | null
  locationType: string
  location: string
  assignedTo: string
  participants: string[]
  relatedToType: string
  relatedToId: string
  description: string
  agenda: string
  outcome: string
  actionItems: string
  createFollowUp: boolean
  followUpType: string
  followUpDate: string
  followUpNotes: string
}

const form = ref<ActivityForm>({
  activityType: '',
  subject: '',
  status: '',
  priority: '',
  activityDate: '',
  startTime: '',
  endTime: '',
  duration: null,
  locationType: '',
  location: '',
  assignedTo: '',
  participants: [],
  relatedToType: '',
  relatedToId: '',
  description: '',
  agenda: '',
  outcome: '',
  actionItems: '',
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

const getLocationPlaceholder = () => {
  switch (form.value.locationType) {
    case 'virtual':
      return 'Enter meeting link (Zoom, Teams, etc.)'
    case 'office':
      return 'Enter office location or room number'
    case 'client_site':
      return 'Enter client address'
    case 'other':
      return 'Enter location details'
    default:
      return 'Enter location'
  }
}

const clearLocation = () => {
  form.value.location = ''
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
    // TODO: Implement API call to save activity
    console.log('Saving activity:', form.value)
    
    // Show success message
    alert('Activity created successfully!')
    
    // Navigate back to activities list
    router.push('/crm/activities')
  } catch (error) {
    console.error('Error saving activity:', error)
    alert('Error creating activity. Please try again.')
  }
}

onMounted(() => {
  // Set default assignee to first user (would be current user in real app)
  form.value.assignedTo = users.value[0]?.id || ''
  
  // Set default activity date to today
  const today = new Date()
  form.value.activityDate = today.toISOString().split('T')[0]
  
  // Set default status
  form.value.status = 'planned'
})
</script>