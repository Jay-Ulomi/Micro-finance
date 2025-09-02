<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-neutral-900">Borrower Groups</h1>
        <p class="text-sm text-neutral-600 mt-1">Manage borrower groups and categories</p>
      </div>
      <div class="flex space-x-3">
        <button @click="refreshGroups" :disabled="isLoading" class="btn-secondary">
          <svg
            :class="['w-4 h-4 mr-2', isLoading ? 'animate-spin' : '']"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
            />
          </svg>
          Refresh
        </button>
        <router-link to="/borrowers/groups/create" class="btn-primary">
          <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 6v6m0 0v6m0-6h6m-6 0H6"
            />
          </svg>
          Add Group
        </router-link>
      </div>
    </div>

    <!-- Search and Filters -->
    <div class="card">
      <div class="card-body">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
          <!-- Search -->
          <div class="md:col-span-2">
            <div class="relative">
              <input
                v-model="searchQuery"
                type="text"
                class="form-input pl-10"
                placeholder="Search groups by name, leader, or description..."
                @input="filterGroups"
              />
              <svg
                class="absolute left-3 top-3 w-4 h-4 text-neutral-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
          </div>

          <!-- Loan Officer Filter -->
          <div>
            <select v-model="selectedLoanOfficer" @change="filterGroups" class="form-input">
              <option value="">All Loan Officers</option>
              <option value="Edwin Simon">Edwin Simon</option>
              <option value="Sarah Johnson">Sarah Johnson</option>
              <option value="Michael Brown">Michael Brown</option>
              <option value="Lisa Wilson">Lisa Wilson</option>
            </select>
          </div>

          <!-- Status Filter -->
          <div>
            <select v-model="selectedStatus" @change="filterGroups" class="form-input">
              <option value="">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="pending">Pending</option>
            </select>
          </div>
        </div>
      </div>
    </div>

    <!-- Groups Grid -->
    <div v-if="isLoading" class="flex justify-center py-12">
      <div
        class="w-8 h-8 border-2 border-primary-300 border-t-primary-600 rounded-full animate-spin"
      ></div>
    </div>

    <div v-else-if="filteredGroups.length === 0" class="card">
      <div class="card-body">
        <div class="text-center py-12">
          <div
            class="mx-auto w-16 h-16 bg-neutral-100 rounded-full flex items-center justify-center mb-4"
          >
            <svg
              class="w-8 h-8 text-neutral-400"
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
          </div>
          <h3 class="text-lg font-semibold text-neutral-900 mb-2">
            {{
              searchQuery || selectedLoanOfficer || selectedStatus
                ? "No groups found"
                : "No groups created yet"
            }}
          </h3>
          <p class="text-neutral-600 mb-6">
            {{
              searchQuery || selectedLoanOfficer || selectedStatus
                ? "Try adjusting your search criteria or filters."
                : "Create your first borrower group to get started with group loan management."
            }}
          </p>
          <router-link
            v-if="!searchQuery && !selectedLoanOfficer && !selectedStatus"
            to="/borrowers/groups/create"
            class="btn-primary"
          >
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
              />
            </svg>
            Create First Group
          </router-link>
        </div>
      </div>
    </div>

    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <!-- Group Card -->
      <div
        v-for="group in filteredGroups"
        :key="group.id"
        class="card hover:shadow-lg transition-shadow duration-200"
      >
        <div class="card-body">
          <!-- Group Header -->
          <div class="flex items-start justify-between mb-4">
            <div class="flex-1">
              <h3 class="text-lg font-semibold text-neutral-900 mb-1">
                {{ group.name }}
              </h3>
              <div class="flex items-center space-x-2">
                <span
                  :class="[
                    'px-2 py-1 text-xs font-medium rounded-full',
                    group.status === 'active'
                      ? 'bg-success-100 text-success-800'
                      : group.status === 'inactive'
                        ? 'bg-neutral-100 text-neutral-800'
                        : 'bg-warning-100 text-warning-800',
                  ]"
                >
                  {{ group.status }}
                </span>
                <span class="text-xs text-neutral-500">
                  Created {{ formatDate(group.createdAt) }}
                </span>
              </div>
            </div>
            <div class="relative">
              <button
                @click="toggleGroupMenu(group.id)"
                class="p-1 text-neutral-400 hover:text-neutral-600 rounded-lg hover:bg-neutral-100"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
                  />
                </svg>
              </button>

              <!-- Dropdown Menu -->
              <div
                v-if="openMenuId === group.id"
                class="absolute right-0 top-8 w-48 bg-white rounded-lg shadow-lg border border-neutral-200 z-10"
              >
                <div class="py-1">
                  <button
                    @click="viewGroup(group.id)"
                    class="w-full px-4 py-2 text-left text-sm text-neutral-700 hover:bg-neutral-50 flex items-center"
                  >
                    <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                      />
                    </svg>
                    View Details
                  </button>
                  <button
                    @click="editGroup(group.id)"
                    class="w-full px-4 py-2 text-left text-sm text-neutral-700 hover:bg-neutral-50 flex items-center"
                  >
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
                  <button
                    @click="manageMembers(group.id)"
                    class="w-full px-4 py-2 text-left text-sm text-neutral-700 hover:bg-neutral-50 flex items-center"
                  >
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
                  <div class="border-t border-neutral-200 my-1"></div>
                  <button
                    @click="deleteGroup(group.id)"
                    class="w-full px-4 py-2 text-left text-sm text-danger-600 hover:bg-danger-50 flex items-center"
                  >
                    <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                    Delete Group
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Group Stats -->
          <div class="grid grid-cols-2 gap-4 mb-4">
            <div class="text-center p-3 bg-primary-50 rounded-lg">
              <p class="text-2xl font-bold text-primary-600">{{ group.memberCount }}</p>
              <p class="text-xs text-primary-600">Members</p>
            </div>
            <div class="text-center p-3 bg-success-50 rounded-lg">
              <p class="text-2xl font-bold text-success-600">{{ group.activeLoans }}</p>
              <p class="text-xs text-success-600">Active Loans</p>
            </div>
          </div>

          <!-- Group Details -->
          <div class="space-y-2 text-sm">
            <div class="flex items-center justify-between">
              <span class="text-neutral-500">Group Leader:</span>
              <span class="font-medium text-neutral-900">{{
                group.leaderName || "Not assigned"
              }}</span>
            </div>
            <div class="flex items-center justify-between">
              <span class="text-neutral-500">Loan Officer:</span>
              <span class="font-medium text-neutral-900">{{
                group.loanOfficer || "Not assigned"
              }}</span>
            </div>
            <div class="flex items-center justify-between">
              <span class="text-neutral-500">Collector:</span>
              <span class="font-medium text-neutral-900">{{
                group.collectorName || "Not assigned"
              }}</span>
            </div>
            <div v-if="group.meetingSchedule" class="flex items-center justify-between">
              <span class="text-neutral-500">Meeting:</span>
              <span class="font-medium text-neutral-900">{{ group.meetingSchedule }}</span>
            </div>
          </div>

          <!-- Description -->
          <div v-if="group.description" class="mt-4 pt-4 border-t border-neutral-200">
            <p class="text-sm text-neutral-600 line-clamp-2">{{ group.description }}</p>
          </div>

          <!-- Action Buttons -->
          <div class="mt-4 pt-4 border-t border-neutral-200 flex space-x-2">
            <button @click="viewGroup(group.id)" class="flex-1 btn-secondary text-sm">View</button>
            <button @click="manageMembers(group.id)" class="flex-1 btn-primary text-sm">
              Manage
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Pagination -->
    <div v-if="filteredGroups.length > 0" class="flex items-center justify-between">
      <p class="text-sm text-neutral-600">
        Showing {{ filteredGroups.length }} of {{ groups.length }} groups
      </p>
      <div class="flex space-x-2">
        <button @click="previousPage" :disabled="currentPage === 1" class="btn-secondary text-sm">
          Previous
        </button>
        <button
          @click="nextPage"
          :disabled="currentPage >= totalPages"
          class="btn-secondary text-sm"
        >
          Next
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import { groupsData } from "@/data";

// Types
interface Group {
  id: string;
  name: string;
  status: "active" | "inactive" | "pending";
  memberCount: number;
  activeLoans: number;
  leaderName?: string;
  loanOfficer?: string;
  collectorName?: string;
  meetingSchedule?: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

// Reactive data
const router = useRouter();
const isLoading = ref(false);
const searchQuery = ref("");
const selectedLoanOfficer = ref("");
const selectedStatus = ref("");
const openMenuId = ref<string | null>(null);
const currentPage = ref(1);
const itemsPerPage = 12;

const groups = ref<Group[]>([]);

// Computed properties
const filteredGroups = computed(() => {
  let filtered = groups.value;

  // Search filter
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    filtered = filtered.filter(
      (group) =>
        group.name.toLowerCase().includes(query) ||
        group.leaderName?.toLowerCase().includes(query) ||
        group.description?.toLowerCase().includes(query),
    );
  }

  // Loan officer filter
  if (selectedLoanOfficer.value) {
    filtered = filtered.filter((group) => group.loanOfficer === selectedLoanOfficer.value);
  }

  // Status filter
  if (selectedStatus.value) {
    filtered = filtered.filter((group) => group.status === selectedStatus.value);
  }

  return filtered;
});

const totalPages = computed(() => {
  return Math.ceil(filteredGroups.value.length / itemsPerPage);
});

// Methods
const loadGroups = async () => {
  isLoading.value = true;
  try {
    // In a real app, this would be an API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Load groups from JSON data
    groups.value = groupsData;
  } catch (error) {
    console.error("Error loading groups:", error);
  } finally {
    isLoading.value = false;
  }
};

const filterGroups = () => {
  currentPage.value = 1; // Reset to first page when filtering
};

const refreshGroups = () => {
  loadGroups();
};

const toggleGroupMenu = (groupId: string) => {
  openMenuId.value = openMenuId.value === groupId ? null : groupId;
};

const viewGroup = (groupId: string) => {
  openMenuId.value = null;
  // Navigate to group details page
  router.push(`/borrowers/groups/${groupId}`);
};

const editGroup = (groupId: string) => {
  openMenuId.value = null;
  // Navigate to edit group page
  router.push(`/borrowers/groups/${groupId}/edit`);
};

const manageMembers = (groupId: string) => {
  openMenuId.value = null;
  // Navigate to member management page
  router.push(`/borrowers/groups/${groupId}/members`);
};

const deleteGroup = async (groupId: string) => {
  openMenuId.value = null;

  if (confirm("Are you sure you want to delete this group? This action cannot be undone.")) {
    try {
      // In a real app, this would be an API call
      console.log("Deleting group:", groupId);

      // Remove from local array
      const index = groups.value.findIndex((g) => g.id === groupId);
      if (index > -1) {
        groups.value.splice(index, 1);
      }

      alert("Group deleted successfully!");
    } catch (error) {
      console.error("Error deleting group:", error);
      alert("Error deleting group. Please try again.");
    }
  }
};

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const previousPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--;
  }
};

const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++;
  }
};

// Close menu when clicking outside
const handleClickOutside = (event: Event) => {
  const target = event.target as HTMLElement;
  if (!target.closest(".relative")) {
    openMenuId.value = null;
  }
};

// Lifecycle
onMounted(() => {
  loadGroups();
  document.addEventListener("click", handleClickOutside);
});

// Cleanup
import { onUnmounted } from "vue";
onUnmounted(() => {
  document.removeEventListener("click", handleClickOutside);
});
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
