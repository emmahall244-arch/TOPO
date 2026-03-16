# Topo Development Platform

A comprehensive web platform for managing commercial and retail development projects across their lifecycle stages (feasibility, entitlement, construction, stabilized).

## Features

### MVP (Phase 1)
- **Project Management:** Centralized dashboard for 30-40 projects with stage filtering
- **Project Information:** Store addresses, parcels, ownership, acreage, documents
- **Scheduling:** Track phases and milestones with timeline view
- **Task Tracking:** Manage tasks with status, priority, and change logs
- **Meeting Notes:** Record and track project meeting notes
- **Contact Management:** Maintain consultant and stakeholder contacts per project
- **Change Logs:** Track who changed what, when, and why (with required explanations)
- **Calendar Export:** Export milestones to iCal format

### Phase 2 (Enhancements)
- AI-powered meeting notes cleanup
- Reporting dashboard with filtering and exports
- Microsoft Planner integration (bidirectional sync)
- Outlook calendar integration
- PDF/Excel export functionality

## Tech Stack

**Frontend:**
- React 18 + TypeScript
- shadcn/ui or Material-UI
- TanStack Query + Zustand
- Recharts (for charts)

**Backend:**
- Node.js + Express + TypeScript
- PostgreSQL with Prisma ORM
- Azure AD authentication
- Azure Blob Storage

**Infrastructure:**
- Azure App Service
- Azure Database for PostgreSQL
- Azure AD

## Getting Started

### Prerequisites
- Node.js 18+ and npm/yarn
- PostgreSQL database
- Azure account for authentication and storage

### Installation

#### Frontend
```bash
cd frontend
npm install
npm run dev
```

#### Backend
```bash
cd backend
npm install
npm run dev
```

### Environment Setup

Create `.env` files in both frontend and backend with appropriate configuration:

**Backend `.env`:**
```
DATABASE_URL=postgresql://user:password@localhost:5432/topo
AZURE_AD_CLIENT_ID=your_client_id
AZURE_AD_CLIENT_SECRET=your_client_secret
AZURE_AD_TENANT_ID=your_tenant_id
AZURE_BLOB_CONNECTION_STRING=your_connection_string
```

**Frontend `.env.local`:**
```
REACT_APP_API_URL=http://localhost:3001
REACT_APP_AZURE_CLIENT_ID=your_client_id
```

## Project Structure

```
├── frontend/              # React application
│   └── src/
│       ├── components/    # React components
│       ├── pages/         # Page components
│       ├── services/      # API and auth services
│       ├── hooks/         # Custom hooks
│       └── App.tsx
│
├── backend/              # Node.js/Express API
│   └── src/
│       ├── routes/        # API route handlers
│       ├── services/      # Business logic
│       ├── middleware/    # Express middleware
│       ├── db/           # Database and Prisma schema
│       └── server.ts
│
└── README.md
```

## Development Workflow

1. Create a feature branch from `main`
2. Make changes in frontend and/or backend
3. Test thoroughly
4. Create a pull request with clear description
5. After review and approval, merge to `main`

## Deployment

Deployment guide coming soon - will use Azure App Service with CI/CD pipeline.

## Contributing

This is an internal project. Contact the development team for contribution guidelines.

## License

Internal use only - Topo Development Group
