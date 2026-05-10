import { describe, it, expect, beforeEach, vi } from 'vitest';
import { mockApi } from '../api/mockApi';

describe('mockApi', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  describe('getServers', () => {
    it('should return a list of servers', async () => {
      const servers = await mockApi.getServers();
      expect(servers).toBeInstanceOf(Array);
      expect(servers.length).toBeGreaterThan(0);
      expect(servers[0]).toHaveProperty('id');
      expect(servers[0]).toHaveProperty('name');
      expect(servers[0]).toHaveProperty('country');
    });
  });

  describe('getPlans', () => {
    it('should return 4 pricing plans', async () => {
      const plans = await mockApi.getPlans();
      expect(plans).toHaveLength(4);
      expect(plans[0]).toHaveProperty('id');
      expect(plans[0]).toHaveProperty('name');
      expect(plans[0]).toHaveProperty('price');
    });

    it('should have one recommended plan', async () => {
      const plans = await mockApi.getPlans();
      const recommended = plans.filter(p => p.recommended);
      expect(recommended).toHaveLength(1);
    });
  });

  describe('validateReferralCode', () => {
    it('should validate a valid referral code', async () => {
      const result = await mockApi.validateReferralCode('SAVE20');
      expect(result).not.toBeNull();
      expect(result?.discount).toBe(20);
    });

    it('should reject an invalid referral code', async () => {
      const result = await mockApi.validateReferralCode('INVALID');
      expect(result).toBeNull();
    });

    it('should be case insensitive', async () => {
      const result = await mockApi.validateReferralCode('save20');
      expect(result).not.toBeNull();
      expect(result?.discount).toBe(20);
    });
  });

  describe('runSpeedTest', () => {
    it('should return speed test results', async () => {
      const result = await mockApi.runSpeedTest('1');
      expect(result).toHaveProperty('downloadSpeed');
      expect(result).toHaveProperty('uploadSpeed');
      expect(result).toHaveProperty('ping');
      expect(result.downloadSpeed).toBeGreaterThan(0);
      expect(result.uploadSpeed).toBeGreaterThan(0);
    });

    it('should enforce rate limiting', async () => {
      await mockApi.runSpeedTest('1');
      await expect(mockApi.runSpeedTest('1')).rejects.toThrow(/Rate limited/);
    });

    it('should reject invalid server id', async () => {
      await expect(mockApi.runSpeedTest('invalid')).rejects.toThrow('Server not found');
    });
  });

  describe('getUsageData', () => {
    it('should return usage data for specified days', async () => {
      const data = await mockApi.getUsageData(7);
      expect(data).toHaveLength(7);
      expect(data[0]).toHaveProperty('date');
      expect(data[0]).toHaveProperty('download');
      expect(data[0]).toHaveProperty('upload');
    });

    it('should return data in chronological order', async () => {
      const data = await mockApi.getUsageData(7);
      const dates = data.map(d => new Date(d.date).getTime());
      for (let i = 1; i < dates.length; i++) {
        expect(dates[i]).toBeGreaterThan(dates[i - 1]);
      }
    });
  });
});
