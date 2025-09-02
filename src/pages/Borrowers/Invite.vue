<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-neutral-900">Invite Borrowers</h1>
        <p class="text-sm text-neutral-600 mt-1">
          Invite new borrowers to join the loan management system
        </p>
      </div>
      <div class="flex items-center space-x-3">
        <button @click="viewInvitations" class="btn-secondary">
          <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
            />
          </svg>
          View Invitations
        </button>
      </div>
    </div>

    <!-- Invitation Methods -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Individual Email Invitation -->
      <div class="card">
        <div class="card-header">
          <div class="flex items-center">
            <div class="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center mr-3">
              <svg
                class="w-5 h-5 text-primary-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
            </div>
            <div>
              <h3 class="text-lg font-semibold text-neutral-900">Email Invitation</h3>
              <p class="text-sm text-neutral-600">Send individual invitations via email</p>
            </div>
          </div>
        </div>
        <div class="card-body">
          <form @submit.prevent="sendEmailInvitation" class="space-y-4">
            <div>
              <label class="form-label">Email Address</label>
              <input
                v-model="emailForm.email"
                type="email"
                class="form-input"
                placeholder="borrower@example.com"
                required
              />
            </div>
            <div>
              <label class="form-label">First Name</label>
              <input
                v-model="emailForm.firstName"
                type="text"
                class="form-input"
                placeholder="John"
                required
              />
            </div>
            <div>
              <label class="form-label">Last Name</label>
              <input
                v-model="emailForm.lastName"
                type="text"
                class="form-input"
                placeholder="Doe"
                required
              />
            </div>
            <div>
              <label class="form-label">Phone Number</label>
              <input
                v-model="emailForm.phone"
                type="tel"
                class="form-input"
                placeholder="+255123456789"
              />
            </div>
            <div>
              <label class="form-label">Loan Officer</label>
              <select v-model="emailForm.loanOfficer" class="form-select">
                <option value="">Select Loan Officer</option>
                <option value="Edwin Simon">Edwin Simon</option>
                <option value="Joseph Ulomi">Joseph Ulomi</option>
              </select>
            </div>
            <div>
              <label class="form-label">Custom Message</label>
              <textarea
                v-model="emailForm.message"
                class="form-textarea"
                rows="3"
                placeholder="Optional personal message..."
              ></textarea>
            </div>
            <button type="submit" :disabled="isSendingEmail" class="w-full btn-primary">
              <svg
                v-if="isSendingEmail"
                class="w-4 h-4 mr-2 animate-spin"
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
              <svg
                v-else
                class="w-4 h-4 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                />
              </svg>
              {{ isSendingEmail ? "Sending..." : "Send Email Invitation" }}
            </button>
          </form>
        </div>
      </div>

      <!-- Bulk CSV Upload -->
      <div class="card">
        <div class="card-header">
          <div class="flex items-center">
            <div class="w-10 h-10 bg-success-100 rounded-lg flex items-center justify-center mr-3">
              <svg
                class="w-5 h-5 text-success-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10"
                />
              </svg>
            </div>
            <div>
              <h3 class="text-lg font-semibold text-neutral-900">Bulk Upload</h3>
              <p class="text-sm text-neutral-600">Upload CSV file with multiple borrowers</p>
            </div>
          </div>
        </div>
        <div class="card-body">
          <div class="space-y-4">
            <div class="border-2 border-dashed border-neutral-300 rounded-lg p-6 text-center">
              <input
                ref="csvFileInput"
                type="file"
                accept=".csv"
                @change="handleCsvUpload"
                class="hidden"
              />
              <svg
                class="w-12 h-12 text-neutral-400 mx-auto mb-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                />
              </svg>
              <p class="text-sm text-neutral-600 mb-2">
                <button
                  @click="$refs.csvFileInput.click()"
                  class="text-primary-600 hover:text-primary-700 font-medium"
                >
                  Click to upload
                </button>
                or drag and drop CSV file
              </p>
              <p class="text-xs text-neutral-500">
                CSV should contain: email, firstName, lastName, phone, loanOfficer
              </p>
            </div>

            <div v-if="csvData.length > 0" class="space-y-3">
              <div class="flex items-center justify-between">
                <h4 class="font-medium text-neutral-900">Preview ({{ csvData.length }} records)</h4>
                <button @click="clearCsvData" class="text-sm text-danger-600 hover:text-danger-700">
                  Clear
                </button>
              </div>
              <div class="max-h-40 overflow-y-auto border border-neutral-200 rounded-lg">
                <table class="min-w-full text-xs">
                  <thead class="bg-neutral-50">
                    <tr>
                      <th class="px-3 py-2 text-left">Email</th>
                      <th class="px-3 py-2 text-left">Name</th>
                      <th class="px-3 py-2 text-left">Phone</th>
                      <th class="px-3 py-2 text-left">Officer</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(row, index) in csvData.slice(0, 5)" :key="index" class="border-t">
                      <td class="px-3 py-2">{{ row.email }}</td>
                      <td class="px-3 py-2">{{ row.firstName }} {{ row.lastName }}</td>
                      <td class="px-3 py-2">{{ row.phone }}</td>
                      <td class="px-3 py-2">{{ row.loanOfficer }}</td>
                    </tr>
                  </tbody>
                </table>
                <div
                  v-if="csvData.length > 5"
                  class="px-3 py-2 text-xs text-neutral-500 bg-neutral-50"
                >
                  ... and {{ csvData.length - 5 }} more records
                </div>
              </div>
              <button
                @click="sendBulkInvitations"
                :disabled="isSendingBulk"
                class="w-full btn-primary"
              >
                <svg
                  v-if="isSendingBulk"
                  class="w-4 h-4 mr-2 animate-spin"
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
                <svg
                  v-else
                  class="w-4 h-4 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                  />
                </svg>
                {{ isSendingBulk ? "Sending..." : `Send ${csvData.length} Invitations` }}
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- SMS Invitation -->
      <div class="card">
        <div class="card-header">
          <div class="flex items-center">
            <div class="w-10 h-10 bg-warning-100 rounded-lg flex items-center justify-center mr-3">
              <svg
                class="w-5 h-5 text-warning-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                />
              </svg>
            </div>
            <div>
              <h3 class="text-lg font-semibold text-neutral-900">SMS Invitation</h3>
              <p class="text-sm text-neutral-600">Send SMS invitations to phone numbers</p>
            </div>
          </div>
        </div>
        <div class="card-body">
          <form @submit.prevent="sendSmsInvitation" class="space-y-4">
            <div>
              <label class="form-label">Phone Numbers</label>
              <textarea
                v-model="smsForm.phones"
                class="form-textarea"
                rows="4"
                placeholder="Enter phone numbers, one per line:&#10;+255123456789&#10;+255987654321&#10;+255555123456"
                required
              ></textarea>
              <p class="text-xs text-neutral-500 mt-1">
                Enter phone numbers in international format, one per line
              </p>
            </div>
            <div>
              <label class="form-label">SMS Message</label>
              <textarea
                v-model="smsForm.message"
                class="form-textarea"
                rows="3"
                placeholder="Hi! You're invited to join our loan management system. Click here to register: [LINK]"
                required
              ></textarea>
              <p class="text-xs text-neutral-500 mt-1">
                Use [LINK] placeholder for registration link
              </p>
            </div>
            <div>
              <label class="form-label">Loan Officer</label>
              <select v-model="smsForm.loanOfficer" class="form-select">
                <option value="">Select Loan Officer</option>
                <option value="Edwin Simon">Edwin Simon</option>
                <option value="Joseph Ulomi">Joseph Ulomi</option>
              </select>
            </div>
            <button type="submit" :disabled="isSendingSms" class="w-full btn-primary">
              <svg
                v-if="isSendingSms"
                class="w-4 h-4 mr-2 animate-spin"
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
              <svg
                v-else
                class="w-4 h-4 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                />
              </svg>
              {{ isSendingSms ? "Sending..." : "Send SMS Invitations" }}
            </button>
          </form>
        </div>
      </div>
    </div>

    <!-- Recent Invitations -->
    <div class="card">
      <div class="card-header">
        <h3 class="text-lg font-semibold text-neutral-900">Recent Invitations</h3>
      </div>
      <div class="card-body">
        <div v-if="recentInvitations.length === 0" class="text-center py-8">
          <svg
            class="w-12 h-12 text-neutral-400 mx-auto mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
            />
          </svg>
          <p class="text-neutral-600">No recent invitations</p>
        </div>
        <div v-else class="space-y-3">
          <div
            v-for="invitation in recentInvitations"
            :key="invitation.id"
            class="flex items-center justify-between p-4 bg-neutral-50 rounded-lg"
          >
            <div class="flex items-center space-x-4">
              <div class="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                <svg
                  class="w-5 h-5 text-primary-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
              </div>
              <div>
                <p class="font-medium text-neutral-900">
                  {{ invitation.firstName }} {{ invitation.lastName }}
                </p>
                <p class="text-sm text-neutral-600">{{ invitation.email || invitation.phone }}</p>
                <p class="text-xs text-neutral-500">
                  {{ invitation.method }} • {{ formatDate(invitation.sentAt) }}
                </p>
              </div>
            </div>
            <div class="flex items-center space-x-2">
              <span
                :class="[
                  'px-2 py-1 text-xs font-medium rounded-full',
                  invitation.status === 'sent'
                    ? 'bg-success-100 text-success-800'
                    : invitation.status === 'pending'
                      ? 'bg-warning-100 text-warning-800'
                      : 'bg-danger-100 text-danger-800',
                ]"
              >
                {{ invitation.status }}
              </span>
              <button
                @click="resendInvitation(invitation.id)"
                class="text-primary-600 hover:text-primary-700 text-sm"
              >
                Resend
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Success/Error Messages -->
    <div v-if="successMessage" class="bg-success-50 border border-success-200 rounded-lg p-4">
      <div class="flex">
        <svg
          class="w-5 h-5 text-success-400 mr-3"
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
        <p class="text-success-800">{{ successMessage }}</p>
      </div>
    </div>

    <div v-if="errorMessage" class="bg-danger-50 border border-danger-200 rounded-lg p-4">
      <div class="flex">
        <svg
          class="w-5 h-5 text-danger-400 mr-3"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
        <p class="text-danger-800">{{ errorMessage }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";

// Types
interface EmailForm {
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  loanOfficer: string;
  message: string;
}

interface SmsForm {
  phones: string;
  message: string;
  loanOfficer: string;
}

interface CsvRow {
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  loanOfficer: string;
}

interface Invitation {
  id: string;
  firstName: string;
  lastName: string;
  email?: string;
  phone?: string;
  method: "email" | "sms" | "bulk";
  status: "sent" | "pending" | "failed";
  sentAt: string;
  loanOfficer: string;
}

// Reactive data
const router = useRouter();

// Form data
const emailForm = ref<EmailForm>({
  email: "",
  firstName: "",
  lastName: "",
  phone: "",
  loanOfficer: "",
  message: "",
});

const smsForm = ref<SmsForm>({
  phones: "",
  message: "Hi! You're invited to join our loan management system. Click here to register: [LINK]",
  loanOfficer: "",
});

// State
const isSendingEmail = ref(false);
const isSendingSms = ref(false);
const isSendingBulk = ref(false);
const csvData = ref<CsvRow[]>([]);
const recentInvitations = ref<Invitation[]>([]);
const successMessage = ref("");
const errorMessage = ref("");

// Methods
const sendEmailInvitation = async () => {
  isSendingEmail.value = true;
  errorMessage.value = "";
  successMessage.value = "";

  try {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Add to recent invitations
    const invitation: Invitation = {
      id: Date.now().toString(),
      firstName: emailForm.value.firstName,
      lastName: emailForm.value.lastName,
      email: emailForm.value.email,
      method: "email",
      status: "sent",
      sentAt: new Date().toISOString(),
      loanOfficer: emailForm.value.loanOfficer,
    };

    recentInvitations.value.unshift(invitation);

    // Reset form
    emailForm.value = {
      email: "",
      firstName: "",
      lastName: "",
      phone: "",
      loanOfficer: "",
      message: "",
    };

    successMessage.value = `Email invitation sent successfully to ${invitation.email}`;
  } catch (error) {
    errorMessage.value = "Failed to send email invitation. Please try again.";
  } finally {
    isSendingEmail.value = false;
  }
};

const sendSmsInvitation = async () => {
  isSendingSms.value = true;
  errorMessage.value = "";
  successMessage.value = "";

  try {
    const phoneNumbers = smsForm.value.phones
      .split("\n")
      .map((phone) => phone.trim())
      .filter((phone) => phone.length > 0);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Add to recent invitations
    phoneNumbers.forEach((phone) => {
      const invitation: Invitation = {
        id: `${Date.now()}-${phone}`,
        firstName: "Unknown",
        lastName: "User",
        phone: phone,
        method: "sms",
        status: "sent",
        sentAt: new Date().toISOString(),
        loanOfficer: smsForm.value.loanOfficer,
      };
      recentInvitations.value.unshift(invitation);
    });

    // Reset form
    smsForm.value.phones = "";

    successMessage.value = `SMS invitations sent successfully to ${phoneNumbers.length} phone numbers`;
  } catch (error) {
    errorMessage.value = "Failed to send SMS invitations. Please try again.";
  } finally {
    isSendingSms.value = false;
  }
};

const handleCsvUpload = (event: Event) => {
  const file = (event.target as HTMLInputElement).files?.[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (e) => {
    const csv = e.target?.result as string;
    const lines = csv.split("\n");
    const headers = lines[0].split(",").map((h) => h.trim().toLowerCase());

    const data: CsvRow[] = [];
    for (let i = 1; i < lines.length; i++) {
      if (lines[i].trim()) {
        const values = lines[i].split(",").map((v) => v.trim());
        if (values.length >= headers.length) {
          data.push({
            email: values[headers.indexOf("email")] || "",
            firstName:
              values[headers.indexOf("firstname")] || values[headers.indexOf("first_name")] || "",
            lastName:
              values[headers.indexOf("lastname")] || values[headers.indexOf("last_name")] || "",
            phone: values[headers.indexOf("phone")] || "",
            loanOfficer:
              values[headers.indexOf("loanofficer")] ||
              values[headers.indexOf("loan_officer")] ||
              "",
          });
        }
      }
    }

    csvData.value = data;
  };
  reader.readAsText(file);
};

const clearCsvData = () => {
  csvData.value = [];
  if (csvFileInput.value) {
    csvFileInput.value.value = "";
  }
};

const sendBulkInvitations = async () => {
  isSendingBulk.value = true;
  errorMessage.value = "";
  successMessage.value = "";

  try {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 3000));

    // Add to recent invitations
    csvData.value.forEach((row) => {
      const invitation: Invitation = {
        id: `${Date.now()}-${row.email}`,
        firstName: row.firstName,
        lastName: row.lastName,
        email: row.email,
        method: "bulk",
        status: "sent",
        sentAt: new Date().toISOString(),
        loanOfficer: row.loanOfficer,
      };
      recentInvitations.value.unshift(invitation);
    });

    const count = csvData.value.length;
    csvData.value = [];
    if (csvFileInput.value) {
      csvFileInput.value.value = "";
    }

    successMessage.value = `Bulk invitations sent successfully to ${count} recipients`;
  } catch (error) {
    errorMessage.value = "Failed to send bulk invitations. Please try again.";
  } finally {
    isSendingBulk.value = false;
  }
};

const resendInvitation = async (invitationId: string) => {
  try {
    // Simulate resend
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const invitation = recentInvitations.value.find((inv) => inv.id === invitationId);
    if (invitation) {
      invitation.status = "sent";
      invitation.sentAt = new Date().toISOString();
    }

    successMessage.value = "Invitation resent successfully";
  } catch (error) {
    errorMessage.value = "Failed to resend invitation. Please try again.";
  }
};

const viewInvitations = () => {
  // Navigate to invitations management page
  alert("Invitations management page would open here");
};

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

// Template refs
const csvFileInput = ref<HTMLInputElement>();

// Lifecycle
onMounted(() => {
  // Load recent invitations (mock data)
  recentInvitations.value = [
    {
      id: "1",
      firstName: "John",
      lastName: "Doe",
      email: "john.doe@example.com",
      method: "email",
      status: "sent",
      sentAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 minutes ago
      loanOfficer: "Edwin Simon",
    },
    {
      id: "2",
      firstName: "Jane",
      lastName: "Smith",
      email: "jane.smith@example.com",
      method: "bulk",
      status: "pending",
      sentAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
      loanOfficer: "Joseph Ulomi",
    },
  ];
});
</script>
