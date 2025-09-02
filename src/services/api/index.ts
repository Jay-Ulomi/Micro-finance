// Export all API modules
export { authApi } from "./auth";
export { borrowersApi } from "./borrowers";
export { loansApi } from "./loans";
export { repaymentsApi } from "./repayments";
export { savingsApi } from "./savings";
export { investorsApi } from "./investors";
export { collateralApi } from "./collateral";
export { reportsApi } from "./reports";
export { accountingApi } from "./accounting";
export { calendarApi } from "./calendar";
export { expensesApi } from "./expenses";
export { otherIncomeApi } from "./other-income";
export { assetManagementApi } from "./asset-management";
export { payrollApi } from "./payroll";
export { eSignaturesApi } from "./e-signatures";

// Export the main API configuration
export { default as api } from "./config";

// Export types
export type * from "./borrowers";
export type * from "./loans";
export type * from "./repayments";
export type * from "./savings";
export type * from "./investors";
export type * from "./collateral";
export type * from "./reports";
export type * from "./accounting";
export type * from "./calendar";
export type * from "./expenses";
export type * from "./other-income";
export type * from "./asset-management";
export type * from "./payroll";
export type * from "./e-signatures";
