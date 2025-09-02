# Mock Services

This folder contains mock services that simulate real API behavior using JSON data files. These services are used during development and testing when a real backend is not available.

## 📁 Files

### `dataService.ts`

The main mock data service that provides:

- **Data Management**: Loading and managing JSON data files
- **API Simulation**: Async methods that simulate real API calls
- **Filtering & Pagination**: Advanced data filtering and pagination
- **Statistics**: Real-time calculation of business statistics
- **Type Safety**: Full TypeScript support with interfaces

## 🚀 Usage

### **Basic Usage**

```typescript
import { dataService } from "@/services/mock/dataService";

// Get borrowers with filtering
const response = await dataService.getBorrowersAsync({
  page: 1,
  limit: 10,
  kycStatus: "verified",
  search: "John",
});

console.log(response.borrowers); // Array of borrowers
console.log(response.total); // Total count
```

### **Statistics**

```typescript
// Get real-time statistics
const stats = await dataService.getBorrowerStatisticsAsync();
console.log(stats.totalBorrowers); // Total count
console.log(stats.kycVerified); // Verified count
console.log(stats.averageCreditScore); // Average score
```

### **Advanced Filtering**

```typescript
// Search and filter borrowers
const filteredBorrowers = await dataService.getBorrowersAsync({
  search: "John",
  kycStatus: "verified",
  loanOfficer: "Edwin Simon",
  sortBy: "createdAt",
  sortOrder: "desc",
});
```

## 📊 Data Sources

The mock service uses JSON files from `src/data/`:

- **`borrowers.json`** - Borrower information and statistics
- **`loans.json`** - Loan data and statistics
- **`repayments.json`** - Repayment data and statistics
- **`loan-officers.json`** - Loan officer information

## 🔧 Features

### **Async API Simulation**

All methods have async versions that simulate real API calls:

- **Delay Simulation**: 500ms delay to simulate network latency
- **Error Handling**: Proper error management and logging
- **Loading States**: Support for loading indicators

### **Advanced Filtering**

Support for multiple filter types:

- **Text Search**: Search across multiple fields
- **Status Filters**: Filter by KYC status, loan status, etc.
- **Date Ranges**: Filter by date ranges
- **Relationships**: Filter by loan officer, borrower, etc.

### **Pagination**

Built-in pagination support:

```typescript
const response = await dataService.getBorrowersAsync({
  page: 2,
  limit: 20,
});
// Returns: { borrowers: [], total: 100, page: 2, limit: 20 }
```

### **Sorting**

Configurable sorting options:

```typescript
const response = await dataService.getBorrowersAsync({
  sortBy: "createdAt",
  sortOrder: "desc",
});
```

### **Statistics**

Real-time statistics calculation:

- **Borrower Statistics**: Total, verified, pending, rejected counts
- **Loan Statistics**: Active loans, disbursed amounts, default rates
- **Repayment Statistics**: Collection rates, overdue amounts

## 🎯 Use Cases

### **Development**

- **UI Development**: Build components without backend
- **Feature Testing**: Test new features with realistic data
- **Performance Testing**: Test with large datasets

### **Testing**

- **Unit Tests**: Consistent test data
- **Integration Tests**: Test component behavior
- **E2E Tests**: Test complete user flows

### **Demo**

- **Client Presentations**: Show features without backend
- **Stakeholder Reviews**: Demonstrate functionality
- **Training**: Train users on system features

## 🔄 Data Flow

1. **Data Loading**: JSON files are loaded into memory
2. **Filtering**: Data is filtered based on parameters
3. **Sorting**: Data is sorted if specified
4. **Pagination**: Data is paginated for performance
5. **Statistics**: Statistics are calculated in real-time
6. **Response**: Formatted response is returned

## 🧪 Testing

### **Mock Data**

```typescript
// The service uses realistic test data
const borrowers = [
  {
    id: "1",
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@example.com",
    kycStatus: "verified",
    creditScore: 750,
    // ... more fields
  },
  // ... more borrowers
];
```

### **Test Integration**

```typescript
// Mock the service for tests
jest.mock("@/services/mock/dataService", () => ({
  dataService: {
    getBorrowersAsync: jest.fn().mockResolvedValue({
      borrowers: mockBorrowers,
      total: 10,
      page: 1,
      limit: 10,
    }),
  },
}));
```

## 🚀 Performance

### **Optimizations**

- **In-Memory Caching**: Data is loaded once and cached
- **Efficient Filtering**: Optimized filter algorithms
- **Lazy Loading**: Statistics calculated on-demand
- **Pagination**: Large datasets are paginated

### **Limitations**

- **Memory Usage**: All data loaded into memory
- **Scalability**: Limited by available memory
- **Real-time**: No real-time updates
- **Persistence**: Changes are not persisted

## 🔮 Future Enhancements

### **Data Generation**

- **Dynamic Data**: Generate data on-demand
- **Realistic Data**: More realistic test data
- **Data Relationships**: Better relationship modeling

### **Performance**

- **Lazy Loading**: Load data as needed
- **Caching**: More sophisticated caching
- **Indexing**: Better data indexing

### **Features**

- **Data Validation**: Validate data structure
- **Data Export**: Export data to files
- **Data Import**: Import data from files

## 📝 Best Practices

### **Usage**

- Use for development and testing only
- Don't use in production
- Keep data files up to date
- Use consistent data formats

### **Maintenance**

- Update data files regularly
- Keep statistics accurate
- Maintain data relationships
- Document data structure

### **Testing**

- Use consistent test data
- Test edge cases
- Validate data integrity
- Test performance with large datasets

This mock service provides a complete development environment without requiring a backend, making it perfect for frontend development and testing.
