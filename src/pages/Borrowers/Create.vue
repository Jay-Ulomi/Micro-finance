<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Add Borrower</h1>
        <p class="text-sm text-gray-600 mt-1">Create a new borrower profile</p>
      </div>
      <div class="flex items-center space-x-2 text-sm text-gray-500">
        <span
          >To show/hide fields, make fields required or optional, and change order, please
          visit</span
        >
        <span class="font-medium text-blue-600"
          >Admin → Borrowers → Modify Add Borrower Fields</span
        >
      </div>
    </div>

    <form @submit.prevent="submitForm" class="space-y-8">
      <!-- Required Fields Section -->
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div class="mb-6">
          <h2 class="text-lg font-semibold text-gray-900 mb-2">Required Fields</h2>
          <p class="text-sm text-gray-600">
            All fields are optional but you must type at least First Name or Business Name.
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <!-- Country -->
          <div>
            <label for="country" class="form-label">
              Country <span class="text-red-500">*</span>
            </label>
            <select id="country" v-model="form.country" class="form-input" required>
              <option value="">Select Country</option>
              <option value="TZ">Tanzania, United Republic of</option>
              <option value="KE">Kenya</option>
              <option value="UG">Uganda</option>
              <option value="RW">Rwanda</option>
              <option value="BI">Burundi</option>
            </select>
          </div>

          <!-- First Name -->
          <div>
            <label for="firstName" class="form-label">
              First Name <span class="text-red-500">*</span>
            </label>
            <input
              id="firstName"
              v-model="form.firstName"
              type="text"
              placeholder="Enter First Name Only"
              class="form-input"
              :class="{ 'border-red-300': errors.firstName }"
            />
            <p v-if="errors.firstName" class="form-error">{{ errors.firstName }}</p>
          </div>

          <!-- Middle / Last Name -->
          <div>
            <label for="middleLastName" class="form-label">Middle / Last Name</label>
            <input
              id="middleLastName"
              v-model="form.middleLastName"
              type="text"
              placeholder="Middle and Last Name"
              class="form-input"
            />
          </div>

          <!-- Business Name -->
          <div>
            <label for="businessName" class="form-label">
              Business Name <span class="text-red-500">*</span>
            </label>
            <input
              id="businessName"
              v-model="form.businessName"
              type="text"
              placeholder="Business Name"
              class="form-input"
              :class="{ 'border-red-300': errors.businessName }"
            />
            <p v-if="errors.businessName" class="form-error">{{ errors.businessName }}</p>
          </div>
        </div>

        <div class="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <p class="text-sm text-blue-800">
            <strong>Note:</strong> You must enter at least First Name or Business Name.
          </p>
        </div>
      </div>

      <!-- Optional Fields Section -->
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div class="mb-6">
          <h2 class="text-lg font-semibold text-gray-900 mb-2">Optional Fields</h2>
          <p class="text-sm text-gray-600">All of the below fields are optional</p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <!-- Unique Number -->
          <div>
            <label for="uniqueNumber" class="form-label">Unique Number</label>
            <input
              id="uniqueNumber"
              v-model="form.uniqueNumber"
              type="text"
              placeholder="1000001"
              class="form-input"
            />
            <p class="text-xs text-gray-500 mt-1">
              You can enter unique number to identify the borrower such as Social Security Number,
              License #, Registration Id....
            </p>
            <div class="mt-2">
              <label class="flex items-center">
                <input
                  v-model="form.setCustomUniqueNumber"
                  type="checkbox"
                  class="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span class="ml-2 text-sm text-gray-700">Set Custom Unique Number</span>
              </label>
            </div>
          </div>

          <!-- Gender -->
          <div>
            <label for="gender" class="form-label">Gender</label>
            <select id="gender" v-model="form.gender" class="form-input">
              <option value="">Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>

          <!-- Title -->
          <div>
            <label for="title" class="form-label">Title</label>
            <select id="title" v-model="form.title" class="form-input">
              <option value="">Select Title</option>
              <option value="Mr">Mr</option>
              <option value="Mrs">Mrs</option>
              <option value="Ms">Ms</option>
              <option value="Dr">Dr</option>
              <option value="Prof">Prof</option>
            </select>
          </div>

          <!-- Mobile -->
          <div>
            <label for="mobile" class="form-label">Mobile</label>
            <input
              id="mobile"
              v-model="form.mobile"
              type="tel"
              placeholder="Numbers Only"
              class="form-input"
            />
            <p class="text-xs text-red-500 mt-1">
              Do not put country code, spaces, or characters in the below mobile otherwise you won't
              be able to send SMS to the mobile.
            </p>
          </div>

          <!-- Email -->
          <div>
            <label for="email" class="form-label">Email</label>
            <input
              id="email"
              v-model="form.email"
              type="email"
              placeholder="Email"
              class="form-input"
            />
          </div>

          <!-- Date of Birth -->
          <div>
            <label for="dateOfBirth" class="form-label">Date of Birth</label>
            <DatePicker
              id="dateOfBirth"
              v-model="form.dateOfBirth"
              placeholder="dd/mm/yyyy"
              format="dd/MM/yyyy"
            />
          </div>

          <!-- Address -->
          <div class="md:col-span-2">
            <label for="address" class="form-label">Address</label>
            <textarea
              id="address"
              v-model="form.address"
              placeholder="Address"
              rows="3"
              class="form-input"
            ></textarea>
          </div>

          <!-- City -->
          <div>
            <label for="city" class="form-label">City</label>
            <input
              id="city"
              v-model="form.city"
              type="text"
              placeholder="City"
              class="form-input"
            />
          </div>

          <!-- Province / State -->
          <div>
            <label for="province" class="form-label">Province / State</label>
            <input
              id="province"
              v-model="form.province"
              type="text"
              placeholder="Province or State"
              class="form-input"
            />
          </div>

          <!-- Zipcode -->
          <div>
            <label for="zipcode" class="form-label">Zipcode</label>
            <input
              id="zipcode"
              v-model="form.zipcode"
              type="text"
              placeholder="Zipcode"
              class="form-input"
            />
          </div>

          <!-- Landline Phone -->
          <div>
            <label for="landline" class="form-label">Landline Phone</label>
            <input
              id="landline"
              v-model="form.landline"
              type="tel"
              placeholder="Landline Phone"
              class="form-input"
            />
          </div>

          <!-- Working Status -->
          <div>
            <label for="workingStatus" class="form-label">Working Status</label>
            <select id="workingStatus" v-model="form.workingStatus" class="form-input">
              <option value="">Select Working Status</option>
              <option value="employed">Employed</option>
              <option value="self-employed">Self Employed</option>
              <option value="unemployed">Unemployed</option>
              <option value="student">Student</option>
              <option value="retired">Retired</option>
            </select>
          </div>

          <!-- Credit Score -->
          <div>
            <label for="creditScore" class="form-label">Credit Score</label>
            <input
              id="creditScore"
              v-model="form.creditScore"
              type="number"
              min="0"
              max="1000"
              placeholder="Credit Score"
              class="form-input"
            />
          </div>
        </div>
      </div>

      <!-- Files Section -->
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 class="text-lg font-semibold text-gray-900 mb-6">Files</h2>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <!-- Borrower Photo -->
          <div>
            <label for="borrowerPhoto" class="form-label">Borrower Photo</label>
            <div
              class="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg hover:border-gray-400 transition-colors"
            >
              <div class="space-y-1 text-center">
                <svg
                  class="mx-auto h-12 w-12 text-gray-400"
                  stroke="currentColor"
                  fill="none"
                  viewBox="0 0 48 48"
                >
                  <path
                    d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
                <div class="flex text-sm text-gray-600">
                  <label
                    for="borrowerPhoto"
                    class="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500"
                  >
                    <span>Upload a file</span>
                    <input
                      id="borrowerPhoto"
                      ref="borrowerPhotoInput"
                      type="file"
                      accept="image/*"
                      class="sr-only"
                      @change="handlePhotoUpload"
                    />
                  </label>
                  <p class="pl-1">or drag and drop</p>
                </div>
                <p class="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                <p v-if="form.borrowerPhoto" class="text-sm text-green-600 mt-2">
                  ✓ {{ form.borrowerPhoto.name }}
                </p>
              </div>
            </div>
          </div>

          <!-- Borrower Files -->
          <div>
            <label for="borrowerFiles" class="form-label">Borrower Files</label>
            <div
              class="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg hover:border-gray-400 transition-colors"
            >
              <div class="space-y-1 text-center">
                <svg
                  class="mx-auto h-12 w-12 text-gray-400"
                  stroke="currentColor"
                  fill="none"
                  viewBox="0 0 48 48"
                >
                  <path
                    d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
                <div class="flex text-sm text-gray-600">
                  <label
                    for="borrowerFiles"
                    class="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500"
                  >
                    <span>Upload files</span>
                    <input
                      id="borrowerFiles"
                      ref="borrowerFilesInput"
                      type="file"
                      multiple
                      class="sr-only"
                      @change="handleFilesUpload"
                    />
                  </label>
                  <p class="pl-1">or drag and drop</p>
                </div>
                <p class="text-xs text-gray-500">PDF, DOC, DOCX up to 10MB each</p>
                <div v-if="form.borrowerFiles.length > 0" class="mt-2 space-y-1">
                  <p
                    v-for="file in form.borrowerFiles"
                    :key="file.name"
                    class="text-sm text-green-600"
                  >
                    ✓ {{ file.name }}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Description Section -->
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 class="text-lg font-semibold text-gray-900 mb-6">Additional Information</h2>

        <div>
          <label for="description" class="form-label">Description</label>
          <textarea
            id="description"
            v-model="form.description"
            placeholder="Additional notes about the borrower..."
            rows="4"
            class="form-input"
          ></textarea>
        </div>
      </div>

      <!-- Loan Officer Access Section -->
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 class="text-lg font-semibold text-gray-900 mb-6">Loan Officer Access</h2>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label for="loanOfficer" class="form-label">Assign Loan Officer</label>
            <select id="loanOfficer" v-model="form.loanOfficer" class="form-input">
              <option value="">Select Loan Officer</option>
              <option value="edwin-simon">Edwin Simon</option>
              <option value="joseph-ulomi">Joseph Ulomi</option>
            </select>
          </div>
        </div>

        <div class="mt-4 flex space-x-4">
          <button type="button" class="text-sm text-blue-600 hover:text-blue-800 font-medium">
            + Add/Edit Loan Officers
          </button>
          <button type="button" class="text-sm text-blue-600 hover:text-blue-800 font-medium">
            + Bulk Update Borrowers With Loan Officers
          </button>
        </div>
      </div>

      <!-- Form Actions -->
      <div class="flex justify-end space-x-4">
        <button
          type="button"
          @click="resetForm"
          class="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
        >
          Reset
        </button>
        <button
          type="submit"
          :disabled="isSubmitting"
          class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <span v-if="isSubmitting">Creating...</span>
          <span v-else>Create Borrower</span>
        </button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from "vue";
import { useRouter } from "vue-router";
import DatePicker from "@/components/DatePicker.vue";

const router = useRouter();

// Form data interface
interface BorrowerForm {
  // Required fields
  country: string;
  firstName: string;
  middleLastName: string;
  businessName: string;

  // Optional fields
  uniqueNumber: string;
  setCustomUniqueNumber: boolean;
  gender: string;
  title: string;
  mobile: string;
  email: string;
  dateOfBirth: string;
  address: string;
  city: string;
  province: string;
  zipcode: string;
  landline: string;
  workingStatus: string;
  creditScore: string;

  // Files
  borrowerPhoto: File | null;
  borrowerFiles: File[];

  // Additional
  description: string;
  loanOfficer: string;
}

const form = reactive<BorrowerForm>({
  // Required fields
  country: "",
  firstName: "",
  middleLastName: "",
  businessName: "",

  // Optional fields
  uniqueNumber: "",
  setCustomUniqueNumber: false,
  gender: "",
  title: "",
  mobile: "",
  email: "",
  dateOfBirth: "",
  address: "",
  city: "",
  province: "",
  zipcode: "",
  landline: "",
  workingStatus: "",
  creditScore: "",

  // Files
  borrowerPhoto: null,
  borrowerFiles: [],

  // Additional
  description: "",
  loanOfficer: "",
});

// Form state
const isSubmitting = ref(false);
const errors = reactive({
  firstName: "",
  businessName: "",
});

// File input refs
const borrowerPhotoInput = ref<HTMLInputElement>();
const borrowerFilesInput = ref<HTMLInputElement>();

// Validation
const validateForm = () => {
  errors.firstName = "";
  errors.businessName = "";

  let isValid = true;

  // Check if at least First Name or Business Name is provided
  if (!form.firstName.trim() && !form.businessName.trim()) {
    errors.firstName = "Either First Name or Business Name is required";
    errors.businessName = "Either First Name or Business Name is required";
    isValid = false;
  }

  // Country is required
  if (!form.country) {
    isValid = false;
  }

  return isValid;
};

// File handlers
const handlePhotoUpload = (event: Event) => {
  const target = event.target as HTMLInputElement;
  if (target.files && target.files[0]) {
    form.borrowerPhoto = target.files[0];
  }
};

const handleFilesUpload = (event: Event) => {
  const target = event.target as HTMLInputElement;
  if (target.files) {
    form.borrowerFiles = Array.from(target.files);
  }
};

// Form actions
const resetForm = () => {
  // Reset form fields
  form.country = "";
  form.firstName = "";
  form.middleLastName = "";
  form.businessName = "";
  form.uniqueNumber = "";
  form.setCustomUniqueNumber = false;
  form.gender = "";
  form.title = "";
  form.mobile = "";
  form.email = "";
  form.dateOfBirth = "";
  form.address = "";
  form.city = "";
  form.province = "";
  form.zipcode = "";
  form.landline = "";
  form.workingStatus = "";
  form.creditScore = "";
  form.borrowerPhoto = null;
  form.borrowerFiles = [];
  form.description = "";
  form.loanOfficer = "";

  // Reset file inputs
  if (borrowerPhotoInput.value) borrowerPhotoInput.value.value = "";
  if (borrowerFilesInput.value) borrowerFilesInput.value.value = "";

  // Reset errors
  errors.firstName = "";
  errors.businessName = "";
};

const submitForm = async () => {
  if (!validateForm()) {
    return;
  }

  isSubmitting.value = true;

  try {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Show success message (you can implement toast notifications here)
    alert("Borrower created successfully!");

    // Redirect to borrowers list
    router.push("/borrowers");
  } catch (error) {
    console.error("Error creating borrower:", error);
    alert("Error creating borrower. Please try again.");
  } finally {
    isSubmitting.value = false;
  }
};
</script>
