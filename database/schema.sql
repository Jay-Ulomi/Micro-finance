-- =============================================
-- MICRO-FINANCE MANAGEMENT SYSTEM DATABASE SCHEMA
-- Version: 1.0.0
-- Database: PostgreSQL/MySQL Compatible
-- =============================================

-- Enable UUID extension (PostgreSQL)
-- CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =============================================
-- SYSTEM & CONFIGURATION TABLES
-- =============================================

-- System configuration
CREATE TABLE IF NOT EXISTS system_config (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    config_key VARCHAR(100) UNIQUE NOT NULL,
    config_value TEXT,
    config_type VARCHAR(50), -- 'string', 'number', 'boolean', 'json'
    description TEXT,
    is_encrypted BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Branches
CREATE TABLE IF NOT EXISTS branches (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code VARCHAR(20) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    address_street VARCHAR(255),
    address_city VARCHAR(100),
    address_state VARCHAR(100),
    address_country VARCHAR(100),
    address_postal_code VARCHAR(20),
    phone VARCHAR(20),
    email VARCHAR(100),
    manager_id UUID,
    parent_branch_id UUID REFERENCES branches(id),
    operating_hours JSONB, -- {"monday": {"open": "08:00", "close": "17:00"}}
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP
);

CREATE INDEX idx_branches_code ON branches(code);
CREATE INDEX idx_branches_active ON branches(is_active);

-- =============================================
-- USER MANAGEMENT & AUTHENTICATION
-- =============================================

-- Roles
CREATE TABLE IF NOT EXISTS roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(50) UNIQUE NOT NULL,
    description TEXT,
    is_system BOOLEAN DEFAULT FALSE, -- System roles cannot be deleted
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP
);

-- Permissions
CREATE TABLE IF NOT EXISTS permissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    module VARCHAR(50) NOT NULL,
    resource VARCHAR(50) NOT NULL,
    action VARCHAR(50) NOT NULL, -- 'create', 'read', 'update', 'delete', 'approve', 'manage'
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(module, resource, action)
);

-- Role permissions
CREATE TABLE IF NOT EXISTS role_permissions (
    role_id UUID REFERENCES roles(id) ON DELETE CASCADE,
    permission_id UUID REFERENCES permissions(id) ON DELETE CASCADE,
    granted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    granted_by UUID,
    PRIMARY KEY (role_id, permission_id)
);

-- Users
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    middle_name VARCHAR(50),
    phone VARCHAR(20),
    avatar_url VARCHAR(500),
    role_id UUID REFERENCES roles(id),
    branch_id UUID REFERENCES branches(id),
    is_active BOOLEAN DEFAULT TRUE,
    is_email_verified BOOLEAN DEFAULT FALSE,
    is_phone_verified BOOLEAN DEFAULT FALSE,
    two_factor_enabled BOOLEAN DEFAULT FALSE,
    two_factor_secret VARCHAR(255),
    last_login_at TIMESTAMP,
    last_login_ip VARCHAR(45),
    failed_login_attempts INT DEFAULT 0,
    locked_until TIMESTAMP,
    password_changed_at TIMESTAMP,
    preferences JSONB, -- User preferences as JSON
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by UUID REFERENCES users(id),
    deleted_at TIMESTAMP
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_users_branch ON users(branch_id);
CREATE INDEX idx_users_role ON users(role_id);

-- User branch access (for multi-branch access)
CREATE TABLE IF NOT EXISTS user_branch_access (
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    branch_id UUID REFERENCES branches(id) ON DELETE CASCADE,
    granted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    granted_by UUID REFERENCES users(id),
    PRIMARY KEY (user_id, branch_id)
);

-- User sessions
CREATE TABLE IF NOT EXISTS user_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    token_hash VARCHAR(255) UNIQUE NOT NULL,
    ip_address VARCHAR(45),
    user_agent TEXT,
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_sessions_token ON user_sessions(token_hash);
CREATE INDEX idx_sessions_user ON user_sessions(user_id);

-- =============================================
-- CRM MODULE TABLES
-- =============================================

-- CRM Contacts
CREATE TABLE IF NOT EXISTS crm_contacts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    type VARCHAR(50) NOT NULL, -- 'individual', 'business', 'organization'
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    company_name VARCHAR(200),
    email VARCHAR(100),
    phone VARCHAR(20),
    mobile VARCHAR(20),
    job_title VARCHAR(100),
    department VARCHAR(100),
    status VARCHAR(50) DEFAULT 'active', -- 'active', 'inactive', 'blacklisted'
    source VARCHAR(50), -- 'website', 'referral', 'campaign', 'walk-in', 'other'
    assigned_to UUID REFERENCES users(id),
    branch_id UUID REFERENCES branches(id),
    address_street VARCHAR(255),
    address_city VARCHAR(100),
    address_state VARCHAR(100),
    address_country VARCHAR(100),
    address_postal_code VARCHAR(20),
    date_of_birth DATE,
    gender VARCHAR(20),
    tags TEXT[], -- Array of tags
    notes TEXT,
    social_media JSONB, -- {"linkedin": "url", "twitter": "handle"}
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by UUID REFERENCES users(id),
    deleted_at TIMESTAMP
);

CREATE INDEX idx_crm_contacts_email ON crm_contacts(email);
CREATE INDEX idx_crm_contacts_phone ON crm_contacts(phone);
CREATE INDEX idx_crm_contacts_assigned ON crm_contacts(assigned_to);
CREATE INDEX idx_crm_contacts_branch ON crm_contacts(branch_id);

-- CRM Leads
CREATE TABLE IF NOT EXISTS crm_leads (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    contact_id UUID REFERENCES crm_contacts(id),
    lead_number VARCHAR(50) UNIQUE NOT NULL,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    stage VARCHAR(50) NOT NULL, -- 'new', 'contacted', 'qualified', 'proposal', 'negotiation', 'closed', 'lost'
    status VARCHAR(50) DEFAULT 'active', -- 'active', 'inactive', 'converted', 'lost'
    source VARCHAR(50),
    estimated_value DECIMAL(15,2),
    probability INT CHECK (probability >= 0 AND probability <= 100),
    expected_close_date DATE,
    actual_close_date DATE,
    lost_reason TEXT,
    assigned_to UUID REFERENCES users(id),
    branch_id UUID REFERENCES branches(id),
    tags TEXT[],
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by UUID REFERENCES users(id),
    converted_at TIMESTAMP,
    converted_to_borrower_id UUID,
    deleted_at TIMESTAMP
);

CREATE INDEX idx_crm_leads_contact ON crm_leads(contact_id);
CREATE INDEX idx_crm_leads_stage ON crm_leads(stage);
CREATE INDEX idx_crm_leads_assigned ON crm_leads(assigned_to);

-- CRM Activities
CREATE TABLE IF NOT EXISTS crm_activities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    type VARCHAR(50) NOT NULL, -- 'call', 'email', 'meeting', 'note', 'task', 'sms'
    subject VARCHAR(200) NOT NULL,
    description TEXT,
    contact_id UUID REFERENCES crm_contacts(id),
    lead_id UUID REFERENCES crm_leads(id),
    status VARCHAR(50) DEFAULT 'scheduled', -- 'scheduled', 'completed', 'cancelled'
    priority VARCHAR(20) DEFAULT 'medium', -- 'low', 'medium', 'high', 'urgent'
    scheduled_at TIMESTAMP,
    completed_at TIMESTAMP,
    duration_minutes INT,
    outcome TEXT,
    assigned_to UUID REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by UUID REFERENCES users(id),
    deleted_at TIMESTAMP
);

CREATE INDEX idx_crm_activities_contact ON crm_activities(contact_id);
CREATE INDEX idx_crm_activities_lead ON crm_activities(lead_id);
CREATE INDEX idx_crm_activities_assigned ON crm_activities(assigned_to);
CREATE INDEX idx_crm_activities_scheduled ON crm_activities(scheduled_at);

-- CRM Tasks
CREATE TABLE IF NOT EXISTS crm_tasks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(200) NOT NULL,
    description TEXT,
    status VARCHAR(50) DEFAULT 'todo', -- 'todo', 'in_progress', 'review', 'completed', 'cancelled'
    priority VARCHAR(20) DEFAULT 'medium',
    due_date DATE,
    completed_at TIMESTAMP,
    contact_id UUID REFERENCES crm_contacts(id),
    lead_id UUID REFERENCES crm_leads(id),
    assigned_to UUID REFERENCES users(id),
    tags TEXT[],
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by UUID REFERENCES users(id),
    deleted_at TIMESTAMP
);

CREATE INDEX idx_crm_tasks_status ON crm_tasks(status);
CREATE INDEX idx_crm_tasks_assigned ON crm_tasks(assigned_to);
CREATE INDEX idx_crm_tasks_due_date ON crm_tasks(due_date);

-- =============================================
-- BORROWER MANAGEMENT TABLES
-- =============================================

-- Borrower groups
CREATE TABLE IF NOT EXISTS borrower_groups (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    group_number VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    type VARCHAR(50), -- 'solidarity', 'village_bank', 'association'
    meeting_frequency VARCHAR(50), -- 'weekly', 'bi-weekly', 'monthly'
    meeting_day VARCHAR(20),
    meeting_time TIME,
    leader_id UUID,
    secretary_id UUID,
    treasurer_id UUID,
    branch_id UUID REFERENCES branches(id),
    status VARCHAR(50) DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by UUID REFERENCES users(id),
    deleted_at TIMESTAMP
);

CREATE INDEX idx_borrower_groups_number ON borrower_groups(group_number);
CREATE INDEX idx_borrower_groups_branch ON borrower_groups(branch_id);

-- Borrowers
CREATE TABLE IF NOT EXISTS borrowers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    borrower_number VARCHAR(50) UNIQUE NOT NULL,
    crm_contact_id UUID REFERENCES crm_contacts(id),
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    middle_name VARCHAR(100),
    date_of_birth DATE NOT NULL,
    gender VARCHAR(20) NOT NULL,
    marital_status VARCHAR(50),
    id_type VARCHAR(50), -- 'national_id', 'passport', 'driving_license'
    id_number VARCHAR(100) UNIQUE NOT NULL,
    id_issue_date DATE,
    id_expiry_date DATE,
    phone VARCHAR(20) NOT NULL,
    mobile VARCHAR(20),
    email VARCHAR(100),
    address_street VARCHAR(255),
    address_city VARCHAR(100),
    address_state VARCHAR(100),
    address_country VARCHAR(100),
    address_postal_code VARCHAR(20),
    employment_status VARCHAR(50), -- 'employed', 'self_employed', 'unemployed', 'retired'
    employer_name VARCHAR(200),
    job_title VARCHAR(100),
    monthly_income DECIMAL(15,2),
    other_income DECIMAL(15,2),
    expenses DECIMAL(15,2),
    credit_score INT,
    status VARCHAR(50) DEFAULT 'active', -- 'active', 'inactive', 'blacklisted', 'deceased'
    kyc_status VARCHAR(50) DEFAULT 'pending', -- 'pending', 'in_review', 'approved', 'rejected'
    kyc_verified_at TIMESTAMP,
    kyc_verified_by UUID REFERENCES users(id),
    assigned_officer UUID REFERENCES users(id),
    branch_id UUID REFERENCES branches(id),
    group_id UUID REFERENCES borrower_groups(id),
    referral_source VARCHAR(100),
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by UUID REFERENCES users(id),
    deleted_at TIMESTAMP
);

CREATE INDEX idx_borrowers_number ON borrowers(borrower_number);
CREATE INDEX idx_borrowers_id_number ON borrowers(id_number);
CREATE INDEX idx_borrowers_phone ON borrowers(phone);
CREATE INDEX idx_borrowers_email ON borrowers(email);
CREATE INDEX idx_borrowers_group ON borrowers(group_id);
CREATE INDEX idx_borrowers_branch ON borrowers(branch_id);
CREATE INDEX idx_borrowers_officer ON borrowers(assigned_officer);

-- Borrower documents
CREATE TABLE IF NOT EXISTS borrower_documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    borrower_id UUID REFERENCES borrowers(id) ON DELETE CASCADE,
    document_type VARCHAR(50) NOT NULL, -- 'id_card', 'proof_of_income', 'bank_statement', etc.
    document_name VARCHAR(200) NOT NULL,
    file_url VARCHAR(500) NOT NULL,
    file_size INT,
    mime_type VARCHAR(100),
    is_verified BOOLEAN DEFAULT FALSE,
    verified_at TIMESTAMP,
    verified_by UUID REFERENCES users(id),
    expiry_date DATE,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by UUID REFERENCES users(id),
    deleted_at TIMESTAMP
);

CREATE INDEX idx_borrower_docs_borrower ON borrower_documents(borrower_id);
CREATE INDEX idx_borrower_docs_type ON borrower_documents(document_type);

-- Emergency contacts
CREATE TABLE IF NOT EXISTS borrower_emergency_contacts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    borrower_id UUID REFERENCES borrowers(id) ON DELETE CASCADE,
    name VARCHAR(200) NOT NULL,
    relationship VARCHAR(50) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    email VARCHAR(100),
    address TEXT,
    is_primary BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_emergency_contacts_borrower ON borrower_emergency_contacts(borrower_id);

-- =============================================
-- LOAN MANAGEMENT TABLES
-- =============================================

-- Loan products
CREATE TABLE IF NOT EXISTS loan_products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    min_amount DECIMAL(15,2) NOT NULL,
    max_amount DECIMAL(15,2) NOT NULL,
    min_term INT NOT NULL, -- in days
    max_term INT NOT NULL, -- in days
    interest_rate DECIMAL(5,2) NOT NULL, -- annual percentage
    interest_method VARCHAR(50), -- 'flat_rate', 'declining_balance', 'compound'
    repayment_frequency VARCHAR(50), -- 'daily', 'weekly', 'bi-weekly', 'monthly'
    processing_fee DECIMAL(15,2),
    processing_fee_type VARCHAR(20), -- 'fixed', 'percentage'
    insurance_fee DECIMAL(15,2),
    late_payment_penalty DECIMAL(15,2),
    penalty_type VARCHAR(20), -- 'fixed', 'percentage'
    grace_period_days INT DEFAULT 0,
    collateral_required BOOLEAN DEFAULT FALSE,
    guarantor_required BOOLEAN DEFAULT FALSE,
    min_guarantors INT DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by UUID REFERENCES users(id),
    deleted_at TIMESTAMP
);

CREATE INDEX idx_loan_products_code ON loan_products(code);
CREATE INDEX idx_loan_products_active ON loan_products(is_active);

-- Loan applications
CREATE TABLE IF NOT EXISTS loan_applications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    application_number VARCHAR(50) UNIQUE NOT NULL,
    borrower_id UUID REFERENCES borrowers(id),
    product_id UUID REFERENCES loan_products(id),
    requested_amount DECIMAL(15,2) NOT NULL,
    approved_amount DECIMAL(15,2),
    term INT NOT NULL, -- in days
    term_unit VARCHAR(20) DEFAULT 'days', -- 'days', 'weeks', 'months'
    purpose VARCHAR(200),
    purpose_details TEXT,
    status VARCHAR(50) DEFAULT 'draft', -- 'draft', 'submitted', 'under_review', 'approved', 'rejected', 'disbursed', 'cancelled'
    application_date DATE DEFAULT CURRENT_DATE,
    submission_date TIMESTAMP,
    review_date TIMESTAMP,
    approval_date TIMESTAMP,
    rejection_date TIMESTAMP,
    rejection_reason TEXT,
    credit_score INT,
    risk_rating VARCHAR(20), -- 'low', 'medium', 'high', 'very_high'
    assigned_officer UUID REFERENCES users(id),
    reviewed_by UUID REFERENCES users(id),
    approved_by UUID REFERENCES users(id),
    branch_id UUID REFERENCES branches(id),
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by UUID REFERENCES users(id),
    deleted_at TIMESTAMP
);

CREATE INDEX idx_loan_apps_number ON loan_applications(application_number);
CREATE INDEX idx_loan_apps_borrower ON loan_applications(borrower_id);
CREATE INDEX idx_loan_apps_status ON loan_applications(status);
CREATE INDEX idx_loan_apps_branch ON loan_applications(branch_id);

-- Loans
CREATE TABLE IF NOT EXISTS loans (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    loan_number VARCHAR(50) UNIQUE NOT NULL,
    application_id UUID REFERENCES loan_applications(id),
    borrower_id UUID REFERENCES borrowers(id),
    product_id UUID REFERENCES loan_products(id),
    principal_amount DECIMAL(15,2) NOT NULL,
    interest_rate DECIMAL(5,2) NOT NULL,
    interest_amount DECIMAL(15,2) NOT NULL,
    total_amount DECIMAL(15,2) NOT NULL,
    term INT NOT NULL,
    term_unit VARCHAR(20) DEFAULT 'days',
    repayment_frequency VARCHAR(50) NOT NULL,
    number_of_installments INT NOT NULL,
    installment_amount DECIMAL(15,2) NOT NULL,
    disbursement_date DATE,
    first_payment_date DATE,
    maturity_date DATE,
    status VARCHAR(50) DEFAULT 'pending', -- 'pending', 'active', 'completed', 'defaulted', 'written_off', 'restructured'
    outstanding_principal DECIMAL(15,2),
    outstanding_interest DECIMAL(15,2),
    outstanding_fees DECIMAL(15,2),
    outstanding_penalty DECIMAL(15,2),
    total_paid DECIMAL(15,2) DEFAULT 0,
    principal_paid DECIMAL(15,2) DEFAULT 0,
    interest_paid DECIMAL(15,2) DEFAULT 0,
    fees_paid DECIMAL(15,2) DEFAULT 0,
    penalty_paid DECIMAL(15,2) DEFAULT 0,
    last_payment_date DATE,
    next_payment_date DATE,
    days_in_arrears INT DEFAULT 0,
    assigned_officer UUID REFERENCES users(id),
    disbursed_by UUID REFERENCES users(id),
    branch_id UUID REFERENCES branches(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by UUID REFERENCES users(id),
    closed_at TIMESTAMP,
    closed_by UUID REFERENCES users(id),
    deleted_at TIMESTAMP
);

CREATE INDEX idx_loans_number ON loans(loan_number);
CREATE INDEX idx_loans_borrower ON loans(borrower_id);
CREATE INDEX idx_loans_status ON loans(status);
CREATE INDEX idx_loans_branch ON loans(branch_id);
CREATE INDEX idx_loans_disbursement ON loans(disbursement_date);
CREATE INDEX idx_loans_maturity ON loans(maturity_date);

-- Loan repayment schedule
CREATE TABLE IF NOT EXISTS loan_schedules (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    loan_id UUID REFERENCES loans(id) ON DELETE CASCADE,
    installment_number INT NOT NULL,
    due_date DATE NOT NULL,
    principal_amount DECIMAL(15,2) NOT NULL,
    interest_amount DECIMAL(15,2) NOT NULL,
    fees_amount DECIMAL(15,2) DEFAULT 0,
    penalty_amount DECIMAL(15,2) DEFAULT 0,
    total_amount DECIMAL(15,2) NOT NULL,
    principal_paid DECIMAL(15,2) DEFAULT 0,
    interest_paid DECIMAL(15,2) DEFAULT 0,
    fees_paid DECIMAL(15,2) DEFAULT 0,
    penalty_paid DECIMAL(15,2) DEFAULT 0,
    total_paid DECIMAL(15,2) DEFAULT 0,
    payment_date DATE,
    status VARCHAR(50) DEFAULT 'pending', -- 'pending', 'partial', 'paid', 'overdue', 'waived'
    days_overdue INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_loan_schedules_loan ON loan_schedules(loan_id);
CREATE INDEX idx_loan_schedules_due_date ON loan_schedules(due_date);
CREATE INDEX idx_loan_schedules_status ON loan_schedules(status);

-- Loan collateral
CREATE TABLE IF NOT EXISTS loan_collateral (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    loan_id UUID REFERENCES loans(id),
    borrower_id UUID REFERENCES borrowers(id),
    type VARCHAR(50) NOT NULL, -- 'property', 'vehicle', 'equipment', 'inventory', 'other'
    description TEXT NOT NULL,
    estimated_value DECIMAL(15,2) NOT NULL,
    market_value DECIMAL(15,2),
    forced_sale_value DECIMAL(15,2),
    valuation_date DATE,
    valuation_by VARCHAR(200),
    location TEXT,
    condition VARCHAR(50), -- 'excellent', 'good', 'fair', 'poor'
    insurance_status VARCHAR(50), -- 'insured', 'not_insured', 'expired'
    insurance_company VARCHAR(200),
    insurance_policy_number VARCHAR(100),
    insurance_expiry_date DATE,
    status VARCHAR(50) DEFAULT 'held', -- 'held', 'released', 'seized', 'sold'
    documents JSONB, -- Array of document references
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by UUID REFERENCES users(id),
    deleted_at TIMESTAMP
);

CREATE INDEX idx_collateral_loan ON loan_collateral(loan_id);
CREATE INDEX idx_collateral_borrower ON loan_collateral(borrower_id);
CREATE INDEX idx_collateral_type ON loan_collateral(type);

-- Loan guarantors
CREATE TABLE IF NOT EXISTS loan_guarantors (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    loan_id UUID REFERENCES loans(id),
    name VARCHAR(200) NOT NULL,
    relationship VARCHAR(50) NOT NULL,
    id_type VARCHAR(50),
    id_number VARCHAR(100),
    phone VARCHAR(20) NOT NULL,
    email VARCHAR(100),
    address TEXT,
    occupation VARCHAR(100),
    employer VARCHAR(200),
    monthly_income DECIMAL(15,2),
    guarantee_amount DECIMAL(15,2),
    status VARCHAR(50) DEFAULT 'active', -- 'active', 'released', 'called'
    consent_date DATE,
    documents JSONB,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by UUID REFERENCES users(id),
    deleted_at TIMESTAMP
);

CREATE INDEX idx_guarantors_loan ON loan_guarantors(loan_id);
CREATE INDEX idx_guarantors_phone ON loan_guarantors(phone);

-- =============================================
-- REPAYMENT TABLES
-- =============================================

-- Repayments
CREATE TABLE IF NOT EXISTS repayments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    receipt_number VARCHAR(50) UNIQUE NOT NULL,
    loan_id UUID REFERENCES loans(id),
    borrower_id UUID REFERENCES borrowers(id),
    schedule_id UUID REFERENCES loan_schedules(id),
    amount DECIMAL(15,2) NOT NULL,
    principal_amount DECIMAL(15,2) DEFAULT 0,
    interest_amount DECIMAL(15,2) DEFAULT 0,
    fees_amount DECIMAL(15,2) DEFAULT 0,
    penalty_amount DECIMAL(15,2) DEFAULT 0,
    payment_date DATE NOT NULL,
    payment_method VARCHAR(50) NOT NULL, -- 'cash', 'bank_transfer', 'mobile_money', 'cheque'
    payment_reference VARCHAR(100),
    bank_name VARCHAR(100),
    cheque_number VARCHAR(50),
    mobile_money_provider VARCHAR(50),
    mobile_money_reference VARCHAR(100),
    collected_by UUID REFERENCES users(id),
    branch_id UUID REFERENCES branches(id),
    status VARCHAR(50) DEFAULT 'pending', -- 'pending', 'approved', 'rejected', 'reversed'
    approved_by UUID REFERENCES users(id),
    approved_at TIMESTAMP,
    rejection_reason TEXT,
    reversal_reason TEXT,
    reversed_by UUID REFERENCES users(id),
    reversed_at TIMESTAMP,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by UUID REFERENCES users(id),
    deleted_at TIMESTAMP
);

CREATE INDEX idx_repayments_receipt ON repayments(receipt_number);
CREATE INDEX idx_repayments_loan ON repayments(loan_id);
CREATE INDEX idx_repayments_borrower ON repayments(borrower_id);
CREATE INDEX idx_repayments_date ON repayments(payment_date);
CREATE INDEX idx_repayments_status ON repayments(status);

-- =============================================
-- SAVINGS MODULE TABLES
-- =============================================

-- Savings products
CREATE TABLE IF NOT EXISTS savings_products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    type VARCHAR(50) NOT NULL, -- 'regular', 'fixed_deposit', 'recurring', 'susu'
    description TEXT,
    min_balance DECIMAL(15,2) DEFAULT 0,
    max_balance DECIMAL(15,2),
    interest_rate DECIMAL(5,2) DEFAULT 0,
    interest_calculation VARCHAR(50), -- 'daily', 'monthly', 'quarterly', 'annual'
    interest_posting VARCHAR(50), -- 'monthly', 'quarterly', 'annual', 'maturity'
    min_deposit DECIMAL(15,2),
    max_deposit DECIMAL(15,2),
    withdrawal_limit_amount DECIMAL(15,2),
    withdrawal_limit_frequency INT, -- number of withdrawals per month
    maintenance_fee DECIMAL(15,2) DEFAULT 0,
    maintenance_fee_frequency VARCHAR(50), -- 'monthly', 'quarterly', 'annual'
    withdrawal_fee DECIMAL(15,2) DEFAULT 0,
    withdrawal_fee_type VARCHAR(20), -- 'fixed', 'percentage'
    minimum_balance_fee DECIMAL(15,2) DEFAULT 0,
    term_days INT, -- for fixed deposits
    premature_withdrawal_penalty DECIMAL(5,2), -- percentage
    auto_renewal BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by UUID REFERENCES users(id),
    deleted_at TIMESTAMP
);

CREATE INDEX idx_savings_products_code ON savings_products(code);
CREATE INDEX idx_savings_products_type ON savings_products(type);

-- Savings accounts
CREATE TABLE IF NOT EXISTS savings_accounts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    account_number VARCHAR(50) UNIQUE NOT NULL,
    borrower_id UUID REFERENCES borrowers(id),
    product_id UUID REFERENCES savings_products(id),
    branch_id UUID REFERENCES branches(id),
    opening_date DATE DEFAULT CURRENT_DATE,
    status VARCHAR(50) DEFAULT 'active', -- 'active', 'dormant', 'frozen', 'closed'
    balance DECIMAL(15,2) DEFAULT 0,
    available_balance DECIMAL(15,2) DEFAULT 0,
    blocked_amount DECIMAL(15,2) DEFAULT 0,
    interest_earned DECIMAL(15,2) DEFAULT 0,
    last_transaction_date DATE,
    last_interest_calculation_date DATE,
    last_interest_posting_date DATE,
    maturity_date DATE, -- for fixed deposits
    assigned_officer UUID REFERENCES users(id),
    nominee_name VARCHAR(200),
    nominee_relationship VARCHAR(50),
    nominee_phone VARCHAR(20),
    closed_date DATE,
    closed_by UUID REFERENCES users(id),
    closure_reason TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by UUID REFERENCES users(id),
    deleted_at TIMESTAMP
);

CREATE INDEX idx_savings_accounts_number ON savings_accounts(account_number);
CREATE INDEX idx_savings_accounts_borrower ON savings_accounts(borrower_id);
CREATE INDEX idx_savings_accounts_status ON savings_accounts(status);
CREATE INDEX idx_savings_accounts_branch ON savings_accounts(branch_id);

-- Savings transactions
CREATE TABLE IF NOT EXISTS savings_transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    transaction_number VARCHAR(50) UNIQUE NOT NULL,
    account_id UUID REFERENCES savings_accounts(id),
    type VARCHAR(50) NOT NULL, -- 'deposit', 'withdrawal', 'interest', 'fee', 'transfer'
    amount DECIMAL(15,2) NOT NULL,
    balance_before DECIMAL(15,2) NOT NULL,
    balance_after DECIMAL(15,2) NOT NULL,
    transaction_date DATE NOT NULL,
    value_date DATE,
    payment_method VARCHAR(50),
    payment_reference VARCHAR(100),
    transfer_account_id UUID REFERENCES savings_accounts(id),
    description TEXT,
    teller_id UUID REFERENCES users(id),
    branch_id UUID REFERENCES branches(id),
    status VARCHAR(50) DEFAULT 'pending', -- 'pending', 'approved', 'rejected', 'reversed'
    approved_by UUID REFERENCES users(id),
    approved_at TIMESTAMP,
    reversed_by UUID REFERENCES users(id),
    reversed_at TIMESTAMP,
    reversal_reason TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by UUID REFERENCES users(id),
    deleted_at TIMESTAMP
);

CREATE INDEX idx_savings_trans_number ON savings_transactions(transaction_number);
CREATE INDEX idx_savings_trans_account ON savings_transactions(account_id);
CREATE INDEX idx_savings_trans_date ON savings_transactions(transaction_date);
CREATE INDEX idx_savings_trans_type ON savings_transactions(type);

-- =============================================
-- INVESTOR MODULE TABLES
-- =============================================

-- Investors
CREATE TABLE IF NOT EXISTS investors (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    investor_number VARCHAR(50) UNIQUE NOT NULL,
    type VARCHAR(50) NOT NULL, -- 'individual', 'institutional'
    name VARCHAR(200) NOT NULL,
    email VARCHAR(100),
    phone VARCHAR(20),
    address TEXT,
    id_type VARCHAR(50),
    id_number VARCHAR(100),
    tax_id VARCHAR(50),
    kyc_status VARCHAR(50) DEFAULT 'pending',
    kyc_verified_at TIMESTAMP,
    kyc_verified_by UUID REFERENCES users(id),
    risk_profile VARCHAR(50), -- 'conservative', 'moderate', 'aggressive'
    investment_limit DECIMAL(15,2),
    total_invested DECIMAL(15,2) DEFAULT 0,
    total_returns DECIMAL(15,2) DEFAULT 0,
    status VARCHAR(50) DEFAULT 'active',
    assigned_officer UUID REFERENCES users(id),
    branch_id UUID REFERENCES branches(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by UUID REFERENCES users(id),
    deleted_at TIMESTAMP
);

CREATE INDEX idx_investors_number ON investors(investor_number);
CREATE INDEX idx_investors_email ON investors(email);
CREATE INDEX idx_investors_status ON investors(status);

-- Investment products
CREATE TABLE IF NOT EXISTS investment_products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    type VARCHAR(50) NOT NULL, -- 'fixed_deposit', 'bond', 'loan_funding'
    description TEXT,
    min_investment DECIMAL(15,2) NOT NULL,
    max_investment DECIMAL(15,2),
    interest_rate DECIMAL(5,2) NOT NULL,
    term_days INT,
    risk_level VARCHAR(50), -- 'low', 'medium', 'high'
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by UUID REFERENCES users(id),
    deleted_at TIMESTAMP
);

-- Investor accounts
CREATE TABLE IF NOT EXISTS investor_accounts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    account_number VARCHAR(50) UNIQUE NOT NULL,
    investor_id UUID REFERENCES investors(id),
    product_id UUID REFERENCES investment_products(id),
    principal_amount DECIMAL(15,2) NOT NULL,
    interest_rate DECIMAL(5,2) NOT NULL,
    start_date DATE NOT NULL,
    maturity_date DATE,
    status VARCHAR(50) DEFAULT 'active', -- 'active', 'matured', 'withdrawn', 'closed'
    interest_earned DECIMAL(15,2) DEFAULT 0,
    total_paid_out DECIMAL(15,2) DEFAULT 0,
    last_interest_payment_date DATE,
    next_interest_payment_date DATE,
    auto_renew BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by UUID REFERENCES users(id),
    deleted_at TIMESTAMP
);

CREATE INDEX idx_investor_accounts_number ON investor_accounts(account_number);
CREATE INDEX idx_investor_accounts_investor ON investor_accounts(investor_id);
CREATE INDEX idx_investor_accounts_status ON investor_accounts(status);

-- =============================================
-- PAYROLL MODULE TABLES
-- =============================================

-- Employees (extends users table)
CREATE TABLE IF NOT EXISTS employees (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id),
    employee_number VARCHAR(50) UNIQUE NOT NULL,
    department VARCHAR(100),
    designation VARCHAR(100),
    date_of_joining DATE NOT NULL,
    employment_type VARCHAR(50), -- 'permanent', 'contract', 'probation', 'intern'
    basic_salary DECIMAL(15,2) NOT NULL,
    allowances JSONB, -- {"housing": 50000, "transport": 30000}
    deductions JSONB, -- {"tax": 0, "pension": 0}
    bank_name VARCHAR(100),
    bank_account_number VARCHAR(50),
    tax_number VARCHAR(50),
    pension_number VARCHAR(50),
    insurance_number VARCHAR(50),
    emergency_contact_name VARCHAR(200),
    emergency_contact_phone VARCHAR(20),
    status VARCHAR(50) DEFAULT 'active', -- 'active', 'on_leave', 'suspended', 'terminated'
    termination_date DATE,
    termination_reason TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by UUID REFERENCES users(id),
    deleted_at TIMESTAMP
);

CREATE INDEX idx_employees_number ON employees(employee_number);
CREATE INDEX idx_employees_user ON employees(user_id);
CREATE INDEX idx_employees_status ON employees(status);

-- Payroll periods
CREATE TABLE IF NOT EXISTS payroll_periods (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    period_name VARCHAR(100) NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    payment_date DATE NOT NULL,
    status VARCHAR(50) DEFAULT 'draft', -- 'draft', 'processing', 'approved', 'paid', 'closed'
    total_gross DECIMAL(15,2) DEFAULT 0,
    total_deductions DECIMAL(15,2) DEFAULT 0,
    total_net DECIMAL(15,2) DEFAULT 0,
    approved_by UUID REFERENCES users(id),
    approved_at TIMESTAMP,
    processed_by UUID REFERENCES users(id),
    processed_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by UUID REFERENCES users(id)
);

CREATE INDEX idx_payroll_periods_dates ON payroll_periods(start_date, end_date);
CREATE INDEX idx_payroll_periods_status ON payroll_periods(status);

-- Payroll records
CREATE TABLE IF NOT EXISTS payroll_records (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    period_id UUID REFERENCES payroll_periods(id),
    employee_id UUID REFERENCES employees(id),
    basic_salary DECIMAL(15,2) NOT NULL,
    allowances JSONB,
    gross_salary DECIMAL(15,2) NOT NULL,
    deductions JSONB,
    net_salary DECIMAL(15,2) NOT NULL,
    payment_method VARCHAR(50), -- 'bank_transfer', 'cash', 'cheque'
    payment_reference VARCHAR(100),
    payment_date DATE,
    status VARCHAR(50) DEFAULT 'pending', -- 'pending', 'paid', 'cancelled'
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by UUID REFERENCES users(id)
);

CREATE INDEX idx_payroll_records_period ON payroll_records(period_id);
CREATE INDEX idx_payroll_records_employee ON payroll_records(employee_id);
CREATE INDEX idx_payroll_records_status ON payroll_records(status);

-- =============================================
-- EXPENSE MANAGEMENT TABLES
-- =============================================

-- Expense categories
CREATE TABLE IF NOT EXISTS expense_categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    code VARCHAR(50) UNIQUE NOT NULL,
    parent_id UUID REFERENCES expense_categories(id),
    description TEXT,
    budget_amount DECIMAL(15,2),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by UUID REFERENCES users(id)
);

CREATE INDEX idx_expense_categories_code ON expense_categories(code);
CREATE INDEX idx_expense_categories_parent ON expense_categories(parent_id);

-- Expenses
CREATE TABLE IF NOT EXISTS expenses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    expense_number VARCHAR(50) UNIQUE NOT NULL,
    category_id UUID REFERENCES expense_categories(id),
    amount DECIMAL(15,2) NOT NULL,
    expense_date DATE NOT NULL,
    description TEXT NOT NULL,
    vendor_name VARCHAR(200),
    invoice_number VARCHAR(100),
    payment_method VARCHAR(50),
    payment_reference VARCHAR(100),
    status VARCHAR(50) DEFAULT 'draft', -- 'draft', 'submitted', 'approved', 'rejected', 'paid'
    requested_by UUID REFERENCES users(id),
    approved_by UUID REFERENCES users(id),
    approved_at TIMESTAMP,
    paid_by UUID REFERENCES users(id),
    paid_at TIMESTAMP,
    rejection_reason TEXT,
    branch_id UUID REFERENCES branches(id),
    receipts JSONB, -- Array of receipt URLs
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by UUID REFERENCES users(id),
    deleted_at TIMESTAMP
);

CREATE INDEX idx_expenses_number ON expenses(expense_number);
CREATE INDEX idx_expenses_category ON expenses(category_id);
CREATE INDEX idx_expenses_date ON expenses(expense_date);
CREATE INDEX idx_expenses_status ON expenses(status);
CREATE INDEX idx_expenses_branch ON expenses(branch_id);

-- =============================================
-- OTHER INCOME TABLES
-- =============================================

-- Income categories
CREATE TABLE IF NOT EXISTS income_categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    code VARCHAR(50) UNIQUE NOT NULL,
    description TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by UUID REFERENCES users(id)
);

-- Other income
CREATE TABLE IF NOT EXISTS other_income (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    income_number VARCHAR(50) UNIQUE NOT NULL,
    category_id UUID REFERENCES income_categories(id),
    amount DECIMAL(15,2) NOT NULL,
    income_date DATE NOT NULL,
    description TEXT NOT NULL,
    source VARCHAR(200),
    payment_method VARCHAR(50),
    payment_reference VARCHAR(100),
    branch_id UUID REFERENCES branches(id),
    status VARCHAR(50) DEFAULT 'received', -- 'pending', 'received', 'cancelled'
    received_by UUID REFERENCES users(id),
    documents JSONB,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by UUID REFERENCES users(id),
    deleted_at TIMESTAMP
);

CREATE INDEX idx_other_income_number ON other_income(income_number);
CREATE INDEX idx_other_income_category ON other_income(category_id);
CREATE INDEX idx_other_income_date ON other_income(income_date);
CREATE INDEX idx_other_income_branch ON other_income(branch_id);

-- =============================================
-- ASSET MANAGEMENT TABLES
-- =============================================

-- Asset categories
CREATE TABLE IF NOT EXISTS asset_categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    code VARCHAR(50) UNIQUE NOT NULL,
    depreciation_rate DECIMAL(5,2), -- annual percentage
    depreciation_method VARCHAR(50), -- 'straight_line', 'declining_balance'
    useful_life_years INT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by UUID REFERENCES users(id)
);

-- Assets
CREATE TABLE IF NOT EXISTS assets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    asset_number VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(200) NOT NULL,
    category_id UUID REFERENCES asset_categories(id),
    description TEXT,
    serial_number VARCHAR(100),
    purchase_date DATE NOT NULL,
    purchase_value DECIMAL(15,2) NOT NULL,
    current_value DECIMAL(15,2) NOT NULL,
    salvage_value DECIMAL(15,2) DEFAULT 0,
    location VARCHAR(200),
    assigned_to UUID REFERENCES users(id),
    branch_id UUID REFERENCES branches(id),
    condition VARCHAR(50), -- 'new', 'good', 'fair', 'poor', 'disposed'
    warranty_expiry_date DATE,
    insurance_policy_number VARCHAR(100),
    insurance_expiry_date DATE,
    disposal_date DATE,
    disposal_value DECIMAL(15,2),
    disposal_reason TEXT,
    status VARCHAR(50) DEFAULT 'active', -- 'active', 'maintenance', 'disposed', 'lost'
    documents JSONB,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by UUID REFERENCES users(id),
    deleted_at TIMESTAMP
);

CREATE INDEX idx_assets_number ON assets(asset_number);
CREATE INDEX idx_assets_category ON assets(category_id);
CREATE INDEX idx_assets_branch ON assets(branch_id);
CREATE INDEX idx_assets_status ON assets(status);

-- Asset maintenance
CREATE TABLE IF NOT EXISTS asset_maintenance (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    asset_id UUID REFERENCES assets(id),
    maintenance_type VARCHAR(50), -- 'preventive', 'corrective', 'emergency'
    description TEXT NOT NULL,
    performed_by VARCHAR(200),
    maintenance_date DATE NOT NULL,
    next_maintenance_date DATE,
    cost DECIMAL(15,2),
    downtime_hours INT,
    status VARCHAR(50) DEFAULT 'scheduled', -- 'scheduled', 'in_progress', 'completed', 'cancelled'
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by UUID REFERENCES users(id)
);

CREATE INDEX idx_asset_maintenance_asset ON asset_maintenance(asset_id);
CREATE INDEX idx_asset_maintenance_date ON asset_maintenance(maintenance_date);

-- =============================================
-- ACCOUNTING MODULE TABLES
-- =============================================

-- Chart of accounts
CREATE TABLE IF NOT EXISTS chart_of_accounts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    account_code VARCHAR(50) UNIQUE NOT NULL,
    account_name VARCHAR(200) NOT NULL,
    account_type VARCHAR(50) NOT NULL, -- 'asset', 'liability', 'equity', 'revenue', 'expense'
    parent_id UUID REFERENCES chart_of_accounts(id),
    is_detail BOOLEAN DEFAULT TRUE, -- Can post transactions
    normal_balance VARCHAR(10), -- 'debit', 'credit'
    current_balance DECIMAL(15,2) DEFAULT 0,
    description TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by UUID REFERENCES users(id),
    deleted_at TIMESTAMP
);

CREATE INDEX idx_chart_accounts_code ON chart_of_accounts(account_code);
CREATE INDEX idx_chart_accounts_type ON chart_of_accounts(account_type);
CREATE INDEX idx_chart_accounts_parent ON chart_of_accounts(parent_id);

-- Journal entries
CREATE TABLE IF NOT EXISTS journal_entries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    entry_number VARCHAR(50) UNIQUE NOT NULL,
    entry_date DATE NOT NULL,
    description TEXT NOT NULL,
    reference_type VARCHAR(50), -- 'loan', 'savings', 'expense', 'income', 'manual'
    reference_id UUID,
    total_debit DECIMAL(15,2) NOT NULL,
    total_credit DECIMAL(15,2) NOT NULL,
    status VARCHAR(50) DEFAULT 'draft', -- 'draft', 'posted', 'reversed'
    posted_by UUID REFERENCES users(id),
    posted_at TIMESTAMP,
    reversed_by UUID REFERENCES users(id),
    reversed_at TIMESTAMP,
    reversal_reason TEXT,
    branch_id UUID REFERENCES branches(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by UUID REFERENCES users(id),
    deleted_at TIMESTAMP,
    CONSTRAINT check_balanced CHECK (total_debit = total_credit)
);

CREATE INDEX idx_journal_entries_number ON journal_entries(entry_number);
CREATE INDEX idx_journal_entries_date ON journal_entries(entry_date);
CREATE INDEX idx_journal_entries_status ON journal_entries(status);
CREATE INDEX idx_journal_entries_reference ON journal_entries(reference_type, reference_id);

-- Journal entry lines
CREATE TABLE IF NOT EXISTS journal_entry_lines (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    entry_id UUID REFERENCES journal_entries(id) ON DELETE CASCADE,
    account_id UUID REFERENCES chart_of_accounts(id),
    debit_amount DECIMAL(15,2) DEFAULT 0,
    credit_amount DECIMAL(15,2) DEFAULT 0,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT check_debit_or_credit CHECK (
        (debit_amount > 0 AND credit_amount = 0) OR 
        (credit_amount > 0 AND debit_amount = 0)
    )
);

CREATE INDEX idx_journal_lines_entry ON journal_entry_lines(entry_id);
CREATE INDEX idx_journal_lines_account ON journal_entry_lines(account_id);

-- =============================================
-- CALENDAR & SCHEDULING TABLES
-- =============================================

-- Calendar events
CREATE TABLE IF NOT EXISTS calendar_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(200) NOT NULL,
    description TEXT,
    event_type VARCHAR(50), -- 'meeting', 'appointment', 'reminder', 'holiday', 'other'
    start_datetime TIMESTAMP NOT NULL,
    end_datetime TIMESTAMP NOT NULL,
    all_day BOOLEAN DEFAULT FALSE,
    location VARCHAR(200),
    related_type VARCHAR(50), -- 'loan', 'borrower', 'savings', etc.
    related_id UUID,
    attendees JSONB, -- Array of user IDs
    organizer_id UUID REFERENCES users(id),
    reminder_minutes INT,
    recurrence_rule TEXT, -- RFC 5545 RRULE format
    status VARCHAR(50) DEFAULT 'scheduled', -- 'scheduled', 'completed', 'cancelled'
    branch_id UUID REFERENCES branches(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by UUID REFERENCES users(id),
    deleted_at TIMESTAMP
);

CREATE INDEX idx_calendar_events_start ON calendar_events(start_datetime);
CREATE INDEX idx_calendar_events_organizer ON calendar_events(organizer_id);
CREATE INDEX idx_calendar_events_type ON calendar_events(event_type);
CREATE INDEX idx_calendar_events_related ON calendar_events(related_type, related_id);

-- =============================================
-- COLLECTION SHEETS TABLES
-- =============================================

-- Collection sheets
CREATE TABLE IF NOT EXISTS collection_sheets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    sheet_number VARCHAR(50) UNIQUE NOT NULL,
    collection_date DATE NOT NULL,
    collector_id UUID REFERENCES users(id),
    route VARCHAR(200),
    branch_id UUID REFERENCES branches(id),
    expected_amount DECIMAL(15,2) DEFAULT 0,
    collected_amount DECIMAL(15,2) DEFAULT 0,
    variance_amount DECIMAL(15,2) DEFAULT 0,
    status VARCHAR(50) DEFAULT 'draft', -- 'draft', 'in_progress', 'completed', 'approved'
    start_time TIMESTAMP,
    end_time TIMESTAMP,
    approved_by UUID REFERENCES users(id),
    approved_at TIMESTAMP,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by UUID REFERENCES users(id),
    deleted_at TIMESTAMP
);

CREATE INDEX idx_collection_sheets_number ON collection_sheets(sheet_number);
CREATE INDEX idx_collection_sheets_date ON collection_sheets(collection_date);
CREATE INDEX idx_collection_sheets_collector ON collection_sheets(collector_id);
CREATE INDEX idx_collection_sheets_status ON collection_sheets(status);

-- Collection sheet items
CREATE TABLE IF NOT EXISTS collection_sheet_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    sheet_id UUID REFERENCES collection_sheets(id) ON DELETE CASCADE,
    loan_id UUID REFERENCES loans(id),
    borrower_id UUID REFERENCES borrowers(id),
    expected_amount DECIMAL(15,2) NOT NULL,
    collected_amount DECIMAL(15,2) DEFAULT 0,
    payment_method VARCHAR(50),
    payment_reference VARCHAR(100),
    collection_time TIMESTAMP,
    status VARCHAR(50) DEFAULT 'pending', -- 'pending', 'collected', 'partial', 'missed'
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_collection_items_sheet ON collection_sheet_items(sheet_id);
CREATE INDEX idx_collection_items_loan ON collection_sheet_items(loan_id);
CREATE INDEX idx_collection_items_status ON collection_sheet_items(status);

-- =============================================
-- E-SIGNATURES TABLES
-- =============================================

-- E-signature templates
CREATE TABLE IF NOT EXISTS esignature_templates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(200) NOT NULL,
    description TEXT,
    document_type VARCHAR(50), -- 'loan_agreement', 'savings_agreement', 'general'
    template_content TEXT,
    placeholders JSONB, -- Array of placeholder fields
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by UUID REFERENCES users(id),
    deleted_at TIMESTAMP
);

-- E-signature requests
CREATE TABLE IF NOT EXISTS esignature_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    request_number VARCHAR(50) UNIQUE NOT NULL,
    template_id UUID REFERENCES esignature_templates(id),
    document_name VARCHAR(200) NOT NULL,
    document_content TEXT,
    document_url VARCHAR(500),
    related_type VARCHAR(50), -- 'loan', 'savings', etc.
    related_id UUID,
    status VARCHAR(50) DEFAULT 'draft', -- 'draft', 'sent', 'signed', 'rejected', 'expired'
    sent_at TIMESTAMP,
    expires_at TIMESTAMP,
    completed_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by UUID REFERENCES users(id),
    deleted_at TIMESTAMP
);

CREATE INDEX idx_esignature_requests_number ON esignature_requests(request_number);
CREATE INDEX idx_esignature_requests_status ON esignature_requests(status);
CREATE INDEX idx_esignature_requests_related ON esignature_requests(related_type, related_id);

-- E-signature signers
CREATE TABLE IF NOT EXISTS esignature_signers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    request_id UUID REFERENCES esignature_requests(id) ON DELETE CASCADE,
    name VARCHAR(200) NOT NULL,
    email VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    signing_order INT,
    status VARCHAR(50) DEFAULT 'pending', -- 'pending', 'signed', 'rejected'
    signed_at TIMESTAMP,
    signature_data TEXT, -- Base64 encoded signature image
    ip_address VARCHAR(45),
    rejection_reason TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_esignature_signers_request ON esignature_signers(request_id);
CREATE INDEX idx_esignature_signers_email ON esignature_signers(email);
CREATE INDEX idx_esignature_signers_status ON esignature_signers(status);

-- =============================================
-- COMMUNICATION TABLES
-- =============================================

-- SMS templates
CREATE TABLE IF NOT EXISTS sms_templates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    content TEXT NOT NULL,
    placeholders JSONB,
    category VARCHAR(50), -- 'payment_reminder', 'marketing', 'notification'
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by UUID REFERENCES users(id)
);

-- SMS messages
CREATE TABLE IF NOT EXISTS sms_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    template_id UUID REFERENCES sms_templates(id),
    recipient_phone VARCHAR(20) NOT NULL,
    recipient_id UUID,
    recipient_type VARCHAR(50), -- 'borrower', 'user', 'contact'
    message_content TEXT NOT NULL,
    status VARCHAR(50) DEFAULT 'pending', -- 'pending', 'sent', 'delivered', 'failed'
    provider VARCHAR(50),
    provider_message_id VARCHAR(100),
    sent_at TIMESTAMP,
    delivered_at TIMESTAMP,
    failed_reason TEXT,
    cost DECIMAL(10,2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by UUID REFERENCES users(id)
);

CREATE INDEX idx_sms_messages_recipient ON sms_messages(recipient_phone);
CREATE INDEX idx_sms_messages_status ON sms_messages(status);
CREATE INDEX idx_sms_messages_sent ON sms_messages(sent_at);

-- Email templates
CREATE TABLE IF NOT EXISTS email_templates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    subject VARCHAR(500) NOT NULL,
    body_html TEXT,
    body_text TEXT,
    placeholders JSONB,
    category VARCHAR(50),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by UUID REFERENCES users(id)
);

-- Email messages
CREATE TABLE IF NOT EXISTS email_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    template_id UUID REFERENCES email_templates(id),
    recipient_email VARCHAR(100) NOT NULL,
    recipient_id UUID,
    recipient_type VARCHAR(50),
    subject VARCHAR(500) NOT NULL,
    body_html TEXT,
    body_text TEXT,
    attachments JSONB,
    status VARCHAR(50) DEFAULT 'pending', -- 'pending', 'sent', 'delivered', 'failed', 'bounced'
    provider VARCHAR(50),
    provider_message_id VARCHAR(100),
    sent_at TIMESTAMP,
    delivered_at TIMESTAMP,
    opened_at TIMESTAMP,
    clicked_at TIMESTAMP,
    failed_reason TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by UUID REFERENCES users(id)
);

CREATE INDEX idx_email_messages_recipient ON email_messages(recipient_email);
CREATE INDEX idx_email_messages_status ON email_messages(status);
CREATE INDEX idx_email_messages_sent ON email_messages(sent_at);

-- =============================================
-- REPORTS & ANALYTICS TABLES
-- =============================================

-- Report definitions
CREATE TABLE IF NOT EXISTS report_definitions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(200) NOT NULL,
    description TEXT,
    category VARCHAR(100),
    query_template TEXT,
    parameters JSONB,
    output_format VARCHAR(50), -- 'pdf', 'excel', 'csv', 'json'
    is_system BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by UUID REFERENCES users(id)
);

-- Generated reports
CREATE TABLE IF NOT EXISTS generated_reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    definition_id UUID REFERENCES report_definitions(id),
    report_name VARCHAR(200) NOT NULL,
    parameters JSONB,
    file_url VARCHAR(500),
    file_size INT,
    format VARCHAR(50),
    status VARCHAR(50) DEFAULT 'pending', -- 'pending', 'processing', 'completed', 'failed'
    generated_at TIMESTAMP,
    generated_by UUID REFERENCES users(id),
    branch_id UUID REFERENCES branches(id),
    error_message TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_generated_reports_definition ON generated_reports(definition_id);
CREATE INDEX idx_generated_reports_status ON generated_reports(status);
CREATE INDEX idx_generated_reports_generated ON generated_reports(generated_at);

-- =============================================
-- AUDIT & LOGGING TABLES
-- =============================================

-- Audit logs
CREATE TABLE IF NOT EXISTS audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id),
    action VARCHAR(50) NOT NULL, -- 'create', 'update', 'delete', 'view', 'approve', 'reject'
    entity_type VARCHAR(50) NOT NULL,
    entity_id UUID,
    entity_data JSONB,
    changes JSONB,
    ip_address VARCHAR(45),
    user_agent TEXT,
    branch_id UUID REFERENCES branches(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_audit_logs_user ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_entity ON audit_logs(entity_type, entity_id);
CREATE INDEX idx_audit_logs_action ON audit_logs(action);
CREATE INDEX idx_audit_logs_created ON audit_logs(created_at);

-- System logs
CREATE TABLE IF NOT EXISTS system_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    level VARCHAR(20) NOT NULL, -- 'debug', 'info', 'warning', 'error', 'critical'
    category VARCHAR(100),
    message TEXT NOT NULL,
    context JSONB,
    exception_type VARCHAR(200),
    exception_message TEXT,
    exception_trace TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_system_logs_level ON system_logs(level);
CREATE INDEX idx_system_logs_category ON system_logs(category);
CREATE INDEX idx_system_logs_created ON system_logs(created_at);

-- =============================================
-- NOTIFICATION TABLES
-- =============================================

-- Notifications
CREATE TABLE IF NOT EXISTS notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id),
    type VARCHAR(50) NOT NULL, -- 'loan_due', 'payment_received', 'approval_required', etc.
    title VARCHAR(200) NOT NULL,
    message TEXT NOT NULL,
    priority VARCHAR(20) DEFAULT 'normal', -- 'low', 'normal', 'high', 'urgent'
    related_type VARCHAR(50),
    related_id UUID,
    is_read BOOLEAN DEFAULT FALSE,
    read_at TIMESTAMP,
    action_url VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP
);

CREATE INDEX idx_notifications_user ON notifications(user_id);
CREATE INDEX idx_notifications_read ON notifications(is_read);
CREATE INDEX idx_notifications_created ON notifications(created_at);
CREATE INDEX idx_notifications_type ON notifications(type);

-- =============================================
-- DEFAULT DATA
-- =============================================

-- Insert default roles
INSERT INTO roles (id, name, description, is_system) VALUES
    (gen_random_uuid(), 'Super Admin', 'Full system access', TRUE),
    (gen_random_uuid(), 'Branch Manager', 'Branch management access', TRUE),
    (gen_random_uuid(), 'Loan Officer', 'Loan management access', TRUE),
    (gen_random_uuid(), 'Teller', 'Transaction processing access', TRUE),
    (gen_random_uuid(), 'Accountant', 'Accounting and reporting access', TRUE);

-- Insert default system configuration
INSERT INTO system_config (config_key, config_value, config_type, description) VALUES
    ('company_name', 'Micro Finance Ltd', 'string', 'Company name'),
    ('company_email', 'info@microfinance.com', 'string', 'Company email'),
    ('company_phone', '+255123456789', 'string', 'Company phone'),
    ('currency', 'TZS', 'string', 'Default currency'),
    ('date_format', 'DD/MM/YYYY', 'string', 'Date format'),
    ('fiscal_year_start', '01-01', 'string', 'Fiscal year start (MM-DD)'),
    ('password_min_length', '8', 'number', 'Minimum password length'),
    ('session_timeout', '30', 'number', 'Session timeout in minutes'),
    ('max_login_attempts', '5', 'number', 'Maximum login attempts before lock');

-- =============================================
-- FUNCTIONS AND TRIGGERS
-- =============================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for all tables with updated_at
DO $$ 
DECLARE
    t text;
BEGIN
    FOR t IN 
        SELECT table_name 
        FROM information_schema.columns 
        WHERE column_name = 'updated_at' 
        AND table_schema = 'public'
    LOOP
        EXECUTE format('CREATE TRIGGER update_%I_updated_at BEFORE UPDATE ON %I 
                       FOR EACH ROW EXECUTE FUNCTION update_updated_at_column()', t, t);
    END LOOP;
END $$;

-- Function to calculate loan arrears
CREATE OR REPLACE FUNCTION calculate_loan_arrears(loan_id UUID)
RETURNS INT AS $$
DECLARE
    days_arrears INT;
BEGIN
    SELECT COALESCE(
        GREATEST(0, EXTRACT(DAY FROM CURRENT_DATE - MIN(due_date))),
        0
    ) INTO days_arrears
    FROM loan_schedules
    WHERE loan_id = loan_id
    AND status IN ('pending', 'partial', 'overdue')
    AND due_date < CURRENT_DATE;
    
    RETURN days_arrears;
END;
$$ LANGUAGE plpgsql;

-- Function to calculate portfolio at risk
CREATE OR REPLACE FUNCTION calculate_portfolio_at_risk(days INT DEFAULT 30)
RETURNS TABLE(
    total_portfolio DECIMAL(15,2),
    par_amount DECIMAL(15,2),
    par_percentage DECIMAL(5,2)
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        SUM(outstanding_principal) as total_portfolio,
        SUM(CASE WHEN days_in_arrears > days THEN outstanding_principal ELSE 0 END) as par_amount,
        CASE 
            WHEN SUM(outstanding_principal) > 0 THEN
                ROUND((SUM(CASE WHEN days_in_arrears > days THEN outstanding_principal ELSE 0 END) / 
                SUM(outstanding_principal)) * 100, 2)
            ELSE 0
        END as par_percentage
    FROM loans
    WHERE status = 'active';
END;
$$ LANGUAGE plpgsql;

-- =============================================
-- VIEWS FOR REPORTING
-- =============================================

-- Loan portfolio summary view
CREATE OR REPLACE VIEW v_loan_portfolio_summary AS
SELECT 
    l.branch_id,
    b.name as branch_name,
    COUNT(DISTINCT l.id) as total_loans,
    COUNT(DISTINCT l.borrower_id) as total_borrowers,
    SUM(l.principal_amount) as total_disbursed,
    SUM(l.outstanding_principal) as total_outstanding,
    SUM(l.principal_paid) as total_collected,
    AVG(l.days_in_arrears) as avg_days_arrears,
    COUNT(CASE WHEN l.days_in_arrears > 0 THEN 1 END) as loans_in_arrears,
    COUNT(CASE WHEN l.days_in_arrears > 30 THEN 1 END) as loans_par_30,
    COUNT(CASE WHEN l.days_in_arrears > 90 THEN 1 END) as loans_par_90
FROM loans l
JOIN branches b ON l.branch_id = b.id
WHERE l.status = 'active'
GROUP BY l.branch_id, b.name;

-- Savings account summary view
CREATE OR REPLACE VIEW v_savings_summary AS
SELECT 
    sa.branch_id,
    b.name as branch_name,
    sp.type as product_type,
    COUNT(DISTINCT sa.id) as total_accounts,
    COUNT(DISTINCT sa.borrower_id) as total_savers,
    SUM(sa.balance) as total_balance,
    AVG(sa.balance) as avg_balance,
    COUNT(CASE WHEN sa.status = 'active' THEN 1 END) as active_accounts,
    COUNT(CASE WHEN sa.status = 'dormant' THEN 1 END) as dormant_accounts
FROM savings_accounts sa
JOIN branches b ON sa.branch_id = b.id
JOIN savings_products sp ON sa.product_id = sp.id
GROUP BY sa.branch_id, b.name, sp.type;

-- Daily collection summary view
CREATE OR REPLACE VIEW v_daily_collections AS
SELECT 
    DATE(r.payment_date) as collection_date,
    r.branch_id,
    b.name as branch_name,
    COUNT(DISTINCT r.id) as total_transactions,
    COUNT(DISTINCT r.borrower_id) as borrowers_paid,
    SUM(r.amount) as total_collected,
    SUM(r.principal_amount) as principal_collected,
    SUM(r.interest_amount) as interest_collected,
    SUM(r.fees_amount) as fees_collected,
    SUM(r.penalty_amount) as penalty_collected
FROM repayments r
JOIN branches b ON r.branch_id = b.id
WHERE r.status = 'approved'
GROUP BY DATE(r.payment_date), r.branch_id, b.name;

-- =============================================
-- INDEXES FOR PERFORMANCE
-- =============================================

-- Create indexes for foreign key relationships and frequently queried columns
CREATE INDEX idx_loans_outstanding ON loans(outstanding_principal) WHERE status = 'active';
CREATE INDEX idx_loans_arrears ON loans(days_in_arrears) WHERE status = 'active';
CREATE INDEX idx_savings_balance ON savings_accounts(balance) WHERE status = 'active';
CREATE INDEX idx_repayments_month ON repayments(EXTRACT(YEAR FROM payment_date), EXTRACT(MONTH FROM payment_date));
CREATE INDEX idx_expenses_month ON expenses(EXTRACT(YEAR FROM expense_date), EXTRACT(MONTH FROM expense_date));
CREATE INDEX idx_audit_logs_month ON audit_logs(EXTRACT(YEAR FROM created_at), EXTRACT(MONTH FROM created_at));

-- =============================================
-- MISSING SCHEMA ADDITIONS
-- =============================================

-- Multi-currency support
CREATE TABLE IF NOT EXISTS currencies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code VARCHAR(3) UNIQUE NOT NULL, -- ISO 4217
    name VARCHAR(100) NOT NULL,
    symbol VARCHAR(10),
    decimal_places INT DEFAULT 2,
    is_base_currency BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS exchange_rates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    from_currency_id UUID REFERENCES currencies(id),
    to_currency_id UUID REFERENCES currencies(id),
    rate DECIMAL(20,10) NOT NULL,
    effective_date DATE NOT NULL,
    source VARCHAR(100), -- 'manual', 'api', 'central_bank'
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(from_currency_id, to_currency_id, effective_date)
);

CREATE INDEX idx_exchange_rates_currencies ON exchange_rates(from_currency_id, to_currency_id);
CREATE INDEX idx_exchange_rates_date ON exchange_rates(effective_date);

-- Borrower invitations (MISSING)
CREATE TABLE IF NOT EXISTS borrower_invitations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    invitation_token VARCHAR(255) UNIQUE NOT NULL,
    email VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    invited_by UUID REFERENCES users(id),
    branch_id UUID REFERENCES branches(id),
    group_id UUID REFERENCES borrower_groups(id),
    status VARCHAR(50) DEFAULT 'sent', -- 'sent', 'accepted', 'expired', 'cancelled'
    invitation_message TEXT,
    expires_at TIMESTAMP NOT NULL,
    sent_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    accepted_at TIMESTAMP,
    accepted_by UUID,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_borrower_invitations_token ON borrower_invitations(invitation_token);
CREATE INDEX idx_borrower_invitations_email ON borrower_invitations(email);
CREATE INDEX idx_borrower_invitations_status ON borrower_invitations(status);

-- Group loans (MISSING)
CREATE TABLE IF NOT EXISTS group_loans (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    group_id UUID REFERENCES borrower_groups(id),
    loan_id UUID REFERENCES loans(id),
    member_share DECIMAL(15,2) NOT NULL,
    member_liability VARCHAR(50) DEFAULT 'joint', -- 'individual', 'joint', 'several'
    guarantor_for JSONB, -- Array of other member IDs this member guarantees
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(group_id, loan_id)
);

-- Savings goals (MISSING)
CREATE TABLE IF NOT EXISTS savings_goals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    account_id UUID REFERENCES savings_accounts(id),
    goal_name VARCHAR(200) NOT NULL,
    goal_description TEXT,
    target_amount DECIMAL(15,2) NOT NULL,
    target_date DATE,
    current_amount DECIMAL(15,2) DEFAULT 0,
    monthly_target DECIMAL(15,2),
    priority INT DEFAULT 1, -- 1 = high, 5 = low
    category VARCHAR(100), -- 'education', 'house', 'business', 'emergency', 'other'
    status VARCHAR(50) DEFAULT 'active', -- 'active', 'achieved', 'paused', 'cancelled'
    achieved_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by UUID REFERENCES users(id),
    deleted_at TIMESTAMP
);

CREATE INDEX idx_savings_goals_account ON savings_goals(account_id);
CREATE INDEX idx_savings_goals_status ON savings_goals(status);
CREATE INDEX idx_savings_goals_target_date ON savings_goals(target_date);

-- Transaction receipts (MISSING)
CREATE TABLE IF NOT EXISTS transaction_receipts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    receipt_number VARCHAR(50) UNIQUE NOT NULL,
    transaction_type VARCHAR(50) NOT NULL, -- 'repayment', 'savings_deposit', 'savings_withdrawal'
    transaction_id UUID NOT NULL, -- References repayments.id, savings_transactions.id, etc.
    customer_id UUID, -- borrower_id or investor_id
    customer_type VARCHAR(50), -- 'borrower', 'saver', 'investor'
    amount DECIMAL(15,2) NOT NULL,
    currency_id UUID REFERENCES currencies(id),
    receipt_template VARCHAR(100),
    receipt_data JSONB, -- Receipt content data
    receipt_file_url VARCHAR(500),
    generated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    generated_by UUID REFERENCES users(id),
    printed_at TIMESTAMP,
    printed_by UUID REFERENCES users(id),
    email_sent_at TIMESTAMP,
    sms_sent_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_transaction_receipts_number ON transaction_receipts(receipt_number);
CREATE INDEX idx_transaction_receipts_transaction ON transaction_receipts(transaction_type, transaction_id);
CREATE INDEX idx_transaction_receipts_customer ON transaction_receipts(customer_type, customer_id);

-- SMS campaigns (MISSING)
CREATE TABLE IF NOT EXISTS sms_campaigns (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    campaign_name VARCHAR(200) NOT NULL,
    description TEXT,
    template_id UUID REFERENCES sms_templates(id),
    target_audience VARCHAR(50), -- 'all_borrowers', 'active_borrowers', 'overdue_borrowers', 'custom'
    target_criteria JSONB, -- Filtering criteria
    scheduled_at TIMESTAMP,
    sent_at TIMESTAMP,
    status VARCHAR(50) DEFAULT 'draft', -- 'draft', 'scheduled', 'sending', 'sent', 'failed', 'cancelled'
    total_recipients INT DEFAULT 0,
    messages_sent INT DEFAULT 0,
    messages_delivered INT DEFAULT 0,
    messages_failed INT DEFAULT 0,
    estimated_cost DECIMAL(10,2),
    actual_cost DECIMAL(10,2),
    created_by UUID REFERENCES users(id),
    approved_by UUID REFERENCES users(id),
    approved_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP
);

CREATE INDEX idx_sms_campaigns_status ON sms_campaigns(status);
CREATE INDEX idx_sms_campaigns_scheduled ON sms_campaigns(scheduled_at);

-- Email campaigns (MISSING)
CREATE TABLE IF NOT EXISTS email_campaigns (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    campaign_name VARCHAR(200) NOT NULL,
    description TEXT,
    template_id UUID REFERENCES email_templates(id),
    target_audience VARCHAR(50),
    target_criteria JSONB,
    scheduled_at TIMESTAMP,
    sent_at TIMESTAMP,
    status VARCHAR(50) DEFAULT 'draft',
    total_recipients INT DEFAULT 0,
    emails_sent INT DEFAULT 0,
    emails_delivered INT DEFAULT 0,
    emails_opened INT DEFAULT 0,
    emails_clicked INT DEFAULT 0,
    emails_bounced INT DEFAULT 0,
    emails_failed INT DEFAULT 0,
    created_by UUID REFERENCES users(id),
    approved_by UUID REFERENCES users(id),
    approved_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP
);

CREATE INDEX idx_email_campaigns_status ON email_campaigns(status);
CREATE INDEX idx_email_campaigns_scheduled ON email_campaigns(scheduled_at);

-- Asset valuations (MISSING)
CREATE TABLE IF NOT EXISTS asset_valuations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    asset_id UUID REFERENCES assets(id),
    collateral_id UUID REFERENCES loan_collateral(id),
    valuation_date DATE NOT NULL,
    valued_by VARCHAR(200) NOT NULL,
    valuation_method VARCHAR(50),
    market_value DECIMAL(15,2),
    forced_sale_value DECIMAL(15,2),
    replacement_value DECIMAL(15,2),
    valuation_report_url VARCHAR(500),
    notes TEXT,
    is_current BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by UUID REFERENCES users(id)
);

CREATE INDEX idx_asset_valuations_asset ON asset_valuations(asset_id);
CREATE INDEX idx_asset_valuations_date ON asset_valuations(valuation_date);

-- =============================================
-- MISSING COLUMNS IN EXISTING TABLES
-- =============================================

-- Add missing columns to borrowers table
ALTER TABLE borrowers ADD COLUMN IF NOT EXISTS unique_number VARCHAR(50) UNIQUE;
ALTER TABLE borrowers ADD COLUMN IF NOT EXISTS borrower_photo VARCHAR(500);
ALTER TABLE borrowers ADD COLUMN IF NOT EXISTS borrower_files JSONB;
ALTER TABLE borrowers ADD COLUMN IF NOT EXISTS description TEXT;
ALTER TABLE borrowers ADD COLUMN IF NOT EXISTS working_status VARCHAR(50); -- 'employed', 'self_employed', 'unemployed', 'student', 'retired'
ALTER TABLE borrowers ADD COLUMN IF NOT EXISTS landline VARCHAR(20);
ALTER TABLE borrowers ADD COLUMN IF NOT EXISTS invitation_token VARCHAR(255);
ALTER TABLE borrowers ADD COLUMN IF NOT EXISTS invitation_sent_at TIMESTAMP;
ALTER TABLE borrowers ADD COLUMN IF NOT EXISTS invitation_accepted_at TIMESTAMP;

-- Add missing columns to loans table
ALTER TABLE loans ADD COLUMN IF NOT EXISTS loan_category VARCHAR(50); -- 'secured', 'unsecured'
ALTER TABLE loans ADD COLUMN IF NOT EXISTS interest_method VARCHAR(50); -- 'flat_rate', 'declining_balance', 'compound'
ALTER TABLE loans ADD COLUMN IF NOT EXISTS total_fees DECIMAL(15,2) DEFAULT 0;
ALTER TABLE loans ADD COLUMN IF NOT EXISTS total_penalties DECIMAL(15,2) DEFAULT 0;
ALTER TABLE loans ADD COLUMN IF NOT EXISTS interest_start_date DATE;
ALTER TABLE loans ADD COLUMN IF NOT EXISTS group_id UUID REFERENCES borrower_groups(id);

-- Add missing columns to repayments table
ALTER TABLE repayments ADD COLUMN IF NOT EXISTS installment_number INT;
ALTER TABLE repayments ADD COLUMN IF NOT EXISTS fees_amount DECIMAL(15,2) DEFAULT 0;
ALTER TABLE repayments ADD COLUMN IF NOT EXISTS penalty_amount DECIMAL(15,2) DEFAULT 0;
ALTER TABLE repayments ADD COLUMN IF NOT EXISTS balance_after_payment DECIMAL(15,2);
ALTER TABLE repayments ADD COLUMN IF NOT EXISTS receipt_url VARCHAR(500);

-- Add missing columns to savings_accounts table (Goal-based savings)
ALTER TABLE savings_accounts ADD COLUMN IF NOT EXISTS goal_amount DECIMAL(15,2);
ALTER TABLE savings_accounts ADD COLUMN IF NOT EXISTS goal_target_date DATE;
ALTER TABLE savings_accounts ADD COLUMN IF NOT EXISTS goal_description TEXT;
ALTER TABLE savings_accounts ADD COLUMN IF NOT EXISTS monthly_contribution_target DECIMAL(15,2);

-- Add missing columns to savings_transactions table
ALTER TABLE savings_transactions ADD COLUMN IF NOT EXISTS goal_id UUID REFERENCES savings_goals(id);
ALTER TABLE savings_transactions ADD COLUMN IF NOT EXISTS receipt_number VARCHAR(50);
ALTER TABLE savings_transactions ADD COLUMN IF NOT EXISTS receipt_url VARCHAR(500);

-- Add missing columns to savings_products table
ALTER TABLE savings_products ADD COLUMN IF NOT EXISTS allows_goals BOOLEAN DEFAULT FALSE;

-- Add missing soft delete columns where needed
ALTER TABLE loan_schedules ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMP;
ALTER TABLE borrower_emergency_contacts ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMP;
ALTER TABLE savings_transactions ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMP;
ALTER TABLE repayments ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMP;

-- Add document versioning columns
ALTER TABLE borrower_documents ADD COLUMN IF NOT EXISTS version_number INT DEFAULT 1;
ALTER TABLE borrower_documents ADD COLUMN IF NOT EXISTS previous_version_id UUID REFERENCES borrower_documents(id);
ALTER TABLE borrower_documents ADD COLUMN IF NOT EXISTS is_current_version BOOLEAN DEFAULT TRUE;

-- =============================================
-- MISSING PERFORMANCE INDEXES
-- =============================================

-- Search indexes for names and IDs
CREATE INDEX IF NOT EXISTS idx_borrowers_name ON borrowers(first_name, last_name);
CREATE INDEX IF NOT EXISTS idx_borrowers_unique_number ON borrowers(unique_number);
CREATE INDEX IF NOT EXISTS idx_borrowers_kyc_status ON borrowers(kyc_status);
CREATE INDEX IF NOT EXISTS idx_loans_group ON loans(group_id);
CREATE INDEX IF NOT EXISTS idx_loans_status_branch ON loans(status, branch_id);
CREATE INDEX IF NOT EXISTS idx_repayments_method ON repayments(payment_method);
CREATE INDEX IF NOT EXISTS idx_savings_trans_goal ON savings_transactions(goal_id);

-- =============================================
-- MISSING DEFAULT DATA
-- =============================================

-- Insert default currencies
INSERT INTO currencies (code, name, symbol, is_base_currency, is_active) VALUES
    ('TZS', 'Tanzanian Shilling', 'TSh', TRUE, TRUE),
    ('USD', 'US Dollar', '$', FALSE, TRUE),
    ('EUR', 'Euro', '€', FALSE, TRUE),
    ('KES', 'Kenyan Shilling', 'KSh', FALSE, TRUE),
    ('UGX', 'Ugandan Shilling', 'USh', FALSE, TRUE)
ON CONFLICT (code) DO NOTHING;

-- Enhanced system configuration
INSERT INTO system_config (config_key, config_value, config_type, description) VALUES
    ('multi_currency_enabled', 'false', 'boolean', 'Enable multi-currency support'),
    ('borrower_photo_required', 'true', 'boolean', 'Require borrower photo upload'),
    ('loan_guarantor_required', 'true', 'boolean', 'Require loan guarantors'),
    ('savings_goal_tracking', 'true', 'boolean', 'Enable savings goal tracking'),
    ('mobile_money_integration', 'false', 'boolean', 'Enable mobile money integration'),
    ('auto_generate_receipts', 'true', 'boolean', 'Auto-generate transaction receipts'),
    ('loan_arrears_days_threshold', '30', 'number', 'Days threshold for loan arrears'),
    ('par_calculation_days', '30', 'number', 'Days for PAR calculation'),
    ('password_require_uppercase', 'true', 'boolean', 'Require uppercase in password'),
    ('password_require_numbers', 'true', 'boolean', 'Require numbers in password')
ON CONFLICT (config_key) DO NOTHING;

-- =============================================
-- ENHANCED VIEWS FOR MISSING FUNCTIONALITY
-- =============================================

-- Customer 360 view
CREATE OR REPLACE VIEW v_customer_360 AS
SELECT 
    br.id as borrower_id,
    br.borrower_number,
    br.unique_number,
    br.first_name || ' ' || br.last_name as full_name,
    br.phone,
    br.email,
    br.kyc_status,
    br.credit_score,
    COUNT(DISTINCT l.id) as total_loans,
    COUNT(DISTINCT CASE WHEN l.status = 'active' THEN l.id END) as active_loans,
    COALESCE(SUM(l.principal_amount), 0) as total_borrowed,
    COALESCE(SUM(l.outstanding_principal), 0) as total_outstanding,
    COALESCE(MAX(l.days_in_arrears), 0) as max_days_arrears,
    COUNT(DISTINCT sa.id) as savings_accounts,
    COALESCE(SUM(sa.balance), 0) as total_savings,
    COUNT(DISTINCT sg.id) as savings_goals,
    COALESCE(AVG(CASE WHEN sg.target_amount > 0 THEN (sg.current_amount / sg.target_amount) * 100 END), 0) as avg_goal_progress,
    br.created_at as customer_since
FROM borrowers br
LEFT JOIN loans l ON br.id = l.borrower_id
LEFT JOIN savings_accounts sa ON br.id = sa.borrower_id
LEFT JOIN savings_goals sg ON sa.id = sg.account_id
GROUP BY br.id, br.borrower_number, br.unique_number, br.first_name, br.last_name, br.phone, br.email, br.kyc_status, br.credit_score, br.created_at;

-- Goal progress summary view
CREATE OR REPLACE VIEW v_savings_goals_summary AS
SELECT 
    sg.account_id,
    sa.account_number,
    br.borrower_number,
    br.first_name || ' ' || br.last_name as customer_name,
    sg.goal_name,
    sg.target_amount,
    sg.current_amount,
    CASE WHEN sg.target_amount > 0 THEN 
        ROUND((sg.current_amount / sg.target_amount) * 100, 2) 
    ELSE 0 END as achievement_percentage,
    sg.target_date,
    CASE 
        WHEN sg.target_date < CURRENT_DATE AND sg.current_amount < sg.target_amount THEN 'overdue'
        WHEN sg.current_amount >= sg.target_amount THEN 'achieved'
        ELSE 'on_track'
    END as goal_status,
    sg.created_at
FROM savings_goals sg
JOIN savings_accounts sa ON sg.account_id = sa.id
JOIN borrowers br ON sa.borrower_id = br.id
WHERE sg.status = 'active';

-- =============================================
-- END OF MISSING SCHEMA ADDITIONS
-- =============================================