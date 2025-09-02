export interface Customer {
  id: string;
  customerId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  address: Address;
  kycStatus: KYCStatus;
  kycDocuments: KYCDocument[];
  creditScore: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Address {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export enum KYCStatus {
  PENDING = "pending",
  VERIFIED = "verified",
  REJECTED = "rejected",
}

export interface KYCDocument {
  id: string;
  type: DocumentType;
  fileName: string;
  fileUrl: string;
  status: DocumentStatus;
  uploadedAt: string;
  verifiedAt?: string;
}

export enum DocumentType {
  ID_CARD = "id_card",
  PASSPORT = "passport",
  DRIVERS_LICENSE = "drivers_license",
  UTILITY_BILL = "utility_bill",
  BANK_STATEMENT = "bank_statement",
  INCOME_PROOF = "income_proof",
}

export enum DocumentStatus {
  PENDING = "pending",
  APPROVED = "approved",
  REJECTED = "rejected",
}

export interface CreateCustomerData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  address: Address;
}
