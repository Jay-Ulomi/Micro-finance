import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { 
  Account, 
  Transaction, 
  JournalEntry, 
  FinancialStatement, 
  Budget,
  AccountingPeriod
} from '@/types/datastore'

export const useAccountingStore = defineStore('accounting', () => {
  const accounts = ref<Account[]>([])
  const transactions = ref<Transaction[]>([])
  const journalEntries = ref<JournalEntry[]>([])
  const statements = ref<FinancialStatement[]>([])
  const budgets = ref<Budget[]>([])
  const periods = ref<AccountingPeriod[]>([])
  const isLoading = ref(false)

  // Computed statistics
  const accountStats = computed(() => {
    const assets = accounts.value.filter(a => a.type === 'asset')
    const liabilities = accounts.value.filter(a => a.type === 'liability')
    const equity = accounts.value.filter(a => a.type === 'equity')
    const revenue = accounts.value.filter(a => a.type === 'revenue')
    const expenses = accounts.value.filter(a => a.type === 'expense')

    return {
      totalAssets: assets.reduce((sum, a) => sum + a.balance, 0),
      totalLiabilities: liabilities.reduce((sum, a) => sum + a.balance, 0),
      totalEquity: equity.reduce((sum, a) => sum + a.balance, 0),
      totalRevenue: revenue.reduce((sum, a) => sum + a.balance, 0),
      totalExpenses: expenses.reduce((sum, a) => sum + a.balance, 0),
      accountCount: {
        assets: assets.length,
        liabilities: liabilities.length,
        equity: equity.length,
        revenue: revenue.length,
        expenses: expenses.length
      }
    }
  })

  const transactionStats = computed(() => ({
    total: transactions.value.length,
    thisMonth: transactions.value.filter(t => {
      const now = new Date()
      const transactionDate = new Date(t.date)
      return transactionDate.getMonth() === now.getMonth() && 
             transactionDate.getFullYear() === now.getFullYear()
    }).length,
    totalAmount: transactions.value.reduce((sum, t) => sum + t.amount, 0)
  }))

  // Account methods
  const fetchAccounts = async () => {
    isLoading.value = true
    try {
      const mockAccounts: Account[] = [
        {
          id: '1001',
          code: '1001',
          name: 'Cash at Bank',
          type: 'asset',
          subType: 'current_asset',
          balance: 5000000,
          parentAccountId: null,
          isActive: true,
          description: 'Main bank account for cash transactions',
          createdAt: new Date(),
          updatedAt: new Date(),
          createdBy: 'admin'
        },
        {
          id: '1002',
          code: '1002',
          name: 'Petty Cash',
          type: 'asset',
          subType: 'current_asset',
          balance: 100000,
          parentAccountId: '1001',
          isActive: true,
          description: 'Cash on hand for small expenses',
          createdAt: new Date(),
          updatedAt: new Date(),
          createdBy: 'admin'
        },
        {
          id: '2001',
          code: '2001',
          name: 'Accounts Payable',
          type: 'liability',
          subType: 'current_liability',
          balance: 750000,
          parentAccountId: null,
          isActive: true,
          description: 'Money owed to suppliers',
          createdAt: new Date(),
          updatedAt: new Date(),
          createdBy: 'admin'
        },
        {
          id: '4001',
          code: '4001',
          name: 'Interest Income',
          type: 'revenue',
          subType: 'operating_revenue',
          balance: 2500000,
          parentAccountId: null,
          isActive: true,
          description: 'Interest earned on loans',
          createdAt: new Date(),
          updatedAt: new Date(),
          createdBy: 'admin'
        },
        {
          id: '5001',
          code: '5001',
          name: 'Staff Salaries',
          type: 'expense',
          subType: 'operating_expense',
          balance: 1800000,
          parentAccountId: null,
          isActive: true,
          description: 'Employee salary expenses',
          createdAt: new Date(),
          updatedAt: new Date(),
          createdBy: 'admin'
        }
      ]
      accounts.value = mockAccounts
    } finally {
      isLoading.value = false
    }
  }

  // Transaction methods
  const fetchTransactions = async () => {
    isLoading.value = true
    try {
      const mockTransactions: Transaction[] = [
        {
          id: '1',
          accountId: '1001',
          amount: 500000,
          type: 'debit',
          description: 'Loan disbursement fee',
          reference: 'TXN-2024-001',
          date: new Date(),
          balance: 5000000,
          status: 'completed',
          category: 'loan_disbursement',
          reconciled: false,
          journalEntryId: 'je-1',
          attachments: [],
          createdAt: new Date(),
          updatedAt: new Date(),
          createdBy: 'staff-1'
        }
      ]
      transactions.value = mockTransactions
    } finally {
      isLoading.value = false
    }
  }

  // Journal entry methods
  const createJournalEntry = async (entryData: Omit<JournalEntry, 'id' | 'createdAt' | 'updatedAt' | 'createdBy'>) => {
    isLoading.value = true
    try {
      // Validate that debits equal credits
      const totalDebits = entryData.entries.filter(e => e.type === 'debit').reduce((sum, e) => sum + e.amount, 0)
      const totalCredits = entryData.entries.filter(e => e.type === 'credit').reduce((sum, e) => sum + e.amount, 0)
      
      if (totalDebits !== totalCredits) {
        return { success: false, error: 'Debits must equal credits' }
      }

      const newEntry: JournalEntry = {
        ...entryData,
        id: Date.now().toString(),
        entryNumber: `JE-${Date.now()}`,
        createdAt: new Date(),
        updatedAt: new Date(),
        createdBy: 'current-user'
      }

      // Update account balances
      for (const entry of newEntry.entries) {
        const account = accounts.value.find(a => a.id === entry.accountId)
        if (account) {
          if (entry.type === 'debit') {
            if (account.type === 'asset' || account.type === 'expense') {
              account.balance += entry.amount
            } else {
              account.balance -= entry.amount
            }
          } else {
            if (account.type === 'liability' || account.type === 'equity' || account.type === 'revenue') {
              account.balance += entry.amount
            } else {
              account.balance -= entry.amount
            }
          }
          account.updatedAt = new Date()
        }
      }

      journalEntries.value.push(newEntry)
      return { success: true, data: newEntry }
    } catch (error) {
      return { success: false, error: 'Failed to create journal entry' }
    } finally {
      isLoading.value = false
    }
  }

  // Budget methods
  const fetchBudgets = async () => {
    isLoading.value = true
    try {
      const mockBudgets: Budget[] = [
        {
          id: '1',
          name: '2024 Annual Budget',
          description: 'Operating budget for 2024',
          startDate: new Date('2024-01-01'),
          endDate: new Date('2024-12-31'),
          status: 'active',
          totalBudget: 50000000,
          totalSpent: 15000000,
          categories: [
            {
              name: 'Staff Costs',
              budgetAmount: 25000000,
              spentAmount: 8000000,
              accountIds: ['5001']
            },
            {
              name: 'Operating Expenses',
              budgetAmount: 15000000,
              spentAmount: 5000000,
              accountIds: ['5002', '5003']
            }
          ],
          approvedBy: 'board-1',
          approvedAt: new Date('2023-12-15'),
          createdAt: new Date('2023-12-01'),
          updatedAt: new Date(),
          createdBy: 'finance-manager'
        }
      ]
      budgets.value = mockBudgets
    } finally {
      isLoading.value = false
    }
  }

  // Financial statement methods
  const generateBalanceSheet = async (asOfDate: Date) => {
    isLoading.value = true
    try {
      const assets = accounts.value.filter(a => a.type === 'asset' && a.isActive)
      const liabilities = accounts.value.filter(a => a.type === 'liability' && a.isActive)
      const equity = accounts.value.filter(a => a.type === 'equity' && a.isActive)

      const balanceSheet: FinancialStatement = {
        id: Date.now().toString(),
        type: 'balance_sheet',
        period: 'as_of',
        startDate: asOfDate,
        endDate: asOfDate,
        generatedAt: new Date(),
        generatedBy: 'current-user',
        data: {
          assets: assets.map(a => ({
            accountId: a.id,
            accountName: a.name,
            amount: a.balance
          })),
          liabilities: liabilities.map(l => ({
            accountId: l.id,
            accountName: l.name,
            amount: l.balance
          })),
          equity: equity.map(e => ({
            accountId: e.id,
            accountName: e.name,
            amount: e.balance
          }))
        }
      }

      statements.value.push(balanceSheet)
      return { success: true, data: balanceSheet }
    } catch (error) {
      return { success: false, error: 'Failed to generate balance sheet' }
    } finally {
      isLoading.value = false
    }
  }

  const generateIncomeStatement = async (startDate: Date, endDate: Date) => {
    isLoading.value = true
    try {
      const revenue = accounts.value.filter(a => a.type === 'revenue' && a.isActive)
      const expenses = accounts.value.filter(a => a.type === 'expense' && a.isActive)

      const incomeStatement: FinancialStatement = {
        id: Date.now().toString(),
        type: 'income_statement',
        period: 'range',
        startDate,
        endDate,
        generatedAt: new Date(),
        generatedBy: 'current-user',
        data: {
          revenue: revenue.map(r => ({
            accountId: r.id,
            accountName: r.name,
            amount: r.balance
          })),
          expenses: expenses.map(e => ({
            accountId: e.id,
            accountName: e.name,
            amount: e.balance
          }))
        }
      }

      statements.value.push(incomeStatement)
      return { success: true, data: incomeStatement }
    } catch (error) {
      return { success: false, error: 'Failed to generate income statement' }
    } finally {
      isLoading.value = false
    }
  }

  const getAccountsByType = (type: Account['type']) => {
    return accounts.value.filter(a => a.type === type && a.isActive)
  }

  const getAccountTransactions = (accountId: string) => {
    return transactions.value.filter(t => t.accountId === accountId)
  }

  // Initialize data
  const initializeAccounting = async () => {
    await Promise.all([
      fetchAccounts(),
      fetchTransactions(),
      fetchBudgets()
    ])
  }

  return {
    // State
    accounts,
    transactions,
    journalEntries,
    statements,
    budgets,
    periods,
    isLoading,
    
    // Computed
    accountStats,
    transactionStats,
    
    // Methods
    fetchAccounts,
    fetchTransactions,
    createJournalEntry,
    fetchBudgets,
    generateBalanceSheet,
    generateIncomeStatement,
    getAccountsByType,
    getAccountTransactions,
    initializeAccounting
  }
})