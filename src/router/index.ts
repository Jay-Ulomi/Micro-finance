import { createRouter, createWebHistory } from "vue-router";
import { useAuthStore } from "@/store/auth";
import AdminLayout from "@/layouts/AdminLayout.vue";
import AuthLayout from "@/layouts/AuthLayout.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      component: AdminLayout,
      meta: { requiresAuth: true },
      children: [
        {
          path: "",
          name: "dashboard",
          component: () => import("@/pages/Reports/Overview.vue"),
          meta: { title: "Home Branch" },
        },
        // Borrowers (renamed from customers)
        {
          path: "borrowers",
          name: "borrowers",
          component: () => import("@/pages/Borrowers/List.vue"),
          meta: { title: "Borrowers" },
        },
        {
          path: "borrowers/:id",
          name: "borrower-details",
          component: () => import("@/pages/Borrowers/Details.vue"),
          meta: { title: "Borrower Details" },
        },
        {
          path: "borrowers/create",
          name: "borrowers-create",
          component: () => import("@/pages/Borrowers/Create.vue"),
          meta: { title: "Add Borrower" },
        },
        {
          path: "borrowers/groups",
          name: "borrowers-groups",
          component: () => import("@/pages/Borrowers/Groups.vue"),
          meta: { title: "Borrower Groups" },
        },
        {
          path: "borrowers/groups/create",
          name: "borrowers-groups-create",
          component: () => import("@/pages/Borrowers/CreateGroup.vue"),
          meta: { title: "Add Borrowers Group" },
        },
        {
          path: "borrowers/groups/:id",
          name: "borrowers-groups-details",
          component: () => import("@/pages/Borrowers/GroupDetails.vue"),
          meta: { title: "Group Details" },
        },
        {
          path: "borrowers/groups/:id/edit",
          name: "borrowers-groups-edit",
          component: () => import("@/pages/Borrowers/EditGroup.vue"),
          meta: { title: "Edit Group" },
        },
        {
          path: "borrowers/groups/:id/members",
          name: "borrowers-groups-members",
          component: () => import("@/pages/Borrowers/ManageMembers.vue"),
          meta: { title: "Manage Members" },
        },
        {
          path: "borrowers/sms",
          name: "borrowers-sms",
          component: () => import("@/pages/Borrowers/SMS.vue"),
          meta: { title: "Send SMS to All Borrowers" },
        },
        {
          path: "borrowers/email",
          name: "borrowers-email",
          component: () => import("@/pages/Borrowers/Email.vue"),
          meta: { title: "Send Email to All Borrowers" },
        },
        {
          path: "borrowers/invite",
          name: "borrowers-invite",
          component: () => import("@/pages/Borrowers/Invite.vue"),
          meta: { title: "Invite Borrowers" },
        },
        {
          path: "borrowers/kyc",
          name: "borrowers-kyc",
          component: () => import("@/pages/Borrowers/KYC.vue"),
          meta: { title: "KYC Verification" },
        },
        {
          path: "borrowers/:id/documents",
          name: "borrower-documents",
          component: () => import("@/pages/Borrowers/Documents.vue"),
          meta: { title: "Borrower Documents" },
        },
        {
          path: "borrowers/:id/messages",
          name: "borrower-messages",
          component: () => import("@/pages/Borrowers/Messages.vue"),
          meta: { title: "Send Message" },
        },
        // Loans
        {
          path: "loans",
          name: "loans",
          component: () => import("@/pages/Loans/List.vue"),
          meta: { title: "Loans" },
        },
        {
          path: "loans/apply",
          name: "loan-apply",
          component: () => import("@/pages/Loans/Apply.vue"),
          meta: { title: "Apply for Loan" },
        },
        {
          path: "loans/:id",
          name: "loan-details",
          component: () => import("@/pages/Loans/Details.vue"),
          meta: { title: "Loan Details" },
        },
        {
          path: "loans/due",
          name: "loans-due",
          component: () => import("@/pages/Loans/Due.vue"),
          meta: { title: "Due Loans" },
        },
        {
          path: "loans/missed",
          name: "loans-missed",
          component: () => import("@/pages/Loans/Missed.vue"),
          meta: { title: "Missed Repayments" },
        },
        {
          path: "loans/arrears",
          name: "loans-arrears",
          component: () => import("@/pages/Loans/Arrears.vue"),
          meta: { title: "Loans in Arrears" },
        },
        {
          path: "loans/no-repayments",
          name: "loans-no-repayments",
          component: () => import("@/pages/Loans/NoRepayments.vue"),
          meta: { title: "No Repayments" },
        },
        {
          path: "loans/past-maturity",
          name: "loans-past-maturity",
          component: () => import("@/pages/Loans/PastMaturity.vue"),
          meta: { title: "Past Maturity Date" },
        },
        {
          path: "loans/principal-outstanding",
          name: "loans-principal-outstanding",
          component: () => import("@/pages/Loans/PrincipalOutstanding.vue"),
          meta: { title: "Principal Outstanding" },
        },
        {
          path: "loans/1-month-late",
          name: "loans-1-month-late",
          component: () => import("@/pages/Loans/OneMonthLate.vue"),
          meta: { title: "1 Month Late Loans" },
        },
        {
          path: "loans/3-months-late",
          name: "loans-3-months-late",
          component: () => import("@/pages/Loans/ThreeMonthsLate.vue"),
          meta: { title: "3 Months Late Loans" },
        },
        {
          path: "loans/calculator",
          name: "loans-calculator",
          component: () => import("@/pages/Loans/Calculator.vue"),
          meta: { title: "Loan Calculator" },
        },
        {
          path: "loans/guarantors",
          name: "loans-guarantors",
          component: () => import("@/pages/Loans/Guarantors.vue"),
          meta: { title: "Guarantors" },
        },
        {
          path: "loans/comments",
          name: "loans-comments",
          component: () => import("@/pages/Loans/Comments.vue"),
          meta: { title: "Loan Comments" },
        },
        {
          path: "loans/approve",
          name: "loans-approve",
          component: () => import("@/pages/Loans/Approve.vue"),
          meta: { title: "Approve Loans" },
        },
        // Repayments
        {
          path: "repayments",
          name: "repayments",
          component: () => import("@/pages/Repayments/List.vue"),
          meta: { title: "Repayments" },
        },
        {
          path: "repayments/view",
          name: "repayments-view",
          component: () => import("@/pages/Repayments/View.vue"),
          meta: { title: "View Repayments" },
        },
        {
          path: "repayments/bulk",
          name: "repayments-bulk",
          component: () => import("@/pages/Repayments/Bulk.vue"),
          meta: { title: "Add Bulk Repayments" },
        },
        {
          path: "repayments/approve",
          name: "repayments-approve",
          component: () => import("@/pages/Repayments/Approve.vue"),
          meta: { title: "Approve Repayments" },
        },
        // Collateral Register
        {
          path: "collateral",
          name: "collateral",
          component: () => import("@/pages/Collateral/List.vue"),
          meta: { title: "Collateral Register" },
        },
        {
          path: "collateral/create",
          name: "collateral-create",
          component: () => import("@/pages/Collateral/Create.vue"),
          meta: { title: "Add Collateral" },
        },
        // Calendar
        {
          path: "calendar",
          name: "calendar",
          component: () => import("@/pages/Calendar/List.vue"),
          meta: { title: "Calendar" },
        },
        // Collection Sheets
        {
          path: "collection-sheets",
          name: "collection-sheets",
          component: () => import("@/pages/CollectionSheets/List.vue"),
          meta: { title: "Collection Sheets" },
        },
        // Savings
        {
          path: "savings",
          name: "savings",
          component: () => import("@/pages/Savings/List.vue"),
          meta: { title: "Savings" },
        },
        {
          path: "savings/create",
          name: "savings-create",
          component: () => import("@/pages/Savings/AccountCreate.vue"),
          meta: { title: "Add Savings Account" },
        },
        {
          path: "savings/products",
          name: "savings-products",
          component: () => import("@/pages/Savings/ProductList.vue"),
          meta: { title: "Savings Products" },
        },
        {
          path: "savings/products/create",
          name: "savings-products-create",
          component: () => import("@/pages/Savings/ProductCreate.vue"),
          meta: { title: "Add Savings Product" },
        },
        {
          path: "savings/products/create-susu",
          name: "savings-products-create-susu",
          component: () => import("@/pages/Savings/SusuProductCreate.vue"),
          meta: { title: "Add SUSU Collector Product" },
        },
        {
          path: "savings/cash-safe",
          name: "savings-cash-safe",
          component: () => import("@/pages/Savings/CashSafeManagement.vue"),
          meta: { title: "Cash Safe Management" },
        },
        {
          path: "savings/fee-report",
          name: "savings-fee-report",
          component: () => import("@/pages/Savings/FeeReport.vue"),
          meta: { title: "Savings Fee Report" },
        },
        {
          path: "savings/products-report",
          name: "savings-products-report",
          component: () => import("@/pages/Savings/ProductsReport.vue"),
          meta: { title: "Savings Products Report" },
        },
        {
          path: "savings/report",
          name: "savings-report",
          component: () => import("@/pages/Savings/SavingsReport.vue"),
          meta: { title: "Savings Report" },
        },
        // Savings Transactions
        {
          path: "savings-transactions",
          name: "savings-transactions",
          component: () => import("@/pages/SavingsTransactions/List.vue"),
          meta: { title: "Savings Transactions" },
        },
        {
          path: "savings-transactions/bulk-add",
          name: "savings-transactions-bulk-add",
          component: () => import("@/pages/SavingsTransactions/BulkAdd.vue"),
          meta: { title: "Add Bulk Transactions" },
        },
        {
          path: "savings-transactions/upload-csv",
          name: "savings-transactions-upload-csv",
          component: () => import("@/pages/SavingsTransactions/UploadCSV.vue"),
          meta: { title: "Upload Transactions from CSV" },
        },
        {
          path: "savings-transactions/staff-report",
          name: "savings-transactions-staff-report",
          component: () => import("@/pages/SavingsTransactions/StaffReport.vue"),
          meta: { title: "Staff Transactions Report" },
        },
        {
          path: "savings-transactions/approve",
          name: "savings-transactions-approve",
          component: () => import("@/pages/SavingsTransactions/Approve.vue"),
          meta: { title: "Approve Transactions" },
        },
        // Investors
        {
          path: "investors",
          name: "investors",
          component: () => import("@/pages/Investors/List.vue"),
          meta: { title: "Investors" },
        },
        {
          path: "investors/create",
          name: "investors-create",
          component: () => import("@/pages/Investors/Create.vue"),
          meta: { title: "Add Investor" },
        },
        {
          path: "investors/:id",
          name: "investors-details",
          component: () => import("@/pages/Investors/Details.vue"),
          meta: { title: "Investor Details" },
        },
        // Investor Accounts
        {
          path: "investor-accounts",
          name: "investor-accounts",
          component: () => import("@/pages/InvestorAccounts/List.vue"),
          meta: { title: "Investor Accounts" },
        },
        {
          path: "investor-accounts/create",
          name: "investor-accounts-create",
          component: () => import("@/pages/InvestorAccounts/Create.vue"),
          meta: { title: "Add Investor Account" },
        },
        {
          path: "investor-accounts/create-product",
          name: "investor-accounts-create-product",
          component: () => import("@/pages/InvestorAccounts/CreateProduct.vue"),
          meta: { title: "Add Investor Product" },
        },
        {
          path: "investor-accounts/loan-investments",
          name: "loan-investments",
          component: () => import("@/pages/InvestorAccounts/LoanInvestments.vue"),
          meta: { title: "Loan Investments" },
        },
        {
          path: "investor-accounts/transactions",
          name: "investor-transactions",
          component: () => import("@/pages/InvestorAccounts/Transactions.vue"),
          meta: { title: "Investor Transactions" },
        },
        {
          path: "investor-accounts/approve-investments",
          name: "approve-investments",
          component: () => import("@/pages/InvestorAccounts/ApproveInvestments.vue"),
          meta: { title: "Approve Loan Investments" },
        },
        {
          path: "investor-accounts/products",
          name: "investor-products",
          component: () => import("@/pages/InvestorAccounts/Products.vue"),
          meta: { title: "Investor Account Products" },
        },
        // E-Signatures
        {
          path: "e-signatures",
          name: "e-signatures",
          component: () => import("@/pages/ESignatures/List.vue"),
          meta: { title: "E-Signatures" },
        },
        // Payroll
        {
          path: "payroll",
          name: "payroll",
          component: () => import("@/pages/Payroll/List.vue"),
          meta: { title: "Payroll" },
        },
        {
          path: "payroll/staff/:staffId",
          name: "staff-payroll",
          component: () => import("@/pages/Payroll/StaffPayroll.vue"),
          meta: { title: "Staff Payroll" },
        },
        {
          path: "payroll/create",
          name: "payroll-create",
          component: () => import("@/pages/Payroll/Create.vue"),
          meta: { title: "Add Payroll" },
        },
        {
          path: "payroll/report",
          name: "payroll-report",
          component: () => import("@/pages/Payroll/Report.vue"),
          meta: { title: "Payroll Report" },
        },
        // Expenses
        {
          path: "expenses",
          name: "expenses",
          component: () => import("@/pages/Expenses/List.vue"),
          meta: { title: "Expenses" },
        },
        {
          path: "expenses/create",
          name: "expenses-create",
          component: () => import("@/pages/Expenses/Create.vue"),
          meta: { title: "Add Expense" },
        },
        // Other Income
        {
          path: "other-income",
          name: "other-income",
          component: () => import("@/pages/OtherIncome/List.vue"),
          meta: { title: "Other Income" },
        },
        {
          path: "other-income/create",
          name: "other-income-create",
          component: () => import("@/pages/OtherIncome/Create.vue"),
          meta: { title: "Add Other Income" },
        },
        {
          path: "other-income/upload",
          name: "other-income-upload",
          component: () => import("@/pages/OtherIncome/UploadCSV.vue"),
          meta: { title: "Upload Other Income - CSV" },
        },
        // Asset Management
          {
            path: "asset-management",
            name: "asset-management",
            component: () => import("@/pages/AssetManagement/List.vue"),
            meta: { title: "Asset Management" },
        },
        {
          path: "asset-management/create",
          name: "asset-management-create",
          component: () => import("@/pages/AssetManagement/Create.vue"),
          meta: { title: "Add Asset" },
        },
        {
          path: "asset-management/depreciation",
          name: "asset-management-depreciation",
          component: () => import("@/pages/AssetManagement/Depreciation.vue"),
          meta: { title: "Asset Depreciation" },
        },

        // Reports
        {
          path: "reports",
          name: "reports",
          component: () => import("@/pages/Reports/Overview.vue"),
          meta: { title: "Reports" },
        },
        // Accounting
        {
          path: "accounting",
          name: "accounting",
          component: () => import("@/pages/Accounting/List.vue"),
          meta: { title: "Accounting" },
        },
        // Settings
        {
          path: "settings",
          name: "settings",
          component: () => import("@/pages/Settings/General.vue"),
          meta: { title: "System Settings" },
        },
      ],
    },
    {
      path: "/auth",
      component: AuthLayout,
      meta: { requiresGuest: true },
      children: [
        {
          path: "login",
          name: "login",
          component: () => import("@/pages/Auth/Login.vue"),
          meta: { title: "Login" },
        },
        {
          path: "register",
          name: "register",
          component: () => import("@/pages/Auth/Register.vue"),
          meta: { title: "Register" },
        },
      ],
    },
    {
      path: "/:pathMatch(.*)*",
      name: "not-found",
      component: () => import("@/pages/NotFound.vue"),
      meta: { title: "Page Not Found" },
    },
  ],
});

// Navigation guard for authentication
router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore();

  // Set page title
  if (to.meta.title) {
    document.title = `${to.meta.title} - Loan Management System`;
  }

  // Check if route requires authentication
  if (to.meta.requiresAuth) {
    if (!authStore.isAuthenticated) {
      // Try to refresh token
      const refreshed = await authStore.refreshAuth();
      if (!refreshed) {
        next({ name: "login", query: { redirect: to.fullPath } });
        return;
      }
    }

    // Check role-based access if needed
    if (to.meta.requiresAdmin && !authStore.isAdmin) {
      next({ name: "dashboard" });
      return;
    }

    if (to.meta.requiresLoanOfficer && !authStore.isLoanOfficer) {
      next({ name: "dashboard" });
      return;
    }
  }

  // Check if route requires guest (not authenticated)
  if (to.meta.requiresGuest && authStore.isAuthenticated) {
    next({ name: "dashboard" });
    return;
  }

  next();
});

export default router;
