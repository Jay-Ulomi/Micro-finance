<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div class="flex items-center space-x-4">
        <button
          @click="$router.go(-1)"
          class="p-2 text-neutral-500 hover:text-neutral-700 hover:bg-neutral-100 rounded-lg transition-colors"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>
        <div>
          <h1 class="text-2xl font-bold text-neutral-900">{{ group?.name || "Group Details" }}</h1>
          <p class="text-sm text-neutral-600 mt-1">View and manage group information</p>
        </div>
      </div>
      <div class="flex space-x-3">
        <button @click="editGroup" class="btn-secondary">
          <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
            />
          </svg>
          Edit Group
        </button>
        <button @click="manageMembers" class="btn-primary">
          <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
            />
          </svg>
          Manage Members
        </button>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="isLoading" class="flex justify-center py-12">
      <div
        class="w-8 h-8 border-2 border-primary-300 border-t-primary-600 rounded-full animate-spin"
      ></div>
    </div>

    <!-- Group Not Found -->
    <div v-else-if="!group" class="card">
      <div class="card-body">
        <div class="text-center py-12">
          <div
            class="mx-auto w-16 h-16 bg-danger-100 rounded-full flex items-center justify-center mb-4"
          >
            <svg
              class="w-8 h-8 text-danger-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
          </div>
          <h3 class="text-lg font-semibold text-neutral-900 mb-2">Group Not Found</h3>
          <p class="text-neutral-600 mb-6">
            The group you're looking for doesn't exist or has been deleted.
          </p>
          <router-link to="/borrowers/groups" class="btn-primary"> Back to Groups </router-link>
        </div>
      </div>
    </div>

    <!-- Group Details -->
    <div v-else class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Main Content -->
      <div class="lg:col-span-2 space-y-6">
        <!-- Group Overview -->
        <div class="card">
          <div class="card-header">
            <h3 class="text-lg font-semibold text-neutral-900">Group Overview</h3>
          </div>
          <div class="card-body">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label class="form-label">Group Name</label>
                <p class="text-lg font-medium text-neutral-900">{{ group.name }}</p>
              </div>
              <div>
                <label class="form-label">Status</label>
                <div class="flex items-center space-x-2">
                  <span
                    :class="[
                      'px-3 py-1 text-sm font-medium rounded-full',
                      group.status === 'active'
                        ? 'bg-success-100 text-success-800'
                        : group.status === 'inactive'
                          ? 'bg-neutral-100 text-neutral-800'
                          : 'bg-warning-100 text-warning-800',
                    ]"
                  >
                    {{ group.status }}
                  </span>
                </div>
              </div>
              <div>
                <label class="form-label">Created Date</label>
                <p class="text-neutral-900">{{ formatDate(group.createdAt) }}</p>
              </div>
              <div>
                <label class="form-label">Last Updated</label>
                <p class="text-neutral-900">{{ formatDate(group.updatedAt) }}</p>
              </div>
            </div>
            <div v-if="group.description" class="mt-6">
              <label class="form-label">Description</label>
              <p class="text-neutral-700 leading-relaxed">{{ group.description }}</p>
            </div>
          </div>
        </div>

        <!-- Group Statistics -->
        <div class="card">
          <div class="card-header">
            <h3 class="text-lg font-semibold text-neutral-900">Group Statistics</h3>
          </div>
          <div class="card-body">
            <div class="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div class="text-center p-4 bg-primary-50 rounded-lg">
                <p class="text-3xl font-bold text-primary-600">{{ group.memberCount }}</p>
                <p class="text-sm text-primary-600 mt-1">Total Members</p>
              </div>
              <div class="text-center p-4 bg-success-50 rounded-lg">
                <p class="text-3xl font-bold text-success-600">{{ group.activeLoans }}</p>
                <p class="text-sm text-success-600 mt-1">Active Loans</p>
              </div>
              <div class="text-center p-4 bg-warning-50 rounded-lg">
                <p class="text-3xl font-bold text-warning-600">{{ group.totalLoanAmount }}</p>
                <p class="text-sm text-warning-600 mt-1">Total Loan Amount</p>
              </div>
              <div class="text-center p-4 bg-neutral-50 rounded-lg">
                <p class="text-3xl font-bold text-neutral-600">{{ group.avgCreditScore }}</p>
                <p class="text-sm text-neutral-600 mt-1">Avg Credit Score</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Group Members -->
        <div class="card">
          <div class="card-header">
            <div class="flex items-center justify-between">
              <h3 class="text-lg font-semibold text-neutral-900">
                Group Members ({{ group.memberCount }})
              </h3>
              <button @click="manageMembers" class="btn-secondary text-sm">
                <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                  />
                </svg>
                Manage
              </button>
            </div>
          </div>
          <div class="card-body">
            <div v-if="members.length === 0" class="text-center py-8">
              <svg
                class="mx-auto w-12 h-12 text-neutral-400 mb-3"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
              <p class="text-neutral-500">No members found</p>
            </div>
            <div v-else class="space-y-3">
              <div
                v-for="member in members"
                :key="member.id"
                class="flex items-center justify-between p-3 border border-neutral-200 rounded-lg hover:bg-neutral-50"
              >
                <div class="flex items-center space-x-3">
                  <div
                    class="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center"
                  >
                    <span class="text-primary-600 font-semibold text-sm">
                      {{ member.firstName.charAt(0) }}{{ member.lastName.charAt(0) }}
                    </span>
                  </div>
                  <div>
                    <p class="font-medium text-neutral-900">
                      {{ member.firstName }} {{ member.lastName }}
                      <span
                        v-if="member.id === group.leaderId"
                        class="ml-2 px-2 py-1 text-xs bg-primary-100 text-primary-800 rounded-full"
                      >
                        Leader
                      </span>
                    </p>
                    <p class="text-sm text-neutral-500">
                      {{ member.email }} • {{ member.uniqueNumber }}
                    </p>
                  </div>
                </div>
                <div class="text-right">
                  <p class="text-sm font-medium text-neutral-900">{{ member.creditScore }}</p>
                  <p class="text-xs text-neutral-500">Credit Score</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Group Loans -->
        <div class="card">
          <div class="card-header">
            <h3 class="text-lg font-semibold text-neutral-900">Group Loans</h3>
          </div>
          <div class="card-body">
            <div v-if="groupLoans.length === 0" class="text-center py-8">
              <svg
                class="mx-auto w-12 h-12 text-neutral-400 mb-3"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
                />
              </svg>
              <p class="text-neutral-500">No loans found for this group</p>
            </div>
            <div v-else class="space-y-3">
              <div
                v-for="loan in groupLoans"
                :key="loan.id"
                class="flex items-center justify-between p-3 border border-neutral-200 rounded-lg hover:bg-neutral-50"
              >
                <div>
                  <p class="font-medium text-neutral-900">{{ loan.loanNumber }}</p>
                  <p class="text-sm text-neutral-500">
                    {{ loan.borrowerName }} • {{ loan.loanType }}
                  </p>
                </div>
                <div class="text-right">
                  <p class="font-medium text-neutral-900">{{ formatCurrency(loan.amount) }}</p>
                  <span
                    :class="[
                      'px-2 py-1 text-xs font-medium rounded-full',
                      loan.status === 'active'
                        ? 'bg-success-100 text-success-800'
                        : loan.status === 'pending'
                          ? 'bg-warning-100 text-warning-800'
                          : 'bg-neutral-100 text-neutral-800',
                    ]"
                  >
                    {{ loan.status }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Sidebar -->
      <div class="space-y-6">
        <!-- Group Information -->
        <div class="card">
          <div class="card-header">
            <h3 class="text-lg font-semibold text-neutral-900">Group Information</h3>
          </div>
          <div class="card-body space-y-4">
            <div>
              <label class="form-label">Group Leader</label>
              <p class="text-neutral-900">{{ group.leaderName || "Not assigned" }}</p>
            </div>
            <div>
              <label class="form-label">Loan Officer</label>
              <p class="text-neutral-900">{{ group.loanOfficer || "Not assigned" }}</p>
            </div>
            <div>
              <label class="form-label">Collector</label>
              <p class="text-neutral-900">{{ group.collectorName || "Not assigned" }}</p>
            </div>
            <div v-if="group.meetingSchedule">
              <label class="form-label">Meeting Schedule</label>
              <p class="text-neutral-900">{{ group.meetingSchedule }}</p>
            </div>
          </div>
        </div>

        <!-- Quick Actions -->
        <div class="card">
          <div class="card-header">
            <h3 class="text-lg font-semibold text-neutral-900">Quick Actions</h3>
          </div>
          <div class="card-body space-y-3">
            <button @click="manageMembers" class="w-full btn-secondary text-sm">
              <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
              Manage Members
            </button>
            <button @click="createGroupLoan" class="w-full btn-primary text-sm">
              <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
                />
              </svg>
              Create Group Loan
            </button>
            <button @click="viewGroupReports" class="w-full btn-secondary text-sm">
              <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                />
              </svg>
              View Reports
            </button>
          </div>
        </div>

        <!-- Group Activity -->
        <div class="card">
          <div class="card-header">
            <h3 class="text-lg font-semibold text-neutral-900">Recent Activity</h3>
          </div>
          <div class="card-body">
            <div class="space-y-3">
              <div
                v-for="activity in recentActivity"
                :key="activity.id"
                class="flex items-start space-x-3"
              >
                <div class="w-2 h-2 bg-primary-500 rounded-full mt-2 flex-shrink-0"></div>
                <div class="flex-1 min-w-0">
                  <p class="text-sm text-neutral-900">{{ activity.description }}</p>
                  <p class="text-xs text-neutral-500">{{ formatDate(activity.date) }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import { groupsData, groupMembersData, groupLoansData, groupActivitiesData } from "@/data";

// Types
interface Group {
  id: string;
  name: string;
  status: "active" | "inactive" | "pending";
  memberCount: number;
  activeLoans: number;
  totalLoanAmount: number;
  avgCreditScore: number;
  leaderId?: string;
  leaderName?: string;
  loanOfficer?: string;
  collectorName?: string;
  meetingSchedule?: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

interface Member {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  uniqueNumber: string;
  creditScore: number;
}

interface GroupLoan {
  id: string;
  loanNumber: string;
  borrowerName: string;
  loanType: string;
  amount: number;
  status: string;
}

interface Activity {
  id: string;
  description: string;
  date: string;
}

// Reactive data
const router = useRouter();
const route = useRoute();
const isLoading = ref(false);
const group = ref<Group | null>(null);
const members = ref<Member[]>([]);
const groupLoans = ref<GroupLoan[]>([]);
const recentActivity = ref<Activity[]>([]);

// Methods
const loadGroupDetails = async () => {
  isLoading.value = true;
  try {
    const groupId = route.params.id as string;

    // In a real app, this would be an API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Find group from JSON data
    const foundGroup = groupsData.find((g) => g.id === groupId);
    if (foundGroup) {
      group.value = foundGroup;
    }

    // Load members for this group
    const groupMembers = groupMembersData.filter((member) => member.groupId === groupId);
    members.value = groupMembers.map((member) => ({
      id: member.id,
      firstName: member.firstName,
      lastName: member.lastName,
      email: member.email,
      uniqueNumber: member.uniqueNumber,
      creditScore: member.creditScore,
    }));

    // Load group loans
    const groupLoansList = groupLoansData.filter((loan) => loan.groupId === groupId);
    groupLoans.value = groupLoansList.map((loan) => ({
      id: loan.id,
      loanNumber: loan.loanNumber,
      borrowerName: loan.borrowerName,
      loanType: loan.loanType,
      amount: loan.amount,
      status: loan.status,
    }));

    // Load recent activity
    const groupActivities = groupActivitiesData
      .filter((activity) => activity.groupId === groupId)
      .slice(0, 3); // Get latest 3 activities
    recentActivity.value = groupActivities.map((activity) => ({
      id: activity.id,
      description: activity.description,
      date: activity.date,
    }));
  } catch (error) {
    console.error("Error loading group details:", error);
  } finally {
    isLoading.value = false;
  }
};

const editGroup = () => {
  router.push(`/borrowers/groups/${route.params.id}/edit`);
};

const manageMembers = () => {
  router.push(`/borrowers/groups/${route.params.id}/members`);
};

const createGroupLoan = () => {
  // Navigate to create group loan page
  router.push(`/loans/create?groupId=${route.params.id}`);
};

const viewGroupReports = () => {
  // Navigate to group reports page
  router.push(`/reports/groups/${route.params.id}`);
};

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("en-TZ", {
    style: "currency",
    currency: "TZS",
  }).format(amount);
};

// Lifecycle
onMounted(() => {
  loadGroupDetails();
});
</script>
