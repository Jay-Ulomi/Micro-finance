 <template>
  <div>
    <div class="text-center mb-8">
      <h3 class="text-lg font-medium text-gray-900">Sign in to your account</h3>
      <p class="mt-2 text-sm text-gray-600">
        Or
        <router-link
          to="/auth/register"
          class="font-medium text-primary-600 hover:text-primary-500"
        >
          create a new account
        </router-link>
      </p>
    </div>

    <form @submit.prevent="handleLogin" class="space-y-6">
      <div
        v-if="authStore.error"
        class="bg-red-50 border border-red-200 rounded-md p-4"
      >
        <div class="flex">
          <div class="flex-shrink-0">
            <svg
              class="h-5 w-5 text-red-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <div class="ml-3">
            <p class="text-sm text-red-800">{{ authStore.error }}</p>
          </div>
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
        <p v-if="errors.email" class="mt-1 text-sm text-red-600">
          {{ errors.email }}
        </p>
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
        <p v-if="errors.password" class="mt-1 text-sm text-red-600">
          {{ errors.password }}
        </p>
      </div>

      <div class="flex items-center justify-between">
        <div class="flex items-center">
          <input
            id="remember-me"
            v-model="form.rememberMe"
            type="checkbox"
            class="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
          />
          <label for="remember-me" class="ml-2 block text-sm text-gray-900">
            Remember me
          </label>
        </div>

        <div class="text-sm">
          <a
            href="#"
            class="font-medium text-primary-600 hover:text-primary-500"
          >
            Forgot your password?
          </a>
        </div>
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
          {{ authStore.isLoading ? "Signing in..." : "Sign in" }}
        </button>
      </div>
    </form>

    <div class="mt-6">
      <div class="relative">
        <div class="absolute inset-0 flex items-center">
          <div class="w-full border-t border-gray-300" />
        </div>
        <div class="relative flex justify-center text-sm">
          <span class="px-2 bg-white text-gray-500">Demo Credentials</span>
        </div>
      </div>

      <div class="mt-4 grid grid-cols-1 gap-3">
        <button
          @click="useDemoCredentials('admin')"
          class="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
        >
          Admin User
        </button>
        <button
          @click="useDemoCredentials('officer')"
          class="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
        >
          Loan Officer
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useAuthStore } from "@/store/auth";

const router = useRouter();
const route = useRoute();
const authStore = useAuthStore();

const form = reactive({
  email: "",
  password: "",
  rememberMe: false,
});

const errors = reactive({
  email: "",
  password: "",
});

const validateForm = () => {
  errors.email = "";
  errors.password = "";

  if (!form.email) {
    errors.email = "Email is required";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
    errors.email = "Please enter a valid email address";
  }

  if (!form.password) {
    errors.password = "Password is required";
  } else if (form.password.length < 6) {
    errors.password = "Password must be at least 6 characters";
  }

  return !errors.email && !errors.password;
};

const handleLogin = async () => {
  if (!validateForm()) return;

  try {
    await authStore.login({
      email: form.email,
      password: form.password,
    });

    const redirectPath = (route.query.redirect as string) || "/";
    router.push(redirectPath);
  } catch (error) {
    // Error is handled by the store
    console.error("Login failed:", error);
  }
};

const useDemoCredentials = (type: "admin" | "officer") => {
  if (type === "admin") {
    form.email = "admin@loanmanager.com";
    form.password = "admin123";
  } else {
    form.email = "officer@loanmanager.com";
    form.password = "officer123";
  }
};

onMounted(() => {
  authStore.clearError();
});
</script>
