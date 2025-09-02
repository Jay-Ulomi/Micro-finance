<template>
  <div>
    <div class="text-center mb-8">
      <h3 class="text-lg font-medium text-gray-900">Create a new account</h3>
      <p class="mt-2 text-sm text-gray-600">
        Or
        <router-link to="/auth/login" class="font-medium text-primary-600 hover:text-primary-500">
          sign in to your existing account
        </router-link>
      </p>
    </div>

    <form @submit.prevent="handleRegister" class="space-y-6">
      <div v-if="authStore.error" class="bg-red-50 border border-red-200 rounded-md p-4">
        <div class="flex">
          <div class="flex-shrink-0">
            <svg class="h-5 w-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div class="ml-3">
            <p class="text-sm text-red-800">{{ authStore.error }}</p>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div>
          <label for="firstName" class="form-label">First name</label>
          <input
            id="firstName"
            v-model="form.firstName"
            type="text"
            required
            class="form-input"
            :class="{ 'border-red-300': errors.firstName }"
            placeholder="Enter your first name"
          />
          <p v-if="errors.firstName" class="mt-1 text-sm text-red-600">{{ errors.firstName }}</p>
        </div>

        <div>
          <label for="lastName" class="form-label">Last name</label>
          <input
            id="lastName"
            v-model="form.lastName"
            type="text"
            required
            class="form-input"
            :class="{ 'border-red-300': errors.lastName }"
            placeholder="Enter your last name"
          />
          <p v-if="errors.lastName" class="mt-1 text-sm text-red-600">{{ errors.lastName }}</p>
        </div>
      </div>

      <div>
        <label for="email" class="form-label">Email address</label>
        <input
          id="email"
          v-model="form.email"
          type="email"
          required
          class="form-input"
          :class="{ 'border-red-300': errors.email }"
          placeholder="Enter your email"
        />
        <p v-if="errors.email" class="mt-1 text-sm text-red-600">{{ errors.email }}</p>
      </div>

      <div>
        <label for="role" class="form-label">Role</label>
        <select
          id="role"
          v-model="form.role"
          required
          class="form-input"
          :class="{ 'border-red-300': errors.role }"
        >
          <option value="">Select a role</option>
          <option value="loan_officer">Loan Officer</option>
          <option value="customer_service">Customer Service</option>
          <option value="viewer">Viewer</option>
        </select>
        <p v-if="errors.role" class="mt-1 text-sm text-red-600">{{ errors.role }}</p>
      </div>

      <div>
        <label for="password" class="form-label">Password</label>
        <input
          id="password"
          v-model="form.password"
          type="password"
          required
          class="form-input"
          :class="{ 'border-red-300': errors.password }"
          placeholder="Enter your password"
        />
        <p v-if="errors.password" class="mt-1 text-sm text-red-600">{{ errors.password }}</p>
      </div>

      <div>
        <label for="confirmPassword" class="form-label">Confirm password</label>
        <input
          id="confirmPassword"
          v-model="form.confirmPassword"
          type="password"
          required
          class="form-input"
          :class="{ 'border-red-300': errors.confirmPassword }"
          placeholder="Confirm your password"
        />
        <p v-if="errors.confirmPassword" class="mt-1 text-sm text-red-600">{{ errors.confirmPassword }}</p>
      </div>

      <div class="flex items-center">
        <input
          id="agree-terms"
          v-model="form.agreeTerms"
          type="checkbox"
          required
          class="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
        />
        <label for="agree-terms" class="ml-2 block text-sm text-gray-900">
          I agree to the
          <a href="#" class="text-primary-600 hover:text-primary-500">Terms and Conditions</a>
        </label>
      </div>

      <div>
        <button
          type="submit"
          :disabled="authStore.isLoading"
          class="w-full btn-primary flex justify-center items-center"
        >
          <svg
            v-if="authStore.isLoading"
            class="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
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
            ></circle>
            <path
              class="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          {{ authStore.isLoading ? 'Creating account...' : 'Create account' }}
        </button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { reactive, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/store/auth';
import type { UserRole } from '@/types/User';

const router = useRouter();
const authStore = useAuthStore();

const form = reactive({
  firstName: '',
  lastName: '',
  email: '',
  role: '' as UserRole | '',
  password: '',
  confirmPassword: '',
  agreeTerms: false
});

const errors = reactive({
  firstName: '',
  lastName: '',
  email: '',
  role: '',
  password: '',
  confirmPassword: ''
});

const validateForm = () => {
  errors.firstName = '';
  errors.lastName = '';
  errors.email = '';
  errors.role = '';
  errors.password = '';
  errors.confirmPassword = '';

  if (!form.firstName.trim()) {
    errors.firstName = 'First name is required';
  }

  if (!form.lastName.trim()) {
    errors.lastName = 'Last name is required';
  }

  if (!form.email) {
    errors.email = 'Email is required';
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
    errors.email = 'Please enter a valid email address';
  }

  if (!form.role) {
    errors.role = 'Please select a role';
  }

  if (!form.password) {
    errors.password = 'Password is required';
  } else if (form.password.length < 6) {
    errors.password = 'Password must be at least 6 characters';
  }

  if (!form.confirmPassword) {
    errors.confirmPassword = 'Please confirm your password';
  } else if (form.password !== form.confirmPassword) {
    errors.confirmPassword = 'Passwords do not match';
  }

  return !Object.values(errors).some(error => error);
};

const handleRegister = async () => {
  if (!validateForm()) return;

  try {
    await authStore.register({
      firstName: form.firstName,
      lastName: form.lastName,
      email: form.email,
      role: form.role as UserRole,
      password: form.password
    });

    router.push('/');
  } catch (error) {
    // Error is handled by the store
    console.error('Registration failed:', error);
  }
};

onMounted(() => {
  authStore.clearError();
});
</script>
