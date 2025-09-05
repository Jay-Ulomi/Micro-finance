<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h1 class="text-2xl font-bold text-gray-900">Add Collateral</h1>
      <p class="text-gray-600 mt-2">
        Fill the form below to register a new collateral. Fields marked as required must be
        completed before saving.
      </p>
    </div>

    <!-- Form -->
    <form
      class="bg-white rounded-lg shadow-sm border border-gray-200 p-6 space-y-8"
      @submit.prevent="handleSubmit"
    >
      <!-- Required Fields -->
      <section>
        <h2 class="text-lg font-semibold text-gray-900 mb-4">Required Fields</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Type</label>
            <select v-model="form.type" class="form-input">
              <option value="">Select Type</option>
              <option value="Automobiles">Automobiles</option>
              <option value="Real Estate">Real Estate</option>
              <option value="Electronics">Electronics</option>
              <option value="Jewelry">Jewelry</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Add/Edit</label>
            <input v-model="form.addEdit" placeholder="Add/Edit" class="form-input" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Product Name</label>
            <input v-model="form.productName" placeholder="Product Name" class="form-input" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Register Date</label>
            <DatePicker v-model="form.registerDate" placeholder="Date" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Value</label>
            <input
              v-model.number="form.value"
              type="number"
              placeholder="Amount"
              class="form-input"
            />
          </div>
        </div>
      </section>

      <!-- Current Status -->
      <section>
        <h2 class="text-lg font-semibold text-gray-900 mb-4">Current Status</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div class="space-y-2">
            <label class="block text-sm font-medium text-gray-700">Deposited into Branch</label>
            <DatePicker v-model="form.status.depositedIntoBranch" placeholder="Date" />
          </div>
          <div class="space-y-2">
            <label class="block text-sm font-medium text-gray-700">Collateral with Borrower</label>
            <DatePicker v-model="form.status.withBorrower" placeholder="Date" />
          </div>
          <div class="space-y-2">
            <label class="block text-sm font-medium text-gray-700">Returned to Borrower</label>
            <DatePicker v-model="form.status.returnedToBorrower" placeholder="Date" />
          </div>
          <div class="space-y-2">
            <label class="block text-sm font-medium text-gray-700">Repossession Initiated</label>
            <DatePicker v-model="form.status.repossessionInitiated" placeholder="Date" />
          </div>
          <div class="space-y-2">
            <label class="block text-sm font-medium text-gray-700">Repossesed</label>
            <DatePicker v-model="form.status.repossesed" placeholder="Date" />
          </div>
          <div class="space-y-2">
            <label class="block text-sm font-medium text-gray-700">Under Auction</label>
            <DatePicker v-model="form.status.underAuction" placeholder="Date" />
          </div>
          <div class="space-y-2">
            <label class="block text-sm font-medium text-gray-700">Sold</label>
            <DatePicker v-model="form.status.sold" placeholder="Date" />
            <p class="text-xs text-gray-500">
              If you have sold the collateral, please mark it as Sold above and also add it in Other
              Income(left menu) → Add Other Income so it shows in Accounting(left menu)
            </p>
          </div>
          <div class="space-y-2">
            <label class="block text-sm font-medium text-gray-700">Lost</label>
            <DatePicker v-model="form.status.lost" placeholder="Date" />
          </div>
        </div>
      </section>

      <!-- Link to Loan(s) -->
      <section>
        <h2 class="text-lg font-semibold text-gray-900 mb-2">Link Collateral to Loan(s)</h2>
        <p class="text-sm text-gray-600 mb-4">
          You can link this collateral to a single loan or multiple loans. If you select multiple
          loans, the Loan to Value ratios will take into account the principal released for all the
          selected loans.
        </p>
        <label class="block text-sm font-medium text-gray-700 mb-2">Link to Loan(s)</label>
        <select v-model="form.linkedLoans" multiple class="form-input h-28">
          <option value="1000001">Josepj Ulomi - ADUINOLA (Loan #1000001, Due: 1050000)</option>
        </select>
        <p class="text-xs text-gray-500 mt-2">Click in the box above to select multiple loans</p>
      </section>

      <!-- Optional Fields -->
      <section>
        <h2 class="text-lg font-semibold text-gray-900 mb-4">Optional Fields</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Serial Number</label>
            <input v-model="form.serialNumber" placeholder="Serial Number" class="form-input" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Model Name</label>
            <input v-model="form.modelName" placeholder="Model Name" class="form-input" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Model Number</label>
            <input v-model="form.modelNumber" placeholder="Model Number" class="form-input" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Colour</label>
            <input v-model="form.colour" placeholder="Color" class="form-input" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Date of Manufacture</label>
            <DatePicker v-model="form.manufactureDate" placeholder="Date" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Condition</label>
            <input v-model="form.condition" placeholder="Condition" class="form-input" />
          </div>
          <div class="md:col-span-2">
            <label class="block text-sm font-medium text-gray-700 mb-1">Address</label>
            <input v-model="form.address" placeholder="Address" class="form-input" />
            <p class="text-xs text-gray-500 mt-1">
              If collateral is with borrower, you should enter the address where it is located
            </p>
          </div>
          <div class="md:col-span-2">
            <label class="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              v-model="form.description"
              rows="4"
              class="form-input"
              placeholder="Description"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Collateral Photo</label>
            <input type="file" @change="onFileChange($event, 'photo')" class="form-input" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Collateral Files</label>
            <input
              type="file"
              multiple
              @change="onFileChange($event, 'files')"
              class="form-input"
            />
          </div>
        </div>
      </section>

      <!-- Vehicles only -->
      <section>
        <h2 class="text-lg font-semibold text-gray-900 mb-4">For Vehicles only (optional)</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Registration Number</label>
            <input
              v-model="form.registrationNumber"
              placeholder="Registration Number"
              class="form-input"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Mileage</label>
            <input
              v-model.number="form.mileage"
              type="number"
              placeholder="Mileage"
              class="form-input"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Engine Number</label>
            <input v-model="form.engineNumber" placeholder="Engine Number" class="form-input" />
          </div>
        </div>
      </section>

      <!-- Actions -->
      <div class="flex items-center justify-between pt-6 border-t border-gray-200">
        <button type="button" class="btn-secondary" @click="resetForm">Reset</button>
        <button type="submit" class="btn-primary" :disabled="isSaving">
          <svg
            v-if="isSaving"
            class="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
            xmlns="http://www.w3.org/2000/svg"
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
            />
            <path
              class="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          {{ isSaving ? "Saving..." : "Save Collateral" }}
        </button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import DatePicker from "@/components/DatePicker.vue";

type NullableDate = string | null;

const isSaving = ref(false);

const form = ref({
  type: "",
  addEdit: "",
  productName: "",
  registerDate: "" as NullableDate,
  value: undefined as number | undefined,
  status: {
    depositedIntoBranch: "" as NullableDate,
    withBorrower: "" as NullableDate,
    returnedToBorrower: "" as NullableDate,
    repossessionInitiated: "" as NullableDate,
    repossesed: "" as NullableDate,
    underAuction: "" as NullableDate,
    sold: "" as NullableDate,
    lost: "" as NullableDate,
  },
  linkedLoans: [] as string[],
  serialNumber: "",
  modelName: "",
  modelNumber: "",
  colour: "",
  manufactureDate: "" as NullableDate,
  condition: "",
  address: "",
  description: "",
  photo: null as File | null,
  files: [] as File[],
  registrationNumber: "",
  mileage: undefined as number | undefined,
  engineNumber: "",
});

const onFileChange = (e: Event, key: "photo" | "files") => {
  const input = e.target as HTMLInputElement;
  if (!input.files) return;
  if (key === "photo") {
    form.value.photo = input.files[0];
  } else {
    form.value.files = Array.from(input.files);
  }
};

const resetForm = () => {
  form.value = {
    type: "",
    addEdit: "",
    productName: "",
    registerDate: "" as NullableDate,
    value: undefined,
    status: {
      depositedIntoBranch: "" as NullableDate,
      withBorrower: "" as NullableDate,
      returnedToBorrower: "" as NullableDate,
      repossessionInitiated: "" as NullableDate,
      repossesed: "" as NullableDate,
      underAuction: "" as NullableDate,
      sold: "" as NullableDate,
      lost: "" as NullableDate,
    },
    linkedLoans: [],
    serialNumber: "",
    modelName: "",
    modelNumber: "",
    colour: "",
    manufactureDate: "" as NullableDate,
    condition: "",
    address: "",
    description: "",
    photo: null,
    files: [],
    registrationNumber: "",
    mileage: undefined,
    engineNumber: "",
  };
};

const handleSubmit = async () => {
  isSaving.value = true;
  try {
    // Simulate save
    await new Promise((res) => setTimeout(res, 1200));
    alert("Collateral saved (mock).");
    resetForm();
  } finally {
    isSaving.value = false;
  }
};
</script>
