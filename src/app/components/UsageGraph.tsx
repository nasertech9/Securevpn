import { useState, useEffect, useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TrendingUp } from 'lucide-react';
import { mockApi } from '../../api/mockApi';
import type { UsageData } from '../../types/vpn';

export function UsageGraph() {
  const [data, setData] = useState<UsageData[]>([]);
  const [days, setDays] = useState(7);

  useEffect(() => {
    mockApi.getUsageData(days).then(setData);
  }, [days]);

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return `${date.getMonth() + 1}/${date.getDate()}`;
  };

  const formatDataSize = (bytes: number) => {
    return `${(bytes / 1024).toFixed(1)} GB`;
  };

  const chartData = useMemo(() =>
    data.map((item, index) => ({
      id: `data-${index}-${item.date}`,
      date: formatDate(item.date),
      Download: Number((item.download / 1024).toFixed(2)),
      Upload: Number((item.upload / 1024).toFixed(2)),
    })),
    [data]
  );

  const totalDownload = data.reduce((sum, item) => sum + item.download, 0);
  const totalUpload = data.reduce((sum, item) => sum + item.upload, 0);

  return (
    <div className="w-full p-6 bg-gray-800 rounded-xl">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl flex items-center gap-2">
          <TrendingUp className="w-6 h-6" />
          Data Usage
        </h2>
        <select
          value={days}
          onChange={(e) => setDays(Number(e.target.value))}
          className="px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-blue-500"
        >
          <option value={7}>Last 7 days</option>
          <option value={14}>Last 14 days</option>
          <option value={30}>Last 30 days</option>
        </select>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="p-4 bg-gray-700 rounded-lg">
          <div className="text-sm text-gray-400 mb-1">Total Download</div>
          <div className="text-2xl text-green-400">{formatDataSize(totalDownload)}</div>
        </div>
        <div className="p-4 bg-gray-700 rounded-lg">
          <div className="text-sm text-gray-400 mb-1">Total Upload</div>
          <div className="text-2xl text-blue-400">{formatDataSize(totalUpload)}</div>
        </div>
      </div>

      {chartData.length > 0 && (
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData} key={`chart-${days}`}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis dataKey="date" stroke="#9CA3AF" />
            <YAxis stroke="#9CA3AF" label={{ value: 'GB', angle: -90, position: 'insideLeft' }} />
            <Tooltip
              contentStyle={{
                backgroundColor: '#1F2937',
                border: '1px solid #374151',
                borderRadius: '8px',
              }}
            />
            <Legend />
            <Bar dataKey="Download" fill="#10B981" />
            <Bar dataKey="Upload" fill="#3B82F6" />
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
