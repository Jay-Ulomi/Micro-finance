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
          <h1 class="text-2xl font-bold text-neutral-900">Edit Group</h1>
          <p class="text-sm text-neutral-600 mt-1">Update group information and settings</p>
        </div>
      </div>
      <div class="flex space-x-3">
        <button @click="$router.go(-1)" class="btn-secondary">Cancel</button>
        <button @click="saveGroup" :disabled="!isFormValid || isSubmitting" class="btn-primary">
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
          <svg v-else class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M5 13l4 4L19 7"
            />
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
            The group you're trying to edit doesn't exist or has been deleted.
          </p>
          <router-link to="/borrowers/groups" class="btn-primary"> Back to Groups </router-link>
        </div>
      </div>
    </div>

    <!-- Edit Form -->
    <div v-else class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Main Form -->
      <div class="lg:col-span-2 space-y-6">
        <!-- Basic Information -->
        <div class="card">
          <div class="card-header">
            <h3 class="text-lg font-semibold text-neutral-900">Basic Information</h3>
            <p class="text-sm text-neutral-500">Update the basic group details</p>
          </div>
          <div class="card-body space-y-6">
            <!-- Group Name -->
            <div>
              <label class="form-label"> Group Name <span class="text-danger-500">*</span> </label>
              <input
                v-model="form.groupName"
                type="text"
                class="form-input"
                placeholder="Enter group name"
                required
              />
              <p v-if="errors.groupName" class="form-error">{{ errors.groupName }}</p>
            </div>

            <!-- Status -->
            <div>
              <label class="form-label">Status</label>
              <select v-model="form.status" class="form-input">
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="pending">Pending</option>
              </select>
            </div>

            <!-- Description -->
            <div>
              <label class="form-label">Description</label>
              <textarea
                v-model="form.description"
                rows="4"
                class="form-input"
                placeholder="Enter group description..."
              ></textarea>
            </div>
          </div>
        </div>

        <!-- Group Leadership -->
        <div class="card">
          <div class="card-header">
            <h3 class="text-lg font-semibold text-neutral-900">Group Leadership</h3>
            <p class="text-sm text-neutral-500">Assign group leaders and officers</p>
          </div>
          <div class="card-body space-y-6">
            <!-- Group Leader -->
            <div>
              <label class="form-label">Group Leader</label>
              <select v-model="form.groupLeader" class="form-input">
                <option value="">Select group leader</option>
                <option v-for="member in members" :key="member.id" :value="member.id">
                  {{ member.firstName }} {{ member.lastName }}
                </option>
              </select>
            </div>

            <!-- Loan Officer -->
            <div>
              <label class="form-label">Loan Officer</label>
              <select v-model="form.loanOfficer" class="form-input">
                <option value="">Select loan officer</option>
                <option value="Edwin Simon">Edwin Simon</option>
                <option value="Sarah Johnson">Sarah Johnson</option>
                <option value="Michael Brown">Michael Brown</option>
                <option value="Lisa Wilson">Lisa Wilson</option>
              </select>
            </div>

            <!-- Collector Name -->
            <div>
              <label class="form-label">Collector Name</label>
              <input
                v-model="form.collectorName"
                type="text"
                class="form-input"
                placeholder="Enter collector name"
              />
            </div>
          </div>
        </div>

        <!-- Meeting Schedule -->
        <div class="card">
          <div class="card-header">
            <h3 class="text-lg font-semibold text-neutral-900">Meeting Schedule</h3>
            <p class="text-sm text-neutral-500">Set up regular meeting times</p>
          </div>
          <div class="card-body space-y-6">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="form-label">Day of Week</label>
                <select v-model="form.meetingDay" class="form-input">
                  <option value="">Select day</option>
                  <option value="monday">Monday</option>
                  <option value="tuesday">Tuesday</option>
                  <option value="wednesday">Wednesday</option>
                  <option value="thursday">Thursday</option>
                  <option value="friday">Friday</option>
                  <option value="saturday">Saturday</option>
                  <option value="sunday">Sunday</option>
                </select>
              </div>
              <div>
                <label class="form-label">Time</label>
                <input v-model="form.meetingTime" type="time" class="form-input" />
              </div>
            </div>
          </div>
        </div>

        <!-- Custom Fields -->
        <div class="card">
          <div class="card-header">
            <div class="flex items-center justify-between">
              <div>
                <h3 class="text-lg font-semibold text-neutral-900">Custom Fields</h3>
                <p class="text-sm text-neutral-500">Add additional fields specific to your needs</p>
              </div>
              <button @click="addCustomField" class="btn-secondary text-sm">
                <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                  />
                </svg>
                Add Field
              </button>
            </div>
          </div>
          <div class="card-body">
            <div v-if="form.customFields.length === 0" class="text-center py-8">
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
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              <p class="text-neutral-500 mb-2">No custom fields added yet</p>
              <p class="text-sm text-neutral-400">
                Click "Add Field" to create custom fields for this group
              </p>
            </div>
            <div v-else class="space-y-4">
              <div
                v-for="(field, index) in form.customFields"
                :key="index"
                class="flex items-center space-x-3 p-3 border border-neutral-200 rounded-lg"
              >
                <div class="flex-1 grid grid-cols-1 md:grid-cols-3 gap-3">
                  <input
                    v-model="field.name"
                    type="text"
                    class="form-input"
                    placeholder="Field name"
                  />
                  <select v-model="field.type" class="form-input">
                    <option value="text">Text</option>
                    <option value="number">Number</option>
                    <option value="date">Date</option>
                    <option value="select">Select</option>
                  </select>
                  <input
                    v-model="field.value"
                    type="text"
                    class="form-input"
                    placeholder="Field value"
                  />
                </div>
                <button
                  @click="removeCustomField(index)"
                  class="p-2 text-danger-500 hover:text-danger-700 hover:bg-danger-50 rounded-lg transition-colors"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                </button>
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
              <span class="text-sm text-neutral-600">Group Name:</span>
              <span class="text-sm font-medium text-neutral-900">
                {{ form.groupName || "Not set" }}
              </span>
            </div>
            <div class="flex items-center justify-between">
              <span class="text-sm text-neutral-600">Status:</span>
              <span class="text-sm font-medium text-neutral-900">
                {{ form.status }}
              </span>
            </div>
            <div class="flex items-center justify-between">
              <span class="text-sm text-neutral-600">Members:</span>
              <span class="text-sm font-medium text-neutral-900">
                {{ group?.memberCount || 0 }}
              </span>
            </div>
            <div class="flex items-center justify-between">
              <span class="text-sm text-neutral-600">Group Leader:</span>
              <span class="text-sm font-medium text-neutral-900">
                {{ getMemberName(form.groupLeader) || "Not assigned" }}
              </span>
            </div>
            <div class="flex items-center justify-between">
              <span class="text-sm text-neutral-600">Loan Officer:</span>
              <span class="text-sm font-medium text-neutral-900">
                {{ form.loanOfficer || "Not assigned" }}
              </span>
            </div>
            <div class="flex items-center justify-between">
              <span class="text-sm text-neutral-600">Custom Fields:</span>
              <span class="text-sm font-medium text-neutral-900">
                {{ form.customFields.length }}
              </span>
            </div>
          </div>
        </div>

        <!-- Validation Status -->
        <div class="card">
          <div class="card-header">
            <h3 class="text-lg font-semibold text-neutral-900">Validation Status</h3>
          </div>
          <div class="card-body">
            <div class="space-y-3">
              <div class="flex items-center space-x-2">
                <svg
                  :class="['w-4 h-4', form.groupName ? 'text-success-500' : 'text-neutral-400']"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                <span class="text-sm text-neutral-600">Group name is set</span>
              </div>
              <div class="flex items-center space-x-2">
                <svg
                  :class="['w-4 h-4', form.status ? 'text-success-500' : 'text-neutral-400']"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                <span class="text-sm text-neutral-600">Status is selected</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Danger Zone -->
        <div class="card border-danger-200">
          <div class="card-header">
            <h3 class="text-lg font-semibold text-danger-600">Danger Zone</h3>
          </div>
          <div class="card-body">
            <div class="space-y-3">
              <p class="text-sm text-neutral-600">
                Once you delete a group, there is no going back. Please be certain.
              </p>
              <button @click="deleteGroup" class="w-full btn-danger text-sm">
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
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import { groupsData, groupMembersData } from "@/data";

// Types
interface Group {
  id: string;
  name: string;
  status: "active" | "inactive" | "pending";
  memberCount: number;
  leaderId?: string;
  loanOfficer?: string;
  collectorName?: string;
  meetingDay?: string;
  meetingTime?: string;
  description?: string;
  customFields: CustomField[];
}

interface Member {
  id: string;
  firstName: string;
  lastName: string;
}

interface CustomField {
  name: string;
  type: "text" | "number" | "date" | "select";
  value: string;
}

interface GroupForm {
  groupName: string;
  status: "active" | "inactive" | "pending";
  groupLeader: string;
  loanOfficer: string;
  collectorName: string;
  meetingDay: string;
  meetingTime: string;
  description: string;
  customFields: CustomField[];
}

// Reactive data
const router = useRouter();
const route = useRoute();
const isLoading = ref(false);
const isSubmitting = ref(false);
const group = ref<Group | null>(null);
const members = ref<Member[]>([]);

const form = ref<GroupForm>({
  groupName: "",
  status: "active",
  groupLeader: "",
  loanOfficer: "",
  collectorName: "",
  meetingDay: "",
  meetingTime: "",
  description: "",
  customFields: [],
});

const errors = ref<Record<string, string>>({});

// Computed properties
const isFormValid = computed(() => {
  return form.value.groupName.trim() !== "";
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
      group.value = foundGroup;

      // Populate form with existing data
      form.value = {
        groupName: foundGroup.name,
        status: foundGroup.status,
        groupLeader: foundGroup.leaderId || "",
        loanOfficer: foundGroup.loanOfficer || "",
        collectorName: foundGroup.collectorName || "",
        meetingDay: foundGroup.meetingDay || "",
        meetingTime: foundGroup.meetingTime || "",
        description: foundGroup.description || "",
        customFields: [...foundGroup.customFields],
      };
    }

    // Load members for this group
    const groupMembers = groupMembersData.filter((member) => member.groupId === groupId);
    members.value = groupMembers.map((member) => ({
      id: member.id,
      firstName: member.firstName,
      lastName: member.lastName,
    }));
  } catch (error) {
    console.error("Error loading group data:", error);
  } finally {
    isLoading.value = false;
  }
};

const getMemberName = (memberId: string) => {
  const member = members.value.find((m) => m.id === memberId);
  return member ? `${member.firstName} ${member.lastName}` : null;
};

const addCustomField = () => {
  form.value.customFields.push({
    name: "",
    type: "text",
    value: "",
  });
};

const removeCustomField = (index: number) => {
  form.value.customFields.splice(index, 1);
};

const validateForm = () => {
  errors.value = {};

  if (!form.value.groupName.trim()) {
    errors.value.groupName = "Group name is required";
  }

  return Object.keys(errors.value).length === 0;
};

const saveGroup = async () => {
  if (!validateForm()) {
    return;
  }

  isSubmitting.value = true;

  try {
    // In a real app, this would be an API call
    console.log("Updating group:", form.value);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Show success message and redirect
    alert("Group updated successfully!");
    router.push(`/borrowers/groups/${route.params.id}`);
  } catch (error) {
    console.error("Error updating group:", error);
    alert("Error updating group. Please try again.");
  } finally {
    isSubmitting.value = false;
  }
};

const deleteGroup = async () => {
  if (
    confirm(
      "Are you sure you want to delete this group? This action cannot be undone and will affect all associated loans and members.",
    )
  ) {
    try {
      // In a real app, this would be an API call
      console.log("Deleting group:", route.params.id);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      alert("Group deleted successfully!");
      router.push("/borrowers/groups");
    } catch (error) {
      console.error("Error deleting group:", error);
      alert("Error deleting group. Please try again.");
    }
  }
};

// Lifecycle
onMounted(() => {
  loadGroupData();
});
</script>
