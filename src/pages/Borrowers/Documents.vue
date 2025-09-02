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
          <h1 class="text-2xl font-bold text-neutral-900">Borrower Documents</h1>
          <p class="text-sm text-neutral-600 mt-1">
            Manage documents for {{ borrower?.firstName }} {{ borrower?.lastName }}
          </p>
        </div>
      </div>
      <div class="flex space-x-3">
        <button @click="showUploadModal = true" class="btn-primary">
          <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
            />
          </svg>
          Upload Document
        </button>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="isLoading" class="flex justify-center py-12">
      <div
        class="w-8 h-8 border-2 border-primary-300 border-t-primary-600 rounded-full animate-spin"
      ></div>
    </div>

    <!-- Borrower Not Found -->
    <div v-else-if="!borrower" class="card">
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
          <h3 class="text-lg font-semibold text-neutral-900 mb-2">Borrower Not Found</h3>
          <p class="text-neutral-600 mb-6">
            The borrower you're looking for doesn't exist or has been deleted.
          </p>
          <router-link to="/borrowers" class="btn-primary"> Back to Borrowers </router-link>
        </div>
      </div>
    </div>

    <!-- Documents Management -->
    <div v-else class="grid grid-cols-1 lg:grid-cols-4 gap-6">
      <!-- Main Content -->
      <div class="lg:col-span-3 space-y-6">
        <!-- Document Statistics -->
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div class="card">
            <div class="card-body text-center">
              <p class="text-3xl font-bold text-primary-600">{{ documents.length }}</p>
              <p class="text-sm text-primary-600 mt-1">Total Documents</p>
            </div>
          </div>
          <div class="card">
            <div class="card-body text-center">
              <p class="text-3xl font-bold text-success-600">{{ verifiedCount }}</p>
              <p class="text-sm text-success-600 mt-1">Verified</p>
            </div>
          </div>
          <div class="card">
            <div class="card-body text-center">
              <p class="text-3xl font-bold text-warning-600">{{ pendingCount }}</p>
              <p class="text-sm text-warning-600 mt-1">Pending</p>
            </div>
          </div>
          <div class="card">
            <div class="card-body text-center">
              <p class="text-3xl font-bold text-danger-600">{{ rejectedCount }}</p>
              <p class="text-sm text-danger-600 mt-1">Rejected</p>
            </div>
          </div>
        </div>

        <!-- Documents List -->
        <div class="card">
          <div class="card-header">
            <h3 class="text-lg font-semibold text-neutral-900">
              Documents ({{ documents.length }})
            </h3>
          </div>
          <div class="card-body">
            <div v-if="documents.length === 0" class="text-center py-8">
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
              <p class="text-neutral-500">No documents uploaded yet.</p>
            </div>
            <div v-else class="space-y-3">
              <div
                v-for="document in documents"
                :key="document.id"
                class="flex items-center justify-between p-4 border border-neutral-200 rounded-lg hover:bg-neutral-50"
              >
                <div class="flex items-center space-x-3">
                  <div class="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                    <svg
                      v-if="document.fileType === 'application/pdf'"
                      class="w-5 h-5 text-primary-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                      />
                    </svg>
                    <svg
                      v-else-if="document.fileType.startsWith('image/')"
                      class="w-5 h-5 text-primary-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                    <svg
                      v-else
                      class="w-5 h-5 text-primary-600"
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
                  </div>
                  <div>
                    <div class="flex items-center space-x-2">
                      <p class="font-medium text-neutral-900">{{ document.documentName }}</p>
                      <span
                        :class="[
                          'px-2 py-1 text-xs rounded-full',
                          document.status === 'verified'
                            ? 'bg-success-100 text-success-800'
                            : document.status === 'pending'
                              ? 'bg-warning-100 text-warning-800'
                              : 'bg-danger-100 text-danger-800',
                        ]"
                      >
                        {{ document.status }}
                      </span>
                    </div>
                    <p class="text-sm text-neutral-500">
                      {{ document.fileName }} • {{ formatFileSize(document.fileSize) }} •
                      {{ formatDate(document.uploadDate) }}
                    </p>
                    <p v-if="document.description" class="text-sm text-neutral-600 mt-1">
                      {{ document.description }}
                    </p>
                  </div>
                </div>
                <div class="flex items-center space-x-3">
                  <div class="text-right">
                    <p class="text-sm font-medium text-neutral-900">
                      {{ document.verifiedBy || "Not verified" }}
                    </p>
                    <p class="text-xs text-neutral-500">
                      {{ document.verifiedAt ? formatDate(document.verifiedAt) : "Pending" }}
                    </p>
                  </div>
                  <button @click="viewDocument(document.id)" class="btn-secondary text-sm">
                    View
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Sidebar -->
      <div class="space-y-6">
        <!-- Borrower Info -->
        <div class="card">
          <div class="card-header">
            <h3 class="text-lg font-semibold text-neutral-900">Borrower Information</h3>
          </div>
          <div class="card-body space-y-4">
            <div>
              <label class="form-label">Name</label>
              <p class="text-neutral-900">{{ borrower.firstName }} {{ borrower.lastName }}</p>
            </div>
            <div>
              <label class="form-label">Email</label>
              <p class="text-neutral-900">{{ borrower.email }}</p>
            </div>
            <div>
              <label class="form-label">Unique Number</label>
              <p class="text-neutral-900">{{ borrower.uniqueNumber }}</p>
            </div>
            <div>
              <label class="form-label">Credit Score</label>
              <p class="text-neutral-900">{{ borrower.creditScore }}</p>
            </div>
          </div>
        </div>

        <!-- Quick Actions -->
        <div class="card">
          <div class="card-header">
            <h3 class="text-lg font-semibold text-neutral-900">Quick Actions</h3>
          </div>
          <div class="card-body space-y-3">
            <button @click="showUploadModal = true" class="w-full btn-primary text-sm">
              <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                />
              </svg>
              Upload Document
            </button>
            <button @click="generateDocumentReport" class="w-full btn-secondary text-sm">
              <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              Generate Report
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
import { documentsData, borrowersData } from "@/data";

// Types
interface Borrower {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  uniqueNumber: string;
  creditScore: number;
}

interface Document {
  id: string;
  borrowerId: string;
  borrowerName: string;
  documentType: string;
  documentName: string;
  fileName: string;
  fileSize: number;
  fileType: string;
  uploadDate: string;
  status: "verified" | "pending" | "rejected";
  verifiedBy?: string;
  verifiedAt?: string;
  expiryDate?: string;
  description?: string;
  tags: string[];
  rejectionReason?: string;
}

// Reactive data
const router = useRouter();
const route = useRoute();
const isLoading = ref(false);
const borrower = ref<Borrower | null>(null);
const documents = ref<Document[]>([]);
const showUploadModal = ref(false);

// Computed properties
const verifiedCount = computed(() => {
  return documents.value.filter((doc) => doc.status === "verified").length;
});

const pendingCount = computed(() => {
  return documents.value.filter((doc) => doc.status === "pending").length;
});

const rejectedCount = computed(() => {
  return documents.value.filter((doc) => doc.status === "rejected").length;
});

// Methods
const loadBorrowerData = async () => {
  isLoading.value = true;
  try {
    const borrowerId = route.params.id as string;

    // In a real app, this would be an API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Find borrower from JSON data
    const foundBorrower = borrowersData.borrowers.find((b) => b.id === borrowerId);
    if (foundBorrower) {
      borrower.value = foundBorrower;
    }

    // Load documents for this borrower
    const borrowerDocuments = documentsData.filter((doc) => doc.borrowerId === borrowerId);
    documents.value = borrowerDocuments;
  } catch (error) {
    console.error("Error loading borrower data:", error);
  } finally {
    isLoading.value = false;
  }
};

const viewDocument = (documentId: string) => {
  // In a real app, this would open a document viewer
  console.log("Viewing document:", documentId);
  alert("Document viewer would open here");
};

const generateDocumentReport = () => {
  // In a real app, this would generate a document report
  console.log("Generating document report for borrower:", route.params.id);
  alert("Document report would be generated here");
};

const formatFileSize = (bytes: number) => {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

// Lifecycle
onMounted(() => {
  loadBorrowerData();
});
</script>
