import type {
  User,
  CRMContact as Contact,
  CRMLead as Lead,
  CRMActivity as Activity,
  CRMTask as Task,
  Borrower,
  Loan,
  SavingsAccount,
  Branch,
  Asset as AssetItem,
  Expense as ExpenseRecord,
  PayrollRecord
} from '@/types/datastore'

// Mock data for development and testing
export class MockDataService {
  // Branch data
  static getBranches(): Branch[] {
    return [
      {
        id: 'branch-1',
        name: 'Main Branch',
        code: 'MB001',
        address: {
          street: '123 Finance Street',
          city: 'Dar es Salaam',
          state: 'Dar es Salaam',
          country: 'Tanzania',
          postalCode: '11000'
        },
        phone: '+255222123456',
        email: 'main@microfinance.co.tz',
        managerId: 'manager-1',
        isActive: true,
        openingHours: {
          monday: { open: '08:00', close: '17:00' },
          tuesday: { open: '08:00', close: '17:00' },
          wednesday: { open: '08:00', close: '17:00' },
          thursday: { open: '08:00', close: '17:00' },
          friday: { open: '08:00', close: '17:00' },
          saturday: { open: '08:00', close: '12:00' }
        },
        createdAt: new Date('2020-01-15'),
        updatedAt: new Date(),
        createdBy: 'admin'
      },
      {
        id: 'branch-2',
        name: 'Arusha Branch',
        code: 'AR001',
        address: {
          street: '456 Market Road',
          city: 'Arusha',
          state: 'Arusha',
          country: 'Tanzania',
          postalCode: '23000'
        },
        phone: '+255272345678',
        email: 'arusha@microfinance.co.tz',
        managerId: 'manager-2',
        isActive: true,
        openingHours: {
          monday: { open: '08:00', close: '17:00' },
          tuesday: { open: '08:00', close: '17:00' },
          wednesday: { open: '08:00', close: '17:00' },
          thursday: { open: '08:00', close: '17:00' },
          friday: { open: '08:00', close: '17:00' },
          saturday: { open: '08:00', close: '12:00' }
        },
        createdAt: new Date('2021-03-20'),
        updatedAt: new Date(),
        createdBy: 'admin'
      }
    ]
  }

  // User data
  static getUsers(): User[] {
    return [
      {
        id: 'admin-1',
        email: 'admin@microfinance.co.tz',
        username: 'admin',
        firstName: 'System',
        lastName: 'Administrator',
        phone: '+255700123456',
        isActive: true,
        lastLogin: new Date(),
        branchId: 'branch-1',
        role: {
          id: 'admin-role',
          name: 'System Administrator',
          description: 'Full system access',
          permissions: [
            { resource: 'users', action: 'manage' },
            { resource: 'branches', action: 'manage' },
            { resource: 'loans', action: 'manage' },
            { resource: 'borrowers', action: 'manage' },
            { resource: 'savings', action: 'manage' },
            { resource: 'crm', action: 'manage' },
            { resource: 'accounting', action: 'manage' },
            { resource: 'reports', action: 'read' }
          ],
          isActive: true,
          createdAt: new Date('2020-01-15'),
          updatedAt: new Date(),
          createdBy: 'system'
        },
        preferences: {
          language: 'en',
          timezone: 'Africa/Dar_es_Salaam',
          currency: 'TZS',
          notifications: {
            email: true,
            sms: true,
            push: true
          }
        },
        createdAt: new Date('2020-01-15'),
        updatedAt: new Date(),
        createdBy: 'system'
      },
      {
        id: 'manager-1',
        email: 'manager@microfinance.co.tz',
        username: 'branch_manager',
        firstName: 'John',
        lastName: 'Manager',
        phone: '+255700234567',
        isActive: true,
        lastLogin: new Date(),
        branchId: 'branch-1',
        role: {
          id: 'manager-role',
          name: 'Branch Manager',
          description: 'Branch management access',
          permissions: [
            { resource: 'loans', actions: ['read', 'write'] },
            { resource: 'borrowers', actions: ['read', 'write'] },
            { resource: 'savings', actions: ['read', 'write'] },
            { resource: 'crm', actions: ['read', 'write'] },
            { resource: 'reports', actions: ['read'] }
          ],
          isActive: true,
          createdAt: new Date('2020-01-15'),
          updatedAt: new Date(),
          createdBy: 'admin-1'
        },
        preferences: {
          theme: 'light',
          language: 'en',
          timezone: 'Africa/Dar_es_Salaam',
          currency: 'TZS',
          notifications: {
            email: true,
            sms: true,
            push: false
          }
        },
        createdAt: new Date('2020-02-01'),
        updatedAt: new Date(),
        createdBy: 'admin-1'
      }
    ]
  }

  // CRM data
  static getContacts(): Contact[] {
    return [
      {
        id: 'contact-1',
        type: 'customer',
        firstName: 'Mary',
        lastName: 'Johnson',
        email: 'mary.johnson@email.com',
        phone: '+255700123456',
        company: 'Johnson Enterprises',
        jobTitle: 'CEO',
        status: 'active',
        assignedTo: 'manager-1',
        tags: ['vip', 'business-owner'],
        address: {
          street: '789 Business Ave',
          city: 'Dar es Salaam',
          region: 'Dar es Salaam',
          country: 'Tanzania',
          postalCode: '11000'
        },
        socialMedia: {
          linkedin: 'mary-johnson-ceo',
          twitter: '@maryjohnson'
        },
        createdAt: new Date('2024-01-10'),
        updatedAt: new Date(),
        createdBy: 'manager-1'
      },
      {
        id: 'contact-2',
        type: 'prospect',
        firstName: 'David',
        lastName: 'Wilson',
        email: 'david.wilson@email.com',
        phone: '+255700234567',
        company: 'Wilson Trading',
        jobTitle: 'Owner',
        status: 'active',
        assignedTo: 'manager-1',
        tags: ['new-business', 'retail'],
        address: {
          street: '321 Trade Street',
          city: 'Arusha',
          region: 'Arusha',
          country: 'Tanzania',
          postalCode: '23000'
        },
        createdAt: new Date('2024-02-15'),
        updatedAt: new Date(),
        createdBy: 'manager-1'
      }
    ]
  }

  static getLeads(): Lead[] {
    return [
      {
        id: 'lead-1',
        contactId: 'contact-1',
        title: 'Business Expansion Loan - Johnson Enterprises',
        description: 'Mary Johnson needs funding for business expansion',
        stage: 'proposal',
        status: 'active',
        source: 'referral',
        estimatedValue: 5000000,
        probability: 85,
        expectedCloseDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
        assignedTo: 'manager-1',
        tags: ['business-loan', 'high-value', 'expansion'],
        notes: 'Strong financials, existing customer relationship',
        createdAt: new Date('2024-01-20'),
        updatedAt: new Date(),
        createdBy: 'manager-1'
      },
      {
        id: 'lead-2',
        contactId: 'contact-2',
        title: 'Working Capital Loan - Wilson Trading',
        description: 'David Wilson requires working capital for inventory',
        stage: 'qualified',
        status: 'active',
        source: 'website',
        estimatedValue: 2500000,
        probability: 60,
        expectedCloseDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        assignedTo: 'manager-1',
        tags: ['working-capital', 'trading', 'inventory'],
        notes: 'New prospect, needs document verification',
        createdAt: new Date('2024-02-20'),
        updatedAt: new Date(),
        createdBy: 'manager-1'
      }
    ]
  }

  // Borrower and Loan data
  static getBorrowers(): Borrower[] {
    return [
      {
        id: 'borrower-1',
        firstName: 'Grace',
        lastName: 'Mwangi',
        dateOfBirth: new Date('1982-08-22'),
        gender: 'female',
        idNumber: 'TZ123456789',
        phone: '+255700345678',
        email: 'grace.mwangi@email.com',
        address: {
          street: '123 Uhuru Street',
          city: 'Dar es Salaam',
          region: 'Dar es Salaam',
          country: 'Tanzania',
          postalCode: '11000'
        },
        employmentStatus: 'self_employed',
        monthlyIncome: 1200000,
        creditScore: 720,
        status: 'active',
        kycStatus: 'verified',
        assignedOfficer: 'manager-1',
        guarantors: [
          {
            name: 'Peter Mwangi',
            relationship: 'spouse',
            phone: '+255700456789',
            idNumber: 'TZ987654321',
            address: '123 Uhuru Street, Dar es Salaam'
          }
        ],
        documents: [
          {
            type: 'national_id',
            url: '/documents/grace_id.pdf',
            uploadedAt: new Date('2024-01-05'),
            verified: true
          },
          {
            type: 'income_statement',
            url: '/documents/grace_income.pdf',
            uploadedAt: new Date('2024-01-05'),
            verified: true
          }
        ],
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date(),
        createdBy: 'manager-1'
      }
    ]
  }

  static getLoans(): Loan[] {
    return [
      {
        id: 'loan-1',
        borrowerId: 'borrower-1',
        applicationId: 'app-1',
        loanNumber: 'LN-2024-0001',
        amount: 3000000,
        interestRate: 18.5,
        term: 18,
        termUnit: 'months',
        purpose: 'business',
        productId: 'business-loan-1',
        status: 'active',
        disbursementDate: new Date('2024-02-01'),
        maturityDate: new Date('2025-08-01'),
        outstandingBalance: 2400000,
        nextPaymentDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        nextPaymentAmount: 195000,
        totalPaid: 600000,
        paymentFrequency: 'monthly',
        collateral: [
          {
            type: 'property',
            description: 'Commercial property in Dar es Salaam',
            estimatedValue: 5000000,
            documents: []
          }
        ],
        approvedBy: 'manager-1',
        approvedAt: new Date('2024-01-25'),
        disbursedBy: 'manager-1',
        createdAt: new Date('2024-01-15'),
        updatedAt: new Date(),
        createdBy: 'manager-1'
      }
    ]
  }

  // Savings data
  static getSavingsAccounts(): SavingsAccount[] {
    return [
      {
        id: 'savings-1',
        accountNumber: 'SAV-2024-0001',
        customerId: 'borrower-1',
        productId: 'regular-savings',
        balance: 850000,
        availableBalance: 850000,
        interestRate: 6.5,
        status: 'active',
        openDate: new Date('2024-01-15'),
        lastTransactionDate: new Date(),
        interestEarned: 25000,
        minimumBalance: 50000,
        assignedOfficer: 'manager-1',
        maturityDate: null,
        autoRenewal: false,
        statements: [],
        createdAt: new Date('2024-01-15'),
        updatedAt: new Date(),
        createdBy: 'manager-1'
      }
    ]
  }

  // Asset data
  static getAssets(): AssetItem[] {
    return [
      {
        id: 'asset-1',
        name: 'Office Computer - Dell OptiPlex',
        category: 'IT Equipment',
        serialNumber: 'DEL123456',
        purchaseDate: new Date('2023-06-15'),
        purchaseValue: 1200000,
        currentValue: 900000,
        depreciationRate: 20,
        condition: 'good',
        location: 'Main Office',
        assignedTo: 'manager-1',
        warrantyExpiry: new Date('2026-06-15'),
        status: 'active',
        insuranceDetails: {
          provider: 'ABC Insurance',
          policyNumber: 'POL123456',
          coverage: 1200000,
          expiryDate: new Date('2024-12-31')
        },
        documents: [],
        createdAt: new Date('2023-06-15'),
        updatedAt: new Date(),
        createdBy: 'admin-1'
      }
    ]
  }

  // Expense data
  static getExpenses(): ExpenseRecord[] {
    return [
      {
        id: 'exp-1',
        category: 'office_supplies',
        subcategory: 'Stationery',
        amount: 150000,
        description: 'Office supplies for March 2024',
        date: new Date('2024-03-15'),
        vendor: 'Office Supplies Ltd',
        paymentMethod: 'bank_transfer',
        status: 'approved',
        approvedBy: 'manager-1',
        approvedAt: new Date('2024-03-16'),
        accountId: 'acc-5002',
        receipts: [],
        tags: ['monthly', 'recurring'],
        branchId: 'branch-1',
        requestedBy: 'manager-1',
        createdAt: new Date('2024-03-15'),
        updatedAt: new Date(),
        createdBy: 'manager-1'
      }
    ]
  }

  // Payroll data  
  static getPayrollRecords(): PayrollRecord[] {
    return [
      {
        id: 'pay-1',
        employeeId: 'manager-1',
        payPeriod: {
          start: new Date('2024-03-01'),
          end: new Date('2024-03-31'),
          payDate: new Date('2024-04-05')
        },
        basicSalary: 800000,
        allowances: {
          housing: 200000,
          transport: 100000,
          medical: 50000
        },
        deductions: {
          tax: 175000,
          pension: 80000,
          insurance: 25000
        },
        grossPay: 1150000,
        netPay: 870000,
        status: 'paid',
        processedBy: 'admin-1',
        processedAt: new Date('2024-04-05'),
        paymentReference: 'PAY-2024-0001',
        createdAt: new Date('2024-04-01'),
        updatedAt: new Date(),
        createdBy: 'admin-1'
      }
    ]
  }

  // Generate sample data for testing
  static generateSampleBorrowers(count: number): Borrower[] {
    const sampleData: Borrower[] = []
    const firstNames = ['Grace', 'John', 'Mary', 'Peter', 'Sarah', 'David', 'Jane', 'Michael', 'Lisa', 'Paul']
    const lastNames = ['Mwangi', 'Doe', 'Smith', 'Johnson', 'Wilson', 'Brown', 'Davis', 'Miller', 'Moore', 'Taylor']
    
    for (let i = 0; i < count; i++) {
      const firstName = firstNames[Math.floor(Math.random() * firstNames.length)]
      const lastName = lastNames[Math.floor(Math.random() * lastNames.length)]
      
      sampleData.push({
        id: `borrower-${i + 2}`,
        firstName,
        lastName,
        dateOfBirth: new Date(1970 + Math.floor(Math.random() * 40), Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1),
        gender: Math.random() > 0.5 ? 'male' : 'female',
        idNumber: `TZ${Math.random().toString().substr(2, 9)}`,
        phone: `+25570${Math.random().toString().substr(2, 7)}`,
        email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@email.com`,
        address: {
          street: `${Math.floor(Math.random() * 999) + 1} Sample Street`,
          city: Math.random() > 0.5 ? 'Dar es Salaam' : 'Arusha',
          region: Math.random() > 0.5 ? 'Dar es Salaam' : 'Arusha',
          country: 'Tanzania',
          postalCode: Math.random() > 0.5 ? '11000' : '23000'
        },
        employmentStatus: ['employed', 'self_employed', 'unemployed'][Math.floor(Math.random() * 3)] as any,
        monthlyIncome: Math.floor(Math.random() * 2000000) + 300000,
        creditScore: Math.floor(Math.random() * 300) + 500,
        status: 'active',
        kycStatus: Math.random() > 0.2 ? 'verified' : 'pending',
        assignedOfficer: 'manager-1',
        guarantors: [],
        documents: [],
        createdAt: new Date(2024, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1),
        updatedAt: new Date(),
        createdBy: 'manager-1'
      })
    }
    
    return sampleData
  }

  // Get all mock data
  static getAllMockData() {
    return {
      branches: this.getBranches(),
      users: this.getUsers(),
      contacts: this.getContacts(),
      leads: this.getLeads(),
      borrowers: [...this.getBorrowers(), ...this.generateSampleBorrowers(20)],
      loans: this.getLoans(),
      savingsAccounts: this.getSavingsAccounts(),
      assets: this.getAssets(),
      expenses: this.getExpenses(),
      payrollRecords: this.getPayrollRecords()
    }
  }
}