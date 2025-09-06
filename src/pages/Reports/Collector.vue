<template>
  <div class="p-6 space-y-8">
    <!-- Collector Report Section -->
    <div>
      <div class="mb-6">
        <h1 class="text-2xl font-bold text-gray-900">Collector Report (Staff)</h1>
        <p class="text-sm text-gray-600 mt-2">
          You can use this page to see the performance of your collectors and how much money they are collecting.
        </p>
      </div>

      <div class="bg-white rounded-lg shadow-sm border border-gray-200">
        <div class="p-6 space-y-6">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Date Range</label>
              <div class="flex items-center space-x-2">
                <input 
                  type="date" 
                  v-model="collectorDateFrom"
                  class="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                <span class="text-gray-500">to</span>
                <input 
                  type="date" 
                  v-model="collectorDateTo"
                  class="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
              </div>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Search:</label>
              <input 
                type="text" 
                v-model="collectorSearchQuery"
                placeholder="Search collector..."
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
            </div>
          </div>

          <div class="flex justify-end">
            <button
              @click="generateCollectorReport"
              class="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              Generate Report
            </button>
          </div>
        </div>
      </div>

      <!-- Collector Results Table -->
      <div v-if="collectorReportGenerated" class="mt-6 bg-white rounded-lg shadow-sm border border-gray-200">
        <div class="p-6">
          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Collector Name
                  </th>
                  <th class="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total Principal
                  </th>
                  <th class="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total Interest
                  </th>
                  <th class="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total Fees
                  </th>
                  <th class="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total Penalty
                  </th>
                  <th class="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total Collections
                  </th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr v-if="collectorData.length === 0">
                  <td colspan="6" class="px-4 py-8 text-center text-gray-500">
                    No collector data available for the selected date range.
                  </td>
                </tr>
                <tr v-else v-for="collector in collectorData" :key="collector.id" class="hover:bg-gray-50">
                  <td class="px-4 py-3 text-sm text-gray-900">
                    {{ collector.name }}
                  </td>
                  <td class="px-4 py-3 text-sm text-right text-gray-900">
                    {{ formatCurrency(collector.totalPrincipal) }}
                  </td>
                  <td class="px-4 py-3 text-sm text-right text-gray-900">
                    {{ formatCurrency(collector.totalInterest) }}
                  </td>
                  <td class="px-4 py-3 text-sm text-right text-gray-900">
                    {{ formatCurrency(collector.totalFees) }}
                  </td>
                  <td class="px-4 py-3 text-sm text-right text-gray-900">
                    {{ formatCurrency(collector.totalPenalty) }}
                  </td>
                  <td class="px-4 py-3 text-sm text-right font-medium text-gray-900">
                    {{ formatCurrency(collector.totalCollections) }}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>

    <!-- Deferred Income Section -->
    <div>
      <div class="mb-6">
        <h2 class="text-xl font-bold text-gray-900">Deferred Income</h2>
        <p class="text-sm text-gray-600 mt-1">Filter Deferred Income</p>
      </div>

      <div class="bg-white rounded-lg shadow-sm border border-gray-200">
        <div class="p-6 space-y-6">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Loan Products</label>
              <div class="flex items-center space-x-2">
                <input 
                  type="date" 
                  v-model="deferredDateFrom"
                  class="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                <span class="text-gray-500">to</span>
                <input 
                  type="date" 
                  v-model="deferredDateTo"
                  class="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
              </div>
            </div>
          </div>

          <div class="flex justify-end">
            <button
              @click="generateDeferredReport"
              class="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              Generate Report
            </button>
          </div>
        </div>
      </div>

      <!-- Deferred Income Results -->
      <div v-if="deferredReportGenerated" class="mt-6 bg-white rounded-lg shadow-sm border border-gray-200">
        <div class="p-6">
          <div class="mb-4">
            <p class="text-sm text-gray-600">
              From {{ formatDate(deferredDateFrom) }} - {{ formatDate(deferredDateTo) }}
              <button @click="generateDeferredReport" class="ml-2 text-primary-600 hover:text-primary-700 text-sm">(change dates above)</button>
            </p>
          </div>

          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Loan Product
                  </th>
                  <th class="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Deferred Principal
                  </th>
                  <th class="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Deferred Interest
                  </th>
                  <th class="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Deferred Fees
                  </th>
                  <th class="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Deferred Penalty
                  </th>
                  <th class="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total Deferred Income
                  </th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr v-for="product in deferredIncomeData" :key="product.id" class="hover:bg-gray-50">
                  <td class="px-4 py-3 text-sm text-gray-900">
                    {{ product.name }}
                  </td>
                  <td class="px-4 py-3 text-sm text-right text-gray-900">
                    {{ formatCurrency(product.deferredPrincipal) }}
                  </td>
                  <td class="px-4 py-3 text-sm text-right text-gray-900">
                    {{ formatCurrency(product.deferredInterest) }}
                  </td>
                  <td class="px-4 py-3 text-sm text-right text-gray-900">
                    {{ formatCurrency(product.deferredFees) }}
                  </td>
                  <td class="px-4 py-3 text-sm text-right text-gray-900">
                    {{ formatCurrency(product.deferredPenalty) }}
                  </td>
                  <td class="px-4 py-3 text-sm text-right font-medium text-gray-900">
                    {{ formatCurrency(product.totalDeferredIncome) }}
                  </td>
                </tr>
                <!-- Total Row -->
                <tr class="bg-gray-100 font-bold">
                  <td class="px-4 py-3 text-sm text-gray-900">Total</td>
                  <td class="px-4 py-3 text-sm text-right text-gray-900">
                    {{ formatCurrency(deferredTotals.deferredPrincipal) }}
                  </td>
                  <td class="px-4 py-3 text-sm text-right text-gray-900">
                    {{ formatCurrency(deferredTotals.deferredInterest) }}
                  </td>
                  <td class="px-4 py-3 text-sm text-right text-gray-900">
                    {{ formatCurrency(deferredTotals.deferredFees) }}
                  </td>
                  <td class="px-4 py-3 text-sm text-right text-gray-900">
                    {{ formatCurrency(deferredTotals.deferredPenalty) }}
                  </td>
                  <td class="px-4 py-3 text-sm text-right font-bold text-gray-900">
                    {{ formatCurrency(deferredTotals.totalDeferredIncome) }}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>

    <!-- Deferred Income Monthly Section -->
    <div>
      <div class="mb-6">
        <h2 class="text-xl font-bold text-gray-900">Deferred Income Monthly</h2>
        <p class="text-sm text-gray-600 mt-1">Filter Deferred Income</p>
      </div>

      <div class="bg-white rounded-lg shadow-sm border border-gray-200">
        <div class="p-6 space-y-6">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Loan Products</label>
              <div class="space-y-2">
                <div class="flex flex-wrap gap-2">
                  <span v-for="status in loanStatuses" :key="status.key" 
                        :class="getStatusBadgeClass(status.key)"
                        class="px-2 py-1 text-xs rounded-full">
                    {{ status.name }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Monthly Projection Table -->
      <div v-if="monthlyReportGenerated" class="mt-6 bg-white rounded-lg shadow-sm border border-gray-200">
        <div class="p-6">
          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200 text-sm">
              <thead class="bg-gray-50">
                <tr>
                  <th class="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Loan Product
                  </th>
                  <th class="px-3 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Until Today
                  </th>
                  <th class="px-3 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    6th Sep - 30th Sep
                  </th>
                  <th class="px-3 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Oct
                  </th>
                  <th class="px-3 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Nov
                  </th>
                  <th class="px-3 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Dec
                  </th>
                  <th class="px-3 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Jan
                  </th>
                  <th class="px-3 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Feb
                  </th>
                  <th class="px-3 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Mar
                  </th>
                  <th class="px-3 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Apr
                  </th>
                  <th class="px-3 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    May
                  </th>
                  <th class="px-3 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Jun
                  </th>
                  <th class="px-3 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Jul
                  </th>
                  <th class="px-3 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Aug
                  </th>
                  <th class="px-3 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Sep
                  </th>
                  <th class="px-3 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Oct
                  </th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <template v-for="product in monthlyProjectionData" :key="product.id">
                  <!-- Product Header -->
                  <tr class="bg-gray-50 font-medium">
                    <td colspan="15" class="px-3 py-2 text-sm text-gray-900">{{ product.name }}</td>
                  </tr>
                  
                  <!-- Principal Projection -->
                  <tr>
                    <td class="px-3 py-2 text-sm text-gray-700 pl-6">Principal Projection</td>
                    <td class="px-3 py-2 text-sm text-right text-gray-900">{{ formatCurrency(product.projections.principal.untilToday) }}</td>
                    <td class="px-3 py-2 text-sm text-right text-gray-900">{{ formatCurrency(product.projections.principal.currentMonth) }}</td>
                    <td v-for="month in product.projections.principal.futureMonths" :key="month" 
                        class="px-3 py-2 text-sm text-right text-gray-900">{{ formatCurrency(month) }}</td>
                  </tr>
                  
                  <!-- Interest Projection -->
                  <tr>
                    <td class="px-3 py-2 text-sm text-gray-700 pl-6">Interest Projection</td>
                    <td class="px-3 py-2 text-sm text-right text-gray-900">{{ formatCurrency(product.projections.interest.untilToday) }}</td>
                    <td class="px-3 py-2 text-sm text-right text-gray-900">{{ formatCurrency(product.projections.interest.currentMonth) }}</td>
                    <td v-for="month in product.projections.interest.futureMonths" :key="month" 
                        class="px-3 py-2 text-sm text-right text-gray-900">{{ formatCurrency(month) }}</td>
                  </tr>
                  
                  <!-- Fees Projection -->
                  <tr>
                    <td class="px-3 py-2 text-sm text-gray-700 pl-6">Fees Projection</td>
                    <td class="px-3 py-2 text-sm text-right text-gray-900">{{ formatCurrency(product.projections.fees.untilToday) }}</td>
                    <td class="px-3 py-2 text-sm text-right text-gray-900">{{ formatCurrency(product.projections.fees.currentMonth) }}</td>
                    <td v-for="month in product.projections.fees.futureMonths" :key="month" 
                        class="px-3 py-2 text-sm text-right text-gray-900">{{ formatCurrency(month) }}</td>
                  </tr>
                  
                  <!-- Penalty Projection -->
                  <tr>
                    <td class="px-3 py-2 text-sm text-gray-700 pl-6">Penalty Projection</td>
                    <td class="px-3 py-2 text-sm text-right text-gray-900">{{ formatCurrency(product.projections.penalty.untilToday) }}</td>
                    <td class="px-3 py-2 text-sm text-right text-gray-900">{{ formatCurrency(product.projections.penalty.currentMonth) }}</td>
                    <td v-for="month in product.projections.penalty.futureMonths" :key="month" 
                        class="px-3 py-2 text-sm text-right text-gray-900">{{ formatCurrency(month) }}</td>
                  </tr>
                  
                  <!-- Total Projection -->
                  <tr class="bg-blue-50">
                    <td class="px-3 py-2 text-sm font-medium text-gray-900 pl-6">Total Projection</td>
                    <td class="px-3 py-2 text-sm text-right font-medium text-gray-900">{{ formatCurrency(product.projections.total.untilToday) }}</td>
                    <td class="px-3 py-2 text-sm text-right font-medium text-gray-900">{{ formatCurrency(product.projections.total.currentMonth) }}</td>
                    <td v-for="month in product.projections.total.futureMonths" :key="month" 
                        class="px-3 py-2 text-sm text-right font-medium text-gray-900">{{ formatCurrency(month) }}</td>
                  </tr>
                  
                  <!-- Pending Due -->
                  <tr>
                    <td class="px-3 py-2 text-sm text-gray-700 pl-6">Pending Due</td>
                    <td class="px-3 py-2 text-sm text-right text-gray-900">{{ formatCurrency(product.pendingDue) }}</td>
                    <td colspan="13"></td>
                  </tr>
                </template>
                
                <!-- Grand Total Section -->
                <tr class="bg-gray-100 font-bold border-t-2">
                  <td class="px-3 py-2 text-sm text-gray-900">Total</td>
                  <td colspan="14"></td>
                </tr>
                <tr class="bg-gray-100 font-bold">
                  <td class="px-3 py-2 text-sm text-gray-900 pl-6">Total Principal Projection</td>
                  <td class="px-3 py-2 text-sm text-right text-gray-900">{{ formatCurrency(monthlyTotals.principal.untilToday) }}</td>
                  <td class="px-3 py-2 text-sm text-right text-gray-900">{{ formatCurrency(monthlyTotals.principal.currentMonth) }}</td>
                  <td v-for="month in monthlyTotals.principal.futureMonths" :key="month" 
                      class="px-3 py-2 text-sm text-right text-gray-900">{{ formatCurrency(month) }}</td>
                </tr>
                <tr class="bg-gray-100 font-bold">
                  <td class="px-3 py-2 text-sm text-gray-900 pl-6">Total Interest Projection</td>
                  <td class="px-3 py-2 text-sm text-right text-gray-900">{{ formatCurrency(monthlyTotals.interest.untilToday) }}</td>
                  <td class="px-3 py-2 text-sm text-right text-gray-900">{{ formatCurrency(monthlyTotals.interest.currentMonth) }}</td>
                  <td v-for="month in monthlyTotals.interest.futureMonths" :key="month" 
                      class="px-3 py-2 text-sm text-right text-gray-900">{{ formatCurrency(month) }}</td>
                </tr>
                <tr class="bg-gray-100 font-bold">
                  <td class="px-3 py-2 text-sm text-gray-900 pl-6">Total Fees Projection</td>
                  <td class="px-3 py-2 text-sm text-right text-gray-900">{{ formatCurrency(monthlyTotals.fees.untilToday) }}</td>
                  <td class="px-3 py-2 text-sm text-right text-gray-900">{{ formatCurrency(monthlyTotals.fees.currentMonth) }}</td>
                  <td v-for="month in monthlyTotals.fees.futureMonths" :key="month" 
                      class="px-3 py-2 text-sm text-right text-gray-900">{{ formatCurrency(month) }}</td>
                </tr>
                <tr class="bg-gray-100 font-bold">
                  <td class="px-3 py-2 text-sm text-gray-900 pl-6">Total Penalty Projection</td>
                  <td class="px-3 py-2 text-sm text-right text-gray-900">{{ formatCurrency(monthlyTotals.penalty.untilToday) }}</td>
                  <td class="px-3 py-2 text-sm text-right text-gray-900">{{ formatCurrency(monthlyTotals.penalty.currentMonth) }}</td>
                  <td v-for="month in monthlyTotals.penalty.futureMonths" :key="month" 
                      class="px-3 py-2 text-sm text-right text-gray-900">{{ formatCurrency(month) }}</td>
                </tr>
                <tr class="bg-blue-100 font-bold">
                  <td class="px-3 py-2 text-sm text-gray-900 pl-6">Total Projection</td>
                  <td class="px-3 py-2 text-sm text-right text-gray-900">{{ formatCurrency(monthlyTotals.total.untilToday) }}</td>
                  <td class="px-3 py-2 text-sm text-right text-gray-900">{{ formatCurrency(monthlyTotals.total.currentMonth) }}</td>
                  <td v-for="month in monthlyTotals.total.futureMonths" :key="month" 
                      class="px-3 py-2 text-sm text-right text-gray-900">{{ formatCurrency(month) }}</td>
                </tr>
                <tr class="bg-gray-100 font-bold">
                  <td class="px-3 py-2 text-sm text-gray-900 pl-6">Total Pending Due</td>
                  <td class="px-3 py-2 text-sm text-right text-gray-900">{{ formatCurrency(monthlyTotals.pendingDue) }}</td>
                  <td colspan="13"></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';

interface CollectorData {
  id: string;
  name: string;
  totalPrincipal: number;
  totalInterest: number;
  totalFees: number;
  totalPenalty: number;
  totalCollections: number;
}

interface DeferredIncomeData {
  id: string;
  name: string;
  deferredPrincipal: number;
  deferredInterest: number;
  deferredFees: number;
  deferredPenalty: number;
  totalDeferredIncome: number;
}

interface MonthlyProjection {
  untilToday: number;
  currentMonth: number;
  futureMonths: number[];
}

interface ProductMonthlyData {
  id: string;
  name: string;
  projections: {
    principal: MonthlyProjection;
    interest: MonthlyProjection;
    fees: MonthlyProjection;
    penalty: MonthlyProjection;
    total: MonthlyProjection;
  };
  pendingDue: number;
}

const currentDate = new Date();
const lastYear = new Date();
lastYear.setFullYear(currentDate.getFullYear() - 1);

const collectorDateFrom = ref(lastYear.toISOString().split('T')[0]);
const collectorDateTo = ref(currentDate.toISOString().split('T')[0]);
const collectorSearchQuery = ref('');
const collectorReportGenerated = ref(false);

const deferredDateFrom = ref('2025-09-06');
const deferredDateTo = ref('2026-09-05');
const deferredReportGenerated = ref(false);
const monthlyReportGenerated = ref(true); // Show by default based on your example

const collectorData = ref<CollectorData[]>([]);

const deferredIncomeData = ref<DeferredIncomeData[]>([
  {
    id: '1',
    name: 'Personal Loan',
    deferredPrincipal: 1000000,
    deferredInterest: 50000,
    deferredFees: 0,
    deferredPenalty: 0,
    totalDeferredIncome: 1050000
  }
]);

const monthlyProjectionData = ref<ProductMonthlyData[]>([
  {
    id: '1',
    name: 'Personal Loan',
    projections: {
      principal: {
        untilToday: 0,
        currentMonth: 1000000,
        futureMonths: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
      },
      interest: {
        untilToday: 0,
        currentMonth: 50000,
        futureMonths: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
      },
      fees: {
        untilToday: 0,
        currentMonth: 0,
        futureMonths: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
      },
      penalty: {
        untilToday: 0,
        currentMonth: 0,
        futureMonths: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
      },
      total: {
        untilToday: 0,
        currentMonth: 1050000,
        futureMonths: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
      }
    },
    pendingDue: 0
  }
]);

const loanStatuses = ref([
  { key: 'processing', name: 'Processing' },
  { key: 'open', name: 'Open' },
  { key: 'current', name: 'Current' },
  { key: 'due-today', name: 'Due Today' },
  { key: 'missed', name: 'Missed Repayment' },
  { key: 'arrears', name: 'Arrears' },
  { key: 'past-maturity', name: 'Past Maturity' },
  { key: 'restructured', name: 'Restructured' },
  { key: 'fully-paid', name: 'Fully Paid' },
  { key: 'defaulted', name: 'Defaulted' },
  { key: 'credit-counseling', name: 'Credit Counseling' },
  { key: 'collection-agency', name: 'Collection Agency' },
  { key: 'sequestrate', name: 'Sequestrate' },
  { key: 'debt-review', name: 'Debt Review' },
  { key: 'fraud', name: 'Fraud' },
  { key: 'investigation', name: 'Investigation' },
  { key: 'legal', name: 'Legal' },
  { key: 'write-off', name: 'Write-Off' },
  { key: 'denied', name: 'Denied' },
  { key: 'not-taken-up', name: 'Not Taken Up' }
]);

const deferredTotals = computed(() => {
  return deferredIncomeData.value.reduce((acc, product) => {
    return {
      deferredPrincipal: acc.deferredPrincipal + product.deferredPrincipal,
      deferredInterest: acc.deferredInterest + product.deferredInterest,
      deferredFees: acc.deferredFees + product.deferredFees,
      deferredPenalty: acc.deferredPenalty + product.deferredPenalty,
      totalDeferredIncome: acc.totalDeferredIncome + product.totalDeferredIncome
    };
  }, {
    deferredPrincipal: 0,
    deferredInterest: 0,
    deferredFees: 0,
    deferredPenalty: 0,
    totalDeferredIncome: 0
  });
});

const monthlyTotals = computed(() => {
  const totals = {
    principal: { untilToday: 0, currentMonth: 0, futureMonths: new Array(13).fill(0) },
    interest: { untilToday: 0, currentMonth: 0, futureMonths: new Array(13).fill(0) },
    fees: { untilToday: 0, currentMonth: 0, futureMonths: new Array(13).fill(0) },
    penalty: { untilToday: 0, currentMonth: 0, futureMonths: new Array(13).fill(0) },
    total: { untilToday: 0, currentMonth: 0, futureMonths: new Array(13).fill(0) },
    pendingDue: 0
  };

  monthlyProjectionData.value.forEach(product => {
    totals.principal.untilToday += product.projections.principal.untilToday;
    totals.principal.currentMonth += product.projections.principal.currentMonth;
    totals.interest.untilToday += product.projections.interest.untilToday;
    totals.interest.currentMonth += product.projections.interest.currentMonth;
    totals.fees.untilToday += product.projections.fees.untilToday;
    totals.fees.currentMonth += product.projections.fees.currentMonth;
    totals.penalty.untilToday += product.projections.penalty.untilToday;
    totals.penalty.currentMonth += product.projections.penalty.currentMonth;
    totals.total.untilToday += product.projections.total.untilToday;
    totals.total.currentMonth += product.projections.total.currentMonth;
    totals.pendingDue += product.pendingDue;

    product.projections.principal.futureMonths.forEach((month, index) => {
      totals.principal.futureMonths[index] += month;
    });
    product.projections.interest.futureMonths.forEach((month, index) => {
      totals.interest.futureMonths[index] += month;
    });
    product.projections.fees.futureMonths.forEach((month, index) => {
      totals.fees.futureMonths[index] += month;
    });
    product.projections.penalty.futureMonths.forEach((month, index) => {
      totals.penalty.futureMonths[index] += month;
    });
    product.projections.total.futureMonths.forEach((month, index) => {
      totals.total.futureMonths[index] += month;
    });
  });

  return totals;
});

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
};

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
};

const getStatusBadgeClass = (statusKey: string) => {
  const statusClasses = {
    'processing': 'bg-yellow-100 text-yellow-800',
    'open': 'bg-green-100 text-green-800',
    'current': 'bg-blue-100 text-blue-800',
    'due-today': 'bg-orange-100 text-orange-800',
    'missed': 'bg-red-100 text-red-800',
    'arrears': 'bg-red-100 text-red-800',
    'past-maturity': 'bg-red-100 text-red-800',
    'restructured': 'bg-purple-100 text-purple-800',
    'fully-paid': 'bg-green-100 text-green-800',
    'defaulted': 'bg-gray-100 text-gray-800'
  };
  return statusClasses[statusKey as keyof typeof statusClasses] || 'bg-gray-100 text-gray-800';
};

const generateCollectorReport = () => {
  console.log('Generating collector report with filters:', {
    dateFrom: collectorDateFrom.value,
    dateTo: collectorDateTo.value,
    searchQuery: collectorSearchQuery.value,
  });
  collectorReportGenerated.value = true;
};

const generateDeferredReport = () => {
  console.log('Generating deferred income report with filters:', {
    dateFrom: deferredDateFrom.value,
    dateTo: deferredDateTo.value,
  });
  deferredReportGenerated.value = true;
};
</script>

<style scoped>
@media print {
  .no-print {
    display: none;
  }
}
</style>