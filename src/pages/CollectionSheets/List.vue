<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Collection Sheets</h1>
        <p class="text-sm text-gray-600">Manage field collection and payment tracking</p>
      </div>
      <button class="btn btn-primary">
        <PlusIcon class="w-4 h-4 mr-2" />
        Create Sheet
      </button>
    </div>

    <div class="card">
      <div class="card-body">
        <div class="text-center py-12 text-gray-500">
          <DocumentTextIcon class="w-16 h-16 mx-auto mb-4 text-gray-300" />
          <h3 class="text-lg font-medium">Collection Sheets Coming Soon</h3>
          <p class="text-sm">Field collection management will be implemented here</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { PlusIcon, DocumentTextIcon } from "@heroicons/vue/24/outline";

defineOptions({
  name: "CollectionSheetsList",
});
</script>
