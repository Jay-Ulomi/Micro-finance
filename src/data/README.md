# Data Folder

This folder contains JSON files with demo data for the Loan Management System. These files serve as a data source for development and testing purposes.

## 📁 File Structure

### `borrowers.json`

Contains borrower information including:

- Personal details (name, email, phone, address)
- KYC status and verification information
- Credit scores and loan officer assignments
- Registration and update timestamps
- Statistics summary

### `loans.json`

Contains loan information including:

- Loan details (type, amount, interest rate, term)
- Borrower and loan officer information
- Collateral and guarantor details
- Application and disbursement dates
- Payment schedules and status
- Statistics summary

### `repayments.json`

Contains repayment information including:

- Payment details (amount, date, method)
- Installment information
- Payment status and references
- Late fees and penalties
- Statistics summary

### `loan-officers.json`

Contains loan officer information including:

- Personal and contact details
- Department and position information
- Performance metrics
- Specialization areas
- Geographic coverage

## 🔧 Usage

### Direct Import

```typescript
import borrowersData from "@/data/borrowers.json";
import loansData from "@/data/loans.json";
```

### Through Data Service

```typescript
import { dataService } from "@/services/dataService";

// Get borrowers with filtering and pagination
const response = await dataService.getBorrowersAsync({
  page: 1,
  limit: 10,
  kycStatus: "verified",
  search: "John",
});

// Get statistics
const stats = await dataService.getBorrowerStatisticsAsync();
```

### Through Data Index

```typescript
import { borrowersData, loansData, type Borrower } from "@/data";
```

## 📊 Data Structure

### Borrower Object

```typescript
interface Borrower {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  mobile: string;
  uniqueNumber?: string;
  kycStatus: "pending" | "verified" | "rejected";
  creditScore?: number;
  loanOfficer?: string;
  createdAt: string;
  country: string;
  gender?: "male" | "female" | "other";
  title?: "Mr" | "Mrs" | "Ms" | "Dr" | "Prof";
  dateOfBirth?: string;
  address?: string;
  city?: string;
  province?: string;
  zipcode?: string;
  workingStatus?:
    | "employed"
    | "self-employed"
    | "unemployed"
    | "student"
    | "retired";
  borrowerPhoto?: string;
  borrowerFiles?: string[];
  description?: string;
  updatedAt: string;
}
```

### Loan Object

```typescript
interface Loan {
  id: string;
  borrowerId: string;
  borrowerName: string;
  loanType:
    | "personal"
    | "business"
    | "agricultural"
    | "microfinance"
    | "emergency";
  loanCategory: "secured" | "unsecured";
  applicationDate: string;
  requestedAmount: number;
  approvedAmount?: number;
  interestRate: number;
  loanTerm: number;
  repaymentFrequency: "weekly" | "bi-weekly" | "monthly" | "quarterly";
  status:
    | "draft"
    | "submitted"
    | "under_review"
    | "approved"
    | "rejected"
    | "disbursed"
    | "active"
    | "completed"
    | "defaulted"
    | "written_off";
  purpose: string;
  collateral?: {
    type: string;
    description: string;
    value: number;
    documents: string[];
  };
  guarantors?: {
    id: string;
    name: string;
    relationship: string;
    contact: string;
  }[];
  loanOfficer: string;
  applicationDocuments: string[];
  disbursementDate?: string;
  firstPaymentDate?: string;
  maturityDate?: string;
  totalInterest: number;
  totalAmount: number;
  outstandingBalance: number;
  nextPaymentDate?: string;
  nextPaymentAmount?: number;
  paymentHistory: any[];
  notes?: string;
  createdAt: string;
  updatedAt: string;
}
```

## 🚀 Features

### Data Service Integration

The data service provides:

- **Async Methods**: Simulate API calls with delays
- **Filtering**: Search, status, and other filters
- **Pagination**: Page-based data loading
- **Sorting**: Configurable sorting options
- **Statistics**: Real-time calculated statistics
- **Type Safety**: Full TypeScript support

### Real-time Statistics

Statistics are calculated dynamically from the data:

- Total counts and percentages
- Financial summaries
- Performance metrics
- Trend analysis

### Filtering and Search

Support for multiple filter types:

- Text search across multiple fields
- Status-based filtering
- Date range filtering
- Relationship-based filtering

## 🔄 Data Updates

To update the demo data:

1. **Edit JSON Files**: Modify the relevant JSON files directly
2. **Update Statistics**: Statistics are calculated automatically
3. **Maintain Relationships**: Ensure IDs match across related data
4. **Test Changes**: Use the data service to verify updates

## 📝 Best Practices

### Data Consistency

- Use consistent ID formats across all files
- Maintain referential integrity between related data
- Use realistic and varied data for testing

### Performance

- Keep JSON files reasonably sized for development
- Use pagination for large datasets
- Implement proper filtering to reduce data transfer

### Type Safety

- Always use TypeScript interfaces
- Validate data structure in the data service
- Handle missing or invalid data gracefully

## 🧪 Testing

The data files are designed for:

- **Development**: Local development and testing
- **Demo**: Showcasing application features
- **Prototyping**: Rapid feature development
- **Unit Testing**: Mock data for tests

## 🔮 Future Enhancements

Potential improvements:

- **Data Validation**: JSON schema validation
- **Data Generation**: Automated test data generation
- **Data Seeding**: Database seeding scripts
- **Data Migration**: Tools for data structure changes
- **Data Export**: Export functionality for data files
