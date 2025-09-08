import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Contact, Lead, Activity, Task, CommunicationCampaign } from '@/types/datastore'

export const useCRMStore = defineStore('crm', () => {
  const contacts = ref<Contact[]>([])
  const leads = ref<Lead[]>([])
  const activities = ref<Activity[]>([])
  const tasks = ref<Task[]>([])
  const campaigns = ref<CommunicationCampaign[]>([])
  const isLoading = ref(false)

  // Computed statistics
  const contactStats = computed(() => ({
    total: contacts.value.length,
    active: contacts.value.filter(c => c.status === 'active').length,
    prospects: contacts.value.filter(c => c.type === 'prospect').length,
    customers: contacts.value.filter(c => c.type === 'customer').length
  }))

  const leadStats = computed(() => ({
    total: leads.value.length,
    new: leads.value.filter(l => l.stage === 'new').length,
    qualified: leads.value.filter(l => l.stage === 'qualified').length,
    proposal: leads.value.filter(l => l.stage === 'proposal').length,
    negotiation: leads.value.filter(l => l.stage === 'negotiation').length,
    closed: leads.value.filter(l => l.stage === 'closed').length,
    totalValue: leads.value.reduce((sum, l) => sum + (l.estimatedValue || 0), 0)
  }))

  const taskStats = computed(() => ({
    total: tasks.value.length,
    pending: tasks.value.filter(t => t.status === 'todo').length,
    inProgress: tasks.value.filter(t => t.status === 'in_progress').length,
    completed: tasks.value.filter(t => t.status === 'completed').length,
    overdue: tasks.value.filter(t => t.dueDate && new Date(t.dueDate) < new Date() && t.status !== 'completed').length
  }))

  // Contact methods
  const fetchContacts = async () => {
    isLoading.value = true
    try {
      // Mock data
      const mockContacts: Contact[] = [
        {
          id: '1',
          type: 'customer',
          firstName: 'John',
          lastName: 'Smith',
          email: 'john.smith@email.com',
          phone: '+255123456789',
          company: 'ABC Corp',
          jobTitle: 'Manager',
          status: 'active',
          assignedTo: 'staff-1',
          tags: ['vip', 'existing-customer'],
          address: {
            street: '123 Main St',
            city: 'Dar es Salaam',
            region: 'Dar es Salaam',
            country: 'Tanzania',
            postalCode: '12345'
          },
          createdAt: new Date(),
          updatedAt: new Date(),
          createdBy: 'staff-1'
        }
      ]
      contacts.value = mockContacts
    } finally {
      isLoading.value = false
    }
  }

  const addContact = async (contactData: Omit<Contact, 'id' | 'createdAt' | 'updatedAt' | 'createdBy'>) => {
    isLoading.value = true
    try {
      const newContact: Contact = {
        ...contactData,
        id: Date.now().toString(),
        createdAt: new Date(),
        updatedAt: new Date(),
        createdBy: 'current-user'
      }
      contacts.value.push(newContact)
      return { success: true, data: newContact }
    } catch (error) {
      return { success: false, error: 'Failed to create contact' }
    } finally {
      isLoading.value = false
    }
  }

  // Lead methods
  const fetchLeads = async () => {
    isLoading.value = true
    try {
      const mockLeads: Lead[] = [
        {
          id: '1',
          contactId: '1',
          title: 'Loan Application - John Smith',
          description: 'Business loan application for expansion',
          stage: 'qualified',
          status: 'active',
          source: 'website',
          estimatedValue: 50000,
          probability: 75,
          expectedCloseDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
          assignedTo: 'staff-1',
          tags: ['business-loan', 'high-value'],
          createdAt: new Date(),
          updatedAt: new Date(),
          createdBy: 'staff-1'
        }
      ]
      leads.value = mockLeads
    } finally {
      isLoading.value = false
    }
  }

  const updateLeadStage = async (leadId: string, newStage: Lead['stage']) => {
    const lead = leads.value.find(l => l.id === leadId)
    if (lead) {
      lead.stage = newStage
      lead.updatedAt = new Date()
      return { success: true }
    }
    return { success: false, error: 'Lead not found' }
  }

  // Activity methods
  const fetchActivities = async () => {
    isLoading.value = true
    try {
      const mockActivities: Activity[] = [
        {
          id: '1',
          type: 'call',
          subject: 'Follow-up call with John Smith',
          description: 'Discussed loan application status',
          contactId: '1',
          leadId: '1',
          status: 'completed',
          priority: 'medium',
          scheduledFor: new Date(Date.now() - 24 * 60 * 60 * 1000),
          completedAt: new Date(Date.now() - 23 * 60 * 60 * 1000),
          assignedTo: 'staff-1',
          outcome: 'Positive response, ready to proceed',
          createdAt: new Date(),
          updatedAt: new Date(),
          createdBy: 'staff-1'
        }
      ]
      activities.value = mockActivities
    } finally {
      isLoading.value = false
    }
  }

  // Task methods
  const fetchTasks = async () => {
    isLoading.value = true
    try {
      const mockTasks: Task[] = [
        {
          id: '1',
          title: 'Prepare loan documentation',
          description: 'Gather all required documents for John Smith loan application',
          status: 'in_progress',
          priority: 'high',
          dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
          assignedTo: 'staff-1',
          contactId: '1',
          leadId: '1',
          tags: ['documentation', 'urgent'],
          createdAt: new Date(),
          updatedAt: new Date(),
          createdBy: 'staff-1'
        }
      ]
      tasks.value = mockTasks
    } finally {
      isLoading.value = false
    }
  }

  const updateTaskStatus = async (taskId: string, status: Task['status']) => {
    const task = tasks.value.find(t => t.id === taskId)
    if (task) {
      task.status = status
      task.updatedAt = new Date()
      if (status === 'completed') {
        task.completedAt = new Date()
      }
      return { success: true }
    }
    return { success: false, error: 'Task not found' }
  }

  // Initialize data
  const initializeCRM = async () => {
    await Promise.all([
      fetchContacts(),
      fetchLeads(),
      fetchActivities(),
      fetchTasks()
    ])
  }

  return {
    // State
    contacts,
    leads,
    activities,
    tasks,
    campaigns,
    isLoading,
    
    // Computed
    contactStats,
    leadStats,
    taskStats,
    
    // Methods
    fetchContacts,
    addContact,
    fetchLeads,
    updateLeadStage,
    fetchActivities,
    fetchTasks,
    updateTaskStatus,
    initializeCRM
  }
})