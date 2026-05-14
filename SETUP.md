# SpendSmart Authentication Setup

## Database Setup

1. **Install MySQL** (if not already installed)
2. **Create Database:**
   ```sql
   CREATE DATABASE spendsmart;
   ```

3. **Update .env file** with your MySQL credentials:
   ```env
   DATABASE_URL="mysql://username:password@localhost:3306/spendsmart"
   ```

4. **Run Database Migration:**
   ```bash
   npm run db:push
   ```

## Running the Application

1. **Start the Server:**
   ```bash
   npm run dev:server
   ```

2. **Start the Mobile App:**
   ```bash
   npm run dev:metro
   ```

## Authentication Features

### Registration
- Navigate to `/register` in the app
- Fill in name, email, and password
- Password must be at least 6 characters
- Email must be unique

### Login
- Navigate to `/login` in the app
- Enter email and password
- Successful login redirects to main app

### Security Features
- Passwords hashed with bcrypt (10 salt rounds)
- Email uniqueness validation
- Protected routes (main app requires authentication)
- Automatic redirect to login for unauthenticated users

## Testing

The authentication system includes:
- Form validation
- Error handling
- Loading states
- Secure password storage
- Session management

## Files Added/Modified

### Backend
- `server/_core/auth.ts` - Password hashing utilities
- `server/routers.ts` - Auth endpoints (register, login, logout)
- `server/db.ts` - Email-based user lookup
- `drizzle/schema.ts` - Password field in users table

### Frontend
- `app/login.tsx` - Login page
- `app/register.tsx` - Registration page
- `app/auth.tsx` - Auth guard component
- `lib/auth-context.tsx` - Authentication context
- `components/auth-button.tsx` - Reusable auth button

### Configuration
- `.env` - Environment variables
- `package.json` - Updated scripts for npm
- `app/_layout.tsx` - Auth provider integration
- `app/(tabs)/_layout.tsx` - Route protection
