<template>
  <div class="relative">
    <label v-if="label" :for="id" class="form-label">{{ label }}</label>
    <div class="relative">
      <input
        :id="id"
        v-model="displayValue"
        type="text"
        :placeholder="placeholder"
        :class="inputClass"
        readonly
        @click="toggleDatePicker"
      />
      <div
        class="absolute inset-y-0 right-0 flex items-center pr-3 cursor-pointer"
        @click="toggleDatePicker"
      >
        <svg
          class="h-5 w-5 text-gray-500 hover:text-gray-700 transition-colors duration-200"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2-2v16a2 2 0 002 2z"
          />
        </svg>
      </div>

      <!-- Custom Date Picker Overlay -->
      <div
        v-if="showDatePicker"
        class="absolute top-full left-0 mt-2 bg-white border border-gray-300 rounded-lg shadow-lg z-50 p-4 min-w-[300px]"
      >
        <!-- Header with month/year navigation -->
        <div
          class="flex items-center justify-between mb-4 bg-gradient-to-r from-gray-50 to-gray-100 p-4 rounded-lg border border-gray-200"
        >
          <button
            @click="previousMonth"
            class="p-2 hover:bg-gray-200 rounded-lg transition-colors border border-transparent hover:border-gray-300"
            title="Previous month"
          >
            <svg
              class="h-5 w-5 text-gray-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>

          <div class="flex items-center space-x-3">
            <select
              v-model="currentMonth"
              class="bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 hover:border-gray-400 transition-colors cursor-pointer min-w-[120px]"
            >
              <option v-for="(month, index) in months" :key="index" :value="index">
                {{ month }}
              </option>
            </select>
            <select
              v-model="currentYear"
              class="bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 hover:border-gray-400 transition-colors cursor-pointer min-w-[80px]"
            >
              <option v-for="year in yearRange" :key="year" :value="year">
                {{ year }}
              </option>
            </select>
          </div>

          <button
            @click="nextMonth"
            class="p-2 hover:bg-gray-200 rounded-lg transition-colors border border-transparent hover:border-gray-300"
            title="Next month"
          >
            <svg
              class="h-5 w-5 text-gray-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        </div>

        <!-- Days of week header -->
        <div class="grid grid-cols-7 gap-1 mb-2">
          <div
            v-for="day in daysOfWeek"
            :key="day"
            class="text-center text-xs font-semibold text-gray-600 p-2"
          >
            {{ day }}
          </div>
        </div>

        <!-- Calendar grid -->
        <div class="grid grid-cols-7 gap-1">
          <button
            v-for="date in calendarDates"
            :key="date.key"
            :class="getDateClass(date)"
            :disabled="!date.inCurrentMonth || isDateDisabled(date.date)"
            @click="selectDate(date.date)"
          >
            {{ date.day }}
          </button>
        </div>

        <!-- Action buttons -->
        <div class="flex justify-end space-x-3 mt-4 pt-4 border-t border-gray-200">
          <button
            @click="clearDate"
            class="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors border border-transparent hover:border-gray-300"
          >
            Clear
          </button>
          <button
            @click="closeDatePicker"
            class="px-4 py-2 text-sm font-medium text-white bg-gray-600 hover:bg-gray-700 rounded-lg transition-colors border border-gray-600 hover:border-gray-700"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
    <p v-if="error" class="form-error mt-1 text-sm text-red-600">{{ error }}</p>

    <!-- Backdrop to close datepicker when clicking outside -->
    <div v-if="showDatePicker" class="fixed inset-0 z-40" @click="closeDatePicker"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted } from "vue";

interface Props {
  modelValue?: string | null;
  label?: string;
  placeholder?: string;
  error?: string;
  id?: string;
  minDate?: string;
  maxDate?: string;
  format?: string;
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: null,
  label: "",
  placeholder: "Select a date",
  error: "",
  id: "datepicker",
  minDate: undefined,
  maxDate: undefined,
  format: "MM/dd/yyyy",
});

const emit = defineEmits<{
  "update:modelValue": [value: string | null];
  change: [value: string | null];
}>();

// Reactive data
const showDatePicker = ref(false);
const selectedDate = ref<Date | null>(null);
const currentMonth = ref(new Date().getMonth());
const currentYear = ref(new Date().getFullYear());

// Constants
const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const daysOfWeek = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

// Computed properties
const inputClass = computed(() => {
  return [
    "w-full px-3 py-2.5 pr-10 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm transition-all duration-200 bg-white text-gray-900 placeholder-gray-500 font-medium cursor-pointer",
    props.error
      ? "border-red-300 focus:border-red-500 focus:ring-red-500 bg-red-50"
      : "hover:border-gray-400 hover:shadow-md",
  ].join(" ");
});

const displayValue = computed(() => {
  if (!selectedDate.value) return "";
  return formatDate(selectedDate.value);
});

const yearRange = computed(() => {
  const currentYearValue = new Date().getFullYear();
  const startYear = currentYearValue - 100;
  const endYear = currentYearValue + 10;
  const years = [];
  for (let year = startYear; year <= endYear; year++) {
    years.push(year);
  }
  return years;
});

const calendarDates = computed(() => {
  const firstDay = new Date(currentYear.value, currentMonth.value, 1);
  const lastDay = new Date(currentYear.value, currentMonth.value + 1, 0);
  const startDate = new Date(firstDay);
  startDate.setDate(startDate.getDate() - firstDay.getDay());

  const dates = [];
  const endDate = new Date(startDate);
  endDate.setDate(endDate.getDate() + 41); // 6 weeks

  for (let date = new Date(startDate); date <= endDate; date.setDate(date.getDate() + 1)) {
    const isInCurrentMonth = date.getMonth() === currentMonth.value;
    dates.push({
      date: new Date(date),
      day: date.getDate(),
      inCurrentMonth: isInCurrentMonth,
      key: date.getTime(),
    });
  }

  return dates.slice(0, 42); // Exactly 6 weeks
});

// Methods
const formatDate = (date: Date): string => {
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const year = date.getFullYear();

  switch (props.format) {
    case "dd/MM/yyyy":
      return `${day}/${month}/${year}`;
    case "yyyy-MM-dd":
      return `${year}-${month}-${day}`;
    case "MM/dd/yyyy":
    default:
      return `${month}/${day}/${year}`;
  }
};

const parseDate = (dateString: string): Date | null => {
  if (!dateString || dateString.trim() === "") return null;

  const date = new Date(dateString);
  return isNaN(date.getTime()) ? null : date;
};

const toggleDatePicker = () => {
  showDatePicker.value = !showDatePicker.value;
  if (showDatePicker.value && selectedDate.value) {
    currentMonth.value = selectedDate.value.getMonth();
    currentYear.value = selectedDate.value.getFullYear();
  }
};

const closeDatePicker = () => {
  showDatePicker.value = false;
};

const selectDate = (date: Date) => {
  if (isDateDisabled(date)) return;

  selectedDate.value = date;
  const dateString = date.toISOString().split("T")[0];
  emit("update:modelValue", dateString);
  emit("change", dateString);
  closeDatePicker();
};

const clearDate = () => {
  selectedDate.value = null;
  emit("update:modelValue", null);
  emit("change", null);
  closeDatePicker();
};

const previousMonth = () => {
  if (currentMonth.value === 0) {
    currentMonth.value = 11;
    currentYear.value--;
  } else {
    currentMonth.value--;
  }
};

const nextMonth = () => {
  if (currentMonth.value === 11) {
    currentMonth.value = 0;
    currentYear.value++;
  } else {
    currentMonth.value++;
  }
};

const isDateDisabled = (date: Date): boolean => {
  if (props.minDate) {
    const minDate = new Date(props.minDate);
    if (date < minDate) return true;
  }
  if (props.maxDate) {
    const maxDate = new Date(props.maxDate);
    if (date > maxDate) return true;
  }
  return false;
};

const getDateClass = (dateObj: any) => {
  const baseClass =
    "w-8 h-8 text-sm font-medium rounded-lg transition-all duration-200 flex items-center justify-center";
  const today = new Date();
  const isToday = dateObj.date.toDateString() === today.toDateString();
  const isSelected =
    selectedDate.value && dateObj.date.toDateString() === selectedDate.value.toDateString();
  const isDisabled = !dateObj.inCurrentMonth || isDateDisabled(dateObj.date);

  if (isDisabled) {
    return `${baseClass} text-gray-300 cursor-not-allowed`;
  }

  if (isSelected) {
    return `${baseClass} bg-blue-600 text-white hover:bg-blue-700`;
  }

  if (isToday) {
    return `${baseClass} bg-blue-100 text-blue-600 hover:bg-blue-200`;
  }

  if (!dateObj.inCurrentMonth) {
    return `${baseClass} text-gray-400 hover:bg-gray-100`;
  }

  return `${baseClass} text-gray-700 hover:bg-gray-100 hover:scale-105`;
};

// Handle clicks outside the component
const handleClickOutside = (event: Event) => {
  const target = event.target as HTMLElement;
  if (!target.closest(".relative")) {
    closeDatePicker();
  }
};

onMounted(() => {
  document.addEventListener("click", handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener("click", handleClickOutside);
});

// Watch for external modelValue changes
watch(
  () => props.modelValue,
  (newValue) => {
    const parsedDate = parseDate(newValue || "");
    selectedDate.value = parsedDate;
    if (parsedDate) {
      currentMonth.value = parsedDate.getMonth();
      currentYear.value = parsedDate.getFullYear();
    }
  },
  { immediate: true },
);

// Watch for month/year changes to update calendar
watch([currentMonth, currentYear], () => {
  // This will trigger calendarDates recomputation
});
</script>

<style scoped>
.form-label {
  @apply block text-sm font-medium text-gray-700 mb-1;
}

.form-error {
  @apply text-sm text-red-600 mt-1;
}

/* Ensure the datepicker overlay appears above other elements */
.relative {
  position: relative;
}

/* Calendar animations */
.calendar-enter-active,
.calendar-leave-active {
  transition: all 0.3s ease;
}

.calendar-enter-from,
.calendar-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>
