// ========================================
// COMPREHENSIVE DATASTORE TYPES
// Micro-Finance Management System
// ========================================

// Base interfaces
export interface BaseEntity {
  id: string
  createdAt: Date
  updatedAt: Date
  createdBy: string
  updatedBy?: string
  isActive: boolean
}

export interface AuditTrail {
  timestamp: Date
  userId: string
  action: string
  entityType: string
  entityId: string
  changes?: Record<string, any>
  ipAddress?: string
  userAgent?: string
}

// ========================================
// USER MANAGEMENT & AUTHENTICATION
// ========================================

export interface User extends BaseEntity {
  email: string
  firstName: string
  lastName: string
  phone?: string
  avatar?: string
  role: UserRole
  permissions: Permission[]
  branchAccess: string[] // Branch IDs user can access
  lastLoginAt?: Date
  isEmailVerified: boolean
  isPhoneVerified: boolean
  twoFactorEnabled: boolean
  preferences: UserPreferences
  status: 'active' | 'inactive' | 'suspended'
}

export interface UserRole extends BaseEntity {
  name: string
  description: string
  permissions: Permission[]
  level: number // Hierarchy level
}

export interface Permission {
  id: string
  module: string // 'loans', 'borrowers', 'accounting', etc.
  action: string // 'create', 'read', 'update', 'delete', 'approve'
  resource?: string // Specific resource within module
}

export interface UserPreferences {
  language: string
  currency: string
  dateFormat: string
  timeFormat: string
  timezone: string
  dashboardLayout: string
  notificationSettings: NotificationSettings
}

export interface NotificationSettings {
  email: boolean
  sms: boolean
  push: boolean
  inApp: boolean
  frequency: 'immediate' | 'daily' | 'weekly'
}

// ========================================
// BRANCH & ORGANIZATION
// ========================================

export interface Branch extends BaseEntity {
  code: string
  name: string
  address: Address
  phone: string
  email: string
  managerId: string
  currency: string
  timezone: string
  operatingHours: OperatingHours
  limits: BranchLimits
  coordinates?: Coordinates
  status: 'active' | 'inactive'
}

export interface OperatingHours {
  [key: string]: { // 'monday', 'tuesday', etc.
    isOpen: boolean
    openTime: string
    closeTime: string
  }
}

export interface BranchLimits {
  maxLoanAmount: number
  maxTransactionAmount: number
  dailyLoanLimit: number
  dailyTransactionLimit: number
}

export interface Address {
  street: string
  city: string
  state: string
  country: string
  postalCode: string
}

export interface Coordinates {
  latitude: number
  longitude: number
}

// ========================================
// CRM SYSTEM
// ========================================

export interface CRMContact extends BaseEntity {
  type: 'individual' | 'business' | 'organization'
  name: string
  company?: string
  title?: string
  email: string
  phone: string
  alternativePhone?: string
  address?: Address
  dateOfBirth?: Date
  avatar?: string
  tags: string[]
  status: 'active' | 'inactive' | 'prospect' | 'lead' | 'customer'
  source: 'website' | 'referral' | 'walk-in' | 'social-media' | 'campaign'
  assignedTo?: string // User ID
  lastContactedAt?: Date
  notes: string
  customFields: Record<string, any>
}

export interface CRMLead extends BaseEntity {
  contactId?: string
  name: string
  company?: string
  email: string
  phone: string
  stage: 'new' | 'contacted' | 'qualified' | 'proposal' | 'negotiation' | 'converted' | 'lost'
  value: number // Potential deal value
  score: number // Lead score (0-100)
  source: string
  assignedTo: string
  expectedCloseDate?: Date
  probability: number // Percentage chance of conversion
  lostReason?: string
  convertedDate?: Date
  notes: string
  activities: CRMActivity[]
}

export interface CRMActivity extends BaseEntity {
  type: 'call' | 'email' | 'meeting' | 'note' | 'task' | 'sms'
  title: string
  description: string
  contactId?: string
  leadId?: string
  customerId?: string
  assignedTo: string
  dueDate?: Date
  completedAt?: Date
  priority: 'high' | 'medium' | 'low'
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled'
  metadata?: Record<string, any> // Call duration, email subject, etc.
  followUpRequired: boolean
  followUpDate?: Date
  tags: string[]
}

export interface CRMTask extends BaseEntity {
  title: string
  description: string
  contactId?: string
  leadId?: string
  customerId?: string
  assignedTo: string
  dueDate: Date
  priority: 'high' | 'medium' | 'low'
  status: 'todo' | 'in_progress' | 'review' | 'completed'
  category: string
  tags: string[]
  checklist?: TaskChecklistItem[]
  attachments: string[]
  estimatedHours?: number
  actualHours?: number
}

export interface TaskChecklistItem {
  id: string
  text: string
  completed: boolean
  completedAt?: Date
  completedBy?: string
}

// ========================================
// CUSTOMER/BORROWER MANAGEMENT
// ========================================

export interface Borrower extends BaseEntity {
  borrowerNumber: string
  type: 'individual' | 'business' | 'group'
  firstName: string
  middleName?: string
  lastName: string
  businessName?: string
  dateOfBirth?: Date
  gender?: 'male' | 'female' | 'other'
  maritalStatus?: 'single' | 'married' | 'divorced' | 'widowed'
  nationalId: string
  passportNumber?: string
  phone: string
  alternativePhone?: string
  email?: string
  address: Address
  emergencyContact: EmergencyContact
  employment: EmploymentInfo
  bankAccount?: BankAccountInfo
  kycStatus: 'pending' | 'in_review' | 'approved' | 'rejected'
  kycDocuments: KYCDocument[]
  creditScore?: number
  riskRating: 'low' | 'medium' | 'high'
  branchId: string
  assignedOfficer: string
  status: 'active' | 'inactive' | 'blacklisted'
  groupId?: string // For group members
  tags: string[]
  notes: string
  customFields: Record<string, any>
}

export interface EmergencyContact {
  name: string
  relationship: string
  phone: string
  address?: string
}

export interface EmploymentInfo {
  status: 'employed' | 'self_employed' | 'unemployed' | 'retired'
  employer?: string
  position?: string
  monthlyIncome?: number
  workAddress?: Address
  employmentStartDate?: Date
  businessType?: string
  yearsInBusiness?: number
}

export interface BankAccountInfo {
  bankName: string
  accountNumber: string
  accountType: 'savings' | 'current' | 'other'
  branchName?: string
}

export interface KYCDocument {
  id: string
  type: 'national_id' | 'passport' | 'driving_license' | 'utility_bill' | 'bank_statement' | 'other'
  fileName: string
  filePath: string
  uploadedAt: Date
  verifiedAt?: Date
  verifiedBy?: string
  status: 'pending' | 'approved' | 'rejected'
  expiryDate?: Date
}

export interface BorrowerGroup extends BaseEntity {
  groupNumber: string
  name: string
  description: string
  type: 'solidarity' | 'joint_liability' | 'self_help'
  memberIds: string[]
  leaderId: string
  meetingSchedule: MeetingSchedule
  address?: Address
  branchId: string
  assignedOfficer: string
  status: 'active' | 'inactive' | 'dissolved'
  formation_date: Date
  rules: string[]
  minMembers: number
  maxMembers: number
}

export interface MeetingSchedule {
  frequency: 'weekly' | 'biweekly' | 'monthly'
  dayOfWeek: number // 0-6, where 0 is Sunday
  time: string
  location: string
}

// ========================================
// LOAN MANAGEMENT
// ========================================

export interface LoanProduct extends BaseEntity {
  code: string
  name: string
  description: string
  category: 'personal' | 'business' | 'agriculture' | 'microfinance' | 'emergency'
  minAmount: number
  maxAmount: number
  minTerm: number // in months
  maxTerm: number
  interestRate: number
  interestType: 'flat' | 'reducing_balance' | 'compound'
  fees: LoanFee[]
  collateralRequired: boolean
  guarantorRequired: boolean
  minGuarantors?: number
  eligibilityCriteria: EligibilityCriteria
  documents: RequiredDocument[]
  branchIds: string[] // Available in these branches
  status: 'active' | 'inactive'
}

export interface LoanFee {
  name: string
  type: 'percentage' | 'fixed'
  value: number
  applicableOn: 'principal' | 'interest' | 'total'
  timing: 'upfront' | 'monthly' | 'end'
}

export interface EligibilityCriteria {
  minAge: number
  maxAge: number
  minIncome?: number
  employmentStatus?: string[]
  creditScoreMin?: number
  existingLoanLimit?: number
}

export interface RequiredDocument {
  type: string
  name: string
  required: boolean
  description: string
}

export interface Loan extends BaseEntity {
  loanNumber: string
  borrowerId: string
  productId: string
  applicationDate: Date
  approvalDate?: Date
  disbursementDate?: Date
  principal: number
  interestRate: number
  term: number // in months
  installmentAmount: number
  totalAmount: number // Principal + Interest
  purpose: string
  collateral: CollateralInfo[]
  guarantors: GuarantorInfo[]
  status: LoanStatus
  stage: LoanStage
  branchId: string
  assignedOfficer: string
  approvedBy?: string
  disbursedBy?: string
  repaymentSchedule: RepaymentSchedule[]
  payments: LoanPayment[]
  balanceOutstanding: number
  interestOutstanding: number
  feesOutstanding: number
  penaltyOutstanding: number
  daysPastDue: number
  classification: 'standard' | 'watch' | 'substandard' | 'doubtful' | 'loss'
  provisioning: number
  lastPaymentDate?: Date
  maturityDate: Date
  writeOffDate?: Date
  writeOffAmount?: number
  writeOffReason?: string
  documents: LoanDocument[]
  notes: string
  customFields: Record<string, any>
}

export type LoanStatus = 
  | 'draft' 
  | 'submitted' 
  | 'under_review' 
  | 'approved' 
  | 'rejected' 
  | 'disbursed' 
  | 'active' 
  | 'completed' 
  | 'written_off' 
  | 'cancelled'

export type LoanStage = 
  | 'application' 
  | 'documentation' 
  | 'credit_assessment' 
  | 'approval' 
  | 'disbursement' 
  | 'active' 
  | 'collection' 
  | 'legal' 
  | 'closed'

export interface CollateralInfo {
  type: string
  description: string
  value: number
  location?: string
  documents: string[]
  valuationDate: Date
  valuedBy?: string
}

export interface GuarantorInfo {
  borrowerId?: string // If guarantor is also a borrower
  name: string
  nationalId: string
  phone: string
  email?: string
  address: Address
  employment: EmploymentInfo
  relationship: string
  guaranteedAmount: number
  documents: string[]
  status: 'pending' | 'approved' | 'rejected'
}

export interface RepaymentSchedule {
  installmentNumber: number
  dueDate: Date
  principal: number
  interest: number
  fees: number
  totalDue: number
  balance: number
  status: 'pending' | 'paid' | 'partial' | 'overdue'
  paidAmount?: number
  paidDate?: Date
  paymentId?: string
}

export interface LoanPayment extends BaseEntity {
  loanId: string
  amount: number
  principalAmount: number
  interestAmount: number
  feesAmount: number
  penaltyAmount: number
  paymentDate: Date
  paymentMethod: PaymentMethod
  referenceNumber: string
  collectedBy: string
  notes?: string
  installmentNumbers: number[]
  reversalPaymentId?: string // If this payment was reversed
  isReversal: boolean
}

export interface LoanDocument {
  id: string
  type: string
  name: string
  filePath: string
  uploadedAt: Date
  uploadedBy: string
  category: 'application' | 'approval' | 'collateral' | 'guarantor' | 'other'
}

// ========================================
// SAVINGS MANAGEMENT
// ========================================

export interface SavingsProduct extends BaseEntity {
  code: string
  name: string
  description: string
  type: 'regular' | 'fixed_deposit' | 'recurring' | 'susu'
  minBalance: number
  maxBalance?: number
  interestRate: number
  interestCalculation: 'daily' | 'monthly' | 'quarterly' | 'annually'
  interestPayment: 'monthly' | 'quarterly' | 'annually' | 'maturity'
  fees: SavingsFee[]
  withdrawalRestrictions: WithdrawalRestrictions
  minDepositAmount: number
  maxDepositAmount?: number
  maturityPeriod?: number // for fixed deposits, in months
  penaltyForEarlyWithdrawal?: number
  branchIds: string[]
  status: 'active' | 'inactive'
}

export interface SavingsFee {
  name: string
  type: 'percentage' | 'fixed'
  value: number
  trigger: 'monthly' | 'transaction' | 'balance' | 'withdrawal'
  condition?: string
}

export interface WithdrawalRestrictions {
  minWithdrawalAmount?: number
  maxWithdrawalAmount?: number
  dailyWithdrawalLimit?: number
  monthlyWithdrawalLimit?: number
  freeWithdrawalsPerMonth?: number
  noticePeriod?: number // days
}

export interface SavingsAccount extends BaseEntity {
  accountNumber: string
  borrowerId: string
  productId: string
  openingDate: Date
  closingDate?: Date
  balance: number
  availableBalance: number
  blockedBalance: number
  minBalance: number
  interestEarned: number
  lastInterestCalculation: Date
  nextInterestPayment?: Date
  branchId: string
  assignedOfficer: string
  status: 'active' | 'inactive' | 'dormant' | 'closed'
  maturityDate?: Date // for fixed deposits
  isMatured: boolean
  autoRenew: boolean // for fixed deposits
  nomineeInfo?: NomineeInfo
  transactions: SavingsTransaction[]
  documents: string[]
  notes: string
}

export interface NomineeInfo {
  name: string
  relationship: string
  nationalId: string
  phone?: string
  address?: Address
  percentage: number
}

export interface SavingsTransaction extends BaseEntity {
  accountId: string
  type: 'deposit' | 'withdrawal' | 'interest' | 'fee' | 'penalty' | 'transfer'
  amount: number
  balance: number
  description: string
  referenceNumber: string
  paymentMethod?: PaymentMethod
  processedBy: string
  reversalTransactionId?: string
  isReversal: boolean
  metadata?: Record<string, any>
}

// ========================================
// INVESTMENT MANAGEMENT
// ========================================

export interface Investor extends BaseEntity {
  investorNumber: string
  type: 'individual' | 'institutional'
  name: string
  companyName?: string
  contactPerson?: string
  email: string
  phone: string
  address: Address
  taxId?: string
  kycStatus: 'pending' | 'approved' | 'rejected'
  kycDocuments: KYCDocument[]
  riskProfile: 'conservative' | 'moderate' | 'aggressive'
  investmentLimit?: number
  branchId: string
  assignedOfficer: string
  status: 'active' | 'inactive'
  notes: string
}

export interface InvestmentProduct extends BaseEntity {
  code: string
  name: string
  description: string
  type: 'fixed_deposit' | 'loan_portfolio' | 'bond' | 'equity'
  minInvestment: number
  maxInvestment?: number
  returnRate: number
  term: number // in months
  riskLevel: 'low' | 'medium' | 'high'
  fees: InvestmentFee[]
  eligibilityCriteria: string[]
  status: 'active' | 'inactive'
}

export interface InvestmentFee {
  name: string
  type: 'percentage' | 'fixed'
  value: number
  timing: 'upfront' | 'annual' | 'maturity'
}

export interface Investment extends BaseEntity {
  investmentNumber: string
  investorId: string
  productId: string
  principal: number
  currentValue: number
  expectedReturn: number
  actualReturn?: number
  startDate: Date
  maturityDate: Date
  status: 'active' | 'matured' | 'liquidated' | 'defaulted'
  interestRate: number
  paymentSchedule: InvestmentPayment[]
  branchId: string
  assignedOfficer: string
}

export interface InvestmentPayment {
  dueDate: Date
  amount: number
  type: 'interest' | 'principal' | 'both'
  status: 'pending' | 'paid' | 'overdue'
  paidDate?: Date
  paidAmount?: number
}

// ========================================
// ACCOUNTING & FINANCE
// ========================================

export interface ChartOfAccount extends BaseEntity {
  code: string
  name: string
  type: 'assets' | 'liabilities' | 'equity' | 'revenue' | 'expenses'
  subType: string
  parentId?: string
  level: number
  isSystemAccount: boolean
  description?: string
  cashFlowType: 'operating' | 'investing' | 'financing' | 'non_applicable'
  normalBalance: 'debit' | 'credit'
  isLocked: boolean
  branchRestricted: boolean
  branchIds: string[]
  currentBalance: number
  status: 'active' | 'inactive'
}

export interface JournalEntry extends BaseEntity {
  entryNumber: string
  date: Date
  description: string
  reference?: string
  type: 'manual' | 'automatic' | 'system'
  source: string // Module that created this entry
  sourceId?: string // ID of the source entity
  totalDebit: number
  totalCredit: number
  status: 'draft' | 'posted' | 'approved' | 'reversed'
  postedBy?: string
  postedAt?: Date
  approvedBy?: string
  approvedAt?: Date
  reversalEntryId?: string
  branchId: string
  lines: JournalLine[]
  attachments: string[]
  tags: string[]
}

export interface JournalLine {
  accountId: string
  debitAmount: number
  creditAmount: number
  description?: string
  reference?: string
  costCenterId?: string
}

export interface BankAccount extends BaseEntity {
  accountNumber: string
  bankName: string
  branchName: string
  accountType: 'current' | 'savings' | 'overdraft'
  currency: string
  balance: number
  reconcileDate?: Date
  reconciledBalance?: number
  chartAccountId: string
  signatories: string[]
  branchId: string
  isActive: boolean
}

export interface Transaction extends BaseEntity {
  transactionNumber: string
  type: TransactionType
  amount: number
  currency: string
  exchangeRate?: number
  description: string
  referenceNumber: string
  paymentMethod: PaymentMethod
  fromAccountId?: string
  toAccountId?: string
  customerId?: string
  loanId?: string
  savingsAccountId?: string
  fees: number
  processingFee: number
  status: TransactionStatus
  processedBy: string
  authorizedBy?: string
  branchId: string
  channelId: string
  metadata?: Record<string, any>
  relatedTransactionId?: string
  reversalTransactionId?: string
  isReversal: boolean
  journalEntryId?: string
}

export type TransactionType = 
  | 'loan_disbursement' 
  | 'loan_payment' 
  | 'savings_deposit' 
  | 'savings_withdrawal' 
  | 'account_transfer' 
  | 'fee_payment' 
  | 'penalty_payment' 
  | 'other'

export type PaymentMethod = 
  | 'cash' 
  | 'bank_transfer' 
  | 'mobile_money' 
  | 'cheque' 
  | 'card' 
  | 'online'

export type TransactionStatus = 
  | 'pending' 
  | 'processing' 
  | 'completed' 
  | 'failed' 
  | 'cancelled' 
  | 'reversed'

// ========================================
// ASSET MANAGEMENT
// ========================================

export interface Asset extends BaseEntity {
  assetNumber: string
  name: string
  description: string
  category: AssetCategory
  subCategory?: string
  purchaseDate: Date
  purchasePrice: number
  currentValue: number
  depreciation: DepreciationInfo
  location: string
  condition: 'excellent' | 'good' | 'fair' | 'poor' | 'damaged'
  status: 'active' | 'disposed' | 'stolen' | 'maintenance'
  branchId: string
  assignedTo?: string
  documents: string[]
  maintenanceSchedule: MaintenanceSchedule[]
  notes: string
}

export type AssetCategory = 
  | 'building' 
  | 'equipment' 
  | 'furniture' 
  | 'vehicle' 
  | 'technology' 
  | 'other'

export interface DepreciationInfo {
  method: 'straight_line' | 'reducing_balance' | 'units_of_production'
  usefulLife: number // in years
  salvageValue: number
  annualDepreciation: number
  accumulatedDepreciation: number
  lastDepreciationDate: Date
}

export interface MaintenanceSchedule {
  id: string
  type: 'routine' | 'preventive' | 'corrective'
  description: string
  scheduledDate: Date
  completedDate?: Date
  cost?: number
  performedBy?: string
  notes?: string
  nextServiceDate?: Date
}

// ========================================
// EXPENSE MANAGEMENT
// ========================================

export interface ExpenseCategory extends BaseEntity {
  name: string
  description: string
  code: string
  parentId?: string
  accountId: string // Chart of Account ID
  requiresApproval: boolean
  approvalLimit?: number
  branchIds: string[]
  status: 'active' | 'inactive'
}

export interface Expense extends BaseEntity {
  expenseNumber: string
  categoryId: string
  amount: number
  currency: string
  description: string
  expenseDate: Date
  vendor?: string
  paymentMethod: PaymentMethod
  receiptNumber?: string
  status: ExpenseStatus
  submittedBy: string
  approvedBy?: string
  approvedAt?: Date
  paidBy?: string
  paidAt?: Date
  branchId: string
  projectId?: string
  costCenterId?: string
  attachments: string[]
  tags: string[]
  journalEntryId?: string
  notes: string
}

export type ExpenseStatus = 
  | 'draft' 
  | 'submitted' 
  | 'approved' 
  | 'rejected' 
  | 'paid' 
  | 'cancelled'

// ========================================
// PAYROLL MANAGEMENT
// ========================================

export interface Employee extends BaseEntity {
  employeeNumber: string
  firstName: string
  lastName: string
  email: string
  phone: string
  dateOfBirth: Date
  nationalId: string
  address: Address
  position: string
  department: string
  hireDate: Date
  terminationDate?: Date
  salary: number
  salaryType: 'monthly' | 'hourly' | 'daily'
  bankAccount: BankAccountInfo
  taxId?: string
  socialSecurityNumber?: string
  emergencyContact: EmergencyContact
  benefits: EmployeeBenefit[]
  branchId: string
  supervisorId?: string
  status: 'active' | 'inactive' | 'terminated'
  documents: string[]
}

export interface EmployeeBenefit {
  type: 'health_insurance' | 'pension' | 'transport' | 'housing' | 'other'
  name: string
  amount: number
  isDeduction: boolean
  isPercentage: boolean
  isTaxable: boolean
}

export interface PayrollPeriod extends BaseEntity {
  name: string
  startDate: Date
  endDate: Date
  payDate: Date
  status: 'draft' | 'calculated' | 'approved' | 'paid' | 'closed'
  branchId: string
  processedBy?: string
  approvedBy?: string
  totalGrossPay: number
  totalDeductions: number
  totalNetPay: number
  employeeCount: number
}

export interface Payslip extends BaseEntity {
  employeeId: string
  payrollPeriodId: string
  basicSalary: number
  allowances: PayrollItem[]
  overtimeHours?: number
  overtimeRate?: number
  overtimeAmount?: number
  grossPay: number
  deductions: PayrollItem[]
  tax: number
  totalDeductions: number
  netPay: number
  status: 'draft' | 'approved' | 'paid'
  paidDate?: Date
  paymentReference?: string
}

export interface PayrollItem {
  type: string
  name: string
  amount: number
  isTaxable: boolean
}

// ========================================
// REPORTING & ANALYTICS
// ========================================

export interface Report extends BaseEntity {
  name: string
  description: string
  category: ReportCategory
  type: 'standard' | 'custom'
  frequency: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'yearly' | 'on_demand'
  parameters: ReportParameter[]
  query?: string
  template: string
  outputFormat: 'pdf' | 'excel' | 'csv' | 'html'
  branchIds: string[]
  userIds: string[] // Users who can access this report
  isPublic: boolean
  status: 'active' | 'inactive'
}

export type ReportCategory = 
  | 'financial' 
  | 'loans' 
  | 'savings' 
  | 'customers' 
  | 'crm' 
  | 'operations' 
  | 'compliance'

export interface ReportParameter {
  name: string
  type: 'string' | 'number' | 'date' | 'boolean' | 'select'
  required: boolean
  defaultValue?: any
  options?: string[] // For select type
}

export interface ReportExecution extends BaseEntity {
  reportId: string
  executedBy: string
  parameters: Record<string, any>
  status: 'running' | 'completed' | 'failed'
  startTime: Date
  endTime?: Date
  filePath?: string
  fileSize?: number
  errorMessage?: string
  branchId: string
}

// ========================================
// SYSTEM CONFIGURATION
// ========================================

export interface SystemSetting extends BaseEntity {
  module: string
  key: string
  value: any
  dataType: 'string' | 'number' | 'boolean' | 'json' | 'array'
  description: string
  isEncrypted: boolean
  branchId?: string // Null for global settings
}

export interface Currency {
  code: string // ISO 4217
  name: string
  symbol: string
  decimalPlaces: number
  exchangeRate?: number
  isBaseCurrency: boolean
  isActive: boolean
}

export interface Tax extends BaseEntity {
  name: string
  type: 'percentage' | 'fixed'
  rate: number
  applicableOn: 'income' | 'transaction' | 'service'
  minAmount?: number
  maxAmount?: number
  branchIds: string[]
  status: 'active' | 'inactive'
}

// ========================================
// COMMUNICATION & MESSAGING
// ========================================

export interface MessageTemplate extends BaseEntity {
  name: string
  type: 'email' | 'sms' | 'push'
  subject?: string // For emails
  body: string
  variables: string[] // Template variables like {customer_name}
  category: 'loan' | 'savings' | 'payment' | 'marketing' | 'system'
  trigger?: string // Event that triggers this template
  branchIds: string[]
  status: 'active' | 'inactive'
}

export interface Message extends BaseEntity {
  templateId?: string
  type: 'email' | 'sms' | 'push' | 'in_app'
  recipientId: string
  recipientType: 'borrower' | 'investor' | 'employee' | 'user'
  recipientEmail?: string
  recipientPhone?: string
  subject?: string
  body: string
  status: 'pending' | 'sent' | 'delivered' | 'failed' | 'opened' | 'clicked'
  sentAt?: Date
  deliveredAt?: Date
  openedAt?: Date
  clickedAt?: Date
  failureReason?: string
  branchId: string
  sentBy: string
}

// ========================================
// API RESPONSE WRAPPERS
// ========================================

export interface APIResponse<T> {
  success: boolean
  data?: T
  error?: APIError
  pagination?: PaginationInfo
  timestamp: Date
}

export interface APIError {
  code: string
  message: string
  details?: any
  field?: string // For validation errors
}

export interface PaginationInfo {
  page: number
  limit: number
  total: number
  pages: number
  hasNext: boolean
  hasPrev: boolean
}

export interface FilterOptions {
  search?: string
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
  filters?: Record<string, any>
  page?: number
  limit?: number
  includeInactive?: boolean
  branchId?: string
  dateFrom?: Date
  dateTo?: Date
}

// ========================================
// DASHBOARD & METRICS
// ========================================

export interface DashboardWidget {
  id: string
  type: 'metric' | 'chart' | 'table' | 'list'
  title: string
  description?: string
  dataSource: string
  configuration: Record<string, any>
  position: { x: number; y: number; width: number; height: number }
  refreshInterval?: number // in seconds
  permissions: string[]
  branchIds: string[]
}

export interface KPI {
  name: string
  value: number
  target?: number
  previousValue?: number
  change?: number
  changePercentage?: number
  trend: 'up' | 'down' | 'stable'
  period: string
  category: string
  unit: string
}

// ========================================
// SEARCH & INDEXING
// ========================================

export interface SearchIndex {
  entityType: string
  entityId: string
  title: string
  description: string
  content: string
  tags: string[]
  category: string
  branchId: string
  createdAt: Date
  updatedAt: Date
}

export interface SearchResult<T> {
  entity: T
  score: number
  highlights?: Record<string, string[]>
}

// ========================================
// WORKFLOW & APPROVAL
// ========================================

export interface WorkflowDefinition extends BaseEntity {
  name: string
  description: string
  entityType: string // 'loan', 'expense', etc.
  stages: WorkflowStage[]
  conditions: WorkflowCondition[]
  branchIds: string[]
  status: 'active' | 'inactive'
}

export interface WorkflowStage {
  id: string
  name: string
  description: string
  order: number
  approvers: string[] // User IDs or role IDs
  requiredApprovals: number
  autoAdvance: boolean
  timeLimit?: number // in hours
  actions: WorkflowAction[]
}

export interface WorkflowCondition {
  field: string
  operator: 'eq' | 'ne' | 'gt' | 'gte' | 'lt' | 'lte' | 'in' | 'contains'
  value: any
  stageId?: string // Skip to this stage if condition is met
}

export interface WorkflowAction {
  type: 'email' | 'sms' | 'system_notification' | 'field_update'
  configuration: Record<string, any>
  trigger: 'on_enter' | 'on_approve' | 'on_reject' | 'on_timeout'
}

export interface WorkflowInstance extends BaseEntity {
  definitionId: string
  entityType: string
  entityId: string
  currentStageId: string
  status: 'active' | 'completed' | 'cancelled' | 'timeout'
  approvals: WorkflowApproval[]
  startedAt: Date
  completedAt?: Date
  metadata: Record<string, any>
}

export interface WorkflowApproval {
  stageId: string
  approverId: string
  action: 'approved' | 'rejected' | 'pending'
  comments?: string
  timestamp?: Date
  timeSpent?: number
}

// ========================================
// EXPORT TYPES FOR MODULES
// ========================================

// Re-export commonly used types for easier imports
// export * from './enums' // Uncomment when enums file is created