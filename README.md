# Loan Management System

A comprehensive loan management system built with Vue 3, TypeScript, and modern web technologies.

## 🚀 Features

- **Authentication & Authorization**: JWT-based auth with role-based access control
- **Customer Management**: Complete customer lifecycle with KYC document management
- **Loan Management**: End-to-end loan processing from application to closure
- **Repayment Tracking**: Comprehensive repayment management with receipt generation
- **Reporting & Analytics**: Dashboard with charts and exportable reports
- **Responsive Design**: Mobile-first design with TailwindCSS

## 🛠️ Tech Stack

- **Frontend**: Vue 3 + TypeScript + Composition API
- **Build Tool**: Vite
- **State Management**: Pinia
- **Routing**: Vue Router 4
- **Styling**: TailwindCSS
- **HTTP Client**: Axios
- **Charts**: Chart.js
- **PDF Generation**: jsPDF + html2canvas

## 📁 Project Structure

```
src/
├── api/              # API services
├── components/       # Reusable components
├── layouts/          # Layout components
├── pages/           # Route pages
├── router/          # Vue Router configuration
├── store/           # Pinia stores
├── types/           # TypeScript interfaces
├── utils/           # Utility functions
├── App.vue          # Root component
└── main.ts          # Application entry point
```

## 🚀 Getting Started

### Prerequisites

- Node.js 16+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd loan-management-system
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

### Build for Production

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## 🔐 Authentication

The system includes demo credentials for testing:

- **Admin User**: `admin@loanmanager.com` / `admin123`
- **Loan Officer**: `officer@loanmanager.com` / `officer123`

## 📊 Key Modules

### 1. Authentication
- User registration and login
- JWT token management
- Role-based access control
- Password management

### 2. Customer Management
- Customer registration and profiles
- KYC document upload and verification
- Address and contact management
- Credit score tracking

### 3. Loan Management
- Loan application processing
- Approval workflow
- Loan disbursement
- Schedule generation
- Status tracking

### 4. Repayment Management
- Payment recording
- Receipt generation
- Overdue tracking
- Payment history

### 5. Reporting & Analytics
- Dashboard with key metrics
- Interactive charts
- Data export (CSV/PDF)
- Custom date ranges

## 🎨 UI Components

The system uses a comprehensive set of reusable components:

- **Forms**: Input fields, selects, checkboxes with validation
- **Tables**: Sortable, filterable data tables with pagination
- **Cards**: Information display cards
- **Modals**: Confirmation and form modals
- **Buttons**: Consistent button styles with states
- **Alerts**: Success, error, and warning notifications

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the root directory:

```env
VITE_API_BASE_URL=http://localhost:3000/api
```

### TailwindCSS Configuration

The project includes custom TailwindCSS configuration with:
- Custom color palette
- Component classes
- Responsive breakpoints
- Form styling

## 📱 Responsive Design

The application is fully responsive and works on:
- Desktop (1024px+)
- Tablet (768px - 1023px)
- Mobile (< 768px)

## 🧪 Testing

```bash
# Run unit tests
npm run test:unit

# Run e2e tests
npm run test:e2e

# Run all tests
npm run test
```

## 📦 Build & Deployment

### Development
```bash
npm run dev
```

### Production Build
```bash
npm run build
```

### Preview Production Build
```bash
npm run preview
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Contact the development team
- Check the documentation

## 🔮 Roadmap

- [ ] Advanced reporting features
- [ ] Mobile app development
- [ ] Integration with external services
- [ ] Advanced analytics dashboard
- [ ] Multi-language support
- [ ] Dark mode theme
- [ ] Real-time notifications
- [ ] Advanced search and filtering
- [ ] Bulk operations
- [ ] Audit logging

## 📈 Performance

The application is optimized for:
- Fast initial load times
- Efficient data fetching
- Smooth user interactions
- Mobile performance
- SEO optimization

---

Built with ❤️ using Vue 3 and modern web technologies.
