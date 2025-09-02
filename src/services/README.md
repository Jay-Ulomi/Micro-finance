# Services

This folder contains all service modules for the Loan Management System, organized by purpose and environment.

## 📁 Folder Structure

```
src/services/
├── api/                    # Real API services (production)
│   ├── auth.ts            # Authentication API
│   ├── borrowers.ts       # Borrower management API
│   ├── loans.ts          # Loan management API
│   ├── repayments.ts     # Repayment API
│   ├── config.ts         # Axios configuration
│   └── index.ts          # API exports
├── mock/                  # Mock services (development)
│   ├── dataService.ts    # Mock data service
│   └── README.md         # Mock service documentation
├── index.ts              # Main service exports
└── README.md             # This file
```

## 🎯 Purpose

### **`api/` folder - Production Services**

- **Real API Integration**: HTTP requests to backend services
- **Authentication**: Login, logout, token management
- **Error Handling**: Network errors, validation, retries
- **Production Ready**: Used in production environment

### **`mock/` folder - Development Services**

- **Mock Data**: JSON-based data for development
- **API Simulation**: Async methods with delays
- **No Backend Required**: Works without server
- **Development Only**: Used during development/testing

## 🚀 Usage

### **Main Service (Recommended)**

```typescript
import { service } from "@/services";

// This automatically uses the appropriate service based on environment
const borrowers = await service.getBorrowersAsync({
  page: 1,
  limit: 10,
  kycStatus: "verified",
});
```

### **Direct Service Access**

```typescript
// For mock data (development)
import { dataService } from "@/services/mock/dataService";

// For real API (production)
import { borrowersApi } from "@/services/api/borrowers";
```

### **Environment-Based Usage**

```typescript
// In your component
import { service } from "@/services";

// This will automatically use:
// - Mock service in development
// - Real API service in production
const response = await service.getBorrowersAsync(params);
```

## 🔧 Configuration

### **Development Mode (Current)**

```typescript
// src/services/index.ts
import { dataService } from "./mock/dataService";
export const service = dataService;
```

### **Production Mode (Future)**

```typescript
// src/services/index.ts
import { borrowersApi, loansApi, repaymentsApi } from "./api";
export const service = {
  getBorrowersAsync: borrowersApi.getBorrowers,
  getLoansAsync: loansApi.getLoans,
  // ... other methods
};
```

## 📊 Service Comparison

| Feature            | Mock Service     | API Service       |
| ------------------ | ---------------- | ----------------- |
| **Data Source**    | JSON files       | HTTP requests     |
| **Network**        | No network calls | Real HTTP calls   |
| **Authentication** | Simulated        | Real tokens       |
| **Error Handling** | Basic            | Comprehensive     |
| **Performance**    | Instant          | Network dependent |
| **Use Case**       | Development      | Production        |

## 🔄 Migration Path

### **Phase 1: Development (Current)**

- Use mock services for all data operations
- Develop UI components and features
- Test with realistic data

### **Phase 2: Integration**

- Implement real API endpoints
- Add authentication and error handling
- Test with real backend

### **Phase 3: Production**

- Switch to API services
- Remove mock services
- Deploy with real backend

## 🧪 Testing

### **Unit Tests**

```typescript
// Mock the service for testing
jest.mock("@/services", () => ({
  service: {
    getBorrowersAsync: jest.fn().mockResolvedValue(mockData),
  },
}));
```

### **Integration Tests**

```typescript
// Test with real API service
import { borrowersApi } from "@/services/api/borrowers";
// Test actual HTTP calls
```

## 🎯 Best Practices

### **Service Selection**

- **Development**: Use mock services for faster iteration
- **Testing**: Use mock services for consistent test data
- **Production**: Use API services for real data

### **Code Organization**

- Import from main service index: `import { service } from '@/services'`
- Use consistent method names across mock and API services
- Handle errors appropriately for each service type

### **Environment Management**

- Use environment variables to switch between services
- Keep mock and API services in sync
- Document differences between services

## 🔮 Future Enhancements

### **Service Factory**

```typescript
// Create service based on environment
const createService = () => {
  if (process.env.NODE_ENV === "development") {
    return new MockService();
  }
  return new ApiService();
};
```

### **Hybrid Services**

```typescript
// Use mock for some operations, API for others
const hybridService = {
  getBorrowers: mockService.getBorrowers,
  createBorrower: apiService.createBorrower,
  updateBorrower: apiService.updateBorrower,
};
```

### **Service Abstraction**

```typescript
// Abstract service interface
interface DataService {
  getBorrowersAsync(params: any): Promise<any>;
  getLoansAsync(params: any): Promise<any>;
  // ... other methods
}
```

## 📝 Migration Guide

### **From Old Structure**

```typescript
// Old import
import { dataService } from "@/services/dataService";

// New import
import { service } from "@/services";
```

### **Update Imports**

```typescript
// Update all imports in your components
// From: import { dataService } from '@/services/dataService';
// To:   import { service } from '@/services';
```

This new structure provides:

- ✅ **Clear separation** between mock and real services
- ✅ **Easy switching** between development and production
- ✅ **Consistent interface** across all services
- ✅ **Better organization** and maintainability
- ✅ **Future-proof** architecture
