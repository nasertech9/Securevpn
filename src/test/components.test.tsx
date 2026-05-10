import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { PlanSelector } from '../app/components/PlanSelector';
import { SpeedTest } from '../app/components/SpeedTest';
import { ConnectionToggle } from '../app/components/ConnectionToggle';

vi.mock('../api/mockApi', () => ({
  mockApi: {
    getPlans: vi.fn().mockResolvedValue([
      { id: 'free', name: 'Free', price: 0, duration: 'month', features: [], maxDevices: 1, bandwidth: '5GB' },
      { id: 'pro', name: 'Pro', price: 9.99, duration: 'month', features: [], maxDevices: 5, bandwidth: 'Unlimited', recommended: true },
    ]),
    validateReferralCode: vi.fn().mockResolvedValue({ code: 'SAVE20', discount: 20, expiresAt: Date.now() + 10000 }),
    getServers: vi.fn().mockResolvedValue([
      { id: '1', name: 'New York #1', country: 'USA', region: 'North America', city: 'New York', load: 45, ping: 23, flag: '🇺🇸' },
      { id: '2', name: 'London #1', country: 'UK', region: 'Europe', city: 'London', load: 67, ping: 12, flag: '🇬🇧' },
    ]),
    runSpeedTest: vi.fn().mockResolvedValue({
      id: '1',
      timestamp: Date.now(),
      server: 'New York #1',
      downloadSpeed: 85.5,
      uploadSpeed: 42.3,
      ping: 23,
      region: 'North America',
    }),
    getSpeedTestHistory: vi.fn().mockResolvedValue([]),
  },
}));

describe('PlanSelector', () => {
  it('should render plan cards', async () => {
    render(<PlanSelector />);
    await waitFor(() => {
      expect(screen.getByText('Free')).toBeInTheDocument();
      expect(screen.getByText('Pro')).toBeInTheDocument();
    });
  });

  it('should show recommended badge on Pro plan', async () => {
    render(<PlanSelector />);
    await waitFor(() => {
      expect(screen.getByText('Recommended')).toBeInTheDocument();
    });
  });

  it('should apply referral code discount', async () => {
    render(<PlanSelector />);

    await waitFor(() => {
      expect(screen.getByPlaceholderText('Enter referral code')).toBeInTheDocument();
    });

    const input = screen.getByPlaceholderText('Enter referral code');
    const button = screen.getByText('Apply');

    fireEvent.change(input, { target: { value: 'SAVE20' } });
    fireEvent.click(button);

    await waitFor(() => {
      expect(screen.getByText(/20% discount applied/)).toBeInTheDocument();
    });
  });
});

describe('SpeedTest', () => {
  it('should render speed test component', async () => {
    render(<SpeedTest />);
    await waitFor(() => {
      expect(screen.getByText('Speed Test')).toBeInTheDocument();
      expect(screen.getByText('Run Speed Test')).toBeInTheDocument();
    });
  });

  it('should show region filter', async () => {
    render(<SpeedTest />);
    await waitFor(() => {
      expect(screen.getByText('Region')).toBeInTheDocument();
    });
  });
});

describe('ConnectionToggle', () => {
  it('should render connection toggle', async () => {
    render(<ConnectionToggle />);
    await waitFor(() => {
      expect(screen.getByText('VPN Connection')).toBeInTheDocument();
      expect(screen.getByText('Disconnected')).toBeInTheDocument();
    });
  });

  it('should toggle connection state', async () => {
    render(<ConnectionToggle />);

    await waitFor(() => {
      expect(screen.getByText('Disconnected')).toBeInTheDocument();
    });

    const button = screen.getAllByRole('button')[1];
    fireEvent.click(button);

    await waitFor(() => {
      expect(screen.getByText('Connected')).toBeInTheDocument();
    });
  });
});
