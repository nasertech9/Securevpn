import { useState, useEffect } from 'react';
import { ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';
import { mockApi } from '../../api/mockApi';
import type { VPNServer } from '../../types/vpn';

type SortField = 'name' | 'country' | 'load' | 'ping';
type SortDirection = 'asc' | 'desc';

export function ServerComparison() {
  const [servers, setServers] = useState<VPNServer[]>([]);
  const [sortField, setSortField] = useState<SortField>('ping');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');

  useEffect(() => {
    mockApi.getServers().then(setServers);
  }, []);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const sortedServers = [...servers].sort((a, b) => {
    let comparison = 0;

    switch (sortField) {
      case 'name':
        comparison = a.name.localeCompare(b.name);
        break;
      case 'country':
        comparison = a.country.localeCompare(b.country);
        break;
      case 'load':
        comparison = a.load - b.load;
        break;
      case 'ping':
        comparison = a.ping - b.ping;
        break;
    }

    return sortDirection === 'asc' ? comparison : -comparison;
  });

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) return <ArrowUpDown className="w-4 h-4 text-gray-500" />;
    return sortDirection === 'asc'
      ? <ArrowUp className="w-4 h-4 text-blue-400" />
      : <ArrowDown className="w-4 h-4 text-blue-400" />;
  };

  const getLoadColor = (load: number) => {
    if (load < 40) return 'text-green-400';
    if (load < 70) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getPingColor = (ping: number) => {
    if (ping < 50) return 'text-green-400';
    if (ping < 100) return 'text-yellow-400';
    return 'text-red-400';
  };

  return (
    <div className="w-full p-6 bg-gray-800 rounded-xl">
      <h2 className="text-2xl mb-6">Server Comparison</h2>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-700">
              <th
                className="px-4 py-3 text-left cursor-pointer hover:bg-gray-700/50"
                onClick={() => handleSort('name')}
              >
                <div className="flex items-center gap-2">
                  Server
                  <SortIcon field="name" />
                </div>
              </th>
              <th
                className="px-4 py-3 text-left cursor-pointer hover:bg-gray-700/50"
                onClick={() => handleSort('country')}
              >
                <div className="flex items-center gap-2">
                  Country
                  <SortIcon field="country" />
                </div>
              </th>
              <th className="px-4 py-3 text-left">Region</th>
              <th
                className="px-4 py-3 text-left cursor-pointer hover:bg-gray-700/50"
                onClick={() => handleSort('load')}
              >
                <div className="flex items-center gap-2">
                  Load
                  <SortIcon field="load" />
                </div>
              </th>
              <th
                className="px-4 py-3 text-left cursor-pointer hover:bg-gray-700/50"
                onClick={() => handleSort('ping')}
              >
                <div className="flex items-center gap-2">
                  Ping
                  <SortIcon field="ping" />
                </div>
              </th>
            </tr>
          </thead>
          <tbody>
            {sortedServers.map((server) => (
              <tr
                key={server.id}
                className="border-b border-gray-700/50 hover:bg-gray-700/30 transition-colors"
              >
                <td className="px-4 py-3">
                  <span className="mr-2">{server.flag}</span>
                  {server.name}
                </td>
                <td className="px-4 py-3">{server.country}</td>
                <td className="px-4 py-3 text-gray-400">{server.region}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <div className="flex-1 max-w-[100px] bg-gray-700 rounded-full h-2 overflow-hidden">
                      <div
                        className={`h-full ${
                          server.load < 40 ? 'bg-green-500' :
                          server.load < 70 ? 'bg-yellow-500' :
                          'bg-red-500'
                        }`}
                        style={{ width: `${server.load}%` }}
                      />
                    </div>
                    <span className={getLoadColor(server.load)}>
                      {server.load}%
                    </span>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <span className={getPingColor(server.ping)}>
                    {server.ping}ms
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
