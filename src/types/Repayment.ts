import type { Loan, LoanSchedule } from "./Loan";

export interface Repayment {
  id: string;
  loanId: string;
  loan: Loan;
  installmentId: string;
  installment: LoanSchedule;
  amount: number;
  principal: number;
  interest: number;
  lateFees: number;
  paymentMethod: PaymentMethod;
  referenceNumber: string;
  status: RepaymentStatus;
  paidAt: string;
  receiptUrl?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export enum PaymentMethod {
  BANK_TRANSFER = "bank_transfer",
  CASH = "cash",
  CHECK = "check",
  MOBILE_MONEY = "mobile_money",
  CREDIT_CARD = "credit_card",
}

export enum RepaymentStatus {
  PENDING = "pending",
  COMPLETED = "completed",
  FAILED = "failed",
  CANCELLED = "cancelled",
}

export interface CreateRepaymentData {
  loanId: string;
  installmentId: string;
  amount: number;
  paymentMethod: PaymentMethod;
  referenceNumber: string;
  notes?: string;
}

export interface RepaymentReceipt {
  id: string;
  repaymentId: string;
  customerName: string;
  loanNumber: string;
  amount: number;
  principal: number;
  interest: number;
  lateFees: number;
  paymentDate: string;
  referenceNumber: string;
  remainingBalance: number;
}
