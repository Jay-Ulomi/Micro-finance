<template>
  <div class="space-y-6">
    <!-- Page header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p class="mt-1 text-sm text-gray-500">Overview of your loan management system</p>
      </div>
      <div class="flex space-x-3">
        <!-- Date Picker -->
        <DatePicker
          v-model="selectedDate"
          label="Filter by Date"
          placeholder="Select date to filter data"
          @change="handleDateChange"
        />
        <button class="btn-secondary">
          <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          Export Report
        </button>
        <button class="btn-primary">
          <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 6v6m0 0v6m0-6h6m-6 0H6"
            />
          </svg>
          New Loan
        </button>
      </div>
    </div>

    <!-- Stats cards -->
    <div class="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
      <div class="card">
        <div class="card-body">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <div class="w-8 h-8 bg-blue-100 rounded-md flex items-center justify-center">
                <svg
                  class="w-5 h-5 text-blue-600"
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
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-500">Total Customers</p>
              <p class="text-2xl font-semibold text-gray-900">{{ stats.totalCustomers || 0 }}</p>
            </div>
          </div>
        </div>
      </div>

      <div class="card">
        <div class="card-body">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <div class="w-8 h-8 bg-green-100 rounded-md flex items-center justify-center">
                <svg
                  class="w-5 h-5 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                  />
                </svg>
              </div>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-500">Active Loans</p>
              <p class="text-2xl font-semibold text-gray-900">{{ stats.activeLoans || 0 }}</p>
            </div>
          </div>
        </div>
      </div>

      <div class="card">
        <div class="card-body">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <div class="w-8 h-8 bg-yellow-100 rounded-md flex items-center justify-center">
                <svg
                  class="w-5 h-5 text-yellow-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-500">Overdue Loans</p>
              <p class="text-2xl font-semibold text-gray-900">{{ stats.overdueLoans || 0 }}</p>
            </div>
          </div>
        </div>
      </div>

      <div class="card">
        <div class="card-body">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <div class="w-8 h-8 bg-purple-100 rounded-md flex items-center justify-center">
                <svg
                  class="w-5 h-5 text-purple-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
                  />
                </svg>
              </div>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-500">Total Disbursed</p>
              <p class="text-2xl font-semibold text-gray-900">
                {{ formatCurrency(stats.totalDisbursed || 0) }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Charts section -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Loan Status Distribution -->
      <div class="card">
        <div class="card-header">
          <h3 class="text-base font-medium text-gray-900">Loan Status Distribution</h3>
        </div>
        <div class="card-body">
          <canvas ref="loanStatusChart" class="w-full h-64"></canvas>
        </div>
      </div>

      <!-- Monthly Loan Trends -->
      <div class="card">
        <div class="card-header">
          <h3 class="text-base font-medium text-gray-900">Monthly Loan Trends</h3>
        </div>
        <div class="card-body">
          <canvas ref="monthlyTrendChart" class="w-full h-64"></canvas>
        </div>
      </div>
    </div>

    <!-- Recent Activity -->
    <div class="card">
      <div class="card-header">
        <h3 class="text-base font-medium text-gray-900">Recent Activity</h3>
      </div>
      <div class="card-body">
        <div class="flow-root">
          <ul class="-mb-8">
            <li
              v-for="(activity, index) in recentActivities"
              :key="activity.id"
              class="relative pb-8"
            >
              <div
                v-if="index !== recentActivities.length - 1"
                class="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200"
              ></div>
              <div class="relative flex space-x-3">
                <div>
                  <span
                    class="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center ring-8 ring-white"
                  >
                    <svg
                      class="h-5 w-5 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </span>
                </div>
                <div class="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                  <div>
                    <p class="text-sm text-gray-500">
                      {{ activity.description }}
                      <span class="font-medium text-gray-900">{{ activity.customerName }}</span>
                    </p>
                  </div>
                  <div class="text-right text-sm whitespace-nowrap text-gray-500">
                    <time>{{ getRelativeTime(activity.timestamp) }}</time>
                  </div>
                </div>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, reactive } from "vue";
import { Chart, registerables } from "chart.js";
import { reportsApi } from "@/api/reports";
import { formatCurrency } from "@/utils/formatCurrency";
import { getRelativeTime } from "@/utils/formatDate";

Chart.register(...registerables);

const stats = reactive({
  totalCustomers: 0,
  totalLoans: 0,
  activeLoans: 0,
  overdueLoans: 0,
  totalDisbursed: 0,
  totalCollected: 0,
  monthlyDisbursements: 0,
  monthlyCollections: 0,
});

const recentActivities = ref([
  {
    id: 1,
    description: "New loan application submitted by ",
    customerName: "John Doe",
    timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
  },
  {
    id: 2,
    description: "Loan approved for ",
    customerName: "Jane Smith",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
  },
  {
    id: 3,
    description: "Payment received from ",
    customerName: "Mike Johnson",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
  },
]);

const loanStatusChart = ref<HTMLCanvasElement>();
const monthlyTrendChart = ref<HTMLCanvasElement>();

onMounted(async () => {
  try {
    // Fetch dashboard stats
    const dashboardStats = await reportsApi.getDashboardStats();
    Object.assign(stats, dashboardStats);

    // Initialize charts
    initializeCharts();
  } catch (error) {
    console.error("Failed to fetch dashboard data:", error);
  }
});

const initializeCharts = () => {
  // Loan Status Chart
  if (loanStatusChart.value) {
    new Chart(loanStatusChart.value, {
      type: "doughnut",
      data: {
        labels: ["Active", "Pending", "Approved", "Overdue", "Closed"],
        datasets: [
          {
            data: [stats.activeLoans, 5, 8, stats.overdueLoans, 12],
            backgroundColor: [
              "#10B981", // green
              "#F59E0B", // yellow
              "#3B82F6", // blue
              "#EF4444", // red
              "#6B7280", // gray
            ],
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: "bottom",
          },
        },
      },
    });
  }

  // Monthly Trend Chart
  if (monthlyTrendChart.value) {
    new Chart(monthlyTrendChart.value, {
      type: "line",
      data: {
        labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
        datasets: [
          {
            label: "Loans Disbursed",
            data: [12, 19, 15, 25, 22, 30],
            borderColor: "#3B82F6",
            backgroundColor: "rgba(59, 130, 246, 0.1)",
            tension: 0.4,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false,
          },
        },
        scales: {
          y: {
            beginAtZero: true,
          },
        },
      },
    });
  }
};
</script>
