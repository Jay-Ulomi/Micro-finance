export interface Loan {
  id: string;
  loanNumber: string;
  customerId: string;
  customer: Customer;
  loanType: LoanType;
  amount: number;
  interestRate: number;
  term: number; // in months
  monthlyPayment: number;
  totalAmount: number;
  status: LoanStatus;
  purpose: string;
  collateral: Collateral[];
  guarantors: Guarantor[];
  documents: LoanDocument[];
  schedule: LoanSchedule[];
  disbursedAt?: string;
  closedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export enum LoanType {
  PERSONAL = 'personal',
  BUSINESS = 'business',
  MORTGAGE = 'mortgage',
  VEHICLE = 'vehicle',
  EDUCATION = 'education'
}

export enum LoanStatus {
  PENDING = 'pending',
  UNDER_REVIEW = 'under_review',
  APPROVED = 'approved',
  DISBURSED = 'disbursed',
  ACTIVE = 'active',
  OVERDUE = 'overdue',
  DEFAULTED = 'defaulted',
  CLOSED = 'closed',
  REJECTED = 'rejected'
}

export interface Collateral {
  id: string;
  type: CollateralType;
  description: string;
  value: number;
  documents: string[];
}

export enum CollateralType {
  REAL_ESTATE = 'real_estate',
  VEHICLE = 'vehicle',
  EQUIPMENT = 'equipment',
  INVENTORY = 'inventory',
  SECURITIES = 'securities'
}

export interface Guarantor {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  relationship: string;
  income: number;
  documents: string[];
}

export interface LoanDocument {
  id: string;
  type: LoanDocumentType;
  fileName: string;
  fileUrl: string;
  uploadedAt: string;
}

export enum LoanDocumentType {
  APPLICATION_FORM = 'application_form',
  INCOME_PROOF = 'income_proof',
  BANK_STATEMENTS = 'bank_statements',
  TAX_RETURNS = 'tax_returns',
  BUSINESS_PLAN = 'business_plan',
  COLLATERAL_DOCS = 'collateral_docs'
}

export interface LoanSchedule {
  id: string;
  installmentNumber: number;
  dueDate: string;
  principal: number;
  interest: number;
  total: number;
  balance: number;
  status: InstallmentStatus;
  paidAt?: string;
}

export enum InstallmentStatus {
  PENDING = 'pending',
  PAID = 'paid',
  OVERDUE = 'overdue',
  PARTIAL = 'partial'
}

export interface CreateLoanData {
  customerId: string;
  loanType: LoanType;
  amount: number;
  interestRate: number;
  term: number;
  purpose: string;
  collateral: Collateral[];
  guarantors: Guarantor[];
}
