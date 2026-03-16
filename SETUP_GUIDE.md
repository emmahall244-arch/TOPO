# Topo Platform - Setup Guide

This guide will help you get the Topo Development Platform running locally.

## Prerequisites

- Node.js 18+ ([download](https://nodejs.org/))
- PostgreSQL 12+ ([download](https://www.postgresql.org/download/))
- Git
- Azure account for authentication (optional, can be skipped for local development)

## Step 1: Install Dependencies

### Backend
```bash
cd backend
npm install
```

### Frontend
```bash
cd frontend
npm install
```

## Step 2: Set Up PostgreSQL Database

### On macOS (with Homebrew)
```bash
brew install postgresql
brew services start postgresql
```

### On Windows
Download and install from [postgresql.org](https://www.postgresql.org/download/windows/)

### On Linux
```bash
sudo apt-get install postgresql postgresql-contrib
sudo systemctl start postgresql
```

### Create Database
```bash
createdb topo
```

Or using psql:
```bash
psql
CREATE DATABASE topo;
\q
```

## Step 3: Configure Environment Variables

### Backend Configuration

Copy `.env.example` to `.env` in the `backend` directory:

```bash
cp backend/.env.example backend/.env
```

Edit `backend/.env`:

```env
# Database connection string
DATABASE_URL="postgresql://postgres:password@localhost:5432/topo"

# Replace 'password' with your PostgreSQL password
# If using default postgres user with no password:
DATABASE_URL="postgresql://postgres@localhost:5432/topo"

# For now, you can skip Azure AD config - it will be set up in Phase 2
AZURE_AD_CLIENT_ID=local_dev
AZURE_AD_CLIENT_SECRET=local_dev
AZURE_AD_TENANT_ID=local_dev

# Server
NODE_ENV=development
PORT=3001
SESSION_SECRET=your_local_secret_key
```

### Frontend Configuration

Copy `.env.example` to `.env.local` in the `frontend` directory:

```bash
cp frontend/.env.example frontend/.env.local
```

Edit `frontend/.env.local`:

```env
VITE_API_URL=http://localhost:3001
VITE_AZURE_CLIENT_ID=local_dev
VITE_AZURE_TENANT_ID=local_dev
VITE_AZURE_REDIRECT_URI=http://localhost:3000
```

## Step 4: Initialize Database Schema

Run Prisma migrations to set up the database schema:

```bash
cd backend
npx prisma db push
```

This command will:
1. Create all tables based on the schema
2. Set up relationships and constraints
3. Initialize the database for the application

You can also view the database with Prisma Studio:

```bash
npx prisma studio
```

This opens a visual database explorer at http://localhost:5555

## Step 5: Start the Development Servers

### Terminal 1 - Backend
```bash
cd backend
npm run dev
```

You should see:
```
✓ Server running on port 3001
✓ Environment: development
```

### Terminal 2 - Frontend
```bash
cd frontend
npm run dev
```

You should see:
```
VITE v5.x.x  ready in xxx ms

➜  Local:   http://localhost:3000/
```

## Step 6: Access the Application

Open your browser and go to: **http://localhost:3000**

You should see the Topo Development Platform dashboard!

## Testing the Application

1. **Create a Project**
   - Click "+ New Project"
   - Fill in the project details
   - Click "Create Project"

2. **View Project Details**
   - Click on a project card
   - View/edit project information
   - Add tasks, contacts, and meeting notes

3. **Manage Schedule**
   - Click the "Schedule" button on a project
   - Create phases and milestones
   - Track schedule changes

4. **Add Meeting Notes**
   - Go to the "Meetings" tab
   - Click "+ New Note"
   - Enter meeting details and notes
   - Use the cleanup button to extract highlights

## Troubleshooting

### Database Connection Error
```
error: connect ECONNREFUSED 127.0.0.1:5432
```

**Solution:**
- Make sure PostgreSQL is running: `psql -U postgres`
- Check DATABASE_URL in `.env` is correct
- Verify database exists: `psql -l`

### Port Already in Use
```
Error: listen EADDRINUSE: address already in use :::3001
```

**Solution:**
- Change PORT in backend `.env`
- Or kill the process: `lsof -ti:3001 | xargs kill -9`

### Module Not Found
```
Cannot find module '@/services/api'
```

**Solution:**
- Make sure you're in the correct directory (backend or frontend)
- Run `npm install` again
- Clear node_modules: `rm -rf node_modules && npm install`

### Prisma Schema Error
```
Error: Database error
```

**Solution:**
```bash
# Reset database
npx prisma migrate reset

# Or delete and recreate
dropdb topo
createdb topo
npx prisma db push
```

## Next Steps

### Setting Up Azure AD Authentication (Phase 2)

1. Register an application in Azure AD
2. Get Client ID and Tenant ID
3. Update the `.env` files with real credentials
4. Implement Microsoft login flow

### Phase 2 Features

- Microsoft Planner integration
- Meeting notes export to OneNote
- PDF/Excel report generation
- Advanced filtering and analytics

## Development Tips

### View Database Schema
```bash
cd backend
npx prisma studio
```

### Format Code
```bash
# Backend
cd backend
npm run lint

# Frontend
cd frontend
npm run lint
```

### Type Check
```bash
# Backend
cd backend
npm run type-check

# Frontend
cd frontend
npm run type-check
```

### Rebuild After Schema Changes
After modifying `backend/prisma/schema.prisma`:

```bash
cd backend
npx prisma db push
npx prisma generate
```

## Still Need Help?

Check the README.md for more information or review the plan at `/root/.claude/plans/rosy-wibbling-donut.md`
