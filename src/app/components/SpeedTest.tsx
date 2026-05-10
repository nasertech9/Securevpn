import { useState, useEffect } from 'react';
import { Gauge, MapPin, Clock, TrendingUp, TrendingDown } from 'lucide-react';
import { mockApi } from '../../api/mockApi';
import type { VPNServer, SpeedTestResult } from '../../types/vpn';

export function SpeedTest() {
  const [servers, setServers] = useState<VPNServer[]>([]);
  const [selectedServer, setSelectedServer] = useState<string>('');
  const [testing, setTesting] = useState(false);
  const [currentResult, setCurrentResult] = useState<SpeedTestResult | null>(null);
  const [history, setHistory] = useState<SpeedTestResult[]>([]);
  const [error, setError] = useState('');
  const [selectedRegion, setSelectedRegion] = useState<string>('all');

  useEffect(() => {
    mockApi.getServers().then((data) => {
      setServers(data);
      if (data.length > 0) setSelectedServer(data[0].id);
    });
    mockApi.getSpeedTestHistory().then(setHistory);
  }, []);

  const regions = ['all', ...new Set(servers.map(s => s.region))];

  const filteredServers = selectedRegion === 'all'
    ? servers
    : servers.filter(s => s.region === selectedRegion);

  const runTest = async () => {
    if (!selectedServer) return;

    setTesting(true);
    setError('');

    try {
      const result = await mockApi.runSpeedTest(selectedServer);
      setCurrentResult(result);
      setHistory([result, ...history]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Speed test failed');
    } finally {
      setTesting(false);
    }
  };

  return (
    <div className="w-full p-6 bg-gray-800 rounded-xl">
      <h2 className="text-2xl mb-6 flex items-center gap-2">
        <Gauge className="w-6 h-6" />
        Speed Test
      </h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <div className="mb-4">
            <label className="block text-sm mb-2 text-gray-400">Region</label>
            <select
              value={selectedRegion}
              onChange={(e) => setSelectedRegion(e.target.value)}
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-blue-500"
            >
              {regions.map(region => (
                <option key={region} value={region}>
                  {region === 'all' ? 'All Regions' : region}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-4">
            <label className="block text-sm mb-2 text-gray-400">Server</label>
            <select
              value={selectedServer}
              onChange={(e) => setSelectedServer(e.target.value)}
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-blue-500"
            >
              {filteredServers.map(server => (
                <option key={server.id} value={server.id}>
                  {server.flag} {server.name} - {server.ping}ms
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={runTest}
            disabled={testing}
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {testing ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Testing...
              </>
            ) : (
              'Run Speed Test'
            )}
          </button>

          {error && (
            <p className="mt-3 text-red-400 text-sm">{error}</p>
          )}

          {currentResult && !testing && (
            <div className="mt-6 p-4 bg-gray-700 rounded-lg">
              <div className="flex items-center gap-2 mb-3 text-gray-400">
                <MapPin className="w-4 h-4" />
                <span className="text-sm">{currentResult.server}</span>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <div className="text-2xl flex items-center gap-1">
                    <TrendingDown className="w-5 h-5 text-green-400" />
                    {currentResult.downloadSpeed.toFixed(1)}
                  </div>
                  <div className="text-xs text-gray-400">Mbps Download</div>
                </div>
                <div>
                  <div className="text-2xl flex items-center gap-1">
                    <TrendingUp className="w-5 h-5 text-blue-400" />
                    {currentResult.uploadSpeed.toFixed(1)}
                  </div>
                  <div className="text-xs text-gray-400">Mbps Upload</div>
                </div>
                <div>
                  <div className="text-2xl flex items-center gap-1">
                    <Clock className="w-5 h-5 text-yellow-400" />
                    {currentResult.ping.toFixed(0)}
                  </div>
                  <div className="text-xs text-gray-400">ms Ping</div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div>
          <h3 className="text-lg mb-3">Test History</h3>
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {history.length === 0 ? (
              <p className="text-gray-400 text-sm">No tests yet. Run your first speed test!</p>
            ) : (
              history.map((result) => (
                <div key={result.id} className="p-3 bg-gray-700 rounded-lg">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-sm">{result.server}</span>
                    <span className="text-xs text-gray-400">
                      {new Date(result.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                  <div className="flex gap-4 text-sm">
                    <span className="text-green-400">↓ {result.downloadSpeed.toFixed(1)} Mbps</span>
                    <span className="text-blue-400">↑ {result.uploadSpeed.toFixed(1)} Mbps</span>
                    <span className="text-gray-400">{result.ping.toFixed(0)}ms</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
