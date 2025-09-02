import type { Customer, Loan, Repayment, User } from '@/types';

export const demoUsers: User[] = [
  {
    id: '1',
    email: 'admin@loanmanager.com',
    firstName: 'Admin',
    lastName: 'User',
    role: 'admin',
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: '2',
    email: 'officer@loanmanager.com',
    firstName: 'Loan',
    lastName: 'Officer',
    role: 'loan_officer',
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  }
];

export const demoCustomers: Customer[] = [
  {
    id: '1',
    customerId: 'CUST001',
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@email.com',
    phone: '+1-555-0123',
    dateOfBirth: '1985-03-15',
    address: {
      street: '123 Main St',
      city: 'New York',
      state: 'NY',
      zipCode: '10001',
      country: 'US'
    },
    kycStatus: 'verified',
    kycDocuments: [],
    creditScore: 750,
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: '2',
    customerId: 'CUST002',
    firstName: 'Jane',
    lastName: 'Smith',
    email: 'jane.smith@email.com',
    phone: '+1-555-0124',
    dateOfBirth: '1990-07-22',
    address: {
      street: '456 Oak Ave',
      city: 'Los Angeles',
      state: 'CA',
      zipCode: '90210',
      country: 'US'
    },
    kycStatus: 'pending',
    kycDocuments: [],
    creditScore: 680,
    isActive: true,
    createdAt: '2024-01-02T00:00:00Z',
    updatedAt: '2024-01-02T00:00:00Z'
  },
  {
    id: '3',
    customerId: 'CUST003',
    firstName: 'Mike',
    lastName: 'Johnson',
    email: 'mike.johnson@email.com',
    phone: '+1-555-0125',
    dateOfBirth: '1988-11-08',
    address: {
      street: '789 Pine Rd',
      city: 'Chicago',
      state: 'IL',
      zipCode: '60601',
      country: 'US'
    },
    kycStatus: 'verified',
    kycDocuments: [],
    creditScore: 820,
    isActive: true,
    createdAt: '2024-01-03T00:00:00Z',
    updatedAt: '2024-01-03T00:00:00Z'
  }
];

export const demoLoans: Loan[] = [
  {
    id: '1',
    loanNumber: 'LOAN001',
    customerId: '1',
    customer: demoCustomers[0],
    loanType: 'personal',
    amount: 15000,
    interestRate: 8.5,
    term: 36,
    monthlyPayment: 475.50,
    totalAmount: 17118.00,
    status: 'active',
    purpose: 'Home renovation',
    collateral: [],
    guarantors: [],
    documents: [],
    schedule: [],
    disbursedAt: '2024-01-15T00:00:00Z',
    createdAt: '2024-01-10T00:00:00Z',
    updatedAt: '2024-01-15T00:00:00Z'
  },
  {
    id: '2',
    loanNumber: 'LOAN002',
    customerId: '2',
    customer: demoCustomers[1],
    loanType: 'business',
    amount: 50000,
    interestRate: 7.2,
    term: 60,
    monthlyPayment: 995.00,
    totalAmount: 59700.00,
    status: 'pending',
    purpose: 'Business expansion',
    collateral: [],
    guarantors: [],
    documents: [],
    schedule: [],
    createdAt: '2024-01-20T00:00:00Z',
    updatedAt: '2024-01-20T00:00:00Z'
  },
  {
    id: '3',
    loanNumber: 'LOAN003',
    customerId: '3',
    customer: demoCustomers[2],
    loanType: 'vehicle',
    amount: 25000,
    interestRate: 6.8,
    term: 48,
    monthlyPayment: 595.00,
    totalAmount: 28560.00,
    status: 'approved',
    purpose: 'Car purchase',
    collateral: [],
    guarantors: [],
    documents: [],
    schedule: [],
    createdAt: '2024-01-25T00:00:00Z',
    updatedAt: '2024-01-25T00:00:00Z'
  }
];

export const demoRepayments: Repayment[] = [
  {
    id: '1',
    loanId: '1',
    loan: demoLoans[0],
    installmentId: 'installment-1',
    installment: {
      id: 'installment-1',
      installmentNumber: 1,
      dueDate: '2024-02-15',
      principal: 400.00,
      interest: 75.50,
      total: 475.50,
      balance: 14600.00,
      status: 'paid',
      paidAt: '2024-02-15'
    },
    amount: 475.50,
    principal: 400.00,
    interest: 75.50,
    lateFees: 0,
    paymentMethod: 'bank_transfer',
    referenceNumber: 'PAY001',
    status: 'completed',
    paidAt: '2024-02-15T00:00:00Z',
    createdAt: '2024-02-15T00:00:00Z',
    updatedAt: '2024-02-15T00:00:00Z'
  }
];

export const demoStats = {
  totalCustomers: demoCustomers.length,
  totalLoans: demoLoans.length,
  activeLoans: demoLoans.filter(l => l.status === 'active').length,
  overdueLoans: demoLoans.filter(l => l.status === 'overdue').length,
  totalDisbursed: demoLoans.filter(l => l.status === 'active').reduce((sum, l) => sum + l.amount, 0),
  totalCollected: demoRepayments.reduce((sum, r) => sum + r.amount, 0),
  monthlyDisbursements: 15000,
  monthlyCollections: 475.50
};
