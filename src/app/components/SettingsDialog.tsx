import { X } from 'lucide-react';
import type { UserSettings } from '../../types/vpn';

interface SettingsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  settings: UserSettings;
  onSettingsChange: (settings: UserSettings) => void;
}

export function SettingsDialog({ isOpen, onClose, settings, onSettingsChange }: SettingsDialogProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-700">
          <h2 className="text-2xl">Settings</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg mb-1">Auto Connect</h3>
              <p className="text-sm text-gray-400">Automatically connect to VPN on startup</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.autoConnect}
                onChange={(e) => onSettingsChange({ ...settings, autoConnect: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg mb-1">Kill Switch</h3>
              <p className="text-sm text-gray-400">Block internet if VPN disconnects</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.killSwitch}
                onChange={(e) => onSettingsChange({ ...settings, killSwitch: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg mb-1">Notifications</h3>
              <p className="text-sm text-gray-400">Show connection status notifications</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.notifications}
                onChange={(e) => onSettingsChange({ ...settings, notifications: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          <div>
            <h3 className="text-lg mb-2">VPN Protocol</h3>
            <select
              value={settings.protocol}
              onChange={(e) => onSettingsChange({ ...settings, protocol: e.target.value as UserSettings['protocol'] })}
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-blue-500"
            >
              <option value="OpenVPN">OpenVPN</option>
              <option value="WireGuard">WireGuard</option>
              <option value="IKEv2">IKEv2</option>
            </select>
          </div>

          <div className="pt-4 border-t border-gray-700">
            <h3 className="text-lg mb-3">Keyboard Shortcuts</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-400">Toggle connection</span>
                <kbd className="px-2 py-1 bg-gray-700 rounded">Ctrl+Shift+C</kbd>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Toggle theme</span>
                <kbd className="px-2 py-1 bg-gray-700 rounded">Ctrl+T</kbd>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Open settings</span>
                <kbd className="px-2 py-1 bg-gray-700 rounded">Ctrl+,</kbd>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Speed test</span>
                <kbd className="px-2 py-1 bg-gray-700 rounded">Ctrl+S</kbd>
              </div>
            </div>
          </div>
        </div>

        <div className="p-6 border-t border-gray-700 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
