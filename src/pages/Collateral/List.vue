<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Collateral Register</h1>
        <p class="text-sm text-gray-600">Manage loan collateral and security</p>
      </div>
      <button class="btn btn-primary">
        <PlusIcon class="w-4 h-4 mr-2" />
        Add Collateral
      </button>
    </div>

    <div class="card">
      <div class="card-header">
        <h3 class="card-title">Collateral List</h3>
        <div class="flex space-x-2">
          <input type="text" placeholder="Search collateral..." class="form-input w-64" />
          <select class="form-select">
            <option>All Types</option>
            <option>Real Estate</option>
            <option>Vehicles</option>
            <option>Equipment</option>
            <option>Securities</option>
          </select>
        </div>
      </div>

      <div class="card-body">
        <div class="table-responsive">
          <table class="table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Type</th>
                <th>Description</th>
                <th>Value</th>
                <th>Owner</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="i in 5" :key="i">
                <td>COL-{{ String(i).padStart(4, "0") }}</td>
                <td>Real Estate</td>
                <td>Residential Property - {{ i }} Bedroom House</td>
                <td>${{ (150000 + i * 25000).toLocaleString() }}</td>
                <td>Borrower {{ i }}</td>
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
  name: "CollateralList",
});
</script>
