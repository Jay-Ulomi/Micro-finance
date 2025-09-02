import borrowersData from "@/data/borrowers.json";
import loansData from "@/data/loans.json";
import repaymentsData from "@/data/repayments.json";
import loanOfficersData from "@/data/loan-officers.json";

// Types
export interface Borrower {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  mobile: string;
  uniqueNumber?: string;
  kycStatus: "pending" | "verified" | "rejected";
  creditScore?: number;
  loanOfficer?: string;
  createdAt: string;
  country: string;
  gender?: "male" | "female" | "other";
  title?: "Mr" | "Mrs" | "Ms" | "Dr" | "Prof";
  dateOfBirth?: string;
  address?: string;
  city?: string;
  province?: string;
  zipcode?: string;
  workingStatus?: "employed" | "self-employed" | "unemployed" | "student" | "retired";
  borrowerPhoto?: string;
  borrowerFiles?: string[];
  description?: string;
  updatedAt: string;
}

export interface Loan {
  id: string;
  borrowerId: string;
  borrowerName: string;
  loanType: "personal" | "business" | "agricultural" | "microfinance" | "emergency";
  loanCategory: "secured" | "unsecured";
  applicationDate: string;
  requestedAmount: number;
  approvedAmount?: number;
  interestRate: number;
  loanTerm: number;
  repaymentFrequency: "weekly" | "bi-weekly" | "monthly" | "quarterly";
  status:
    | "draft"
    | "submitted"
    | "under_review"
    | "approved"
    | "rejected"
    | "disbursed"
    | "active"
    | "completed"
    | "defaulted"
    | "written_off";
  purpose: string;
  collateral?: {
    type: string;
    description: string;
    value: number;
    documents: string[];
  };
  guarantors?: {
    id: string;
    name: string;
    relationship: string;
    contact: string;
  }[];
  loanOfficer: string;
  applicationDocuments: string[];
  disbursementDate?: string;
  firstPaymentDate?: string;
  maturityDate?: string;
  totalInterest: number;
  totalAmount: number;
  outstandingBalance: number;
  nextPaymentDate?: string;
  nextPaymentAmount?: number;
  paymentHistory: any[];
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Repayment {
  id: string;
  loanId: string;
  borrowerId: string;
  borrowerName: string;
  installmentNumber: number;
  dueDate: string;
  scheduledAmount: number;
  principalAmount: number;
  interestAmount: number;
  feesAmount?: number;
  paidAmount: number;
  paidDate?: string;
  paymentMethod?: "cash" | "bank_transfer" | "mobile_money" | "check" | "automatic";
  status: "pending" | "paid" | "partial" | "overdue" | "missed" | "waived";
  reference?: string;
  notes?: string;
  lateFee?: number;
  penaltyAmount?: number;
  balanceAfterPayment: number;
  createdAt: string;
  updatedAt: string;
}

export interface LoanOfficer {
  id: string;
  name: string;
  email: string;
  phone: string;
  department: string;
  position: string;
  status: "active" | "inactive";
  hireDate: string;
  totalLoans: number;
  activeLoans: number;
  totalDisbursed: number;
  collectionRate: number;
  specialization: string[];
  areas: string[];
}

export interface BorrowerStatistics {
  totalBorrowers: number;
  kycVerified: number;
  kycPending: number;
  kycRejected: number;
  activeLoans: number;
  totalLoanAmount: number;
  averageCreditScore: number;
}

export interface LoanStatistics {
  totalLoans: number;
  activeLoans: number;
  pendingApproval: number;
  disbursedThisMonth: number;
  totalDisbursed: number;
  totalOutstanding: number;
  overdueLoans: number;
  defaultRate: number;
  averageLoanAmount: number;
  averageInterestRate: number;
}

export interface RepaymentStatistics {
  totalRepayments: number;
  totalAmount: number;
  overdueRepayments: number;
  overdueAmount: number;
  paidThisMonth: number;
  paidThisMonthAmount: number;
  collectionRate: number;
  averagePaymentDelay: number;
}

// Data Service Class
class DataService {
  private borrowers: Borrower[] = [];
  private loans: Loan[] = [];
  private repayments: Repayment[] = [];
  private loanOfficers: LoanOfficer[] = [];

  constructor() {
    this.loadData();
  }

  private loadData() {
    this.borrowers = borrowersData.borrowers as Borrower[];
    this.loans = loansData.loans as Loan[];
    this.repayments = repaymentsData.repayments as Repayment[];
    this.loanOfficers = loanOfficersData.loanOfficers as LoanOfficer[];
  }

  // Borrowers
  getBorrowers(
    params: {
      page?: number;
      limit?: number;
      search?: string;
      kycStatus?: string;
      loanOfficer?: string;
      country?: string;
      workingStatus?: string;
      sortBy?: string;
      sortOrder?: "asc" | "desc";
    } = {},
  ): { borrowers: Borrower[]; total: number; page: number; limit: number } {
    let filteredBorrowers = [...this.borrowers];

    // Apply filters
    if (params.search) {
      const query = params.search.toLowerCase();
      filteredBorrowers = filteredBorrowers.filter(
        (borrower) =>
          borrower.firstName.toLowerCase().includes(query) ||
          borrower.lastName.toLowerCase().includes(query) ||
          borrower.email.toLowerCase().includes(query) ||
          borrower.uniqueNumber?.toLowerCase().includes(query) ||
          borrower.id.toLowerCase().includes(query),
      );
    }

    if (params.kycStatus) {
      filteredBorrowers = filteredBorrowers.filter(
        (borrower) => borrower.kycStatus === params.kycStatus,
      );
    }

    if (params.loanOfficer) {
      filteredBorrowers = filteredBorrowers.filter(
        (borrower) => borrower.loanOfficer === params.loanOfficer,
      );
    }

    if (params.country) {
      filteredBorrowers = filteredBorrowers.filter(
        (borrower) => borrower.country === params.country,
      );
    }

    if (params.workingStatus) {
      filteredBorrowers = filteredBorrowers.filter(
        (borrower) => borrower.workingStatus === params.workingStatus,
      );
    }

    // Apply sorting
    if (params.sortBy) {
      filteredBorrowers.sort((a, b) => {
        const aValue = (a as any)[params.sortBy!];
        const bValue = (b as any)[params.sortBy!];

        if (params.sortOrder === "desc") {
          return bValue > aValue ? 1 : -1;
        }
        return aValue > bValue ? 1 : -1;
      });
    }

    // Apply pagination
    const page = params.page || 1;
    const limit = params.limit || 10;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedBorrowers = filteredBorrowers.slice(startIndex, endIndex);

    return {
      borrowers: paginatedBorrowers,
      total: filteredBorrowers.length,
      page,
      limit,
    };
  }

  getBorrower(id: string): Borrower | undefined {
    return this.borrowers.find((borrower) => borrower.id === id);
  }

  getBorrowerStatistics(): BorrowerStatistics {
    const total = this.borrowers.length;
    const verified = this.borrowers.filter((b) => b.kycStatus === "verified").length;
    const pending = this.borrowers.filter((b) => b.kycStatus === "pending").length;
    const rejected = this.borrowers.filter((b) => b.kycStatus === "rejected").length;
    const activeLoans = this.borrowers.filter((b) => b.creditScore && b.creditScore > 600).length;
    const totalLoanAmount = this.loans.reduce((sum, loan) => sum + loan.approvedAmount || 0, 0);
    const averageCreditScore =
      this.borrowers.reduce((sum, b) => sum + (b.creditScore || 0), 0) / total;

    return {
      totalBorrowers: total,
      kycVerified: verified,
      kycPending: pending,
      kycRejected: rejected,
      activeLoans,
      totalLoanAmount,
      averageCreditScore: Math.round(averageCreditScore),
    };
  }

  // Loans
  getLoans(
    params: {
      page?: number;
      limit?: number;
      search?: string;
      status?: string;
      borrowerId?: string;
      loanType?: string;
      loanOfficer?: string;
      dateFrom?: string;
      dateTo?: string;
      sortBy?: string;
      sortOrder?: "asc" | "desc";
    } = {},
  ): { loans: Loan[]; total: number; page: number; limit: number } {
    let filteredLoans = [...this.loans];

    // Apply filters
    if (params.search) {
      const query = params.search.toLowerCase();
      filteredLoans = filteredLoans.filter(
        (loan) =>
          loan.borrowerName.toLowerCase().includes(query) ||
          loan.id.toLowerCase().includes(query) ||
          loan.purpose.toLowerCase().includes(query),
      );
    }

    if (params.status) {
      filteredLoans = filteredLoans.filter((loan) => loan.status === params.status);
    }

    if (params.borrowerId) {
      filteredLoans = filteredLoans.filter((loan) => loan.borrowerId === params.borrowerId);
    }

    if (params.loanType) {
      filteredLoans = filteredLoans.filter((loan) => loan.loanType === params.loanType);
    }

    if (params.loanOfficer) {
      filteredLoans = filteredLoans.filter((loan) => loan.loanOfficer === params.loanOfficer);
    }

    // Apply pagination
    const page = params.page || 1;
    const limit = params.limit || 10;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedLoans = filteredLoans.slice(startIndex, endIndex);

    return {
      loans: paginatedLoans,
      total: filteredLoans.length,
      page,
      limit,
    };
  }

  getLoan(id: string): Loan | undefined {
    return this.loans.find((loan) => loan.id === id);
  }

  getLoanStatistics(): LoanStatistics {
    const total = this.loans.length;
    const active = this.loans.filter((l) => l.status === "active").length;
    const pending = this.loans.filter((l) => l.status === "under_review").length;
    const disbursedThisMonth = this.loans.filter((l) => {
      if (!l.disbursementDate) return false;
      const disbursementDate = new Date(l.disbursementDate);
      const now = new Date();
      return (
        disbursementDate.getMonth() === now.getMonth() &&
        disbursementDate.getFullYear() === now.getFullYear()
      );
    }).length;
    const totalDisbursed = this.loans.reduce((sum, loan) => sum + (loan.approvedAmount || 0), 0);
    const totalOutstanding = this.loans.reduce((sum, loan) => sum + loan.outstandingBalance, 0);
    const overdue = this.loans.filter((l) => l.status === "defaulted").length;
    const defaultRate = total > 0 ? (overdue / total) * 100 : 0;
    const averageLoanAmount = total > 0 ? totalDisbursed / total : 0;
    const averageInterestRate =
      total > 0 ? this.loans.reduce((sum, loan) => sum + loan.interestRate, 0) / total : 0;

    return {
      totalLoans: total,
      activeLoans: active,
      pendingApproval: pending,
      disbursedThisMonth,
      totalDisbursed,
      totalOutstanding,
      overdueLoans: overdue,
      defaultRate: Math.round(defaultRate * 100) / 100,
      averageLoanAmount: Math.round(averageLoanAmount),
      averageInterestRate: Math.round(averageInterestRate * 100) / 100,
    };
  }

  // Repayments
  getRepayments(
    params: {
      page?: number;
      limit?: number;
      loanId?: string;
      borrowerId?: string;
      status?: string;
      startDate?: string;
      endDate?: string;
      loanOfficer?: string;
      paymentMethod?: string;
      sortBy?: string;
      sortOrder?: "asc" | "desc";
    } = {},
  ): { repayments: Repayment[]; total: number; page: number; limit: number } {
    let filteredRepayments = [...this.repayments];

    // Apply filters
    if (params.loanId) {
      filteredRepayments = filteredRepayments.filter(
        (repayment) => repayment.loanId === params.loanId,
      );
    }

    if (params.borrowerId) {
      filteredRepayments = filteredRepayments.filter(
        (repayment) => repayment.borrowerId === params.borrowerId,
      );
    }

    if (params.status) {
      filteredRepayments = filteredRepayments.filter(
        (repayment) => repayment.status === params.status,
      );
    }

    if (params.paymentMethod) {
      filteredRepayments = filteredRepayments.filter(
        (repayment) => repayment.paymentMethod === params.paymentMethod,
      );
    }

    // Apply pagination
    const page = params.page || 1;
    const limit = params.limit || 10;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedRepayments = filteredRepayments.slice(startIndex, endIndex);

    return {
      repayments: paginatedRepayments,
      total: filteredRepayments.length,
      page,
      limit,
    };
  }

  getRepayment(id: string): Repayment | undefined {
    return this.repayments.find((repayment) => repayment.id === id);
  }

  getRepaymentStatistics(): RepaymentStatistics {
    const total = this.repayments.length;
    const totalAmount = this.repayments.reduce((sum, repayment) => sum + repayment.paidAmount, 0);
    const overdue = this.repayments.filter((r) => r.status === "overdue").length;
    const overdueAmount = this.repayments
      .filter((r) => r.status === "overdue")
      .reduce((sum, repayment) => sum + repayment.scheduledAmount, 0);
    const paidThisMonth = this.repayments.filter((r) => {
      if (!r.paidDate) return false;
      const paidDate = new Date(r.paidDate);
      const now = new Date();
      return paidDate.getMonth() === now.getMonth() && paidDate.getFullYear() === now.getFullYear();
    }).length;
    const paidThisMonthAmount = this.repayments
      .filter((r) => {
        if (!r.paidDate) return false;
        const paidDate = new Date(r.paidDate);
        const now = new Date();
        return (
          paidDate.getMonth() === now.getMonth() && paidDate.getFullYear() === now.getFullYear()
        );
      })
      .reduce((sum, repayment) => sum + repayment.paidAmount, 0);
    const collectionRate =
      total > 0 ? (this.repayments.filter((r) => r.status === "paid").length / total) * 100 : 0;
    const averagePaymentDelay = 0; // This would need to be calculated based on due dates vs paid dates

    return {
      totalRepayments: total,
      totalAmount,
      overdueRepayments: overdue,
      overdueAmount,
      paidThisMonth,
      paidThisMonthAmount,
      collectionRate: Math.round(collectionRate * 100) / 100,
      averagePaymentDelay,
    };
  }

  // Loan Officers
  getLoanOfficers(): LoanOfficer[] {
    return this.loanOfficers;
  }

  getLoanOfficer(id: string): LoanOfficer | undefined {
    return this.loanOfficers.find((officer) => officer.id === id);
  }

  // Utility methods
  getBorrowerLoanHistory(borrowerId: string): Loan[] {
    return this.loans.filter((loan) => loan.borrowerId === borrowerId);
  }

  getBorrowerRepaymentHistory(borrowerId: string): Repayment[] {
    return this.repayments.filter((repayment) => repayment.borrowerId === borrowerId);
  }

  // Simulate API delays
  private async delay(ms: number = 500): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  // Async versions of methods to simulate API calls
  async getBorrowersAsync(
    params: any = {},
  ): Promise<{ borrowers: Borrower[]; total: number; page: number; limit: number }> {
    await this.delay();
    return this.getBorrowers(params);
  }

  async getBorrowerAsync(id: string): Promise<Borrower | undefined> {
    await this.delay();
    return this.getBorrower(id);
  }

  async getBorrowerStatisticsAsync(): Promise<BorrowerStatistics> {
    await this.delay();
    return this.getBorrowerStatistics();
  }

  async getLoansAsync(
    params: any = {},
  ): Promise<{ loans: Loan[]; total: number; page: number; limit: number }> {
    await this.delay();
    return this.getLoans(params);
  }

  async getLoanAsync(id: string): Promise<Loan | undefined> {
    await this.delay();
    return this.getLoan(id);
  }

  async getLoanStatisticsAsync(): Promise<LoanStatistics> {
    await this.delay();
    return this.getLoanStatistics();
  }

  async getRepaymentsAsync(
    params: any = {},
  ): Promise<{ repayments: Repayment[]; total: number; page: number; limit: number }> {
    await this.delay();
    return this.getRepayments(params);
  }

  async getRepaymentAsync(id: string): Promise<Repayment | undefined> {
    await this.delay();
    return this.getRepayment(id);
  }

  async getRepaymentStatisticsAsync(): Promise<RepaymentStatistics> {
    await this.delay();
    return this.getRepaymentStatistics();
  }

  async getLoanOfficersAsync(): Promise<LoanOfficer[]> {
    await this.delay();
    return this.getLoanOfficers();
  }
}

// Export singleton instance
export const dataService = new DataService();
export default dataService;
