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
          <h1 class="text-2xl font-bold text-neutral-900">Manage Members</h1>
          <p class="text-sm text-neutral-600 mt-1">{{ group?.name || "Group Members" }}</p>
        </div>
      </div>
      <div class="flex space-x-3">
        <button @click="showAddMemberModal = true" class="btn-primary">
          <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 6v6m0 0v6m0-6h6m-6 0H6"
            />
          </svg>
          Add Members
        </button>
        <button @click="saveChanges" :disabled="!hasChanges || isSubmitting" class="btn-secondary">
          <svg
            v-if="isSubmitting"
            class="w-4 h-4 mr-2 animate-spin"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              class="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              stroke-width="4"
            ></circle>
            <path
              class="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          {{ isSubmitting ? "Saving..." : "Save Changes" }}
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
            The group you're trying to manage doesn't exist or has been deleted.
          </p>
          <router-link to="/borrowers/groups" class="btn-primary"> Back to Groups </router-link>
        </div>
      </div>
    </div>

    <!-- Members Management -->
    <div v-else class="grid grid-cols-1 lg:grid-cols-4 gap-6">
      <!-- Main Content -->
      <div class="lg:col-span-3 space-y-6">
        <!-- Search and Filters -->
        <div class="card">
          <div class="card-body">
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
              <!-- Search -->
              <div class="md:col-span-2">
                <div class="relative">
                  <input
                    v-model="searchQuery"
                    type="text"
                    class="form-input pl-10"
                    placeholder="Search members by name, email, or ID..."
                    @input="filterMembers"
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

              <!-- Status Filter -->
              <div>
                <select v-model="selectedStatus" @change="filterMembers" class="form-input">
                  <option value="">All Members</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="pending">Pending</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        <!-- Members List -->
        <div class="card">
          <div class="card-header">
            <div class="flex items-center justify-between">
              <h3 class="text-lg font-semibold text-neutral-900">
                Group Members ({{ filteredMembers.length }})
              </h3>
              <div class="flex items-center space-x-2">
                <button
                  v-if="selectedMembers.length > 0"
                  @click="removeSelectedMembers"
                  class="btn-danger text-sm"
                >
                  <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                  Remove Selected ({{ selectedMembers.length }})
                </button>
                <button @click="selectAllMembers" class="btn-secondary text-sm">
                  {{ allMembersSelected ? "Deselect All" : "Select All" }}
                </button>
              </div>
            </div>
          </div>
          <div class="card-body">
            <div v-if="filteredMembers.length === 0" class="text-center py-8">
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
              <p class="text-neutral-500">
                {{
                  searchQuery || selectedStatus
                    ? "No members found matching your criteria."
                    : "No members in this group yet."
                }}
              </p>
            </div>
            <div v-else class="space-y-3">
              <div
                v-for="member in filteredMembers"
                :key="member.id"
                class="flex items-center justify-between p-4 border border-neutral-200 rounded-lg hover:bg-neutral-50"
              >
                <div class="flex items-center space-x-3">
                  <input
                    :id="`member-${member.id}`"
                    v-model="selectedMembers"
                    :value="member.id"
                    type="checkbox"
                    class="w-4 h-4 text-primary-600 border-neutral-300 rounded focus:ring-primary-500"
                  />
                  <div
                    class="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center"
                  >
                    <span class="text-primary-600 font-semibold text-sm">
                      {{ member.firstName.charAt(0) }}{{ member.lastName.charAt(0) }}
                    </span>
                  </div>
                  <div>
                    <div class="flex items-center space-x-2">
                      <p class="font-medium text-neutral-900">
                        {{ member.firstName }} {{ member.lastName }}
                      </p>
                      <span
                        v-if="member.id === group.leaderId"
                        class="px-2 py-1 text-xs bg-primary-100 text-primary-800 rounded-full"
                      >
                        Leader
                      </span>
                      <span
                        :class="[
                          'px-2 py-1 text-xs rounded-full',
                          member.status === 'active'
                            ? 'bg-success-100 text-success-800'
                            : member.status === 'inactive'
                              ? 'bg-neutral-100 text-neutral-800'
                              : 'bg-warning-100 text-warning-800',
                        ]"
                      >
                        {{ member.status }}
                      </span>
                    </div>
                    <p class="text-sm text-neutral-500">
                      {{ member.email }} • {{ member.uniqueNumber }}
                    </p>
                  </div>
                </div>
                <div class="flex items-center space-x-3">
                  <div class="text-right">
                    <p class="text-sm font-medium text-neutral-900">{{ member.creditScore }}</p>
                    <p class="text-xs text-neutral-500">Credit Score</p>
                  </div>
                  <div class="relative">
                    <button
                      @click="toggleMemberMenu(member.id)"
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

                    <!-- Member Menu -->
                    <div
                      v-if="openMenuId === member.id"
                      class="absolute right-0 top-8 w-48 bg-white rounded-lg shadow-lg border border-neutral-200 z-10"
                    >
                      <div class="py-1">
                        <button
                          v-if="member.id !== group.leaderId"
                          @click="setAsLeader(member.id)"
                          class="w-full px-4 py-2 text-left text-sm text-neutral-700 hover:bg-neutral-50 flex items-center"
                        >
                          <svg
                            class="w-4 h-4 mr-2"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              stroke-linecap="round"
                              stroke-linejoin="round"
                              stroke-width="2"
                              d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
                            />
                          </svg>
                          Set as Leader
                        </button>
                        <button
                          @click="viewMemberDetails(member.id)"
                          class="w-full px-4 py-2 text-left text-sm text-neutral-700 hover:bg-neutral-50 flex items-center"
                        >
                          <svg
                            class="w-4 h-4 mr-2"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
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
                        <div class="border-t border-neutral-200 my-1"></div>
                        <button
                          @click="removeMember(member.id)"
                          class="w-full px-4 py-2 text-left text-sm text-danger-600 hover:bg-danger-50 flex items-center"
                        >
                          <svg
                            class="w-4 h-4 mr-2"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              stroke-linecap="round"
                              stroke-linejoin="round"
                              stroke-width="2"
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                            />
                          </svg>
                          Remove from Group
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Sidebar -->
      <div class="space-y-6">
        <!-- Group Summary -->
        <div class="card">
          <div class="card-header">
            <h3 class="text-lg font-semibold text-neutral-900">Group Summary</h3>
          </div>
          <div class="card-body space-y-4">
            <div class="flex items-center justify-between">
              <span class="text-sm text-neutral-600">Total Members:</span>
              <span class="text-sm font-medium text-neutral-900">{{ members.length }}</span>
            </div>
            <div class="flex items-center justify-between">
              <span class="text-sm text-neutral-600">Active Members:</span>
              <span class="text-sm font-medium text-neutral-900">{{ activeMembersCount }}</span>
            </div>
            <div class="flex items-center justify-between">
              <span class="text-sm text-neutral-600">Selected:</span>
              <span class="text-sm font-medium text-neutral-900">{{ selectedMembers.length }}</span>
            </div>
            <div class="flex items-center justify-between">
              <span class="text-sm text-neutral-600">Group Leader:</span>
              <span class="text-sm font-medium text-neutral-900">{{ groupLeaderName }}</span>
            </div>
          </div>
        </div>

        <!-- Quick Actions -->
        <div class="card">
          <div class="card-header">
            <h3 class="text-lg font-semibold text-neutral-900">Quick Actions</h3>
          </div>
          <div class="card-body space-y-3">
            <button @click="showAddMemberModal = true" class="w-full btn-primary text-sm">
              <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                />
              </svg>
              Add Members
            </button>
            <button @click="exportMembers" class="w-full btn-secondary text-sm">
              <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              Export Members
            </button>
            <button @click="sendGroupMessage" class="w-full btn-secondary text-sm">
              <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                />
              </svg>
              Send Message
            </button>
          </div>
        </div>

        <!-- Recent Changes -->
        <div class="card">
          <div class="card-header">
            <h3 class="text-lg font-semibold text-neutral-900">Recent Changes</h3>
          </div>
          <div class="card-body">
            <div class="space-y-3">
              <div
                v-for="change in recentChanges"
                :key="change.id"
                class="flex items-start space-x-3"
              >
                <div class="w-2 h-2 bg-primary-500 rounded-full mt-2 flex-shrink-0"></div>
                <div class="flex-1 min-w-0">
                  <p class="text-sm text-neutral-900">{{ change.description }}</p>
                  <p class="text-xs text-neutral-500">{{ formatDate(change.date) }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Add Members Modal -->
    <div
      v-if="showAddMemberModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      @click.self="showAddMemberModal = false"
    >
      <div class="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div class="p-6">
          <div class="flex items-center justify-between mb-6">
            <h3 class="text-lg font-semibold text-neutral-900">Add Members to Group</h3>
            <button
              @click="showAddMemberModal = false"
              class="p-2 text-neutral-400 hover:text-neutral-600 rounded-lg hover:bg-neutral-100"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          <!-- Search Available Borrowers -->
          <div class="mb-6">
            <div class="relative">
              <input
                v-model="availableBorrowerSearch"
                type="text"
                class="form-input pl-10"
                placeholder="Search available borrowers..."
                @input="filterAvailableBorrowers"
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

          <!-- Available Borrowers List -->
          <div class="max-h-96 overflow-y-auto border border-neutral-200 rounded-lg">
            <div
              v-for="borrower in filteredAvailableBorrowers"
              :key="borrower.id"
              class="flex items-center justify-between p-3 border-b border-neutral-100 last:border-b-0 hover:bg-neutral-50"
            >
              <div class="flex items-center space-x-3">
                <input
                  :id="`available-${borrower.id}`"
                  v-model="selectedAvailableBorrowers"
                  :value="borrower.id"
                  type="checkbox"
                  class="w-4 h-4 text-primary-600 border-neutral-300 rounded focus:ring-primary-500"
                />
                <div>
                  <p class="font-medium text-neutral-900">
                    {{ borrower.firstName }} {{ borrower.lastName }}
                  </p>
                  <p class="text-sm text-neutral-500">
                    {{ borrower.uniqueNumber }} - {{ borrower.email }}
                  </p>
                </div>
              </div>
              <div class="text-right">
                <p class="text-sm font-medium text-neutral-900">{{ borrower.creditScore }}</p>
                <p class="text-xs text-neutral-500">Credit Score</p>
              </div>
            </div>
            <div
              v-if="filteredAvailableBorrowers.length === 0"
              class="p-6 text-center text-neutral-500"
            >
              No available borrowers found.
            </div>
          </div>

          <!-- Modal Actions -->
          <div class="flex justify-end space-x-3 mt-6">
            <button @click="showAddMemberModal = false" class="btn-secondary">Cancel</button>
            <button
              @click="addSelectedMembers"
              :disabled="selectedAvailableBorrowers.length === 0"
              class="btn-primary"
            >
              Add {{ selectedAvailableBorrowers.length }} Member(s)
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import { groupsData, groupMembersData, groupActivitiesData } from "@/data";

// Types
interface Group {
  id: string;
  name: string;
  leaderId?: string;
}

interface Member {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  uniqueNumber: string;
  creditScore: number;
  status: "active" | "inactive" | "pending";
}

interface AvailableBorrower {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  uniqueNumber: string;
  creditScore: number;
}

interface Change {
  id: string;
  description: string;
  date: string;
}

// Reactive data
const router = useRouter();
const route = useRoute();
const isLoading = ref(false);
const isSubmitting = ref(false);
const group = ref<Group | null>(null);
const members = ref<Member[]>([]);
const availableBorrowers = ref<AvailableBorrower[]>([]);
const filteredAvailableBorrowers = ref<AvailableBorrower[]>([]);
const recentChanges = ref<Change[]>([]);

const searchQuery = ref("");
const selectedStatus = ref("");
const selectedMembers = ref<string[]>([]);
const selectedAvailableBorrowers = ref<string[]>([]);
const availableBorrowerSearch = ref("");
const openMenuId = ref<string | null>(null);
const showAddMemberModal = ref(false);

// Computed properties
const filteredMembers = computed(() => {
  let filtered = members.value;

  // Search filter
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    filtered = filtered.filter(
      (member) =>
        member.firstName.toLowerCase().includes(query) ||
        member.lastName.toLowerCase().includes(query) ||
        member.email.toLowerCase().includes(query) ||
        member.uniqueNumber.toLowerCase().includes(query),
    );
  }

  // Status filter
  if (selectedStatus.value) {
    filtered = filtered.filter((member) => member.status === selectedStatus.value);
  }

  return filtered;
});

const activeMembersCount = computed(() => {
  return members.value.filter((member) => member.status === "active").length;
});

const groupLeaderName = computed(() => {
  if (!group.value?.leaderId) return "Not assigned";
  const leader = members.value.find((member) => member.id === group.value?.leaderId);
  return leader ? `${leader.firstName} ${leader.lastName}` : "Not found";
});

const allMembersSelected = computed(() => {
  return (
    filteredMembers.value.length > 0 &&
    filteredMembers.value.every((member) => selectedMembers.value.includes(member.id))
  );
});

const hasChanges = computed(() => {
  return selectedMembers.value.length > 0 || selectedAvailableBorrowers.value.length > 0;
});

// Methods
const loadGroupData = async () => {
  isLoading.value = true;
  try {
    const groupId = route.params.id as string;

    // In a real app, this would be an API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Find group from JSON data
    const foundGroup = groupsData.find((g) => g.id === groupId);
    if (foundGroup) {
      group.value = {
        id: foundGroup.id,
        name: foundGroup.name,
        leaderId: foundGroup.leaderId,
      };
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
      status: member.status,
    }));

    // Load available borrowers (not in any group)
    const availableBorrowersList = groupMembersData.filter((member) => !member.groupId);
    availableBorrowers.value = availableBorrowersList.map((member) => ({
      id: member.id,
      firstName: member.firstName,
      lastName: member.lastName,
      email: member.email,
      uniqueNumber: member.uniqueNumber,
      creditScore: member.creditScore,
    }));
    filteredAvailableBorrowers.value = availableBorrowers.value;

    // Load recent changes for this group
    const groupActivities = groupActivitiesData
      .filter((activity) => activity.groupId === groupId)
      .slice(0, 5); // Get latest 5 activities
    recentChanges.value = groupActivities.map((activity) => ({
      id: activity.id,
      description: activity.description,
      date: activity.date,
    }));
  } catch (error) {
    console.error("Error loading group data:", error);
  } finally {
    isLoading.value = false;
  }
};

const filterMembers = () => {
  // Filtering is handled by computed property
};

const filterAvailableBorrowers = () => {
  const search = availableBorrowerSearch.value.toLowerCase();
  filteredAvailableBorrowers.value = availableBorrowers.value.filter(
    (borrower) =>
      borrower.firstName.toLowerCase().includes(search) ||
      borrower.lastName.toLowerCase().includes(search) ||
      borrower.email.toLowerCase().includes(search) ||
      borrower.uniqueNumber.toLowerCase().includes(search),
  );
};

const selectAllMembers = () => {
  if (allMembersSelected.value) {
    selectedMembers.value = [];
  } else {
    selectedMembers.value = filteredMembers.value.map((member) => member.id);
  }
};

const toggleMemberMenu = (memberId: string) => {
  openMenuId.value = openMenuId.value === memberId ? null : memberId;
};

const setAsLeader = (memberId: string) => {
  openMenuId.value = null;
  if (group.value) {
    group.value.leaderId = memberId;
    // In real app, update via API
    console.log("Setting leader:", memberId);
  }
};

const viewMemberDetails = (memberId: string) => {
  openMenuId.value = null;
  router.push(`/borrowers/${memberId}`);
};

const removeMember = async (memberId: string) => {
  openMenuId.value = null;

  if (confirm("Are you sure you want to remove this member from the group?")) {
    try {
      // In real app, API call
      console.log("Removing member:", memberId);

      const index = members.value.findIndex((m) => m.id === memberId);
      if (index > -1) {
        members.value.splice(index, 1);
      }

      // If removed member was leader, clear leader
      if (group.value?.leaderId === memberId) {
        group.value.leaderId = undefined;
      }
    } catch (error) {
      console.error("Error removing member:", error);
      alert("Error removing member. Please try again.");
    }
  }
};

const removeSelectedMembers = async () => {
  if (
    confirm(
      `Are you sure you want to remove ${selectedMembers.value.length} member(s) from the group?`,
    )
  ) {
    try {
      // In real app, API call
      console.log("Removing members:", selectedMembers.value);

      members.value = members.value.filter((member) => !selectedMembers.value.includes(member.id));
      selectedMembers.value = [];
    } catch (error) {
      console.error("Error removing members:", error);
      alert("Error removing members. Please try again.");
    }
  }
};

const addSelectedMembers = async () => {
  try {
    // In real app, API call
    console.log("Adding members:", selectedAvailableBorrowers.value);

    const newMembers = availableBorrowers.value
      .filter((borrower) => selectedAvailableBorrowers.value.includes(borrower.id))
      .map((borrower) => ({
        ...borrower,
        status: "active" as const,
      }));

    members.value.push(...newMembers);

    // Remove from available borrowers
    availableBorrowers.value = availableBorrowers.value.filter(
      (borrower) => !selectedAvailableBorrowers.value.includes(borrower.id),
    );

    selectedAvailableBorrowers.value = [];
    showAddMemberModal.value = false;
  } catch (error) {
    console.error("Error adding members:", error);
    alert("Error adding members. Please try again.");
  }
};

const saveChanges = async () => {
  isSubmitting.value = true;
  try {
    // In real app, save all changes via API
    console.log("Saving changes...");
    await new Promise((resolve) => setTimeout(resolve, 1000));

    alert("Changes saved successfully!");
    selectedMembers.value = [];
  } catch (error) {
    console.error("Error saving changes:", error);
    alert("Error saving changes. Please try again.");
  } finally {
    isSubmitting.value = false;
  }
};

const exportMembers = () => {
  // In real app, generate and download CSV/Excel
  console.log("Exporting members...");
  alert("Members exported successfully!");
};

const sendGroupMessage = () => {
  // In real app, open message composer
  console.log("Sending group message...");
  alert("Message composer opened!");
};

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
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
  loadGroupData();
  document.addEventListener("click", handleClickOutside);
});

// Cleanup
import { onUnmounted } from "vue";
onUnmounted(() => {
  document.removeEventListener("click", handleClickOutside);
});
</script>
