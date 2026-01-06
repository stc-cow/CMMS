# ACES Authentication System - Complete Setup

## Overview

The ACES Operations Portal now includes a complete user authentication system powered by Supabase Auth. Users can:

- ✅ Create new accounts
- ✅ Sign in with email and password
- ✅ Sign out
- ✅ Email verification (optional, configurable)
- ✅ Protected routes that require authentication
- ✅ User profile management

---

## Architecture

### Authentication Flow

```
┌─────────────────────────────────────────────────┐
│          User Access Application                │
└────────────────────┬────────────────────────────┘
                     │
                     ▼
          ┌──────────────────────┐
          │   Login Page         │
          │  (Sign In / Sign Up) │
          └────────┬─────────────┘
                   │
        ┌──────────┴──────────┐
        │                     │
        ▼                     ▼
    Sign Up             Sign In
        │                     │
        └──────────┬──────────┘
                   │
                   ▼
         ┌─────────────────────┐
         │  Supabase Auth      │
         │  (Email/Password)   │
         └────────┬────────────┘
                  │
        ┌─────────┴──────────┐
        │                    │
        ▼                    ▼
   Email Verification   Auto-Login
   (if enabled)
        │                    │
        └─────────┬──────────┘
                  │
                  ▼
        ┌─────────────────────┐
        │   Auth Context      │
        │  (User State)       │
        └─────────┬───────────┘
                  │
                  ▼
        ┌─────────────────────┐
        │  Protected Routes   │
        │  Dashboard/Views    │
        └─────────────────────┘
```

### Key Components

1. **Supabase Client** (`client/lib/auth.ts`)
   - Direct authentication API calls
   - User sign up, sign in, sign out
   - Session management
   - Email verification

2. **Auth Context** (`client/context/AuthContext.tsx`)
   - Global authentication state
   - User information
   - Authentication status
   - Sign out function

3. **Protected Route Component** (`client/components/ProtectedRoute.tsx`)
   - Route protection
   - Redirect unauthenticated users to login
   - Loading state while checking auth

4. **Auth Form Hook** (`client/hooks/useAuthForm.ts`)
   - Form state management
   - Validation logic
   - Error handling
   - Sign in/sign up logic

5. **Login Page** (`client/pages/Login.tsx`)
   - Dual mode: Sign In / Sign Up
   - Form validation
   - Error/success messages
   - Responsive design

---

## Setup Configuration

### Supabase Auth Requirements

Your Supabase project needs to have Auth enabled (it's enabled by default).

**To configure email settings:**

1. Go to Supabase Dashboard → Project Settings → Auth
2. Under "Email Templates", you can customize:
   - Confirmation email template
   - Password reset email template
   - Magic link emails

**To enable email confirmation:**

1. Dashboard → Authentication → Providers → Email
2. Toggle "Email Verification" ON
3. Configure redirect URL: `https://yourdomain.com/auth/callback`

### Environment Variables

```env
VITE_SUPABASE_URL=https://rmcgmcmqpjhqxrwuzbmy.supabase.co
VITE_SUPABASE_ANON_KEY=sb_publishable_GD5r_Ixnmpmd9VoBi8L2qg_L5nyiZEP
SUPABASE_SERVICE_ROLE_KEY=<your-service-role-key> # Backend only
```

---

## User Flow

### Sign Up Flow

```
1. User clicks "Create one" on login page
2. Form switches to signup mode
3. User enters:
   - Full Name (optional)
   - Email
   - Password
   - Confirm Password
4. Form validates:
   - Email format
   - Password length (min 6 chars)
   - Passwords match
5. Submit → Supabase Auth processes signup
6. If email verification enabled:
   - User gets confirmation email
   - Must click link to verify
   - Then can sign in
7. If email verification disabled:
   - User auto-logged in
   - Redirected to dashboard
```

### Sign In Flow

```
1. User on login page in "Sign In" mode
2. User enters:
   - Email
   - Password
3. Submit → Supabase Auth processes login
4. Auth Context updated with user
5. User redirected to dashboard
6. All routes protected - only accessible when logged in
```

### Sign Out Flow

```
1. User clicks user menu (top right)
2. Click "Sign out"
3. Auth Context clears user
4. Supabase session terminated
5. User redirected to login page
6. All protected routes inaccessible
```

---

## Files & Structure

```
client/
├── pages/
│   └── Login.tsx                 # Login/Signup page
├── context/
│   └── AuthContext.tsx           # Global auth state
├── hooks/
│   └── useAuthForm.ts            # Form logic hook
├── lib/
│   └── auth.ts                   # Supabase auth functions
└── components/
    ├── ProtectedRoute.tsx        # Route protection wrapper
    └── layout.tsx                # Updated with user menu
```

---

## Supabase Users Table

When users sign up, Supabase automatically creates entries in the `auth.users` table with:

```
id              UUID (primary key)
email           User's email address
email_confirmed Whether email was verified
password_hash   Bcrypt hashed password
user_metadata   JSON - stores full_name and custom data
created_at      Signup timestamp
updated_at      Last update timestamp
```

**Accessing user data in app:**

```typescript
// In components using useAuth hook
const { user } = useAuth();

// Access user properties
user?.email; // User's email
user?.id; // UUID
user?.user_metadata?.full_name; // User's full name
user?.email_confirmed; // Email verified?
user?.created_at; // When account created
```

---

## Code Examples

### Using Auth in Components

```typescript
import { useAuth } from "@/context/AuthContext";

export function MyComponent() {
  const { user, isAuthenticated, signOut } = useAuth();

  if (!isAuthenticated) {
    return <div>Please log in</div>;
  }

  return (
    <div>
      <h1>Welcome, {user?.email}</h1>
      <button onClick={signOut}>Logout</button>
    </div>
  );
}
```

### Sign Up Programmatically

```typescript
import { signUp } from "@/lib/auth";

const { data, error } = await signUp(
  "user@example.com",
  "password123",
  "John Doe",
);

if (error) {
  console.error("Signup failed:", error.message);
} else {
  console.log("Account created for:", data.user?.email);
}
```

### Sign In Programmatically

```typescript
import { signIn } from "@/lib/auth";

const { data, error } = await signIn("user@example.com", "password123");

if (error) {
  console.error("Login failed:", error.message);
} else {
  console.log("Logged in as:", data.user?.email);
}
```

---

## Testing Authentication

### Test Sign Up

1. Go to `/login`
2. Click "Create one"
3. Enter email: `test@example.com`
4. Enter password: `testpass123`
5. Confirm password: `testpass123`
6. Click "Create Account"
7. Should redirect to dashboard if verification disabled
8. Check Supabase Dashboard > Users to see new user

### Test Sign In

1. Go to `/login`
2. Enter email from above
3. Enter password
4. Click "Sign in to ACES"
5. Should redirect to dashboard
6. User menu shows your email

### Test Protected Routes

1. Log out
2. Try to visit `/suppliers` or `/cows`
3. Should redirect to `/login`
4. Log back in to access

### Test Sign Out

1. While logged in, click user avatar (top right)
2. Click "Sign out"
3. Should redirect to login
4. Try accessing protected routes → redirects to login

---

## Security Features

✅ **Password Security**

- Minimum 6 characters
- Bcrypt hashing in Supabase
- Never logged or exposed

✅ **Session Management**

- Secure JWT tokens
- Automatic session refresh
- Sign out clears session

✅ **Protected Routes**

- Unauthenticated users redirected to login
- Loading state during auth check
- No data exposed without auth

✅ **Email Verification** (Optional)

- Configurable in Supabase
- Verification link sent via email
- User must confirm before full access

✅ **Data Privacy**

- No passwords stored in app
- Secure Supabase API
- HTTPS only

---

## Common Tasks

### Add Email Verification

In `client/lib/auth.ts`, the `signUp` function already includes email redirect:

```typescript
options: {
  emailRedirectTo: `${window.location.origin}/auth/callback`,
}
```

Enable in Supabase Dashboard → Auth → Email provider.

### Customize User Data

Store additional user info:

```typescript
// During signup
const { error } = await supabase.auth.signUp({
  email,
  password,
  options: {
    data: {
      full_name: "John Doe",
      company: "ACES",
      role: "Admin",
      // Add any custom fields
    },
  },
});
```

Access in app:

```typescript
user?.user_metadata?.company;
user?.user_metadata?.role;
```

### Require Email Verification

Make protected routes check:

```typescript
if (user && !user.email_confirmed) {
  return <EmailVerificationRequired />;
}
```

### Social Login (Future)

Supabase supports OAuth providers:

- Google
- GitHub
- Microsoft
- Discord

Configure in Supabase Dashboard → Auth → Providers.

---

## Troubleshooting

### "Missing Supabase environment variables"

- Check `.env` file has `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`
- Restart dev server after updating `.env`

### "Invalid login credentials"

- Verify email and password are correct
- Check user exists in Supabase Dashboard → Users
- Password is case-sensitive

### "Redirect URI mismatch"

- For email confirmation links to work, set correct redirect URL
- In Supabase: Auth → URL Configuration
- Add your domain (dev: `http://localhost:5173`)

### User gets logged out randomly

- Check session expiry in Supabase
- Browser clearing cookies between sessions
- Multiple tabs/windows signing out

### "useAuth must be used within AuthProvider"

- Ensure `<AuthProvider>` wraps the entire app
- Check `App.tsx` has the provider

---

## Status

**Current Implementation**: ✅ COMPLETE

- ✅ Email/password authentication
- ✅ Sign up with validation
- ✅ Sign in with persistence
- ✅ Sign out functionality
- ✅ Protected routes
- ✅ User profile display
- ✅ Auth state management
- ✅ Error handling
- ⏳ Email verification (optional - can be enabled)
- ⏳ Social login (future enhancement)

---

## Next Steps

1. **Test the authentication flow** - Sign up, sign in, sign out
2. **Check Supabase Users** - Go to Dashboard → Users to see created accounts
3. **Configure email settings** - Optional email verification in Supabase
4. **Backend integration** - Create protected API endpoints for authenticated users
5. **User profile page** - Build profile management at `/settings`

---

## Documentation

- **Supabase Auth Docs**: https://supabase.com/docs/guides/auth
- **Supabase Dashboard**: https://app.supabase.com
- **ACES Project**: https://rmcgmcmqpjhqxrwuzbmy.supabase.co

---

**Authentication System Setup**: ✅ COMPLETE
**User Management**: Ready for production
**Data Safety**: All user data in Supabase
