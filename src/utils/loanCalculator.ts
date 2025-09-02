import type { LoanSchedule } from "@/types/Loan";
import { InstallmentStatus } from "@/types/Loan";

export interface LoanCalculation {
  monthlyPayment: number;
  totalAmount: number;
  totalInterest: number;
  schedule: LoanSchedule[];
}

export const generateLoanSchedule = (
  principal: number,
  annualRate: number,
  term: number,
): LoanCalculation => {
  const monthlyRate = annualRate / 100 / 12;
  const monthlyPayment = calculateMonthlyPayment(principal, annualRate, term);

  let balance = principal;
  const schedule: LoanSchedule[] = [];

  for (let i = 1; i <= term; i++) {
    const interest = balance * monthlyRate;
    const principalPayment = monthlyPayment - interest;
    balance -= principalPayment;

    schedule.push({
      id: `installment-${i}`,
      installmentNumber: i,
      dueDate: calculateDueDate(i),
      principal: Math.max(0, principalPayment),
      interest: Math.max(0, interest),
      total: monthlyPayment,
      balance: Math.max(0, balance),
      status: InstallmentStatus.PENDING,
    });
  }

  const totalAmount = monthlyPayment * term;
  const totalInterest = totalAmount - principal;

  return {
    monthlyPayment,
    totalAmount,
    totalInterest,
    schedule,
  };
};

export const calculateMonthlyPayment = (principal: number, rate: number, term: number): number => {
  const monthlyRate = rate / 100 / 12;
  const numberOfPayments = term;

  if (monthlyRate === 0) return principal / numberOfPayments;

  return (
    (principal * (monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments))) /
    (Math.pow(1 + monthlyRate, numberOfPayments) - 1)
  );
};

export const calculateTotalAmount = (principal: number, rate: number, term: number): number => {
  const monthlyPayment = calculateMonthlyPayment(principal, rate, term);
  return monthlyPayment * term;
};

export const calculateRemainingBalance = (loan: any): number => {
  // Simplified calculation - in a real app, you'd calculate based on payments made
  const { amount, interestRate, term } = loan;
  const monthlyPayment = calculateMonthlyPayment(amount, interestRate, term);
  const totalAmount = calculateTotalAmount(amount, interestRate, term);

  // For demo purposes, return a percentage of the original amount
  // In reality, this would be calculated based on actual payments made
  return totalAmount * 0.7; // Assume 30% has been paid
};

export const calculateLateFees = (
  overdueAmount: number,
  daysOverdue: number,
  dailyRate: number = 0.0005, // 0.05% per day
): number => {
  return overdueAmount * dailyRate * daysOverdue;
};

export const calculateDebtToIncomeRatio = (
  monthlyDebtPayments: number,
  monthlyIncome: number,
): number => {
  return (monthlyDebtPayments / monthlyIncome) * 100;
};

export const calculateLoanToValueRatio = (loanAmount: number, collateralValue: number): number => {
  return (loanAmount / collateralValue) * 100;
};

const calculateDueDate = (installmentNumber: number): string => {
  const today = new Date();
  const dueDate = new Date(today);
  dueDate.setMonth(dueDate.getMonth() + installmentNumber);
  return dueDate.toISOString().split("T")[0];
};
