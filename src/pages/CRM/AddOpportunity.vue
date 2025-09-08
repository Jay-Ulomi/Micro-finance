<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Add Opportunity</h1>
        <p class="text-sm text-gray-600 mt-1">Create a new sales opportunity</p>
      </div>
      <button @click="$router.back()" class="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors">
        <ArrowLeftIcon class="w-4 h-4 mr-2 inline" />
        Back
      </button>
    </div>

    <form @submit.prevent="submitForm" class="space-y-8">
      <!-- Opportunity Information -->
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 class="text-lg font-semibold text-gray-900 mb-6">Opportunity Information</h2>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <!-- Opportunity Name -->
          <div class="md:col-span-2">
            <label for="opportunityName" class="form-label">
              Opportunity Name <span class="text-red-500">*</span>
            </label>
            <input
              id="opportunityName"
              v-model="form.opportunityName"
              type="text"
              placeholder="Enter opportunity name"
              class="form-input"
              required
            />
          </div>

          <!-- Account/Contact -->
          <div>
            <label for="account" class="form-label">
              Account/Contact <span class="text-red-500">*</span>
            </label>
            <select id="account" v-model="form.account" class="form-input" required>
              <option value="">Select Account</option>
              <option v-for="account in accounts" :key="account.id" :value="account.id">
                {{ account.name }}
              </option>
            </select>
          </div>

          <!-- Stage -->
          <div>
            <label for="stage" class="form-label">
              Stage <span class="text-red-500">*</span>
            </label>
            <select id="stage" v-model="form.stage" class="form-input" required>
              <option value="">Select Stage</option>
              <option value="prospecting">Prospecting</option>
              <option value="qualification">Qualification</option>
              <option value="needs_analysis">Needs Analysis</option>
              <option value="value_proposition">Value Proposition</option>
              <option value="proposal">Proposal</option>
              <option value="negotiation">Negotiation</option>
              <option value="closed_won">Closed Won</option>
              <option value="closed_lost">Closed Lost</option>
            </select>
          </div>

          <!-- Amount -->
          <div>
            <label for="amount" class="form-label">
              Amount <span class="text-red-500">*</span>
            </label>
            <div class="relative">
              <span class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
              <input
                id="amount"
                v-model.number="form.amount"
                type="number"
                step="0.01"
                min="0"
                placeholder="0.00"
                class="form-input pl-8"
                required
              />
            </div>
          </div>

          <!-- Currency -->
          <div>
            <label for="currency" class="form-label">Currency</label>
            <select id="currency" v-model="form.currency" class="form-input">
              <option value="USD">USD</option>
              <option value="TZS">TZS</option>
              <option value="KES">KES</option>
              <option value="UGX">UGX</option>
              <option value="RWF">RWF</option>
              <option value="BIF">BIF</option>
            </select>
          </div>

          <!-- Close Date -->
          <div>
            <label for="closeDate" class="form-label">
              Expected Close Date <span class="text-red-500">*</span>
            </label>
            <input
              id="closeDate"
              v-model="form.closeDate"
              type="date"
              class="form-input"
              required
            />
          </div>

          <!-- Probability -->
          <div>
            <label for="probability" class="form-label">
              Probability (%) <span class="text-red-500">*</span>
            </label>
            <input
              id="probability"
              v-model.number="form.probability"
              type="number"
              min="0"
              max="100"
              placeholder="0-100"
              class="form-input"
              required
            />
          </div>

          <!-- Lead Source -->
          <div>
            <label for="leadSource" class="form-label">Lead Source</label>
            <select id="leadSource" v-model="form.leadSource" class="form-input">
              <option value="">Select Source</option>
              <option value="website">Website</option>
              <option value="referral">Referral</option>
              <option value="social_media">Social Media</option>
              <option value="email_campaign">Email Campaign</option>
              <option value="cold_call">Cold Call</option>
              <option value="trade_show">Trade Show</option>
              <option value="advertisement">Advertisement</option>
              <option value="partner">Partner</option>
              <option value="existing_customer">Existing Customer</option>
              <option value="other">Other</option>
            </select>
          </div>

          <!-- Type -->
          <div>
            <label for="type" class="form-label">Type</label>
            <select id="type" v-model="form.type" class="form-input">
              <option value="">Select Type</option>
              <option value="new_business">New Business</option>
              <option value="existing_business">Existing Business</option>
              <option value="upsell">Upsell</option>
              <option value="renewal">Renewal</option>
            </select>
          </div>

          <!-- Next Step -->
          <div class="md:col-span-2">
            <label for="nextStep" class="form-label">Next Step</label>
            <input
              id="nextStep"
              v-model="form.nextStep"
              type="text"
              placeholder="Enter next step"
              class="form-input"
            />
          </div>
        </div>
      </div>

      <!-- Sales Information -->
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 class="text-lg font-semibold text-gray-900 mb-6">Sales Information</h2>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <!-- Assigned To -->
          <div>
            <label for="assignedTo" class="form-label">
              Assigned To <span class="text-red-500">*</span>
            </label>
            <select id="assignedTo" v-model="form.assignedTo" class="form-input" required>
              <option value="">Select Sales Rep</option>
              <option v-for="rep in salesReps" :key="rep.id" :value="rep.id">
                {{ rep.name }}
              </option>
            </select>
          </div>

          <!-- Sales Team -->
          <div>
            <label for="salesTeam" class="form-label">Sales Team</label>
            <select id="salesTeam" v-model="form.salesTeam" class="form-input">
              <option value="">Select Team</option>
              <option value="enterprise">Enterprise</option>
              <option value="mid_market">Mid-Market</option>
              <option value="small_business">Small Business</option>
              <option value="retail">Retail</option>
            </select>
          </div>

          <!-- Campaign -->
          <div>
            <label for="campaign" class="form-label">Campaign</label>
            <select id="campaign" v-model="form.campaign" class="form-input">
              <option value="">Select Campaign</option>
              <option value="q1_promo">Q1 Promotion</option>
              <option value="trade_show_2024">Trade Show 2024</option>
              <option value="email_blast">Email Blast</option>
              <option value="referral_program">Referral Program</option>
            </select>
          </div>

          <!-- Competitor -->
          <div>
            <label for="competitor" class="form-label">Primary Competitor</label>
            <input
              id="competitor"
              v-model="form.competitor"
              type="text"
              placeholder="Enter competitor name"
              class="form-input"
            />
          </div>
        </div>
      </div>

      <!-- Products/Services -->
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 class="text-lg font-semibold text-gray-900 mb-6">Products & Services</h2>
        
        <div class="space-y-4">
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <!-- Product -->
            <div>
              <label for="product" class="form-label">Product/Service</label>
              <select v-model="currentProduct.product" class="form-input">
                <option value="">Select Product</option>
                <option v-for="product in products" :key="product.id" :value="product.id">
                  {{ product.name }}
                </option>
              </select>
            </div>

            <!-- Quantity -->
            <div>
              <label for="quantity" class="form-label">Quantity</label>
              <input
                v-model.number="currentProduct.quantity"
                type="number"
                min="1"
                placeholder="1"
                class="form-input"
              />
            </div>

            <!-- Unit Price -->
            <div class="flex items-end space-x-2">
              <div class="flex-1">
                <label for="unitPrice" class="form-label">Unit Price</label>
                <input
                  v-model.number="currentProduct.unitPrice"
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="0.00"
                  class="form-input"
                />
              </div>
              <button
                type="button"
                @click="addProduct"
                class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Add
              </button>
            </div>
          </div>

          <!-- Added Products List -->
          <div v-if="form.products.length > 0" class="mt-4">
            <h4 class="font-medium text-gray-900 mb-2">Added Products:</h4>
            <div class="space-y-2">
              <div
                v-for="(product, index) in form.products"
                :key="index"
                class="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div class="flex-1">
                  <span class="font-medium">{{ getProductName(product.product) }}</span>
                  <span class="text-gray-500 ml-2">Qty: {{ product.quantity }} × ${{ product.unitPrice }}</span>
                </div>
                <div class="flex items-center space-x-2">
                  <span class="font-medium">${{ (product.quantity * product.unitPrice).toFixed(2) }}</span>
                  <button
                    type="button"
                    @click="removeProduct(index)"
                    class="text-red-600 hover:text-red-800"
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Additional Information -->
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 class="text-lg font-semibold text-gray-900 mb-6">Additional Information</h2>
        
        <div class="space-y-6">
          <!-- Description -->
          <div>
            <label for="description" class="form-label">Description</label>
            <textarea
              id="description"
              v-model="form.description"
              rows="4"
              placeholder="Enter opportunity description..."
              class="form-input"
            ></textarea>
          </div>

          <!-- Notes -->
          <div>
            <label for="notes" class="form-label">Internal Notes</label>
            <textarea
              id="notes"
              v-model="form.notes"
              rows="4"
              placeholder="Enter internal notes..."
              class="form-input"
            ></textarea>
          </div>
        </div>
      </div>

      <!-- Form Actions -->
      <div class="flex justify-end space-x-4">
        <button
          type="button"
          @click="$router.back()"
          class="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Save Opportunity
        </button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { ArrowLeftIcon } from '@heroicons/vue/24/outline'

const router = useRouter()

interface Product {
  product: string
  quantity: number
  unitPrice: number
}

interface OpportunityForm {
  opportunityName: string
  account: string
  stage: string
  amount: number
  currency: string
  closeDate: string
  probability: number
  leadSource: string
  type: string
  nextStep: string
  assignedTo: string
  salesTeam: string
  campaign: string
  competitor: string
  products: Product[]
  description: string
  notes: string
}

const form = ref<OpportunityForm>({
  opportunityName: '',
  account: '',
  stage: '',
  amount: 0,
  currency: 'USD',
  closeDate: '',
  probability: 50,
  leadSource: '',
  type: '',
  nextStep: '',
  assignedTo: '',
  salesTeam: '',
  campaign: '',
  competitor: '',
  products: [],
  description: '',
  notes: ''
})

const currentProduct = ref<Product>({
  product: '',
  quantity: 1,
  unitPrice: 0
})

const accounts = ref([
  { id: '1', name: 'ABC Corporation' },
  { id: '2', name: 'XYZ Limited' },
  { id: '3', name: 'Tech Solutions Inc' },
  { id: '4', name: 'Global Enterprises' }
])

const salesReps = ref([
  { id: '1', name: 'John Smith' },
  { id: '2', name: 'Jane Doe' },
  { id: '3', name: 'Mike Johnson' },
  { id: '4', name: 'Sarah Williams' }
])

const products = ref([
  { id: '1', name: 'Loan Product A' },
  { id: '2', name: 'Savings Account' },
  { id: '3', name: 'Investment Plan' },
  { id: '4', name: 'Insurance Product' }
])

const getProductName = (productId: string) => {
  const product = products.value.find(p => p.id === productId)
  return product ? product.name : 'Unknown Product'
}

const addProduct = () => {
  if (currentProduct.value.product && currentProduct.value.quantity > 0 && currentProduct.value.unitPrice > 0) {
    form.value.products.push({ ...currentProduct.value })
    currentProduct.value = {
      product: '',
      quantity: 1,
      unitPrice: 0
    }
    updateTotalAmount()
  }
}

const removeProduct = (index: number) => {
  form.value.products.splice(index, 1)
  updateTotalAmount()
}

const updateTotalAmount = () => {
  form.value.amount = form.value.products.reduce(
    (total, product) => total + (product.quantity * product.unitPrice),
    0
  )
}

const submitForm = async () => {
  try {
    // TODO: Implement API call to save opportunity
    console.log('Saving opportunity:', form.value)
    
    // Show success message
    alert('Opportunity created successfully!')
    
    // Navigate back to opportunities list
    router.push('/crm/opportunities')
  } catch (error) {
    console.error('Error saving opportunity:', error)
    alert('Error creating opportunity. Please try again.')
  }
}

onMounted(() => {
  // Load any necessary data
})
</script>