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
        // Collateral Register
        {
          path: "collateral",
          name: "collateral",
          component: () => import("@/pages/Collateral/List.vue"),
          meta: { title: "Collateral Register" },
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
        // Savings Transactions
        {
          path: "savings-transactions",
          name: "savings-transactions",
          component: () => import("@/pages/SavingsTransactions/List.vue"),
          meta: { title: "Savings Transactions" },
        },
        // Investors
        {
          path: "investors",
          name: "investors",
          component: () => import("@/pages/Investors/List.vue"),
          meta: { title: "Investors" },
        },
        // Investor Accounts
        {
          path: "investor-accounts",
          name: "investor-accounts",
          component: () => import("@/pages/InvestorAccounts/List.vue"),
          meta: { title: "Investor Accounts" },
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
        // Expenses
        {
          path: "expenses",
          name: "expenses",
          component: () => import("@/pages/Expenses/List.vue"),
          meta: { title: "Expenses" },
        },
        // Other Income
        {
          path: "other-income",
          name: "other-income",
          component: () => import("@/pages/OtherIncome/List.vue"),
          meta: { title: "Other Income" },
        },
        // Asset Management
        {
          path: "asset-management",
          name: "asset-management",
          component: () => import("@/pages/AssetManagement/List.vue"),
          meta: { title: "Asset Management" },
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
