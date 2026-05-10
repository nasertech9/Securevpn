# SecureVPN Dashboard

A comprehensive VPN dashboard built with React, TypeScript, Vite, and Tailwind CSS. Features a complete mock backend, advanced UI components, and full testing coverage with Vitest.

## Features

### 🔐 Authentication System
- **Sign In**: Full authentication form with validation
  - Email and password fields
  - Remember me checkbox
  - Forgot password functionality
  - Social login options (Google, GitHub)
  - Switch to Sign Up link
- **Sign Up**: Complete registration form
  - First name and last name
  - Email with format validation
  - Strong password requirements (8+ chars, uppercase, lowercase, number)
  - Password confirmation matching
  - Terms and conditions acceptance
  - Social registration options
  - Switch to Sign In link
- **User Session**: Persistent authentication state
  - LocalStorage-based session
  - User profile dropdown
  - Sign out functionality
  - Welcome messages with toast notifications

### 🔌 Connection Management
- One-click VPN connection toggle with visual status indicator
- Real-time connection timer
- Fake IP address generation
- Live data usage tracking (download/upload)
- Server selection from multiple regions

### 🚀 Speed Testing
- Advanced speed test with region picker
- Test history with timestamps
- Rate limiting (30-second cooldown)
- Download/upload speed and ping measurements
- Visual speed test results

### 💳 Subscription Plans
- 4-tier pricing plans (Free, Basic, Pro, Premium)
- Referral code system with validation
- Real-time discount calculation
- Recommended plan highlighting
- Plan comparison features
- **Free Plan Activation**: Click "Get Started" to activate free plan instantly
- **Payment Form**: Click "Subscribe" on paid plans to open full payment dialog
  - Card number with auto-formatting
  - Expiration date (MM/YY format)
  - CVV security code
  - Complete billing information (name, address, city, country)
  - Form validation with error messages
  - Discount applied to final price

### 📊 Data Visualization
- Interactive usage graph with Recharts
- Customizable date ranges (7/14/30 days)
- Download/upload statistics
- Visual data trends

### 🖥️ Server Management
- Sortable server comparison table
- Sort by name, country, load, or ping
- Visual load indicators
- Ping status with color coding
- Multiple regions supported

### 🎨 User Experience
- Dark/Light theme toggle
- Keyboard shortcuts for common actions
- Settings import/export (JSON)
- Offline detection with visual indicator
- Toast notifications
- Responsive design

### ⌨️ Keyboard Shortcuts
- `Ctrl+Shift+C` - Toggle VPN connection
- `Ctrl+T` - Toggle dark/light theme
- `Ctrl+,` - Open settings
- `Ctrl+S` - Run speed test

### 🔧 Settings
- Auto-connect on startup
- Kill switch toggle
- VPN protocol selection (OpenVPN, WireGuard, IKEv2)
- Notification preferences
- Preferred server selection

## Mock Backend API

The application includes 6 mock API endpoints:

1. **getServers()** - Fetch available VPN servers
2. **getPlans()** - Retrieve subscription plans
3. **validateReferralCode()** - Validate referral codes
4. **runSpeedTest()** - Execute speed tests with rate limiting
5. **getSpeedTestHistory()** - Retrieve test history
6. **getUsageData()** - Fetch data usage statistics

## Technology Stack

- **React 18.3** - UI framework
- **TypeScript 6.0** - Type safety
- **Vite 6.3** - Build tool
- **Tailwind CSS 4.1** - Styling
- **Recharts 2.15** - Data visualization
- **Lucide React** - Icons
- **next-themes** - Theme management
- **Sonner** - Toast notifications
- **Vitest 4.1** - Testing framework

## Testing

Run tests with:

```bash
pnpm test
```

Run tests with UI:

```bash
pnpm test:ui
```

Test coverage includes:
- Mock API functionality
- Component rendering
- User interactions
- Referral code validation
- Rate limiting
- Connection state management

## Project Structure

```
src/
├── api/
│   └── mockApi.ts          # Mock backend implementation
├── app/
│   ├── components/
│   │   ├── ConnectionToggle.tsx
│   │   ├── Header.tsx
│   │   ├── PlanSelector.tsx
│   │   ├── ServerComparison.tsx
│   │   ├── SettingsDialog.tsx
│   │   ├── SpeedTest.tsx
│   │   ├── ThemeProvider.tsx
│   │   └── UsageGraph.tsx
│   └── App.tsx             # Main application
├── test/
│   ├── components.test.tsx
│   ├── mockApi.test.ts
│   └── setup.ts
├── types/
│   └── vpn.ts              # TypeScript interfaces
└── styles/
    ├── fonts.css
    └── theme.css           # Tailwind theme configuration
```

## Referral Codes

Test the referral system with these codes:

- `SAVE20` - 20% discount
- `WELCOME10` - 10% discount
- `FRIEND50` - 50% discount

## Development

The Vite dev server is already running. The application uses:
- Hot module replacement (HMR)
- TypeScript type checking
- Automatic Tailwind compilation
- React Fast Refresh

## Features Checklist

✅ Mock backend with 6 API endpoints
✅ 4-tier plan selector
✅ Referral code system
✅ Advanced speed test with region picker
✅ Speed test history
✅ Rate limiting on speed tests
✅ Connection toggle
✅ Connection timer
✅ Fake IP generation
✅ Data usage tracking
✅ Sortable server comparison table
✅ Dark/light mode
✅ Usage graph with Recharts
✅ Keyboard shortcuts
✅ Settings import/export
✅ Offline detection
✅ Full TypeScript support
✅ Vitest test suite
✅ Responsive design
✅ Toast notifications

## Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+

## License

MIT
