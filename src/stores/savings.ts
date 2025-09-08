import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { SavingsAccount, SavingsTransaction, SavingsProduct } from '@/types/datastore'

export const useSavingsStore = defineStore('savings', () => {
  const accounts = ref<SavingsAccount[]>([])
  const transactions = ref<SavingsTransaction[]>([])
  const products = ref<SavingsProduct[]>([])
  const isLoading = ref(false)

  // Computed statistics
  const accountStats = computed(() => ({
    total: accounts.value.length,
    active: accounts.value.filter(a => a.status === 'active').length,
    dormant: accounts.value.filter(a => a.status === 'dormant').length,
    closed: accounts.value.filter(a => a.status === 'closed').length,
    totalBalance: accounts.value.reduce((sum, a) => sum + a.balance, 0)
  }))

  const transactionStats = computed(() => ({
    total: transactions.value.length,
    deposits: transactions.value.filter(t => t.type === 'deposit').length,
    withdrawals: transactions.value.filter(t => t.type === 'withdrawal').length,
    totalDeposits: transactions.value
      .filter(t => t.type === 'deposit')
      .reduce((sum, t) => sum + t.amount, 0),
    totalWithdrawals: transactions.value
      .filter(t => t.type === 'withdrawal')
      .reduce((sum, t) => sum + t.amount, 0)
  }))

  // Product methods
  const fetchProducts = async () => {
    isLoading.value = true
    try {
      const mockProducts: SavingsProduct[] = [
        {
          id: 'savings-1',
          name: 'Regular Savings',
          type: 'regular',
          description: 'Standard savings account with competitive interest rates',
          interestRate: 5.5,
          minimumBalance: 50000,
          minimumDeposit: 10000,
          maximumBalance: 10000000,
          fees: {
            monthlyMaintenance: 2000,
            withdrawalFee: 1000,
            belowMinimumFee: 5000
          },
          features: ['ATM access', 'Online banking', 'Mobile banking'],
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date(),
          createdBy: 'admin'
        },
        {
          id: 'savings-2',
          name: 'Fixed Deposit',
          type: 'fixed_deposit',
          description: 'Fixed term deposit with higher interest rates',
          interestRate: 8.5,
          minimumBalance: 100000,
          minimumDeposit: 100000,
          maximumBalance: 50000000,
          term: 12,
          termUnit: 'months',
          fees: {
            earlyWithdrawalPenalty: 0.02
          },
          features: ['High interest rate', 'Fixed term'],
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date(),
          createdBy: 'admin'
        }
      ]
      products.value = mockProducts
    } finally {
      isLoading.value = false
    }
  }

  // Account methods
  const fetchAccounts = async () => {
    isLoading.value = true
    try {
      const mockAccounts: SavingsAccount[] = [
        {
          id: '1',
          accountNumber: 'SAV-001-2024',
          customerId: '1',
          productId: 'savings-1',
          balance: 750000,
          availableBalance: 750000,
          interestRate: 5.5,
          status: 'active',
          openDate: new Date('2024-01-15'),
          lastTransactionDate: new Date(),
          interestEarned: 15000,
          minimumBalance: 50000,
          assignedOfficer: 'staff-3',
          maturityDate: null,
          autoRenewal: false,
          statements: [],
          createdAt: new Date('2024-01-15'),
          updatedAt: new Date(),
          createdBy: 'staff-3'
        }
      ]
      accounts.value = mockAccounts
    } finally {
      isLoading.value = false
    }
  }

  const createAccount = async (accountData: Omit<SavingsAccount, 'id' | 'accountNumber' | 'createdAt' | 'updatedAt' | 'createdBy'>) => {
    isLoading.value = true
    try {
      const accountNumber = `SAV-${String(accounts.value.length + 1).padStart(3, '0')}-${new Date().getFullYear()}`
      const newAccount: SavingsAccount = {
        ...accountData,
        id: Date.now().toString(),
        accountNumber,
        createdAt: new Date(),
        updatedAt: new Date(),
        createdBy: 'current-user'
      }
      accounts.value.push(newAccount)
      return { success: true, data: newAccount }
    } catch (error) {
      return { success: false, error: 'Failed to create account' }
    } finally {
      isLoading.value = false
    }
  }

  // Transaction methods
  const fetchTransactions = async (accountId?: string) => {
    isLoading.value = true
    try {
      const mockTransactions: SavingsTransaction[] = [
        {
          id: '1',
          accountId: '1',
          type: 'deposit',
          amount: 200000,
          balance: 750000,
          description: 'Cash deposit',
          channel: 'branch',
          processedBy: 'staff-3',
          processedAt: new Date(),
          status: 'completed',
          reference: 'DEP-2024-001',
          fees: 0,
          createdAt: new Date(),
          updatedAt: new Date(),
          createdBy: 'staff-3'
        },
        {
          id: '2',
          accountId: '1',
          type: 'withdrawal',
          amount: 50000,
          balance: 700000,
          description: 'ATM withdrawal',
          channel: 'atm',
          processedAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
          status: 'completed',
          reference: 'WTH-2024-001',
          fees: 1000,
          createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
          updatedAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
          createdBy: 'system'
        }
      ]
      
      if (accountId) {
        transactions.value = mockTransactions.filter(t => t.accountId === accountId)
      } else {
        transactions.value = mockTransactions
      }
    } finally {
      isLoading.value = false
    }
  }

  const createTransaction = async (transactionData: Omit<SavingsTransaction, 'id' | 'createdAt' | 'updatedAt' | 'createdBy'>) => {
    isLoading.value = true
    try {
      // Find the account and validate transaction
      const account = accounts.value.find(a => a.id === transactionData.accountId)
      if (!account) {
        return { success: false, error: 'Account not found' }
      }

      // Validate withdrawal amount
      if (transactionData.type === 'withdrawal' && transactionData.amount > account.availableBalance) {
        return { success: false, error: 'Insufficient funds' }
      }

      // Calculate new balance
      let newBalance = account.balance
      if (transactionData.type === 'deposit') {
        newBalance += transactionData.amount
      } else {
        newBalance -= (transactionData.amount + (transactionData.fees || 0))
      }

      const newTransaction: SavingsTransaction = {
        ...transactionData,
        id: Date.now().toString(),
        balance: newBalance,
        status: 'completed',
        processedAt: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
        createdBy: 'current-user'
      }

      // Update account balance
      account.balance = newBalance
      account.availableBalance = newBalance
      account.lastTransactionDate = new Date()
      account.updatedAt = new Date()

      transactions.value.push(newTransaction)
      return { success: true, data: newTransaction }
    } catch (error) {
      return { success: false, error: 'Failed to process transaction' }
    } finally {
      isLoading.value = false
    }
  }

  const getAccountTransactions = (accountId: string) => {
    return transactions.value.filter(t => t.accountId === accountId)
  }

  const getCustomerAccounts = (customerId: string) => {
    return accounts.value.filter(a => a.customerId === customerId)
  }

  const calculateInterest = async (accountId: string) => {
    const account = accounts.value.find(a => a.id === accountId)
    if (!account) return { success: false, error: 'Account not found' }

    // Simple interest calculation (monthly)
    const monthlyRate = account.interestRate / 100 / 12
    const interest = account.balance * monthlyRate

    // Create interest transaction
    const interestTransaction: Omit<SavingsTransaction, 'id' | 'createdAt' | 'updatedAt' | 'createdBy'> = {
      accountId,
      type: 'interest',
      amount: interest,
      balance: account.balance + interest,
      description: 'Monthly interest credit',
      channel: 'system',
      processedAt: new Date(),
      status: 'completed',
      reference: `INT-${Date.now()}`,
      fees: 0
    }

    return await createTransaction(interestTransaction)
  }

  // Initialize data
  const initializeSavings = async () => {
    await Promise.all([
      fetchProducts(),
      fetchAccounts(),
      fetchTransactions()
    ])
  }

  return {
    // State
    accounts,
    transactions,
    products,
    isLoading,
    
    // Computed
    accountStats,
    transactionStats,
    
    // Methods
    fetchProducts,
    fetchAccounts,
    createAccount,
    fetchTransactions,
    createTransaction,
    getAccountTransactions,
    getCustomerAccounts,
    calculateInterest,
    initializeSavings
  }
})