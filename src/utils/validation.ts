import type { 
  User, 
  Contact, 
  Lead, 
  Borrower, 
  Loan, 
  LoanApplication,
  SavingsAccount,
  Transaction
} from '@/types/datastore'

// Validation utilities for data integrity
export class ValidationUtils {
  // Email validation
  static isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  // Phone validation (Tanzanian format)
  static isValidPhone(phone: string): boolean {
    const phoneRegex = /^\+255[67]\d{8}$/
    return phoneRegex.test(phone)
  }

  // ID Number validation (Tanzanian format)
  static isValidIdNumber(idNumber: string): boolean {
    const idRegex = /^[A-Z]{2}\d{8,12}$/
    return idRegex.test(idNumber)
  }

  // Loan number validation
  static isValidLoanNumber(loanNumber: string): boolean {
    const loanRegex = /^LN-\d{4}-\d{4,6}$/
    return loanRegex.test(loanNumber)
  }

  // Account number validation
  static isValidAccountNumber(accountNumber: string): boolean {
    const accountRegex = /^(SAV|LON|CHQ)-\d{3,6}-\d{4}$/
    return accountRegex.test(accountNumber)
  }

  // Validate user data
  static validateUser(user: Partial<User>): { valid: boolean; errors: string[] } {
    const errors: string[] = []

    if (!user.email || !this.isValidEmail(user.email)) {
      errors.push('Valid email is required')
    }

    if (!user.firstName || user.firstName.trim().length < 2) {
      errors.push('First name must be at least 2 characters')
    }

    if (!user.lastName || user.lastName.trim().length < 2) {
      errors.push('Last name must be at least 2 characters')
    }

    if (user.phone && !this.isValidPhone(user.phone)) {
      errors.push('Phone number must be in format +255XXXXXXXXX')
    }

    return { valid: errors.length === 0, errors }
  }

  // Validate contact data
  static validateContact(contact: Partial<Contact>): { valid: boolean; errors: string[] } {
    const errors: string[] = []

    if (!contact.firstName || contact.firstName.trim().length < 2) {
      errors.push('First name must be at least 2 characters')
    }

    if (!contact.lastName || contact.lastName.trim().length < 2) {
      errors.push('Last name must be at least 2 characters')
    }

    if (contact.email && !this.isValidEmail(contact.email)) {
      errors.push('Valid email is required')
    }

    if (!contact.phone || !this.isValidPhone(contact.phone)) {
      errors.push('Valid phone number is required')
    }

    if (!contact.type || !['customer', 'prospect', 'partner', 'vendor'].includes(contact.type)) {
      errors.push('Valid contact type is required')
    }

    return { valid: errors.length === 0, errors }
  }

  // Validate lead data
  static validateLead(lead: Partial<Lead>): { valid: boolean; errors: string[] } {
    const errors: string[] = []

    if (!lead.title || lead.title.trim().length < 5) {
      errors.push('Lead title must be at least 5 characters')
    }

    if (!lead.contactId) {
      errors.push('Contact ID is required')
    }

    if (lead.estimatedValue && lead.estimatedValue < 0) {
      errors.push('Estimated value must be positive')
    }

    if (lead.probability && (lead.probability < 0 || lead.probability > 100)) {
      errors.push('Probability must be between 0 and 100')
    }

    const validStages = ['new', 'contacted', 'qualified', 'proposal', 'negotiation', 'closed', 'lost']
    if (lead.stage && !validStages.includes(lead.stage)) {
      errors.push('Invalid lead stage')
    }

    return { valid: errors.length === 0, errors }
  }

  // Validate borrower data
  static validateBorrower(borrower: Partial<Borrower>): { valid: boolean; errors: string[] } {
    const errors: string[] = []

    if (!borrower.firstName || borrower.firstName.trim().length < 2) {
      errors.push('First name must be at least 2 characters')
    }

    if (!borrower.lastName || borrower.lastName.trim().length < 2) {
      errors.push('Last name must be at least 2 characters')
    }

    if (!borrower.dateOfBirth) {
      errors.push('Date of birth is required')
    } else {
      const age = new Date().getFullYear() - borrower.dateOfBirth.getFullYear()
      if (age < 18 || age > 100) {
        errors.push('Borrower must be between 18 and 100 years old')
      }
    }

    if (!borrower.idNumber || !this.isValidIdNumber(borrower.idNumber)) {
      errors.push('Valid ID number is required')
    }

    if (!borrower.phone || !this.isValidPhone(borrower.phone)) {
      errors.push('Valid phone number is required')
    }

    if (borrower.email && !this.isValidEmail(borrower.email)) {
      errors.push('Valid email format required')
    }

    if (!borrower.gender || !['male', 'female', 'other'].includes(borrower.gender)) {
      errors.push('Valid gender is required')
    }

    if (borrower.monthlyIncome && borrower.monthlyIncome < 0) {
      errors.push('Monthly income must be positive')
    }

    return { valid: errors.length === 0, errors }
  }

  // Validate loan data
  static validateLoan(loan: Partial<Loan>): { valid: boolean; errors: string[] } {
    const errors: string[] = []

    if (!loan.borrowerId) {
      errors.push('Borrower ID is required')
    }

    if (!loan.amount || loan.amount <= 0) {
      errors.push('Loan amount must be positive')
    }

    if (!loan.interestRate || loan.interestRate < 0 || loan.interestRate > 100) {
      errors.push('Interest rate must be between 0 and 100')
    }

    if (!loan.term || loan.term <= 0) {
      errors.push('Loan term must be positive')
    }

    if (loan.loanNumber && !this.isValidLoanNumber(loan.loanNumber)) {
      errors.push('Invalid loan number format')
    }

    const validPurposes = ['business', 'personal', 'education', 'agriculture', 'housing', 'other']
    if (!loan.purpose || !validPurposes.includes(loan.purpose)) {
      errors.push('Valid loan purpose is required')
    }

    if (loan.disbursementDate && loan.maturityDate) {
      if (loan.disbursementDate >= loan.maturityDate) {
        errors.push('Maturity date must be after disbursement date')
      }
    }

    return { valid: errors.length === 0, errors }
  }

  // Validate loan application
  static validateLoanApplication(application: Partial<LoanApplication>): { valid: boolean; errors: string[] } {
    const errors: string[] = []

    if (!application.borrowerId) {
      errors.push('Borrower ID is required')
    }

    if (!application.requestedAmount || application.requestedAmount <= 0) {
      errors.push('Requested amount must be positive')
    }

    if (!application.term || application.term <= 0) {
      errors.push('Loan term must be positive')
    }

    const validPurposes = ['business', 'personal', 'education', 'agriculture', 'housing', 'other']
    if (!application.purpose || !validPurposes.includes(application.purpose)) {
      errors.push('Valid loan purpose is required')
    }

    return { valid: errors.length === 0, errors }
  }

  // Validate savings account
  static validateSavingsAccount(account: Partial<SavingsAccount>): { valid: boolean; errors: string[] } {
    const errors: string[] = []

    if (!account.customerId) {
      errors.push('Customer ID is required')
    }

    if (!account.productId) {
      errors.push('Product ID is required')
    }

    if (account.balance && account.balance < 0) {
      errors.push('Balance cannot be negative')
    }

    if (account.interestRate && (account.interestRate < 0 || account.interestRate > 100)) {
      errors.push('Interest rate must be between 0 and 100')
    }

    if (account.minimumBalance && account.minimumBalance < 0) {
      errors.push('Minimum balance cannot be negative')
    }

    if (account.accountNumber && !this.isValidAccountNumber(account.accountNumber)) {
      errors.push('Invalid account number format')
    }

    return { valid: errors.length === 0, errors }
  }

  // Validate transaction
  static validateTransaction(transaction: Partial<Transaction>): { valid: boolean; errors: string[] } {
    const errors: string[] = []

    if (!transaction.accountId) {
      errors.push('Account ID is required')
    }

    if (!transaction.amount || transaction.amount <= 0) {
      errors.push('Transaction amount must be positive')
    }

    if (!transaction.type || !['debit', 'credit'].includes(transaction.type)) {
      errors.push('Valid transaction type is required')
    }

    if (!transaction.description || transaction.description.trim().length < 3) {
      errors.push('Description must be at least 3 characters')
    }

    if (!transaction.date || transaction.date > new Date()) {
      errors.push('Transaction date cannot be in the future')
    }

    return { valid: errors.length === 0, errors }
  }

  // Business rule validations
  static validateBusinessRules = {
    // Check if borrower can take another loan
    canBorrowAgain(borrower: Borrower, activeLoans: Loan[], newLoanAmount: number): { allowed: boolean; reason?: string } {
      const totalActiveDebt = activeLoans.reduce((sum, loan) => sum + loan.outstandingBalance, 0)
      const totalDebtAfterNewLoan = totalActiveDebt + newLoanAmount
      const monthlyIncome = borrower.monthlyIncome || 0
      
      // Debt-to-income ratio should not exceed 60%
      const debtToIncomeRatio = (totalDebtAfterNewLoan * 0.1) / monthlyIncome // Assuming 10% monthly payment
      
      if (debtToIncomeRatio > 0.6) {
        return { allowed: false, reason: 'Debt-to-income ratio would exceed 60%' }
      }

      // Credit score should be above 600
      if (borrower.creditScore < 600) {
        return { allowed: false, reason: 'Credit score is below minimum requirement (600)' }
      }

      // KYC must be verified
      if (borrower.kycStatus !== 'verified') {
        return { allowed: false, reason: 'KYC verification is required' }
      }

      // Maximum 3 active loans per borrower
      if (activeLoans.length >= 3) {
        return { allowed: false, reason: 'Maximum number of active loans reached (3)' }
      }

      return { allowed: true }
    },

    // Check if savings withdrawal is allowed
    canWithdraw(account: SavingsAccount, amount: number): { allowed: boolean; reason?: string } {
      if (amount > account.availableBalance) {
        return { allowed: false, reason: 'Insufficient available balance' }
      }

      const balanceAfterWithdrawal = account.balance - amount
      if (balanceAfterWithdrawal < account.minimumBalance) {
        return { allowed: false, reason: 'Withdrawal would breach minimum balance requirement' }
      }

      if (account.status !== 'active') {
        return { allowed: false, reason: 'Account is not active' }
      }

      return { allowed: true }
    }
  }
}

// Export validation functions
export const {
  isValidEmail,
  isValidPhone,
  isValidIdNumber,
  isValidLoanNumber,
  isValidAccountNumber,
  validateUser,
  validateContact,
  validateLead,
  validateBorrower,
  validateLoan,
  validateLoanApplication,
  validateSavingsAccount,
  validateTransaction,
  validateBusinessRules
} = ValidationUtils