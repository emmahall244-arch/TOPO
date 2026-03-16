# Local Setup Instructions for Topo Platform

I've prepared everything for you! Here's what's been done and what you need to do on your local machine.

## ✅ Already Completed

- ✓ Full backend API code written
- ✓ Full frontend React application written
- ✓ Database schema designed in Prisma
- ✓ npm dependencies downloaded (backend & frontend)
- ✓ Environment files created (.env files)
- ✓ Git history and commits ready

## 🚀 What You Need to Do Locally

### Step 1: Ensure PostgreSQL is Running

**On macOS:**
```bash
brew services start postgresql
# OR if you have PostgreSQL installed
postgres -D /usr/local/var/postgres
```

**On Windows:**
- Start PostgreSQL from Services or the Start menu

**On Linux:**
```bash
sudo systemctl start postgresql
```

**Verify it's running:**
```bash
psql --version  # Should show version number
```

### Step 2: Create the Database

```bash
createdb topo
```

If that doesn't work:
```bash
psql -U postgres -c "CREATE DATABASE topo;"
```

### Step 3: Pull the Code

If you haven't already, clone or pull the latest code:

```bash
cd /home/user/TOPO-
git pull origin claude/onboarding-setup-d9lg2
```

### Step 4: Set Up Database Schema

The dependencies are already installed, so just initialize the database:

```bash
cd backend
npx prisma db push
```

You should see:
```
✓ Database synced, created 8 tables
```

### Step 5: Open Two Terminal Windows

**Terminal 1 - Backend Server:**
```bash
cd /home/user/TOPO-/backend
npm run dev
```

Wait for:
```
✓ Server running on port 3001
✓ Environment: development
```

**Terminal 2 - Frontend App:**
```bash
cd /home/user/TOPO-/frontend
npm run dev
```

Wait for:
```
VITE v5.x.x  ready in xxx ms
➜  Local:   http://localhost:3000/
```

### Step 6: Open Your Browser

Go to: **http://localhost:3000**

🎉 **You should now see the Topo Platform dashboard!**

---

## 🧪 Test These Features

### 1. Create a Test Project
- Click "+ New Project"
- Enter: "Westfield Mall Expansion"
- Address: "123 Main St, Downtown"
- Stage: "Construction"
- Click "Create Project"

### 2. Add Project Details
- Click the project card
- Click "Edit"
- Add: Acreage (50), Size (500,000 sq ft), Ownership (Acme Corp)
- Click "Save"

### 3. Add a Task
- Stay in the project
- Click "Tasks" tab
- Enter task: "Get zoning approval"
- Priority: "High"
- Click "Add Task"

### 4. Add a Contact
- Click "Contacts" tab
- Name: "John Smith"
- Role: "Zoning Attorney"
- Company: "Smith & Associates"
- Email: john@smith.com
- Click "Add Contact"

### 5. Create a Schedule
- Click "Schedule" button
- Click "Add Phase"
- Name: "Pre-Construction Phase"
- Set start and end dates
- Click "Add Phase"
- Add a milestone within the phase

### 6. Add Meeting Notes
- Go back to project (click back link)
- Click "Meetings" tab
- Click "+ New Note"
- Enter date and notes
- Click "Save Note"

### 7. Check Change Tracking
- Try updating a task date or milestone date
- A popup will ask "Why are you making this change?"
- Enter a reason
- Check the project to see the change log

---

## 🛠️ Troubleshooting

### PostgreSQL Won't Start
```bash
# macOS - check if it's already running
lsof -i :5432

# Linux - check status
sudo systemctl status postgresql

# Restart if needed
sudo systemctl restart postgresql
```

### Port 3000 or 3001 Already in Use
```bash
# Find and kill the process
lsof -i :3000  # Frontend
lsof -i :3001  # Backend

# Kill it
kill -9 <PID>
```

### Database Connection Error
```bash
# Check database exists
psql -l | grep topo

# If it doesn't exist, create it
createdb topo

# Then reinitialize schema
cd backend
npx prisma db push
```

### Dependencies Still Missing
```bash
cd backend
npm install --legacy-peer-deps

cd ../frontend
npm install
```

---

## 📊 Database Inspection

To view your database visually:

```bash
cd backend
npx prisma studio
```

This opens **http://localhost:5555** where you can:
- Browse all tables
- View records
- Edit data
- See relationships

---

## 📝 Environment Files

Already created for you in:
- `backend/.env` - Database and server config
- `frontend/.env.local` - API and build config

They default to localhost development settings. No changes needed!

---

## ✨ What's Next?

### Testing More Features
- Create multiple projects with different stages
- Track how change logs capture modifications
- Test adding multiple tasks and contacts
- Play with meeting notes

### Data Persistence
All data you create stays in the PostgreSQL database. You can:
- View database at **http://localhost:5555** (Prisma Studio)
- Delete the database and start fresh: `dropdb topo`
- Export data from Prisma Studio

---

## 🎯 Phase 2 Features Coming

The foundation is ready for Phase 2 when you're ready:
- Microsoft Planner integration
- Azure AD authentication (Microsoft login)
- Outlook calendar integration
- AI-powered meeting notes cleanup
- Reporting dashboard with exports

---

## Need Help?

If something doesn't work:

1. **Check databases running:** `psql -l`
2. **Check ports:** `lsof -i :3000` and `lsof -i :3001`
3. **Check Node.js:** `node --version` (need 18+)
4. **Re-install deps:** Delete `node_modules` and run `npm install --legacy-peer-deps`

---

**Everything is ready. Follow the 6 steps above and you'll have a fully working development environment!** 🚀
