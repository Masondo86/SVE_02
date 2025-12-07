/* Client-side unit tests for src/scamEngine.mjs */
import { describe, test, expect } from '@jest/globals';

let mod;
beforeAll(async () => {
  // dynamic import of ESM module
  mod = await import('../src/scamEngine.mjs');
});

describe('client generateResult (heuristic)', () => {
  test('returns high risk for inputs with multiple phishing keywords', () => {
    const r = mod.generateResult('Please login and verify your bank account to confirm payment', {
      whitelist: [],
      blacklist: [],
      strictTokens: true
    });
    expect(r).toHaveProperty('riskLevel', 'high');
    expect(r.score).toBeLessThanOrEqual(20);
  });

  test('respects whitelist and returns safe', () => {
    const r = mod.generateResult('https://linktech.example/path', {
      whitelist: ['linktech.example'],
      blacklist: [],
      strictTokens: true
    });
    expect(r.riskLevel).toBe('safe');
    expect(r.score).toBeGreaterThanOrEqual(90);
  });

  test('respects blacklist and returns high risk', () => {
    const r = mod.generateResult('phishy-site.example/login', {
      whitelist: [],
      blacklist: ['phishy-site.example'],
      strictTokens: false
    });
    expect(r.riskLevel).toBe('high');
    expect(r.score).toBeLessThanOrEqual(20);
  });

  test('returns medium for innocuous text', () => {
    const r = mod.generateResult('this is a generic informational message', { whitelist: [], blacklist: [] });
    expect(r.riskLevel).toBe('medium');
    expect(r.score).toBeGreaterThanOrEqual(0);
    expect(r.score).toBeLessThanOrEqual(100);
  });
});

describe('gauge helpers', () => {
  test('computeGaugeOffset clamps and computes correctly', () => {
    expect(mod.computeGaugeOffset(100)).toBeCloseTo(0);
    expect(mod.computeGaugeOffset(0)).toBeCloseTo(283);
    expect(mod.computeGaugeOffset(50)).toBeCloseTo(283 - 0.5 * 283);
  });

  test('chooseGaugeColor mapping', () => {
    expect(mod.chooseGaugeColor('high')).toBe('#dc2626');
    expect(mod.chooseGaugeColor('safe')).toBe('#16a34a');
    expect(mod.chooseGaugeColor('medium')).toBe('#f97316');
  });
});
