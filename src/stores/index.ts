import { useAuthStore } from './auth'
import { useCRMStore } from './crm'
import { useBorrowersStore } from './borrowers'
import { useSavingsStore } from './savings'
import { useAccountingStore } from './accounting'
import { MockDataService } from '@/services/mockData'

// Central store manager for data relationships and validation
export class StoreManager {
  // Initialize all stores with mock data for development
  static async initializeAllStores() {
    const authStore = useAuthStore()
    const crmStore = useCRMStore()
    const borrowersStore = useBorrowersStore()
    const savingsStore = useSavingsStore()
    const accountingStore = useAccountingStore()

    // Only initialize if not already authenticated (to avoid overriding user data)
    if (!authStore.isAuthenticated) {
      try {
        // Initialize CRM data
        await crmStore.initializeCRM()
        
        // Initialize borrower data  
        await borrowersStore.initializeBorrowers()
        
        // Initialize savings data
        await savingsStore.initializeSavings()
        
        // Initialize accounting data
        await accountingStore.initializeAccounting()
        
        console.log('✅ All stores initialized with mock data')
      } catch (error) {
        console.error('❌ Error initializing stores:', error)
      }
    }
  }

  // Validate data relationships
  static validateDataIntegrity() {
    const crmStore = useCRMStore()
    const borrowersStore = useBorrowersStore()
    const savingsStore = useSavingsStore()
    
    const issues: string[] = []

    // Validate CRM Lead-Contact relationships
    crmStore.leads.forEach(lead => {
      const contact = crmStore.contacts.find(c => c.id === lead.contactId)
      if (!contact) {
        issues.push(`Lead ${lead.id} references non-existent contact ${lead.contactId}`)
      }
    })

    // Validate CRM Activity relationships
    crmStore.activities.forEach(activity => {
      if (activity.contactId) {
        const contact = crmStore.contacts.find(c => c.id === activity.contactId)
        if (!contact) {
          issues.push(`Activity ${activity.id} references non-existent contact ${activity.contactId}`)
        }
      }
      if (activity.leadId) {
        const lead = crmStore.leads.find(l => l.id === activity.leadId)
        if (!lead) {
          issues.push(`Activity ${activity.id} references non-existent lead ${activity.leadId}`)
        }
      }
    })

    // Validate Loan-Borrower relationships
    borrowersStore.loans.forEach(loan => {
      const borrower = borrowersStore.borrowers.find(b => b.id === loan.borrowerId)
      if (!borrower) {
        issues.push(`Loan ${loan.id} references non-existent borrower ${loan.borrowerId}`)
      }
    })

    // Validate Savings-Customer relationships
    savingsStore.accounts.forEach(account => {
      const customer = borrowersStore.borrowers.find(b => b.id === account.customerId)
      if (!customer) {
        issues.push(`Savings account ${account.id} references non-existent customer ${account.customerId}`)
      }
    })

    if (issues.length > 0) {
      console.warn('⚠️ Data integrity issues found:', issues)
      return { valid: false, issues }
    }

    console.log('✅ Data integrity validation passed')
    return { valid: true, issues: [] }
  }

  // Get related data across stores
  static getCustomerProfile(customerId: string) {
    const borrowersStore = useBorrowersStore()
    const savingsStore = useSavingsStore()
    const crmStore = useCRMStore()
    
    const customer = borrowersStore.borrowers.find(b => b.id === customerId)
    if (!customer) return null

    const loans = borrowersStore.getBorrowerLoans(customerId)
    const applications = borrowersStore.getBorrowerApplications(customerId)
    const savingsAccounts = savingsStore.getCustomerAccounts(customerId)
    
    // Find CRM contact for this customer
    const contact = crmStore.contacts.find(c => 
      c.email === customer.email || 
      c.phone === customer.phone ||
      (c.firstName === customer.firstName && c.lastName === customer.lastName)
    )
    
    const activities = contact ? crmStore.activities.filter(a => a.contactId === contact.id) : []
    const tasks = contact ? crmStore.tasks.filter(t => t.contactId === contact.id) : []

    return {
      customer,
      contact,
      loans,
      applications,
      savingsAccounts,
      activities,
      tasks,
      stats: {
        totalLoans: loans.length,
        totalSavings: savingsAccounts.reduce((sum, acc) => sum + acc.balance, 0),
        totalDebt: loans.reduce((sum, loan) => sum + loan.outstandingBalance, 0),
        creditScore: customer.creditScore
      }
    }
  }

  // Calculate customer risk score
  static calculateCustomerRisk(customerId: string): number {
    const profile = this.getCustomerProfile(customerId)
    if (!profile) return 100 // Maximum risk if no data

    let riskScore = 50 // Base risk score

    // Credit score factor (lower credit score = higher risk)
    if (profile.customer.creditScore) {
      riskScore -= (profile.customer.creditScore - 600) * 0.05
    }

    // Debt-to-income ratio
    const monthlyIncome = profile.customer.monthlyIncome || 1
    const monthlyDebtPayment = profile.loans.reduce((sum, loan) => sum + loan.nextPaymentAmount, 0)
    const debtToIncomeRatio = monthlyDebtPayment / monthlyIncome
    riskScore += debtToIncomeRatio * 30

    // Loan performance history
    const activeLoans = profile.loans.filter(l => l.status === 'active')
    const defaultedLoans = profile.loans.filter(l => l.status === 'defaulted')
    if (defaultedLoans.length > 0) {
      riskScore += defaultedLoans.length * 20
    }

    // Savings balance factor (higher savings = lower risk)
    if (profile.stats.totalSavings > 0) {
      riskScore -= Math.min(profile.stats.totalSavings / 100000, 10)
    }

    // Employment status
    if (profile.customer.employmentStatus === 'unemployed') {
      riskScore += 25
    } else if (profile.customer.employmentStatus === 'self_employed') {
      riskScore += 10
    }

    // KYC verification status
    if (profile.customer.kycStatus !== 'verified') {
      riskScore += 15
    }

    // Ensure score is within 0-100 range
    return Math.max(0, Math.min(100, Math.round(riskScore)))
  }

  // Search across all stores
  static globalSearch(query: string) {
    const crmStore = useCRMStore()
    const borrowersStore = useBorrowersStore()
    const savingsStore = useSavingsStore()
    
    const results = {
      contacts: [] as any[],
      leads: [] as any[],
      borrowers: [] as any[],
      loans: [] as any[],
      savingsAccounts: [] as any[]
    }

    const lowerQuery = query.toLowerCase()

    // Search contacts
    results.contacts = crmStore.contacts.filter(contact => 
      contact.firstName.toLowerCase().includes(lowerQuery) ||
      contact.lastName.toLowerCase().includes(lowerQuery) ||
      contact.email.toLowerCase().includes(lowerQuery) ||
      contact.phone.includes(query) ||
      (contact.company && contact.company.toLowerCase().includes(lowerQuery))
    )

    // Search leads
    results.leads = crmStore.leads.filter(lead =>
      lead.title.toLowerCase().includes(lowerQuery) ||
      lead.description.toLowerCase().includes(lowerQuery)
    )

    // Search borrowers
    results.borrowers = borrowersStore.borrowers.filter(borrower =>
      borrower.firstName.toLowerCase().includes(lowerQuery) ||
      borrower.lastName.toLowerCase().includes(lowerQuery) ||
      borrower.email?.toLowerCase().includes(lowerQuery) ||
      borrower.phone.includes(query) ||
      borrower.idNumber.toLowerCase().includes(lowerQuery)
    )

    // Search loans
    results.loans = borrowersStore.loans.filter(loan =>
      loan.loanNumber.toLowerCase().includes(lowerQuery) ||
      loan.purpose.toLowerCase().includes(lowerQuery)
    )

    // Search savings accounts
    results.savingsAccounts = savingsStore.accounts.filter(account =>
      account.accountNumber.toLowerCase().includes(lowerQuery)
    )

    return results
  }
}

// Export individual stores
export {
  useAuthStore,
  useCRMStore,
  useBorrowersStore,
  useSavingsStore,
  useAccountingStore
}

// Auto-initialize stores in development
if (import.meta.env.DEV) {
  // Initialize after a short delay to allow stores to be ready
  setTimeout(() => {
    StoreManager.initializeAllStores()
  }, 1000)
}