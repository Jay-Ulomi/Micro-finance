<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">System Settings</h1>
        <p class="text-sm text-gray-600">Configure system preferences and user management</p>
      </div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div class="card">
        <div class="card-header">
          <h3 class="card-title">General Settings</h3>
        </div>
        <div class="card-body">
          <div class="space-y-4">
            <div>
              <label class="form-label">Organization Name</label>
              <input type="text" class="form-input" value="Loan Manager" />
            </div>
            <div>
              <label class="form-label">Default Currency</label>
              <select class="form-select">
                <option>USD ($)</option>
                <option>EUR (€)</option>
                <option>GBP (£)</option>
              </select>
            </div>
            <div>
              <label class="form-label">Time Zone</label>
              <select class="form-select">
                <option>UTC</option>
                <option>America/New_York</option>
                <option>Europe/London</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <div class="card">
        <div class="card-header">
          <h3 class="card-title">Loan Settings</h3>
        </div>
        <div class="card-body">
          <div class="space-y-4">
            <div>
              <label class="form-label">Default Interest Rate (%)</label>
              <input type="number" class="form-input" value="12.5" step="0.1" />
            </div>
            <div>
              <label class="form-label">Minimum Loan Amount</label>
              <input type="number" class="form-input" value="1000" />
            </div>
            <div>
              <label class="form-label">Maximum Loan Amount</label>
              <input type="number" class="form-input" value="100000" />
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="card">
      <div class="card-header">
        <h3 class="card-title">User Management</h3>
      </div>
      <div class="card-body">
        <div class="text-center py-8 text-gray-500">
          <Cog6ToothIcon class="w-16 h-16 mx-auto mb-4 text-gray-300" />
          <h3 class="text-lg font-medium">User Management Coming Soon</h3>
          <p class="text-sm">User and role management will be implemented here</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Cog6ToothIcon } from "@heroicons/vue/24/outline";

defineOptions({
  name: "SettingsGeneral",
});
</script>
