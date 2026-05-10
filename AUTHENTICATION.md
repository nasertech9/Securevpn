# Authentication System Guide

## Overview
SecureVPN now includes a complete authentication system with Sign In and Sign Up functionality, session management, and persistent user state.

## Features

### 🔐 Sign In
Click the **"Sign In"** button in the header to access:

#### Form Fields
- **Email**: Required, must be valid email format
- **Password**: Required, minimum 6 characters
- **Remember Me**: Optional checkbox for persistent session

#### Additional Options
- **Forgot Password**: Click to receive password reset email (simulated)
- **Social Login**: Google and GitHub buttons (coming soon)
- **Switch to Sign Up**: Link to create new account

#### Validation
- Real-time email format checking
- Password length validation
- Clear error messages for each field

### ✨ Sign Up
Click the **"Sign Up"** button in the header to register:

#### Form Fields
- **First Name**: Required
- **Last Name**: Required
- **Email**: Required, must be valid format
- **Password**: Required with strong requirements:
  - Minimum 8 characters
  - At least one uppercase letter
  - At least one lowercase letter
  - At least one number
- **Confirm Password**: Must match password
- **Terms Acceptance**: Required checkbox

#### Additional Options
- **Social Registration**: Google and GitHub buttons (coming soon)
- **Switch to Sign In**: Link for existing users

#### Password Requirements
The system enforces strong passwords with visual feedback:
```
✓ Minimum 8 characters
✓ Uppercase letter (A-Z)
✓ Lowercase letter (a-z)
✓ Number (0-9)
```

### 👤 User Session

#### When Signed In
The header displays:
- **Avatar**: Blue circle with user icon
- **Name**: First name (on desktop)
- **Dropdown Menu**:
  - Full name
  - Email address
  - Sign Out button (red)

#### Session Persistence
- Automatically saved to localStorage
- Survives page refreshes
- Cleared on sign out

### 🎉 User Experience

#### Success Messages
- **Sign In**: "Welcome back! Signed in as [email]"
- **Sign Up**: "Account created successfully! Welcome to SecureVPN, [name]!"
- **Sign Out**: "Signed out successfully"

#### Form Validation
All forms include:
- Required field indicators (red asterisk)
- Inline error messages
- Clear validation rules
- Disabled submission until valid

## Usage Examples

### Example 1: Quick Sign In
1. Click **"Sign In"** in header
2. Enter email: `user@example.com`
3. Enter password: `mypassword`
4. Click **"Sign In"**
5. Welcome toast appears
6. Header shows user avatar

### Example 2: Create Account
1. Click **"Sign Up"** in header
2. Enter first name: `John`
3. Enter last name: `Doe`
4. Enter email: `john.doe@example.com`
5. Enter password: `SecurePass123`
6. Confirm password: `SecurePass123`
7. Check "I agree to terms"
8. Click **"Create Account"**
9. Success message appears
10. Automatically signed in

### Example 3: Switch Between Forms
1. Open Sign In dialog
2. Click **"Sign Up"** link at bottom
3. Sign Up dialog opens (Sign In closes)
4. Click **"Sign In"** link at bottom
5. Returns to Sign In dialog

## Technical Details

### State Management
- User data stored in React state and localStorage
- Automatic persistence on changes
- Cleanup on sign out

### Form Validation
- Client-side validation before submission
- Email regex: `/^[^\s@]+@[^\s@]+\.[^\s@]+$/`
- Password regex: `/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/`

### Security Notes
- Passwords are masked in UI
- This is a **demonstration** authentication system
- In production, use proper backend authentication
- Never store passwords in localStorage
- Implement proper session tokens

## Keyboard Shortcuts
No specific shortcuts for auth, but forms support:
- **Tab**: Navigate between fields
- **Enter**: Submit form
- **Escape**: Close dialog (planned)

## Testing Credentials
Since this is a mock system, any valid format works:
```
Email: test@example.com
Password: password123 (or any 6+ chars)
```

For Sign Up, use any strong password:
```
Password: MyPassword123
```

## Future Enhancements
- [ ] OAuth integration (Google, GitHub)
- [ ] Email verification
- [ ] Two-factor authentication
- [ ] Password strength meter
- [ ] Account recovery flow
- [ ] Profile editing
- [ ] Avatar upload

## Related Components
- `SignInDialog.tsx` - Sign in form
- `SignUpDialog.tsx` - Registration form
- `Header.tsx` - Auth buttons and user menu
- `App.tsx` - State management

## API Integration
Currently uses mock authentication. To integrate with real backend:

```typescript
// Replace in App.tsx
const handleSignIn = async (email: string, password: string) => {
  const response = await fetch('/api/auth/signin', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
  const user = await response.json();
  setUser(user);
};
```

## Support
For authentication issues or questions:
- Check browser console for errors
- Clear localStorage if session is stuck
- Verify form validation requirements
- Check that JavaScript is enabled
