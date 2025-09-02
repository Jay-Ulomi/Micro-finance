// Main services index - exports the appropriate service based on environment
import { dataService } from "./mock/dataService";

// For now, we'll use the mock service for development
// In production, this would switch to the real API services
export const service = dataService;

// Export individual services for direct access if needed
export { dataService } from "./mock/dataService";

// Export API services (for future use)
export * from "./api";

// Export types
export type {
  Borrower,
  Loan,
  Repayment,
  LoanOfficer,
  BorrowerStatistics,
  LoanStatistics,
  RepaymentStatistics,
} from "./mock/dataService";
