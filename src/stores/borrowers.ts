import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Borrower, Loan, LoanApplication } from '@/types/datastore'

export const useBorrowersStore = defineStore('borrowers', () => {
  const borrowers = ref<Borrower[]>([])
  const loans = ref<Loan[]>([])
  const applications = ref<LoanApplication[]>([])
  const isLoading = ref(false)

  // Computed statistics
  const borrowerStats = computed(() => ({
    total: borrowers.value.length,
    active: borrowers.value.filter(b => b.status === 'active').length,
    inactive: borrowers.value.filter(b => b.status === 'inactive').length,
    blacklisted: borrowers.value.filter(b => b.status === 'blacklisted').length
  }))

  const loanStats = computed(() => ({
    total: loans.value.length,
    active: loans.value.filter(l => l.status === 'active').length,
    completed: loans.value.filter(l => l.status === 'completed').length,
    defaulted: loans.value.filter(l => l.status === 'defaulted').length,
    totalAmount: loans.value.reduce((sum, l) => sum + l.amount, 0),
    totalOutstanding: loans.value
      .filter(l => l.status === 'active')
      .reduce((sum, l) => sum + l.outstandingBalance, 0)
  }))

  const applicationStats = computed(() => ({
    total: applications.value.length,
    pending: applications.value.filter(a => a.status === 'pending').length,
    approved: applications.value.filter(a => a.status === 'approved').length,
    rejected: applications.value.filter(a => a.status === 'rejected').length,
    underReview: applications.value.filter(a => a.status === 'under_review').length
  }))

  // Borrower methods
  const fetchBorrowers = async () => {
    isLoading.value = true
    try {
      const mockBorrowers: Borrower[] = [
        {
          id: '1',
          firstName: 'Jane',
          lastName: 'Doe',
          dateOfBirth: new Date('1985-06-15'),
          gender: 'female',
          idNumber: 'ID123456789',
          phone: '+255987654321',
          email: 'jane.doe@email.com',
          address: {
            street: '456 Oak Street',
            city: 'Arusha',
            region: 'Arusha',
            country: 'Tanzania',
            postalCode: '23456'
          },
          employmentStatus: 'employed',
          monthlyIncome: 800000,
          creditScore: 750,
          status: 'active',
          kycStatus: 'verified',
          assignedOfficer: 'staff-2',
          guarantors: [
            {
              name: 'John Guarantor',
              relationship: 'spouse',
              phone: '+255111222333',
              idNumber: 'ID987654321',
              address: '456 Oak Street, Arusha'
            }
          ],
          documents: [
            {
              type: 'national_id',
              url: '/documents/jane_id.pdf',
              uploadedAt: new Date(),
              verified: true
            }
          ],
          createdAt: new Date(),
          updatedAt: new Date(),
          createdBy: 'staff-2'
        }
      ]
      borrowers.value = mockBorrowers
    } finally {
      isLoading.value = false
    }
  }

  const addBorrower = async (borrowerData: Omit<Borrower, 'id' | 'createdAt' | 'updatedAt' | 'createdBy'>) => {
    isLoading.value = true
    try {
      const newBorrower: Borrower = {
        ...borrowerData,
        id: Date.now().toString(),
        createdAt: new Date(),
        updatedAt: new Date(),
        createdBy: 'current-user'
      }
      borrowers.value.push(newBorrower)
      return { success: true, data: newBorrower }
    } catch (error) {
      return { success: false, error: 'Failed to create borrower' }
    } finally {
      isLoading.value = false
    }
  }

  // Loan methods
  const fetchLoans = async () => {
    isLoading.value = true
    try {
      const mockLoans: Loan[] = [
        {
          id: '1',
          borrowerId: '1',
          applicationId: 'app-1',
          loanNumber: 'LN-2024-001',
          amount: 2000000,
          interestRate: 15.5,
          term: 12,
          termUnit: 'months',
          purpose: 'business',
          productId: 'product-1',
          status: 'active',
          disbursementDate: new Date('2024-01-15'),
          maturityDate: new Date('2025-01-15'),
          outstandingBalance: 1500000,
          nextPaymentDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
          nextPaymentAmount: 185000,
          totalPaid: 500000,
          paymentFrequency: 'monthly',
          collateral: [
            {
              type: 'property',
              description: 'Residential house in Arusha',
              estimatedValue: 3000000,
              documents: []
            }
          ],
          approvedBy: 'manager-1',
          approvedAt: new Date('2024-01-10'),
          disbursedBy: 'staff-2',
          createdAt: new Date('2024-01-05'),
          updatedAt: new Date(),
          createdBy: 'staff-2'
        }
      ]
      loans.value = mockLoans
    } finally {
      isLoading.value = false
    }
  }

  const fetchApplications = async () => {
    isLoading.value = true
    try {
      const mockApplications: LoanApplication[] = [
        {
          id: 'app-2',
          borrowerId: '1',
          loanNumber: 'APP-2024-002',
          requestedAmount: 1500000,
          purpose: 'education',
          term: 24,
          termUnit: 'months',
          productId: 'product-2',
          status: 'pending',
          applicationDate: new Date(),
          documents: [],
          creditAssessment: {
            score: 750,
            grade: 'A',
            riskLevel: 'low',
            assessedBy: 'credit-officer-1',
            assessedAt: new Date(),
            notes: 'Good credit history and stable income'
          },
          workflow: {
            currentStep: 'credit_review',
            steps: [
              {
                name: 'application_submitted',
                status: 'completed',
                completedAt: new Date(),
                completedBy: 'staff-2'
              },
              {
                name: 'document_verification',
                status: 'completed',
                completedAt: new Date(),
                completedBy: 'staff-2'
              },
              {
                name: 'credit_review',
                status: 'in_progress',
                assignedTo: 'credit-officer-1'
              }
            ]
          },
          createdAt: new Date(),
          updatedAt: new Date(),
          createdBy: 'staff-2'
        }
      ]
      applications.value = mockApplications
    } finally {
      isLoading.value = false
    }
  }

  const updateApplicationStatus = async (applicationId: string, status: LoanApplication['status'], notes?: string) => {
    const application = applications.value.find(a => a.id === applicationId)
    if (application) {
      application.status = status
      application.updatedAt = new Date()
      if (notes && application.workflow) {
        application.workflow.steps.push({
          name: `status_updated_to_${status}`,
          status: 'completed',
          completedAt: new Date(),
          completedBy: 'current-user',
          notes
        })
      }
      return { success: true }
    }
    return { success: false, error: 'Application not found' }
  }

  const getBorrowerLoans = (borrowerId: string) => {
    return loans.value.filter(loan => loan.borrowerId === borrowerId)
  }

  const getBorrowerApplications = (borrowerId: string) => {
    return applications.value.filter(app => app.borrowerId === borrowerId)
  }

  // Initialize data
  const initializeBorrowers = async () => {
    await Promise.all([
      fetchBorrowers(),
      fetchLoans(),
      fetchApplications()
    ])
  }

  return {
    // State
    borrowers,
    loans,
    applications,
    isLoading,
    
    // Computed
    borrowerStats,
    loanStats,
    applicationStats,
    
    // Methods
    fetchBorrowers,
    addBorrower,
    fetchLoans,
    fetchApplications,
    updateApplicationStatus,
    getBorrowerLoans,
    getBorrowerApplications,
    initializeBorrowers
  }
})