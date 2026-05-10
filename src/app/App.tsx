import { useState, useEffect, useRef } from 'react';
import { useTheme } from 'next-themes';
import { toast, Toaster } from 'sonner';
import { ThemeProvider } from './components/ThemeProvider';
import { Header } from './components/Header';
import { ConnectionToggle } from './components/ConnectionToggle';
import { SpeedTest } from './components/SpeedTest';
import { PlanSelector } from './components/PlanSelector';
import { ServerComparison } from './components/ServerComparison';
import { UsageGraph } from './components/UsageGraph';
import { SettingsDialog } from './components/SettingsDialog';
import { SignInDialog } from './components/SignInDialog';
import { SignUpDialog } from './components/SignUpDialog';
import type { UserSettings } from '../types/vpn';

function AppContent() {
  const { setTheme } = useTheme();
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [signInOpen, setSignInOpen] = useState(false);
  const [signUpOpen, setSignUpOpen] = useState(false);
  const [user, setUser] = useState<{ email: string; name: string } | null>(() => {
    const saved = localStorage.getItem('vpn-user');
    return saved ? JSON.parse(saved) : null;
  });
  const [settings, setSettings] = useState<UserSettings>(() => {
    const saved = localStorage.getItem('vpn-settings');
    return saved ? JSON.parse(saved) : {
      autoConnect: false,
      killSwitch: true,
      protocol: 'WireGuard' as const,
      notifications: true,
      darkMode: true,
      preferredServer: null,
    };
  });

  const speedTestRef = useRef<{ runTest: () => void }>(null);

  useEffect(() => {
    localStorage.setItem('vpn-settings', JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    if (user) {
      localStorage.setItem('vpn-user', JSON.stringify(user));
    } else {
      localStorage.removeItem('vpn-user');
    }
  }, [user]);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      if (settings.notifications) {
        toast.success('Internet connection restored');
      }
    };

    const handleOffline = () => {
      setIsOnline(false);
      if (settings.notifications) {
        toast.error('Internet connection lost');
      }
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [settings.notifications]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key === ',') {
        e.preventDefault();
        setSettingsOpen(true);
      }

      if (e.ctrlKey && e.key === 't') {
        e.preventDefault();
        setTheme(theme => theme === 'dark' ? 'light' : 'dark');
      }

      if (e.ctrlKey && e.shiftKey && e.key === 'C') {
        e.preventDefault();
        const connectBtn = document.querySelector('[aria-label="vpn-connect-button"]') as HTMLButtonElement;
        connectBtn?.click();
      }

      if (e.ctrlKey && e.key === 's') {
        e.preventDefault();
        const speedTestBtn = document.querySelector('[aria-label="speed-test-button"]') as HTMLButtonElement;
        speedTestBtn?.click();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [setTheme]);

  const handleExportSettings = () => {
    const dataStr = JSON.stringify(settings, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'vpn-settings.json';
    link.click();
    URL.revokeObjectURL(url);
    toast.success('Settings exported successfully');
  };

  const handleImportSettings = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          try {
            const imported = JSON.parse(event.target?.result as string);
            setSettings(imported);
            toast.success('Settings imported successfully');
          } catch (error) {
            toast.error('Failed to import settings');
          }
        };
        reader.readAsText(file);
      }
    };
    input.click();
  };

  const handleSignIn = (email: string) => {
    const name = email.split('@')[0];
    setUser({ email, name: name.charAt(0).toUpperCase() + name.slice(1) });
  };

  const handleSignUp = (email: string, name: string) => {
    setUser({ email, name });
  };

  const handleSignOut = () => {
    setUser(null);
    toast.success('Signed out successfully');
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Header
        isOnline={isOnline}
        onExportSettings={handleExportSettings}
        onImportSettings={handleImportSettings}
        onOpenSettings={() => setSettingsOpen(true)}
        user={user}
        onSignOut={handleSignOut}
        onOpenSignIn={() => setSignInOpen(true)}
        onOpenSignUp={() => setSignUpOpen(true)}
      />

      <main className="max-w-7xl mx-auto p-6 space-y-8">
        <ConnectionToggle />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <SpeedTest />
          <UsageGraph />
        </div>

        <ServerComparison />

        <PlanSelector />
      </main>

      <SettingsDialog
        isOpen={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        settings={settings}
        onSettingsChange={setSettings}
      />

      <SignInDialog
        isOpen={signInOpen}
        onClose={() => setSignInOpen(false)}
        onSignIn={handleSignIn}
        onSwitchToSignUp={() => {
          setSignInOpen(false);
          setSignUpOpen(true);
        }}
      />

      <SignUpDialog
        isOpen={signUpOpen}
        onClose={() => setSignUpOpen(false)}
        onSignUp={handleSignUp}
        onSwitchToSignIn={() => {
          setSignUpOpen(false);
          setSignInOpen(true);
        }}
      />

      <Toaster position="top-right" theme="dark" />

      {!isOnline && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 px-6 py-3 bg-red-600 rounded-lg shadow-xl flex items-center gap-2">
          <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
          <span>You are currently offline</span>
        </div>
      )}
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}
