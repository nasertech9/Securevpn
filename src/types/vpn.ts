export interface VPNServer {
  id: string;
  name: string;
  country: string;
  region: string;
  city: string;
  load: number;
  ping: number;
  flag: string;
}

export interface Plan {
  id: string;
  name: string;
  price: number;
  duration: string;
  features: string[];
  maxDevices: number;
  bandwidth: string;
  recommended?: boolean;
}

export interface SpeedTestResult {
  id: string;
  timestamp: number;
  server: string;
  downloadSpeed: number;
  uploadSpeed: number;
  ping: number;
  region: string;
}

export interface ConnectionStatus {
  connected: boolean;
  server: VPNServer | null;
  connectedAt: number | null;
  duration: number;
  dataUsed: {
    download: number;
    upload: number;
  };
  fakeIP: string | null;
}

export interface UserSettings {
  autoConnect: boolean;
  killSwitch: boolean;
  protocol: 'OpenVPN' | 'WireGuard' | 'IKEv2';
  notifications: boolean;
  darkMode: boolean;
  preferredServer: string | null;
}

export interface UsageData {
  date: string;
  download: number;
  upload: number;
}

export interface ReferralCode {
  code: string;
  discount: number;
  expiresAt: number;
}
