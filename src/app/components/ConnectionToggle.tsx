import { useState, useEffect } from 'react';
import { Power, Clock, Download, Upload, Globe } from 'lucide-react';
import { mockApi } from '../../api/mockApi';
import type { VPNServer, ConnectionStatus } from '../../types/vpn';

export function ConnectionToggle() {
  const [servers, setServers] = useState<VPNServer[]>([]);
  const [selectedServer, setSelectedServer] = useState<string>('');
  const [status, setStatus] = useState<ConnectionStatus>({
    connected: false,
    server: null,
    connectedAt: null,
    duration: 0,
    dataUsed: { download: 0, upload: 0 },
    fakeIP: null,
  });

  useEffect(() => {
    mockApi.getServers().then((data) => {
      setServers(data);
      if (data.length > 0) setSelectedServer(data[0].id);
    });
  }, []);

  useEffect(() => {
    if (!status.connected) return;

    const interval = setInterval(() => {
      setStatus(prev => ({
        ...prev,
        duration: prev.connectedAt ? Date.now() - prev.connectedAt : 0,
        dataUsed: {
          download: prev.dataUsed.download + Math.random() * 100,
          upload: prev.dataUsed.upload + Math.random() * 30,
        },
      }));
    }, 1000);

    return () => clearInterval(interval);
  }, [status.connected]);

  const toggleConnection = () => {
    if (status.connected) {
      setStatus({
        connected: false,
        server: null,
        connectedAt: null,
        duration: 0,
        dataUsed: { download: 0, upload: 0 },
        fakeIP: null,
      });
    } else {
      const server = servers.find(s => s.id === selectedServer);
      if (server) {
        const fakeIP = `${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`;
        setStatus({
          connected: true,
          server,
          connectedAt: Date.now(),
          duration: 0,
          dataUsed: { download: 0, upload: 0 },
          fakeIP,
        });
      }
    }
  };

  const formatDuration = (ms: number) => {
    const seconds = Math.floor(ms / 1000);
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const formatDataSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes.toFixed(0)} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  return (
    <div className="w-full p-6 bg-gray-800 rounded-xl">
      <div className="max-w-2xl mx-auto">
        <h2 className="text-2xl mb-6 text-center">VPN Connection</h2>

        {!status.connected && (
          <div className="mb-6">
            <label className="block text-sm mb-2 text-gray-400">Select Server</label>
            <select
              value={selectedServer}
              onChange={(e) => setSelectedServer(e.target.value)}
              className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-blue-500"
            >
              {servers.map(server => (
                <option key={server.id} value={server.id}>
                  {server.flag} {server.name} - Load: {server.load}%
                </option>
              ))}
            </select>
          </div>
        )}

        <div className="flex flex-col items-center mb-6">
          <button
            onClick={toggleConnection}
            className={`relative w-32 h-32 rounded-full flex items-center justify-center transition-all ${
              status.connected
                ? 'bg-green-600 hover:bg-green-700 shadow-lg shadow-green-500/50'
                : 'bg-gray-700 hover:bg-gray-600'
            }`}
          >
            <Power className="w-16 h-16" />
          </button>
          <p className="mt-4 text-lg">
            {status.connected ? 'Connected' : 'Disconnected'}
          </p>
        </div>

        {status.connected && status.server && (
          <div className="space-y-4">
            <div className="p-4 bg-gray-700 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-400">Server</span>
                <span>{status.server.flag} {status.server.name}</span>
              </div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-400 flex items-center gap-2">
                  <Globe className="w-4 h-4" />
                  IP Address
                </span>
                <span className="font-mono">{status.fakeIP}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-400 flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  Duration
                </span>
                <span className="font-mono">{formatDuration(status.duration)}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-gray-700 rounded-lg">
                <div className="flex items-center gap-2 mb-2 text-green-400">
                  <Download className="w-5 h-5" />
                  <span>Download</span>
                </div>
                <div className="text-2xl font-mono">
                  {formatDataSize(status.dataUsed.download)}
                </div>
              </div>

              <div className="p-4 bg-gray-700 rounded-lg">
                <div className="flex items-center gap-2 mb-2 text-blue-400">
                  <Upload className="w-5 h-5" />
                  <span>Upload</span>
                </div>
                <div className="text-2xl font-mono">
                  {formatDataSize(status.dataUsed.upload)}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
