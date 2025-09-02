// Export all data files
export { default as borrowersData } from "./borrowers.json";
export { default as loansData } from "./loans.json";
export { default as repaymentsData } from "./repayments.json";
export { default as loanOfficersData } from "./loan-officers.json";
export { default as groupsData } from "./groups.json";
export { default as groupMembersData } from "./group-members.json";
export { default as groupLoansData } from "./group-loans.json";
export { default as groupActivitiesData } from "./group-activities.json";
export { default as documentsData } from "./documents.json";

// Re-export types from dataService
export type {
  Borrower,
  Loan,
  Repayment,
  LoanOfficer,
  BorrowerStatistics,
  LoanStatistics,
  RepaymentStatistics,
} from "../services/mock/dataService";
