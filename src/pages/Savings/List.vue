<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Savings Accounts</h1>
        <p class="text-sm text-gray-600">Manage customer savings accounts and products</p>
      </div>
      <button class="btn btn-primary">
        <PlusIcon class="w-4 h-4 mr-2" />
        Open Account
      </button>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div class="card">
        <div class="card-body text-center">
          <div class="text-3xl font-bold text-primary-600">$2,847,392</div>
          <div class="text-sm text-gray-600">Total Savings</div>
        </div>
      </div>
      <div class="card">
        <div class="card-body text-center">
          <div class="text-3xl font-bold text-green-600">1,247</div>
          <div class="text-sm text-gray-600">Active Accounts</div>
        </div>
      </div>
      <div class="card">
        <div class="card-body text-center">
          <div class="text-3xl font-bold text-blue-600">4.25%</div>
          <div class="text-sm text-gray-600">Average Interest Rate</div>
        </div>
      </div>
    </div>

    <div class="card">
      <div class="card-header">
        <h3 class="card-title">Savings Accounts</h3>
        <div class="flex space-x-2">
          <input type="text" placeholder="Search accounts..." class="form-input w-64" />
          <select class="form-select">
            <option>All Products</option>
            <option>Regular Savings</option>
            <option>Fixed Deposit</option>
            <option>Goal Savings</option>
          </select>
        </div>
      </div>

      <div class="card-body">
        <div class="table-responsive">
          <table class="table">
            <thead>
              <tr>
                <th>Account No</th>
                <th>Customer</th>
                <th>Product</th>
                <th>Balance</th>
                <th>Interest Rate</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="i in 5" :key="i">
                <td>SAV-{{ String(i).padStart(6, "0") }}</td>
                <td>Customer {{ i }}</td>
                <td>Regular Savings</td>
                <td>${{ (5000 + i * 1500).toLocaleString() }}</td>
                <td>4.25%</td>
                <td>
                  <span class="badge badge-success">Active</span>
                </td>
                <td>
                  <button class="btn btn-sm btn-outline">View</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { PlusIcon } from "@heroicons/vue/24/outline";

defineOptions({
  name: "SavingsList",
});
</script>
