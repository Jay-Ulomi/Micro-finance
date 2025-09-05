<template>
  <div class="space-y-6">
    <!-- Page header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Add Investor</h1>
        <p class="text-sm text-gray-600">Register a new investor with complete profile information</p>
      </div>
      <button @click="goBack" class="btn btn-secondary">
        <ArrowLeftIcon class="w-4 h-4 mr-2" />
        Back to Investors
      </button>
    </div>

    <!-- Form -->
    <form @submit.prevent="submitForm" class="space-y-6">
      <!-- Required Fields -->
      <div class="card">
        <div class="card-header">
          <h2 class="card-title text-red-600">Required Fields:</h2>
        </div>
        <div class="card-body">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Country <span class="text-red-500">*</span>
              </label>
              <select v-model="form.country" class="form-input" required>
                <option value="">Select Country</option>
                <option value="Tanzania">Tanzania, United Republic of</option>
                <option value="Kenya">Kenya</option>
                <option value="Uganda">Uganda</option>
                <option value="Rwanda">Rwanda</option>
                <option value="Burundi">Burundi</option>
                <option value="South Africa">South Africa</option>
                <option value="Nigeria">Nigeria</option>
                <option value="Ghana">Ghana</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <!-- Optional Fields -->
      <div class="card">
        <div class="card-header">
          <h2 class="card-title">Optional Fields:</h2>
          <p class="text-sm text-gray-600 mt-1">
            All fields are optional but you must type at least First Name and Middle / Last Name or Business Name.
          </p>
        </div>
        <div class="card-body space-y-6">
          <!-- Personal Information -->
          <div>
            <h3 class="text-lg font-medium text-gray-900 mb-4">Personal Information</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  First Name
                </label>
                <input 
                  v-model="form.firstName" 
                  type="text" 
                  placeholder="Enter First Name Only"
                  class="form-input"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Middle / Last Name
                </label>
                <input 
                  v-model="form.lastName" 
                  type="text" 
                  placeholder="Middle and Last Name"
                  class="form-input"
                />
              </div>
            </div>

            <div class="text-center my-4">
              <span class="text-sm font-medium text-gray-500 bg-gray-100 px-3 py-1 rounded">AND/OR</span>
            </div>

            <div class="grid grid-cols-1 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Business Name
                </label>
                <input 
                  v-model="form.businessName" 
                  type="text" 
                  placeholder="Business Name"
                  class="form-input"
                />
              </div>
            </div>

            <div class="mt-4 p-3 bg-blue-50 rounded-lg">
              <p class="text-sm text-blue-800">
                <strong>All of the below fields are optional:</strong>
              </p>
            </div>
          </div>

          <!-- Identification -->
          <div>
            <h3 class="text-lg font-medium text-gray-900 mb-4">Identification</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Unique Number
                </label>
                <input 
                  v-model="form.uniqueNumber" 
                  type="text" 
                  placeholder="1000001"
                  class="form-input"
                />
                <p class="text-xs text-gray-500 mt-1">
                  You can enter unique number to identify the investor such as Social Security Number, License #, Registration Id....
                </p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Gender
                </label>
                <select v-model="form.gender" class="form-input">
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                  <option value="Prefer not to say">Prefer not to say</option>
                </select>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Title
                </label>
                <select v-model="form.title" class="form-input">
                  <option value="">Select Title</option>
                  <option value="Mr.">Mr.</option>
                  <option value="Ms.">Ms.</option>
                  <option value="Mrs.">Mrs.</option>
                  <option value="Dr.">Dr.</option>
                  <option value="Prof.">Prof.</option>
                  <option value="Hon.">Hon.</option>
                </select>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Date of Birth
                </label>
                <input 
                  v-model="form.dateOfBirth" 
                  type="date" 
                  class="form-input"
                />
                <p class="text-xs text-gray-500 mt-1">dd/mm/yyyy</p>
              </div>
            </div>
          </div>

          <!-- Contact Information -->
          <div>
            <h3 class="text-lg font-medium text-gray-900 mb-4">Contact Information</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Mobile
                </label>
                <input 
                  v-model="form.mobile" 
                  type="tel" 
                  placeholder="Numbers Only"
                  class="form-input"
                />
                <p class="text-xs text-gray-500 mt-1">
                  Do not put country code, spaces, or characters in mobile otherwise you won't be able to send SMS to this mobile.
                </p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input 
                  v-model="form.email" 
                  type="email" 
                  placeholder="Email"
                  class="form-input"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Landline Phone
                </label>
                <input 
                  v-model="form.landline" 
                  type="tel" 
                  placeholder="Landline Phone"
                  class="form-input"
                />
              </div>
            </div>
          </div>

          <!-- Address Information -->
          <div>
            <h3 class="text-lg font-medium text-gray-900 mb-4">Address Information</h3>
            <div class="grid grid-cols-1 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Address
                </label>
                <textarea 
                  v-model="form.address" 
                  rows="3"
                  placeholder="Address"
                  class="form-input"
                ></textarea>
              </div>
              <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">
                    City
                  </label>
                  <input 
                    v-model="form.city" 
                    type="text" 
                    placeholder="City"
                    class="form-input"
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">
                    Province / State
                  </label>
                  <input 
                    v-model="form.state" 
                    type="text" 
                    placeholder="Province or State"
                    class="form-input"
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">
                    Zipcode
                  </label>
                  <input 
                    v-model="form.zipcode" 
                    type="text" 
                    placeholder="Zipcode"
                    class="form-input"
                  />
                </div>
              </div>
            </div>
          </div>

          <!-- Additional Information -->
          <div>
            <h3 class="text-lg font-medium text-gray-900 mb-4">Additional Information</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Working Status
                </label>
                <select v-model="form.workingStatus" class="form-input">
                  <option value="">Select Working Status</option>
                  <option value="Employed">Employed</option>
                  <option value="Self-Employed">Self-Employed</option>
                  <option value="Business Owner">Business Owner</option>
                  <option value="Retired">Retired</option>
                  <option value="Student">Student</option>
                  <option value="Unemployed">Unemployed</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>
          </div>

          <!-- File Uploads -->
          <div>
            <h3 class="text-lg font-medium text-gray-900 mb-4">Documents & Files</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Investor Photo
                </label>
                <div class="mt-1">
                  <input
                    ref="photoInput"
                    type="file"
                    accept="image/*"
                    @change="handlePhotoUpload"
                    class="hidden"
                  />
                  <div 
                    @click="$refs.photoInput.click()"
                    class="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center cursor-pointer hover:border-gray-400"
                  >
                    <UserCircleIcon class="w-12 h-12 text-gray-400 mx-auto mb-2" />
                    <p class="text-sm text-gray-600">
                      {{ selectedPhoto ? selectedPhoto.name : 'No file chosen' }}
                    </p>
                    <p class="text-xs text-gray-500 mt-1">Click to select photo</p>
                  </div>
                </div>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Investor Files
                </label>
                <div class="mt-1">
                  <input
                    ref="filesInput"
                    type="file"
                    multiple
                    @change="handleFilesUpload"
                    class="hidden"
                  />
                  <div 
                    @click="$refs.filesInput.click()"
                    class="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center cursor-pointer hover:border-gray-400"
                  >
                    <DocumentIcon class="w-12 h-12 text-gray-400 mx-auto mb-2" />
                    <p class="text-sm text-gray-600">
                      {{ selectedFiles.length > 0 ? `${selectedFiles.length} file(s) selected` : 'No file chosen' }}
                    </p>
                    <p class="text-xs text-gray-500 mt-1">Click to select files</p>
                  </div>
                </div>
                <div v-if="selectedFiles.length > 0" class="mt-2">
                  <div v-for="file in selectedFiles" :key="file.name" class="text-xs text-gray-600">
                    {{ file.name }}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Description -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea 
              v-model="form.description" 
              rows="4"
              placeholder="Additional notes or description about the investor"
              class="form-input"
            ></textarea>
          </div>

          <!-- Custom Fields -->
          <div class="border-t pt-6">
            <button 
              type="button" 
              @click="showCustomFields = !showCustomFields"
              class="text-blue-600 hover:text-blue-800 text-sm font-medium"
            >
              Click here to add custom fields on this page
            </button>
            
            <div v-if="showCustomFields" class="mt-4 space-y-4">
              <div v-for="(customField, index) in customFields" :key="index" class="flex items-end space-x-2">
                <div class="flex-1">
                  <label class="block text-sm font-medium text-gray-700 mb-1">
                    Field Name
                  </label>
                  <input 
                    v-model="customField.name" 
                    type="text" 
                    placeholder="Custom field name"
                    class="form-input"
                  />
                </div>
                <div class="flex-1">
                  <label class="block text-sm font-medium text-gray-700 mb-1">
                    Value
                  </label>
                  <input 
                    v-model="customField.value" 
                    type="text" 
                    placeholder="Custom field value"
                    class="form-input"
                  />
                </div>
                <button 
                  type="button"
                  @click="removeCustomField(index)"
                  class="btn btn-xs btn-danger mb-0.5"
                >
                  <XMarkIcon class="w-3 h-3" />
                </button>
              </div>
              <button 
                type="button"
                @click="addCustomField"
                class="btn btn-sm btn-secondary"
              >
                <PlusIcon class="w-4 h-4 mr-2" />
                Add Custom Field
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Form Actions -->
      <div class="card">
        <div class="card-body">
          <div class="flex justify-end space-x-3">
            <button type="button" @click="resetForm" class="btn btn-secondary">
              <ArrowPathIcon class="w-4 h-4 mr-2" />
              Reset Form
            </button>
            <button type="button" @click="goBack" class="btn btn-outline">
              Cancel
            </button>
            <button type="submit" :disabled="!isFormValid" class="btn btn-primary">
              <CheckIcon class="w-4 h-4 mr-2" />
              Add Investor
            </button>
          </div>
        </div>
      </div>
    </form>

    <!-- Validation Errors -->
    <div v-if="validationErrors.length > 0" class="card border-red-200 bg-red-50">
      <div class="card-body">
        <div class="flex items-start">
          <ExclamationTriangleIcon class="w-5 h-5 text-red-500 mr-2 mt-0.5" />
          <div>
            <h3 class="font-medium text-red-900 mb-2">Please fix the following issues:</h3>
            <ul class="list-disc list-inside text-sm text-red-800 space-y-1">
              <li v-for="error in validationErrors" :key="error">{{ error }}</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { useRouter } from "vue-router";
import { 
  ArrowLeftIcon,
  UserCircleIcon,
  DocumentIcon,
  XMarkIcon,
  PlusIcon,
  ArrowPathIcon,
  CheckIcon,
  ExclamationTriangleIcon
} from "@heroicons/vue/24/outline";

// Types
interface CustomField {
  name: string;
  value: string;
}

interface InvestorForm {
  country: string;
  firstName: string;
  lastName: string;
  businessName: string;
  uniqueNumber: string;
  gender: string;
  title: string;
  mobile: string;
  email: string;
  dateOfBirth: string;
  address: string;
  city: string;
  state: string;
  zipcode: string;
  landline: string;
  workingStatus: string;
  description: string;
}

// Reactive data
const router = useRouter();
const photoInput = ref<HTMLInputElement>();
const filesInput = ref<HTMLInputElement>();
const selectedPhoto = ref<File | null>(null);
const selectedFiles = ref<File[]>([]);
const showCustomFields = ref(false);
const customFields = ref<CustomField[]>([]);

const form = ref<InvestorForm>({
  country: "",
  firstName: "",
  lastName: "",
  businessName: "",
  uniqueNumber: "",
  gender: "",
  title: "",
  mobile: "",
  email: "",
  dateOfBirth: "",
  address: "",
  city: "",
  state: "",
  zipcode: "",
  landline: "",
  workingStatus: "",
  description: ""
});

// Computed properties
const isFormValid = computed(() => {
  // Country is required
  if (!form.value.country) return false;
  
  // Must have either (firstName AND lastName) OR businessName
  const hasPersonalName = form.value.firstName && form.value.lastName;
  const hasBusinessName = form.value.businessName;
  
  return hasPersonalName || hasBusinessName;
});

const validationErrors = computed(() => {
  const errors: string[] = [];
  
  if (!form.value.country) {
    errors.push("Country is required");
  }
  
  const hasPersonalName = form.value.firstName && form.value.lastName;
  const hasBusinessName = form.value.businessName;
  
  if (!hasPersonalName && !hasBusinessName) {
    errors.push("You must provide either First Name and Middle/Last Name, or Business Name");
  }
  
  if (form.value.email && !isValidEmail(form.value.email)) {
    errors.push("Please enter a valid email address");
  }
  
  return errors;
});

// Methods
const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const handlePhotoUpload = (event: Event) => {
  const target = event.target as HTMLInputElement;
  const file = target.files?.[0];
  if (file) {
    selectedPhoto.value = file;
  }
};

const handleFilesUpload = (event: Event) => {
  const target = event.target as HTMLInputElement;
  const files = target.files;
  if (files) {
    selectedFiles.value = Array.from(files);
  }
};

const addCustomField = () => {
  customFields.value.push({ name: "", value: "" });
};

const removeCustomField = (index: number) => {
  customFields.value.splice(index, 1);
};

const resetForm = () => {
  if (confirm("Are you sure you want to reset the form? All entered data will be lost.")) {
    form.value = {
      country: "",
      firstName: "",
      lastName: "",
      businessName: "",
      uniqueNumber: "",
      gender: "",
      title: "",
      mobile: "",
      email: "",
      dateOfBirth: "",
      address: "",
      city: "",
      state: "",
      zipcode: "",
      landline: "",
      workingStatus: "",
      description: ""
    };
    selectedPhoto.value = null;
    selectedFiles.value = [];
    customFields.value = [];
    showCustomFields.value = false;
    
    if (photoInput.value) photoInput.value.value = "";
    if (filesInput.value) filesInput.value.value = "";
  }
};

const goBack = () => {
  router.push("/investors");
};

const submitForm = () => {
  if (!isFormValid.value) {
    alert("Please fix validation errors before submitting");
    return;
  }
  
  // Prepare form data
  const investorData = {
    ...form.value,
    photo: selectedPhoto.value,
    files: selectedFiles.value,
    customFields: customFields.value.filter(field => field.name && field.value),
    submittedAt: new Date()
  };
  
  // In a real application, you would send this to your backend API
  console.log("Submitting investor data:", investorData);
  
  alert("Investor added successfully!");
  router.push("/investors");
};

defineOptions({
  name: "CreateInvestor",
});
</script>