<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Add Task</h1>
        <p class="text-sm text-gray-600 mt-1">Create a new task</p>
      </div>
      <button @click="$router.back()" class="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors">
        <ArrowLeftIcon class="w-4 h-4 mr-2 inline" />
        Back
      </button>
    </div>

    <form @submit.prevent="submitForm" class="space-y-8">
      <!-- Task Information -->
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 class="text-lg font-semibold text-gray-900 mb-6">Task Information</h2>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <!-- Task Title -->
          <div class="md:col-span-2">
            <label for="title" class="form-label">
              Task Title <span class="text-red-500">*</span>
            </label>
            <input
              id="title"
              v-model="form.title"
              type="text"
              placeholder="Enter task title"
              class="form-input"
              required
            />
          </div>

          <!-- Task Type -->
          <div>
            <label for="taskType" class="form-label">
              Task Type <span class="text-red-500">*</span>
            </label>
            <select id="taskType" v-model="form.taskType" class="form-input" required>
              <option value="">Select Type</option>
              <option value="call">Call</option>
              <option value="email">Email</option>
              <option value="meeting">Meeting</option>
              <option value="follow_up">Follow Up</option>
              <option value="demo">Demo</option>
              <option value="proposal">Proposal</option>
              <option value="research">Research</option>
              <option value="admin">Administrative</option>
              <option value="other">Other</option>
            </select>
          </div>

          <!-- Priority -->
          <div>
            <label for="priority" class="form-label">
              Priority <span class="text-red-500">*</span>
            </label>
            <select id="priority" v-model="form.priority" class="form-input" required>
              <option value="">Select Priority</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>

          <!-- Status -->
          <div>
            <label for="status" class="form-label">
              Status <span class="text-red-500">*</span>
            </label>
            <select id="status" v-model="form.status" class="form-input" required>
              <option value="">Select Status</option>
              <option value="not_started">Not Started</option>
              <option value="in_progress">In Progress</option>
              <option value="waiting">Waiting on Someone Else</option>
              <option value="deferred">Deferred</option>
              <option value="completed">Completed</option>
            </select>
          </div>

          <!-- Due Date -->
          <div>
            <label for="dueDate" class="form-label">
              Due Date <span class="text-red-500">*</span>
            </label>
            <input
              id="dueDate"
              v-model="form.dueDate"
              type="date"
              class="form-input"
              required
            />
          </div>

          <!-- Due Time -->
          <div>
            <label for="dueTime" class="form-label">Due Time</label>
            <input
              id="dueTime"
              v-model="form.dueTime"
              type="time"
              class="form-input"
            />
          </div>

          <!-- Estimated Duration -->
          <div>
            <label for="duration" class="form-label">Estimated Duration (hours)</label>
            <input
              id="duration"
              v-model.number="form.duration"
              type="number"
              step="0.5"
              min="0"
              placeholder="0.5"
              class="form-input"
            />
          </div>
        </div>
      </div>

      <!-- Assignment & Related Records -->
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 class="text-lg font-semibold text-gray-900 mb-6">Assignment & Related Records</h2>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <!-- Assigned To -->
          <div>
            <label for="assignedTo" class="form-label">
              Assigned To <span class="text-red-500">*</span>
            </label>
            <select id="assignedTo" v-model="form.assignedTo" class="form-input" required>
              <option value="">Select Assignee</option>
              <option v-for="user in users" :key="user.id" :value="user.id">
                {{ user.name }}
              </option>
            </select>
          </div>

          <!-- Related To -->
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
          <div v-if="form.relatedToType" class="md:col-span-2">
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

          <!-- Created By -->
          <div>
            <label for="createdBy" class="form-label">Created By</label>
            <input
              id="createdBy"
              :value="currentUser.name"
              type="text"
              class="form-input"
              disabled
            />
          </div>

          <!-- Team/Department -->
          <div>
            <label for="team" class="form-label">Team/Department</label>
            <select id="team" v-model="form.team" class="form-input">
              <option value="">Select Team</option>
              <option value="sales">Sales</option>
              <option value="marketing">Marketing</option>
              <option value="support">Support</option>
              <option value="operations">Operations</option>
              <option value="management">Management</option>
            </select>
          </div>
        </div>
      </div>

      <!-- Task Details -->
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 class="text-lg font-semibold text-gray-900 mb-6">Task Details</h2>
        
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
              placeholder="Enter task description..."
              class="form-input"
              required
            ></textarea>
          </div>

          <!-- Comments -->
          <div>
            <label for="comments" class="form-label">Additional Comments</label>
            <textarea
              id="comments"
              v-model="form.comments"
              rows="3"
              placeholder="Enter any additional comments..."
              class="form-input"
            ></textarea>
          </div>
        </div>
      </div>

      <!-- Reminder & Follow-up -->
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 class="text-lg font-semibold text-gray-900 mb-6">Reminder & Follow-up</h2>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <!-- Set Reminder -->
          <div>
            <div class="flex items-center mb-3">
              <input
                id="setReminder"
                v-model="form.setReminder"
                type="checkbox"
                class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label for="setReminder" class="ml-2 block text-sm font-medium text-gray-700">
                Set Reminder
              </label>
            </div>
            
            <div v-if="form.setReminder" class="space-y-3">
              <div>
                <label for="reminderDate" class="form-label">Reminder Date</label>
                <input
                  id="reminderDate"
                  v-model="form.reminderDate"
                  type="date"
                  class="form-input"
                />
              </div>
              <div>
                <label for="reminderTime" class="form-label">Reminder Time</label>
                <input
                  id="reminderTime"
                  v-model="form.reminderTime"
                  type="time"
                  class="form-input"
                />
              </div>
            </div>
          </div>

          <!-- Follow-up Task -->
          <div>
            <div class="flex items-center mb-3">
              <input
                id="createFollowUp"
                v-model="form.createFollowUp"
                type="checkbox"
                class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label for="createFollowUp" class="ml-2 block text-sm font-medium text-gray-700">
                Create Follow-up Task
              </label>
            </div>
            
            <div v-if="form.createFollowUp" class="space-y-3">
              <div>
                <label for="followUpTitle" class="form-label">Follow-up Title</label>
                <input
                  id="followUpTitle"
                  v-model="form.followUpTitle"
                  type="text"
                  placeholder="Follow-up task title"
                  class="form-input"
                />
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
          Save Task
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

interface TaskForm {
  title: string
  taskType: string
  priority: string
  status: string
  dueDate: string
  dueTime: string
  duration: number | null
  assignedTo: string
  relatedToType: string
  relatedToId: string
  team: string
  description: string
  comments: string
  setReminder: boolean
  reminderDate: string
  reminderTime: string
  createFollowUp: boolean
  followUpTitle: string
  followUpDate: string
}

const form = ref<TaskForm>({
  title: '',
  taskType: '',
  priority: '',
  status: '',
  dueDate: '',
  dueTime: '',
  duration: null,
  assignedTo: '',
  relatedToType: '',
  relatedToId: '',
  team: '',
  description: '',
  comments: '',
  setReminder: false,
  reminderDate: '',
  reminderTime: '',
  createFollowUp: false,
  followUpTitle: '',
  followUpDate: ''
})

const currentUser = ref({
  id: '1',
  name: 'Current User'
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
    // TODO: Implement API call to save task
    console.log('Saving task:', form.value)
    
    // Show success message
    alert('Task created successfully!')
    
    // Navigate back to tasks list
    router.push('/crm/tasks')
  } catch (error) {
    console.error('Error saving task:', error)
    alert('Error creating task. Please try again.')
  }
}

onMounted(() => {
  // Set default assignee to current user
  form.value.assignedTo = currentUser.value.id
  
  // Set default due date to tomorrow
  const tomorrow = new Date()
  tomorrow.setDate(tomorrow.getDate() + 1)
  form.value.dueDate = tomorrow.toISOString().split('T')[0]
})
</script>