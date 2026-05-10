# VPN Dashboard - Detailed Features

## Core Components

### 1. Authentication System

#### Sign In Dialog (`SignInDialog.tsx`)
Full-featured sign in form:
- **Email Field**:
  - Required field with email format validation
  - Placeholder: "your@email.com"
  - Error message on invalid format
  
- **Password Field**:
  - Required field with minimum 6 characters
  - Password masking
  - Validation on submit
  
- **Additional Features**:
  - "Remember me" checkbox for persistent sessions
  - "Forgot password?" link with reset email simulation
  - Social login buttons (Google, GitHub) with coming soon alerts
  - Switch to Sign Up link
  - Full form validation with error messages
  
- **User Flow**:
  1. Enter email and password
  2. Optional: Check "Remember me"
  3. Click "Sign In"
  4. Success toast: "Welcome back!"
  5. Header updates to show user profile

#### Sign Up Dialog (`SignUpDialog.tsx`)
Comprehensive registration form:
- **Personal Information**:
  - First name (required)
  - Last name (required)
  - Both validated on submit
  
- **Account Details**:
  - Email (required, format validation)
  - Password requirements:
    - Minimum 8 characters
    - Must contain uppercase letter
    - Must contain lowercase letter
    - Must contain number
  - Confirm password (must match)
  - Helper text shows requirements
  
- **Terms Acceptance**:
  - Checkbox required for submission
  - Clickable links to Terms and Privacy Policy
  - Error if not checked
  
- **Social Options**:
  - Google sign up button
  - GitHub sign up button
  - Both show "coming soon" messages
  
- **User Flow**:
  1. Fill all required fields
  2. Create strong password
  3. Confirm password matches
  4. Accept terms
  5. Click "Create Account"
  6. Success toast: "Account created successfully!"
  7. Automatic sign in

#### Header Authentication UI
- **Signed Out State**:
  - "Sign In" button (text style)
  - "Sign Up" button (blue, prominent)
  - Both open respective dialogs
  
- **Signed In State**:
  - User avatar (blue circle with user icon)
  - First name displayed (desktop only)
  - Dropdown menu on click:
    - Full name
    - Email address
    - Sign Out button (red)
  
- **Session Persistence**:
  - Uses localStorage for user data
  - Survives page refreshes
  - Cleared on sign out

### 2. Connection Toggle (`ConnectionToggle.tsx`)
The main VPN connection interface provides:
- **Server Selection**: Choose from 8+ global servers before connecting
- **Visual Status**: Large circular power button that changes color when connected
- **Connection Timer**: Real-time display of connection duration (HH:MM:SS format)
- **Fake IP Display**: Shows generated IP address while connected
- **Data Usage Tracking**: Live monitoring of download/upload data
  - Updates every second while connected
  - Displays in B/KB/MB format automatically
- **Server Info**: Shows connected server flag, name, and location

### 3. Speed Test (`SpeedTest.tsx`)
Advanced speed testing with enterprise features:
- **Region Filter**: Filter servers by geographic region
- **Server Selection**: Choose specific server for testing
- **Test Execution**: 2-second simulated test with progress indicator
- **Results Display**:
  - Download speed (Mbps)
  - Upload speed (Mbps)
  - Ping latency (ms)
  - Server name and timestamp
- **Test History**: Maintains last 10 speed tests
- **Rate Limiting**: 30-second cooldown between tests
  - Shows remaining wait time in error message
  - Prevents server abuse
- **Color-Coded Icons**: Green download, blue upload, yellow ping

### 4. Plan Selector (`PlanSelector.tsx`)
4-tier subscription system:

#### Plans:
1. **Free** ($0/month)
   - 1 device
   - 5GB bandwidth
   - Basic servers
   - Ad-supported

2. **Basic** ($4.99/month)
   - 3 devices
   - 100GB bandwidth
   - All servers
   - No ads
   - Email support

3. **Pro** ($9.99/month) ⭐ RECOMMENDED
   - 5 devices
   - Unlimited bandwidth
   - All servers
   - Priority support
   - Kill switch
   - Ad blocker

4. **Premium** ($14.99/month)
   - 10 devices
   - Unlimited bandwidth
   - Dedicated servers
   - 24/7 support
   - All Pro features
   - Static IP

#### Referral System:
- **Code Input**: Text field with apply button
- **Validation**: Real-time API validation
- **Discount Display**: Shows percentage off with sparkle icon
- **Price Update**: Automatically recalculates all plan prices
- **Visual Strikethrough**: Original price shown when discount applied
- **Pre-loaded Codes**:
  - `SAVE20` - 20% off
  - `WELCOME10` - 10% off
  - `FRIEND50` - 50% off

#### Plan Actions:
- **Free Plan ("Get Started")**:
  - Instant activation with success toast
  - No payment required
  - Immediate access to free features
  
- **Paid Plans ("Subscribe")**:
  - Opens payment dialog modal
  - **Payment Information**:
    - Card number (auto-formats with spaces)
    - Expiration date (MM/YY format)
    - CVV (3-4 digits)
  - **Billing Information**:
    - First name (required)
    - Last name (required)
    - Country (dropdown selection)
    - Billing address line 1 (required)
    - Billing address line 2 (optional)
    - City (required)
  - **Features**:
    - Real-time form validation
    - Error messages for invalid fields
    - Applied discount shown in total
    - Cancel or complete purchase
    - Success confirmation on submission

### 5. Server Comparison (`ServerComparison.tsx`)
Sortable table of all VPN servers:
- **Columns**:
  - Server (name with flag emoji)
  - Country
  - Region
  - Load (% with progress bar)
  - Ping (ms)
- **Sorting**: Click column headers to sort
  - Shows arrow indicators (up/down)
  - Highlighted active column
  - Supports ascending/descending
- **Visual Indicators**:
  - Load bars: Green (<40%), Yellow (40-70%), Red (>70%)
  - Ping colors: Green (<50ms), Yellow (50-100ms), Red (>100ms)
- **Hover Effects**: Row highlighting for better UX

### 6. Usage Graph (`UsageGraph.tsx`)
Data visualization with Recharts:
- **Bar Chart**: Dual bars for download/upload
- **Time Ranges**:
  - Last 7 days (default)
  - Last 14 days
  - Last 30 days
- **Statistics Cards**:
  - Total download (green)
  - Total upload (blue)
- **Interactive**: Hover tooltips on bars
- **Responsive**: Adapts to container width
- **Color Scheme**: Matches dashboard theme

### 7. Settings Dialog (`SettingsDialog.tsx`)
Comprehensive preferences:
- **Auto Connect**: Connect VPN on app startup
- **Kill Switch**: Block internet if VPN drops
- **Notifications**: Toggle connection status alerts
- **Protocol Selection**: OpenVPN, WireGuard, or IKEv2
- **Keyboard Shortcuts Reference**: Built-in help
- **Persistence**: Saves to localStorage

### 8. Header (`Header.tsx`)
Navigation and utilities:
- **Branding**: Shield logo + "SecureVPN" title
- **Online Status**: Live indicator with wifi icon
- **Theme Toggle**: Sun/moon icon for dark/light mode
- **Settings Menu**:
  - Export settings (download JSON)
  - Import settings (upload JSON)
  - Open preferences dialog

## Technical Features

### Keyboard Shortcuts
All shortcuts use standard browser conventions:
- `Ctrl+Shift+C` - Quick connect/disconnect
- `Ctrl+T` - Theme toggle
- `Ctrl+,` - Settings (macOS convention)
- `Ctrl+S` - Speed test (overrides browser save)

### Offline Detection
- **Browser API**: Uses `navigator.onLine`
- **Event Listeners**: Online/offline events
- **Visual Feedback**:
  - Header status badge
  - Bottom banner when offline
  - Pulsing red dot animation
- **Toast Notifications**: Alerts on connection change

### Settings Import/Export
- **Format**: Clean JSON with 2-space indent
- **Export**: Downloads `vpn-settings.json`
- **Import**: File picker validates JSON
- **Error Handling**: Toast on success/failure
- **Persistence**: Auto-saves to localStorage

### Theme System
- **Provider**: next-themes with class strategy
- **Modes**: Light/dark (system mode disabled)
- **Default**: Dark mode
- **CSS Variables**: Full Tailwind v4 integration
- **Scope**: Applied to entire app via class

### Mock Backend
Realistic API simulation:
- **Network Delays**: 100-400ms response times
- **Data Generation**: Randomized but consistent
- **Error States**: Rate limiting, invalid inputs
- **State Management**: In-memory history tracking
- **Type Safety**: Full TypeScript interfaces

## Data Flow

1. **Component Mount** → Fetch data from mockApi
2. **User Action** → Update local state
3. **API Call** → Simulated delay → Response
4. **State Update** → Re-render components
5. **Side Effects** → localStorage, notifications

## Performance Optimizations

- **Lazy Loading**: Components load on demand
- **Memo**: Prevent unnecessary re-renders
- **Debouncing**: Rate limit API calls
- **Local State**: Minimize prop drilling
- **CSS Variables**: Fast theme switching

## Accessibility

- **Semantic HTML**: Proper heading hierarchy
- **ARIA Labels**: Screen reader support
- **Keyboard Navigation**: Full keyboard access
- **Focus Indicators**: Visible focus states
- **Color Contrast**: WCAG AA compliant

## Browser Features Used

- **LocalStorage**: Settings persistence
- **Navigator API**: Online detection
- **FileReader API**: Import settings
- **Blob API**: Export settings
- **Crypto API**: UUID generation
