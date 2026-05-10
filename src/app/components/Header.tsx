import { Moon, Sun, Download, Upload, Wifi, WifiOff, Settings, User, LogOut } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useState } from 'react';

interface HeaderProps {
  isOnline: boolean;
  onExportSettings: () => void;
  onImportSettings: () => void;
  onOpenSettings: () => void;
  user: { email: string; name: string } | null;
  onSignOut: () => void;
  onOpenSignIn: () => void;
  onOpenSignUp: () => void;
}

export function Header({
  isOnline,
  onExportSettings,
  onImportSettings,
  onOpenSettings,
  user,
  onSignOut,
  onOpenSignIn,
  onOpenSignUp
}: HeaderProps) {
  const { theme, setTheme } = useTheme();
  const [showMenu, setShowMenu] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  return (
    <header className="bg-gray-800 border-b border-gray-700 px-6 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
            <span className="text-2xl">🛡️</span>
          </div>
          <h1 className="text-2xl">SecureVPN</h1>
        </div>

        <div className="flex items-center gap-4">
          <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full ${isOnline ? 'bg-green-900/30 text-green-400' : 'bg-red-900/30 text-red-400'}`}>
            {isOnline ? <Wifi className="w-4 h-4" /> : <WifiOff className="w-4 h-4" />}
            <span className="text-sm">{isOnline ? 'Online' : 'Offline'}</span>
          </div>

          <button
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
            title="Toggle theme (Ctrl+T)"
          >
            {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>

          <div className="relative">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
              title="Settings menu"
            >
              <Settings className="w-5 h-5" />
            </button>

            {showMenu && (
              <>
                <div
                  className="fixed inset-0"
                  onClick={() => setShowMenu(false)}
                />
                <div className="absolute right-0 mt-2 w-48 bg-gray-700 border border-gray-600 rounded-lg shadow-xl z-10">
                  <button
                    onClick={() => {
                      onExportSettings();
                      setShowMenu(false);
                    }}
                    className="w-full px-4 py-2 text-left hover:bg-gray-600 flex items-center gap-2 rounded-t-lg"
                  >
                    <Download className="w-4 h-4" />
                    Export Settings
                  </button>
                  <button
                    onClick={() => {
                      onImportSettings();
                      setShowMenu(false);
                    }}
                    className="w-full px-4 py-2 text-left hover:bg-gray-600 flex items-center gap-2"
                  >
                    <Upload className="w-4 h-4" />
                    Import Settings
                  </button>
                  <button
                    onClick={() => {
                      onOpenSettings();
                      setShowMenu(false);
                    }}
                    className="w-full px-4 py-2 text-left hover:bg-gray-600 flex items-center gap-2 rounded-b-lg border-t border-gray-600"
                  >
                    <Settings className="w-4 h-4" />
                    Preferences
                  </button>
                </div>
              </>
            )}
          </div>

          {user ? (
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-2 px-3 py-2 hover:bg-gray-700 rounded-lg transition-colors"
              >
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                  <User className="w-5 h-5" />
                </div>
                <span className="text-sm hidden md:block">{user.name.split(' ')[0]}</span>
              </button>

              {showUserMenu && (
                <>
                  <div
                    className="fixed inset-0"
                    onClick={() => setShowUserMenu(false)}
                  />
                  <div className="absolute right-0 mt-2 w-64 bg-gray-700 border border-gray-600 rounded-lg shadow-xl z-10">
                    <div className="px-4 py-3 border-b border-gray-600">
                      <p className="text-sm">{user.name}</p>
                      <p className="text-xs text-gray-400">{user.email}</p>
                    </div>
                    <button
                      onClick={() => {
                        onSignOut();
                        setShowUserMenu(false);
                      }}
                      className="w-full px-4 py-2 text-left hover:bg-gray-600 flex items-center gap-2 rounded-b-lg text-red-400"
                    >
                      <LogOut className="w-4 h-4" />
                      Sign Out
                    </button>
                  </div>
                </>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={onOpenSignIn}
                className="px-4 py-2 hover:bg-gray-700 rounded-lg transition-colors"
              >
                Sign In
              </button>
              <button
                onClick={onOpenSignUp}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
              >
                Sign Up
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
