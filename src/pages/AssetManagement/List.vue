<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Asset Management</h1>
        <p class="text-sm text-gray-600">Manage fixed assets and depreciation</p>
      </div>
      <button class="btn btn-primary">
        <PlusIcon class="w-4 h-4 mr-2" />
        Add Asset
      </button>
    </div>

    <div class="card">
      <div class="card-body">
        <div class="text-center py-12 text-gray-500">
          <BuildingOfficeIcon class="w-16 h-16 mx-auto mb-4 text-gray-300" />
          <h3 class="text-lg font-medium">Asset Management Coming Soon</h3>
          <p class="text-sm">Asset tracking will be implemented here</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { PlusIcon, BuildingOfficeIcon } from "@heroicons/vue/24/outline";

defineOptions({
  name: "AssetManagementList",
});
</script>
