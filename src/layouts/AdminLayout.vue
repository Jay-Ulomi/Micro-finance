<template>
  <div class="min-h-screen bg-neutral-50">
    <!-- Sidebar -->
    <aside
      class="fixed inset-y-0 left-0 z-50 shadow-xl transform transition-transform duration-300 ease-in-out border-r border-primary-200"
      :class="[
        !sidebarOpen ? '-translate-x-full' : '',
        sidebarCollapsed ? 'w-20' : 'w-64',
        'bg-gradient-to-br from-neutral-900 via-neutral-800 to-primary-900 text-white',
      ]"
    >
      <!-- Sidebar content -->
      <div class="flex flex-col h-full">
        <!-- Sidebar header -->
        <div
          class="flex items-center justify-between h-14 px-6 border-b border-primary-300 bg-gradient-to-r from-primary-100 to-primary-50"
        >
          <h1
            :class="[
              'font-bold text-primary-700 transition-all duration-300',
              sidebarCollapsed ? 'text-lg' : 'text-xl',
            ]"
          >
            {{ sidebarCollapsed ? "OL" : "Orbit Loan" }}
          </h1>
          <div class="flex items-center space-x-2">
            <!-- Toggle button for large screens -->
            <button
              @click="toggleSidebar"
              class="hidden lg:flex p-2 rounded-lg hover:bg-neutral-100 transition-colors"
              :title="sidebarCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'"
            >
              <ChevronLeftIcon
                :class="[
                  'w-5 h-5 text-gray-600 transition-transform duration-300',
                  sidebarCollapsed ? 'rotate-180' : '',
                ]"
              />
            </button>
            <!-- Close button for mobile -->
            <button
              @click="sidebarOpen = false"
              class="lg:hidden p-2 rounded-lg hover:bg-neutral-100 transition-colors"
            >
              <XMarkIcon class="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>

        <!-- Scrollable navigation area -->
        <div
          class="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 hover:scrollbar-thumb-gray-400"
        >
          <nav class="px-6 py-6 space-y-3">
            <div v-for="item in navigationItems" :key="item.name" class="space-y-2">
              <!-- Main navigation item -->
              <div
                v-if="!item.hasDropdown"
                :class="[
                  'flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 cursor-pointer border border-transparent whitespace-nowrap relative',
                  isRouteActive(item.to)
                    ? 'bg-primary-600 text-white border-primary-500 shadow-lg'
                    : 'text-neutral-300 hover:bg-primary-800 hover:text-white hover:border-primary-600',
                ]"
                @click="$router.push(item.to)"
                @mouseenter="sidebarCollapsed && showMainTooltip(item.label)"
                @mouseleave="sidebarCollapsed && hideMainTooltip()"
              >
                <component :is="item.icon" class="w-5 h-5 mr-3 text-primary-300 flex-shrink-0" />
                <span
                  v-if="!sidebarCollapsed"
                  class="font-semibold truncate transition-all duration-300"
                >
                  {{ item.label }}
                </span>

                <!-- Tooltip for main items when collapsed -->
                <div
                  v-if="sidebarCollapsed && mainTooltipVisible === item.label"
                  class="absolute left-full ml-2 top-1/2 transform -translate-y-1/2 z-50 bg-primary-800 text-white px-3 py-2 rounded-lg shadow-xl border border-primary-600 whitespace-nowrap"
                  @mouseenter="mainTooltipVisible = item.label"
                  @mouseleave="hideMainTooltip()"
                >
                  {{ item.label }}
                </div>
              </div>

              <!-- Dropdown navigation item -->
              <div v-else class="space-y-2">
                <button
                  :class="[
                    'w-full flex items-center justify-between px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 border border-transparent whitespace-nowrap',
                    isDropdownRouteActive(item)
                      ? 'bg-primary-600 text-white border-primary-500 shadow-lg'
                      : 'text-neutral-300 hover:bg-primary-800 hover:text-white hover:border-primary-600',
                  ]"
                  @click="toggleDropdown(item.name)"
                >
                  <div class="flex items-center min-w-0">
                    <component
                      :is="item.icon"
                      class="w-5 h-5 mr-3 text-primary-300 flex-shrink-0"
                    />
                    <span
                      v-if="!sidebarCollapsed"
                      class="font-semibold truncate transition-all duration-300"
                    >
                      {{ item.label }}
                    </span>
                  </div>
                  <ChevronDownIcon
                    v-if="!sidebarCollapsed"
                    :class="[
                      'w-4 h-4 transition-transform duration-200 text-primary-300 flex-shrink-0',
                      openDropdowns.has(item.name) ? 'rotate-180' : '',
                    ]"
                  />
                </button>

                <!-- Dropdown items -->
                <div
                  v-if="openDropdowns.has(item.name) && !sidebarCollapsed"
                  class="ml-6 space-y-1 pl-4 border-l-2 border-primary-600"
                >
                  <router-link
                    v-for="dropdownItem in item.dropdownItems"
                    :key="dropdownItem.name"
                    :to="dropdownItem.to"
                    :class="[
                      'flex items-center px-4 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 whitespace-nowrap',
                      isRouteActive(dropdownItem.to)
                        ? 'bg-primary-500 text-white border border-primary-400 shadow-md'
                        : 'text-primary-200 hover:bg-primary-700 hover:text-white hover:border-primary-500 border border-transparent',
                    ]"
                  >
                    <div class="w-2 h-2 bg-primary-400 rounded-full mr-3 flex-shrink-0"></div>
                    <span class="font-medium truncate">{{ dropdownItem.label }}</span>
                  </router-link>
                </div>
              </div>
            </div>
          </nav>
        </div>
      </div>
    </aside>

    <!-- Main content -->
    <div :class="sidebarCollapsed ? 'lg:pl-20' : 'lg:pl-64'">
      <!-- Header -->
      <header class="sticky top-0 z-30 bg-white shadow-sm border-b border-gray-200">
        <div class="flex items-center justify-between h-14 px-6">
          <div class="flex items-center">
            <button @click="sidebarOpen = true" class="lg:hidden mr-4">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
            <h2 class="text-lg font-semibold text-gray-900">
              {{ currentPageTitle }}
            </h2>
          </div>

          <div class="flex items-center space-x-4">
            <!-- Notifications -->
            <button class="relative p-2 text-gray-400 hover:text-gray-600">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M15 17h5l-5 5v-5z"
                />
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M9 11h.01M9 8h.01M15 14h.01M15 11h.01M15 8h.01M15 5h.01M12 5h.01M12 2h.01"
                />
              </svg>
              <span
                v-if="notificationCount > 0"
                class="absolute top-0 right-0 block w-2 h-2 bg-danger-400 rounded-full"
              ></span>
            </button>

            <!-- User menu -->
            <div class="relative">
              <button
                @click="userMenuOpen = !userMenuOpen"
                class="flex items-center space-x-2 text-sm text-gray-700 hover:text-gray-900"
              >
                <div class="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                  <span class="text-primary-600 font-medium">{{ userInitials }}</span>
                </div>
                <span>{{ authStore.user?.firstName }} {{ authStore.user?.lastName }}</span>
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>

              <div
                v-if="userMenuOpen"
                class="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50"
              >
                <router-link
                  to="/profile"
                  class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Profile
                </router-link>
                <button
                  @click="logout"
                  class="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      <!-- Page content -->
      <main class="p-4">
        <router-view />
      </main>
    </div>

    <!-- Overlay for mobile sidebar -->
    <div
      v-if="sidebarOpen"
      @click="sidebarOpen = false"
      class="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
    ></div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useAuthStore } from "@/store/auth";
import {
  HomeIcon,
  UsersIcon,
  CreditCardIcon,
  BanknotesIcon,
  ChartBarIcon,
  Cog6ToothIcon,
  ShieldCheckIcon,
  XMarkIcon,
  ChevronDownIcon,
  CalendarIcon,
  DocumentTextIcon,
  // PiggyBankIcon, // Not available in Heroicons v2, using BanknotesIcon instead
  ArrowPathIcon,
  UserGroupIcon,
  BuildingLibraryIcon,
  DocumentArrowDownIcon,
  CurrencyDollarIcon,
  ArrowTrendingDownIcon,
  ArrowTrendingUpIcon,
  BuildingOfficeIcon,
  CalculatorIcon,
  ChevronLeftIcon,
} from "@heroicons/vue/24/outline";

const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();

const sidebarOpen = ref(false);
const sidebarCollapsed = ref(false);
const userMenuOpen = ref(false);
const notificationCount = ref(0);
const openDropdowns = ref<Set<string>>(new Set());
const mainTooltipVisible = ref<string | null>(null);

const toggleDropdown = (name: string) => {
  if (openDropdowns.value.has(name)) {
    openDropdowns.value.delete(name);
  } else {
    openDropdowns.value.add(name);
  }
};

const showMainTooltip = (label: string) => {
  mainTooltipVisible.value = label;
};

const hideMainTooltip = () => {
  mainTooltipVisible.value = null;
};

const toggleSidebar = () => {
  sidebarCollapsed.value = !sidebarCollapsed.value;
};

const navigationItems = [
  {
    name: "dashboard",
    label: "Home Branch",
    to: "/",
    icon: HomeIcon,
    hasDropdown: false,
  },
  {
    name: "borrowers",
    label: "Borrowers",
    to: "/borrowers",
    icon: UsersIcon,
    hasDropdown: true,
    dropdownItems: [
      { name: "borrowers-list", label: "View Borrowers", to: "/borrowers" },
      { name: "borrowers-create", label: "Add Borrower", to: "/borrowers/create" },
      { name: "borrowers-groups", label: "View Borrower Groups", to: "/borrowers/groups" },
      {
        name: "borrowers-groups-create",
        label: "Add Borrowers Group",
        to: "/borrowers/groups/create",
      },
      { name: "borrowers-sms", label: "Send SMS to All Borrowers", to: "/borrowers/sms" },
      { name: "borrowers-email", label: "Send Email to All Borrowers", to: "/borrowers/email" },
      { name: "borrowers-invite", label: "Invite Borrowers", to: "/borrowers/invite" },
      { name: "borrowers-kyc", label: "KYC Verification", to: "/borrowers/kyc" },
    ],
  },
  {
    name: "loans",
    label: "Loans",
    to: "/loans",
    icon: CreditCardIcon,
    hasDropdown: true,
    dropdownItems: [
      { name: "loans-list", label: "View All Loans", to: "/loans" },
      { name: "loans-create", label: "Add Loan", to: "/loans/apply" },
      { name: "loans-due", label: "Due Loans", to: "/loans/due" },
      { name: "loans-missed", label: "Missed Repayments", to: "/loans/missed" },
      { name: "loans-arrears", label: "Loans in Arrears", to: "/loans/arrears" },
      { name: "loans-no-repayments", label: "No Repayments", to: "/loans/no-repayments" },
      { name: "loans-past-maturity", label: "Past Maturity Date", to: "/loans/past-maturity" },
      {
        name: "loans-principal-outstanding",
        label: "Principal Outstanding",
        to: "/loans/principal-outstanding",
      },
      { name: "loans-1-month-late", label: "1 Month Late Loans", to: "/loans/1-month-late" },
      { name: "loans-3-months-late", label: "3 Months Late Loans", to: "/loans/3-months-late" },
      { name: "loans-calculator", label: "Loan Calculator", to: "/loans/calculator" },
      { name: "loans-guarantors", label: "Guarantors", to: "/loans/guarantors" },
      { name: "loans-comments", label: "Loan Comments", to: "/loans/comments" },
      { name: "loans-approve", label: "Approve Loans", to: "/loans/approve" },
    ],
  },
  {
    name: "repayments",
    label: "Repayments",
    to: "/repayments",
    icon: BanknotesIcon,
    hasDropdown: true,
    dropdownItems: [
      { name: "repayments-list", label: "Repayment List", to: "/repayments" },
      { name: "repayments-view", label: "View Repayments", to: "/repayments/view" },
      { name: "repayments-bulk", label: "Add Bulk Repayments", to: "/repayments/bulk" },
      { name: "repayments-approve", label: "Approve Repayments", to: "/repayments/approve" },
    ],
  },
  {
    name: "collateral",
    label: "Collateral Register",
    to: "/collateral",
    icon: ShieldCheckIcon,
    hasDropdown: true,
    dropdownItems: [
      { name: "collateral-list", label: "Collateral List", to: "/collateral" },
      { name: "collateral-create", label: "Add Collateral", to: "/collateral/create" },
      { name: "collateral-valuation", label: "Valuation", to: "/collateral/valuation" },
      { name: "collateral-insurance", label: "Insurance", to: "/collateral/insurance" },
    ],
  },
  {
    name: "calendar",
    label: "Calendar",
    to: "/calendar",
    icon: CalendarIcon,
    hasDropdown: true,
    dropdownItems: [
      { name: "calendar-events", label: "Events", to: "/calendar" },
      { name: "calendar-meetings", label: "Meetings", to: "/calendar/meetings" },
      { name: "calendar-reminders", label: "Reminders", to: "/calendar/reminders" },
      { name: "calendar-schedule", label: "Schedule", to: "/calendar/schedule" },
    ],
  },
  {
    name: "collection-sheets",
    label: "Collection Sheets",
    to: "/collection-sheets",
    icon: DocumentTextIcon,
    hasDropdown: true,
    dropdownItems: [
      { name: "collection-sheets-list", label: "Collection Sheets", to: "/collection-sheets" },
      { name: "collection-sheets-create", label: "Create Sheet", to: "/collection-sheets/create" },
      {
        name: "collection-sheets-assign",
        label: "Assign Collectors",
        to: "/collection-sheets/assign",
      },
      { name: "collection-sheets-track", label: "Track Progress", to: "/collection-sheets/track" },
    ],
  },
  {
    name: "savings",
    label: "Savings",
    to: "/savings",
    icon: BuildingLibraryIcon,
    hasDropdown: true,
    dropdownItems: [

      { name: "savings-accounts", label: "View Savings Accounts", to: "/savings" },
      { name: "savings-create", label: "Add Savings Account", to: "/savings/create" },
      { name: "savings-charts", label: "Savings Charts", to: "/savings/charts" },
      { name: "savings-report", label: "Savings Report", to: "/savings/report" },
      {
        name: "savings-products-report",
        label: "Savings Products Report",
        to: "/savings/products-report",
      },
      { name: "savings-fee-report", label: "Savings Fee Report", to: "/savings/fee-report" },
      { name: "savings-cash-safe", label: "Cash Safe Management", to: "/savings/cash-safe" },
      { name: "savings-products", label: "Products", to: "/savings/products" },
      { name: "savings-products-create", label: "Add Product", to: "/savings/products/create" },
      { name: "savings-products-create-susu", label: "Add SUSU Product", to: "/savings/products/create-susu" },
      { name: "savings-interest", label: "Interest Rates", to: "/savings/interest" },
    ],
  },
  {
    name: "savings-transactions",
    label: "Savings Transactions",
    to: "/savings-transactions",
    icon: ArrowPathIcon,
    hasDropdown: true,
    dropdownItems: [
      { name: "savings-transactions-list", label: "Transactions", to: "/savings-transactions" },
      {
        name: "savings-transactions-bulk-add",
        label: "Add Bulk Transactions",
        to: "/savings-transactions/bulk-add",
      },
      {
        name: "savings-transactions-upload-csv",
        label: "Upload from CSV",
        to: "/savings-transactions/upload-csv",
      },
      {
        name: "savings-transactions-staff-report",
        label: "Staff Transactions Report",
        to: "/savings-transactions/staff-report",
      },
      {
        name: "savings-transactions-approve",
        label: "Approve Transactions",
        to: "/savings-transactions/approve",
      },
      {
        name: "savings-transactions-deposits",
        label: "Deposits",
        to: "/savings-transactions/deposits",
      },
      {
        name: "savings-transactions-withdrawals",
        label: "Withdrawals",
        to: "/savings-transactions/withdrawals",
      },
      {
        name: "savings-transactions-transfers",
        label: "Transfers",
        to: "/savings-transactions/transfers",
      },
    ],
  },
  {
    name: "investors",
    label: "Investors",
    to: "/investors",
    icon: UserGroupIcon,
    hasDropdown: true,
    dropdownItems: [
      { name: "investors-list", label: "Investor List", to: "/investors" },
      { name: "investors-create", label: "Add Investor", to: "/investors/create" },
      { name: "investors-kyc", label: "KYC Verification", to: "/investors/kyc" },
      { name: "investors-documents", label: "Documents", to: "/investors/documents" },
    ],
  },
  {
    name: "investor-accounts",
    label: "Investor Accounts",
    to: "/investor-accounts",
    icon: BuildingLibraryIcon,
    hasDropdown: true,
    dropdownItems: [
      { name: "investor-accounts-list", label: "View All Accounts", to: "/investor-accounts" },
      { name: "investor-accounts-create", label: "Open Account", to: "/investor-accounts/create" },
      { name: "investor-accounts-create-product", label: "Create Product", to: "/investor-accounts/create-product" },
      { name: "investor-products", label: "Products", to: "/investor-accounts/products" },
      { name: "loan-investments", label: "Loan Investments", to: "/investor-accounts/loan-investments" },
      { name: "investor-transactions", label: "Transactions", to: "/investor-accounts/transactions" },
      { name: "approve-investments", label: "Approve Investments", to: "/investor-accounts/approve-investments" },
      {
        name: "investor-accounts-investments",
        label: "Investments",
        to: "/investor-accounts/investments",
      },
      { name: "investor-accounts-returns", label: "Returns", to: "/investor-accounts/returns" },
    ],
  },
  {
    name: "e-signatures",
    label: "E-Signatures",
    to: "/e-signatures",
    icon: DocumentArrowDownIcon,
    hasDropdown: true,
    dropdownItems: [
      { name: "e-signatures-list", label: "Signature Requests", to: "/e-signatures" },
      { name: "e-signatures-create", label: "Create Request", to: "/e-signatures/create" },
      { name: "e-signatures-templates", label: "Templates", to: "/e-signatures/templates" },
      { name: "e-signatures-history", label: "History", to: "/e-signatures/history" },
    ],
  },
  {
    name: "payroll",
    label: "Payroll",
    to: "/payroll",
    icon: CurrencyDollarIcon,
    hasDropdown: true,
    dropdownItems: [
      { name: "payroll-list", label: "Payroll List", to: "/payroll" },
      { name: "payroll-create", label: "Process Payroll", to: "/payroll/create" },
      { name: "payroll-employees", label: "Employees", to: "/payroll/employees" },
      { name: "payroll-report", label: "Payroll Reports", to: "/payroll/report" },
    ],
  },
  {
    name: "expenses",
    label: "Expenses",
    to: "/expenses",
    icon: ArrowTrendingDownIcon,
    hasDropdown: true,
    dropdownItems: [
      { name: "expenses-list", label: "Expense List", to: "/expenses" },
      { name: "expenses-create", label: "Add Expense", to: "/expenses/create" },
      { name: "expenses-categories", label: "Categories", to: "/expenses/categories" },
      { name: "expenses-approvals", label: "Approvals", to: "/expenses/approvals" },
    ],
  },
  {
    name: "other-income",
    label: "Other Income",
    to: "/other-income",
    icon: ArrowTrendingUpIcon,
    hasDropdown: true,
    dropdownItems: [
      { name: "other-income-list", label: "Income List", to: "/other-income" },
      { name: "other-income-create", label: "Add Income", to: "/other-income/create" },
      { name: "other-income-categories", label: "Categories", to: "/other-income/categories" },
      { name: "other-income-reports", label: "Income Reports", to: "/other-income/reports" },
    ],
  },
  {
    name: "asset-management",
    label: "Asset Management",
    to: "/asset-management",
    icon: BuildingOfficeIcon,
    hasDropdown: true,
    dropdownItems: [
      { name: "asset-management-list", label: "Assets", to: "/asset-management" },
      { name: "asset-management-create", label: "Add Asset", to: "/asset-management/create" },
      {
        name: "asset-management-depreciation",
        label: "Depreciation",
        to: "/asset-management/depreciation",
      },
      {
        name: "asset-management-maintenance",
        label: "Maintenance",
        to: "/asset-management/maintenance",
      },
    ],
  },
  {
    name: "reports",
    label: "Reports",
    to: "/reports",
    icon: ChartBarIcon,
    hasDropdown: true,
    dropdownItems: [
      { name: "reports-overview", label: "Overview", to: "/reports" },
      { name: "reports-loans", label: "Loan Reports", to: "/reports/loans" },
      { name: "reports-repayments", label: "Repayment Reports", to: "/reports/repayments" },
      { name: "reports-borrowers", label: "Borrower Reports", to: "/reports/borrowers" },
      { name: "reports-savings", label: "Savings Reports", to: "/reports/savings" },
      { name: "reports-investors", label: "Investor Reports", to: "/reports/investors" },
      { name: "reports-financial", label: "Financial Reports", to: "/reports/financial" },
    ],
  },
  {
    name: "accounting",
    label: "Accounting",
    to: "/accounting",
    icon: CalculatorIcon,
    hasDropdown: true,
    dropdownItems: [
      { name: "accounting-general-ledger", label: "General Ledger", to: "/accounting/ledger" },
      { name: "accounting-journal", label: "Journal Entries", to: "/accounting/journal" },
      { name: "accounting-chart-accounts", label: "Chart of Accounts", to: "/accounting/chart" },
      { name: "accounting-trial-balance", label: "Trial Balance", to: "/accounting/trial-balance" },
      {
        name: "accounting-financial-statements",
        label: "Financial Statements",
        to: "/accounting/statements",
      },
    ],
  },
  {
    name: "settings",
    label: "System Settings",
    to: "/settings",
    icon: Cog6ToothIcon,
    hasDropdown: true,
    dropdownItems: [
      { name: "settings-general", label: "General Settings", to: "/settings/general" },
      { name: "settings-loans", label: "Loan Settings", to: "/settings/loans" },
      { name: "settings-users", label: "User Management", to: "/settings/users" },
      { name: "settings-roles", label: "Role Management", to: "/settings/roles" },
      { name: "settings-branches", label: "Branch Management", to: "/settings/branches" },
      { name: "settings-notifications", label: "Notifications", to: "/settings/notifications" },
    ],
  },
];

const currentPageTitle = computed(() => {
  const item = navigationItems.find((nav) => nav.name === route.name);
  return item?.label || "Dashboard";
});

const userInitials = computed(() => {
  const user = authStore.user;
  if (!user) return "U";
  return `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`.toUpperCase();
});

const logout = async () => {
  await authStore.logout();
  router.push("/auth/login");
};

// Active state functions
const isRouteActive = (path: string) => {
  return route.path === path;
};

const isDropdownRouteActive = (item: any) => {
  return item.dropdownItems.some((dropdownItem: any) => route.path === dropdownItem.to);
};

// Close inactive dropdowns when routes change
watch(
  () => route.path,
  (newPath) => {
    navigationItems.forEach((item) => {
      if (item.hasDropdown && item.dropdownItems) {
        const isActive = item.dropdownItems.some(
          (dropdownItem: any) => newPath === dropdownItem.to,
        );
        if (!isActive && openDropdowns.value.has(item.name)) {
          openDropdowns.value.delete(item.name);
        }
      }
    });
  },
);

// Auto-open dropdowns for active routes
onMounted(() => {
  navigationItems.forEach((item) => {
    if (item.hasDropdown && isDropdownRouteActive(item)) {
      openDropdowns.value.add(item.name);
    }
  });
});

// Handle window resize for responsive sidebar
const handleResize = () => {
  if (window.innerWidth >= 1024) {
    sidebarOpen.value = true; // Always show sidebar on large screens
  } else {
    sidebarOpen.value = false; // Hide sidebar on small screens
  }
};

// Close user menu when clicking outside
const handleClickOutside = (event: Event) => {
  const target = event.target as HTMLElement;
  if (!target.closest(".relative")) {
    userMenuOpen.value = false;
  }
};

onMounted(() => {
  document.addEventListener("click", handleClickOutside);

  // Handle window resize for responsive sidebar
  window.addEventListener("resize", handleResize);
  handleResize(); // Set initial state
});

onUnmounted(() => {
  document.removeEventListener("click", handleClickOutside);
  window.removeEventListener("resize", handleResize);
});
</script>
