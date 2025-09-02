# Loan Management System API

This directory contains comprehensive API modules for the Loan Management System. Each module provides TypeScript interfaces and functions for interacting with the backend services.

## 📁 API Structure

### Core Modules

#### 🔐 Authentication (`auth.ts`)

- User authentication and authorization
- Login/logout functionality
- Token management
- Password reset

#### 👥 Borrowers (`borrowers.ts`)

- Borrower management (CRUD operations)
- KYC verification and document management
- Borrower groups and bulk operations
- Communication (SMS, Email, Invitations)
- Statistics and reporting

#### 💰 Loans (`loans.ts`)

- Loan application and management
- Loan workflow (approval, disbursement, closure)
- Payment schedules and history
- Risk assessment
- Bulk operations and reporting

#### 💳 Repayments (`repayments.ts`)

- Repayment processing and tracking
- Payment reminders and notifications
- Collection sheets and field operations
- Receipt generation
- Overdue management

#### 🏦 Savings (`savings.ts`)

- Savings account management
- Transaction processing (deposits, withdrawals, transfers)
- Interest calculation and processing
- Account statements and reporting

#### 💼 Investors (`investors.ts`)

- Investor management and accounts
- Investment tracking and performance
- Dividend management and payments
- Portfolio reporting

#### 🏠 Collateral (`collateral.ts`)

- Collateral registration and management
- Appraisal and valuation
- Pledge and release operations
- Insurance and document management

### Business Modules

#### 📊 Reports (`reports.ts`)

- Report generation and scheduling
- Dashboard management and widgets
- Analytics and KPIs
- Export functionality

#### 📈 Accounting (`accounting.ts`)

- Chart of accounts management
- Journal entries and financial statements
- Trial balance and period management
- General ledger and reporting

#### 📅 Calendar (`calendar.ts`)

- Event and appointment management
- Payment reminders and scheduling
- Availability checking
- Notification management

#### 💸 Expenses (`expenses.ts`)

- Expense tracking and approval
- Category and budget management
- Receipt and document handling
- Reporting and analytics

#### 💵 Other Income (`other-income.ts`)

- Non-loan income tracking
- Category and target management
- Confirmation and reporting

#### 🏢 Asset Management (`asset-management.ts`)

- Asset registration and tracking
- Maintenance scheduling and management
- Depreciation calculation
- Disposal and reporting

#### 👔 Payroll (`payroll.ts`)

- Employee management
- Payroll processing and records
- Tax calculations and reporting
- Period management

#### ✍️ E-Signatures (`e-signatures.ts`)

- Digital document signing
- Signature templates and workflows
- Compliance and audit trails
- Document management

## 🚀 Usage Examples

### Basic API Usage

```typescript
import { borrowersApi, loansApi, repaymentsApi } from "@/api";

// Get borrowers with filters
const borrowers = await borrowersApi.getBorrowers({
  page: 1,
  limit: 10,
  kycStatus: "verified",
  search: "John",
});

// Create a new loan
const loan = await loansApi.createLoan({
  borrowerId: "borrower-123",
  loanType: "personal",
  loanCategory: "unsecured",
  requestedAmount: 50000,
  interestRate: 12.5,
  loanTerm: 24,
  repaymentFrequency: "monthly",
  purpose: "Business expansion",
  loanOfficer: "officer-456",
});

// Process a repayment
const repayment = await repaymentsApi.processPayment("repayment-789", {
  paidAmount: 2500,
  paidDate: "2024-01-15",
  paymentMethod: "bank_transfer",
  reference: "TXN123456",
});
```

### Advanced Operations

```typescript
// Bulk operations
await borrowersApi.bulkAssignLoanOfficer(
  ["borrower-1", "borrower-2", "borrower-3"],
  "officer-456"
);

// Export data
const csvData = await borrowersApi.exportBorrowers("csv", {
  kycStatus: "verified",
  startDate: "2024-01-01",
  endDate: "2024-01-31",
});

// Get statistics
const stats = await borrowersApi.getBorrowerStatistics();
console.log(`Total borrowers: ${stats.totalBorrowers}`);
console.log(`KYC verified: ${stats.kycVerified}`);
```

### File Uploads

```typescript
// Upload borrower photo
const photoResult = await borrowersApi.uploadBorrowerPhoto(
  "borrower-123",
  photoFile
);

// Upload multiple files
const filesResult = await borrowersApi.uploadBorrowerFiles("borrower-123", [
  file1,
  file2,
  file3,
]);
```

## 🔧 Configuration

The API configuration is handled in `config.ts`:

```typescript
import api from "@/api/config";

// The API instance is pre-configured with:
// - Base URL from environment variables
// - Request/response interceptors
// - Authentication token handling
// - Error handling
```

## 📋 Type Safety

All API functions are fully typed with TypeScript interfaces:

```typescript
interface Borrower {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  mobile: string;
  kycStatus: "pending" | "verified" | "rejected";
  // ... other properties
}

// Type-safe API calls
const borrower: Borrower = await borrowersApi.getBorrower("borrower-123");
```

## 🎯 Key Features

### Comprehensive CRUD Operations

- Create, Read, Update, Delete for all entities
- Bulk operations for efficiency
- Advanced filtering and sorting

### File Management

- Document uploads and downloads
- Image processing for photos
- Receipt and statement generation

### Workflow Management

- Status transitions and approvals
- Automated notifications
- Audit trails and logging

### Reporting and Analytics

- Real-time statistics
- Export functionality (CSV, Excel, PDF)
- Dashboard widgets and KPIs

### Security and Compliance

- E-signature support
- Audit trails
- Data validation
- Access control

## 🔄 Error Handling

All API functions include proper error handling:

```typescript
try {
  const borrower = await borrowersApi.createBorrower(data);
  console.log("Borrower created:", borrower);
} catch (error) {
  console.error("Error creating borrower:", error);
  // Handle error appropriately
}
```

## 📊 Statistics and Reporting

Each module provides comprehensive statistics:

```typescript
// Borrower statistics
const borrowerStats = await borrowersApi.getBorrowerStatistics();

// Loan statistics
const loanStats = await loansApi.getLoanStatistics();

// Repayment statistics
const repaymentStats = await repaymentsApi.getRepaymentStatistics();
```

## 🚀 Performance Features

- **Pagination**: All list endpoints support pagination
- **Filtering**: Advanced filtering options for all entities
- **Sorting**: Configurable sorting by multiple fields
- **Bulk Operations**: Efficient bulk processing
- **Caching**: Built-in caching for frequently accessed data

## 🔐 Security Features

- **Authentication**: JWT token-based authentication
- **Authorization**: Role-based access control
- **Data Validation**: Input validation and sanitization
- **Audit Trails**: Complete audit logging
- **E-Signatures**: Digital signature support

## 📱 Mobile Support

All APIs are designed to work seamlessly with mobile applications:

- RESTful API design
- JSON responses
- File upload support
- Offline capability considerations

## 🧪 Testing

The API modules are designed to be easily testable:

```typescript
// Mock API responses for testing
jest.mock("@/api/borrowers", () => ({
  borrowersApi: {
    getBorrowers: jest.fn().mockResolvedValue(mockBorrowers),
    createBorrower: jest.fn().mockResolvedValue(mockBorrower),
  },
}));
```

## 📚 Documentation

Each API module includes:

- Comprehensive TypeScript interfaces
- JSDoc comments for all functions
- Usage examples
- Error handling guidelines

## 🔄 Versioning

The API follows semantic versioning:

- **Major**: Breaking changes
- **Minor**: New features (backward compatible)
- **Patch**: Bug fixes (backward compatible)

## 🚀 Getting Started

1. Import the required API modules
2. Configure authentication
3. Start making API calls
4. Handle responses and errors appropriately

```typescript
import { borrowersApi, loansApi } from "@/api";

// Your implementation here
```

This comprehensive API structure provides all the functionality needed for a complete loan management system, with proper TypeScript support, error handling, and modern development practices.
