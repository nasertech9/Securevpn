import type { VPNServer, Plan, SpeedTestResult, UserSettings, UsageData, ReferralCode } from '../types/vpn';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const MOCK_SERVERS: VPNServer[] = [
  { id: '1', name: 'New York #1', country: 'United States', region: 'North America', city: 'New York', load: 45, ping: 23, flag: '🇺🇸' },
  { id: '2', name: 'London #1', country: 'United Kingdom', region: 'Europe', city: 'London', load: 67, ping: 12, flag: '🇬🇧' },
  { id: '3', name: 'Tokyo #1', country: 'Japan', region: 'Asia', city: 'Tokyo', load: 34, ping: 89, flag: '🇯🇵' },
  { id: '4', name: 'Sydney #1', country: 'Australia', region: 'Oceania', city: 'Sydney', load: 52, ping: 156, flag: '🇦🇺' },
  { id: '5', name: 'Frankfurt #1', country: 'Germany', region: 'Europe', city: 'Frankfurt', load: 28, ping: 18, flag: '🇩🇪' },
  { id: '6', name: 'Singapore #1', country: 'Singapore', region: 'Asia', city: 'Singapore', load: 71, ping: 98, flag: '🇸🇬' },
  { id: '7', name: 'Toronto #1', country: 'Canada', region: 'North America', city: 'Toronto', load: 41, ping: 34, flag: '🇨🇦' },
  { id: '8', name: 'Paris #1', country: 'France', region: 'Europe', city: 'Paris', load: 55, ping: 15, flag: '🇫🇷' },
];

const MOCK_PLANS: Plan[] = [
  {
    id: 'free',
    name: 'Free',
    price: 0,
    duration: 'month',
    features: ['1 device', '5GB bandwidth', 'Basic servers', 'Ads supported'],
    maxDevices: 1,
    bandwidth: '5GB',
  },
  {
    id: 'basic',
    name: 'Basic',
    price: 4.99,
    duration: 'month',
    features: ['3 devices', '100GB bandwidth', 'All servers', 'No ads', 'Email support'],
    maxDevices: 3,
    bandwidth: '100GB',
  },
  {
    id: 'pro',
    name: 'Pro',
    price: 9.99,
    duration: 'month',
    features: ['5 devices', 'Unlimited bandwidth', 'All servers', 'Priority support', 'Kill switch', 'Ad blocker'],
    maxDevices: 5,
    bandwidth: 'Unlimited',
    recommended: true,
  },
  {
    id: 'premium',
    name: 'Premium',
    price: 14.99,
    duration: 'month',
    features: ['10 devices', 'Unlimited bandwidth', 'Dedicated servers', '24/7 support', 'All Pro features', 'Static IP'],
    maxDevices: 10,
    bandwidth: 'Unlimited',
  },
];

const REFERRAL_CODES: Record<string, ReferralCode> = {
  'SAVE20': { code: 'SAVE20', discount: 20, expiresAt: Date.now() + 30 * 24 * 60 * 60 * 1000 },
  'WELCOME10': { code: 'WELCOME10', discount: 10, expiresAt: Date.now() + 7 * 24 * 60 * 60 * 1000 },
  'FRIEND50': { code: 'FRIEND50', discount: 50, expiresAt: Date.now() + 24 * 60 * 60 * 1000 },
};

let speedTestHistory: SpeedTestResult[] = [];
let lastSpeedTestTime = 0;
const SPEED_TEST_COOLDOWN = 30000;

export const mockApi = {
  async getServers(): Promise<VPNServer[]> {
    await delay(300);
    return [...MOCK_SERVERS];
  },

  async getPlans(): Promise<Plan[]> {
    await delay(200);
    return [...MOCK_PLANS];
  },

  async validateReferralCode(code: string): Promise<ReferralCode | null> {
    await delay(400);
    const referral = REFERRAL_CODES[code.toUpperCase()];
    if (referral && referral.expiresAt > Date.now()) {
      return referral;
    }
    return null;
  },

  async runSpeedTest(serverId: string): Promise<SpeedTestResult> {
    const now = Date.now();
    if (now - lastSpeedTestTime < SPEED_TEST_COOLDOWN) {
      const remainingTime = Math.ceil((SPEED_TEST_COOLDOWN - (now - lastSpeedTestTime)) / 1000);
      throw new Error(`Rate limited. Please wait ${remainingTime} seconds.`);
    }

    await delay(2000);

    const server = MOCK_SERVERS.find(s => s.id === serverId);
    if (!server) throw new Error('Server not found');

    const result: SpeedTestResult = {
      id: crypto.randomUUID(),
      timestamp: now,
      server: server.name,
      downloadSpeed: Math.random() * 80 + 20,
      uploadSpeed: Math.random() * 40 + 10,
      ping: server.ping + Math.random() * 10 - 5,
      region: server.region,
    };

    speedTestHistory = [result, ...speedTestHistory].slice(0, 10);
    lastSpeedTestTime = now;
    return result;
  },

  async getSpeedTestHistory(): Promise<SpeedTestResult[]> {
    await delay(100);
    return [...speedTestHistory];
  },

  async getUsageData(days: number = 7): Promise<UsageData[]> {
    await delay(300);
    const data: UsageData[] = [];
    const now = new Date();

    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      data.push({
        date: date.toISOString().split('T')[0],
        download: Math.random() * 5000 + 1000,
        upload: Math.random() * 2000 + 500,
      });
    }

    return data;
  },
};
