import {
  calcMemoryPercent,
  formatCpu,
  formatGpu,
  formatRam,
  parseRawMetrics,
} from './metrics.util';

describe('metrics.util', () => {
  describe('parseRawMetrics', () => {
    it('parses a well-formed "cpu,gpu,ram" string', () => {
      expect(parseRawMetrics('635.0,22.0,4994.9')).toEqual({
        cpu: 635,
        gpu: 22,
        ram: 4994.9,
      });
    });

    it('defaults missing or invalid parts to 0', () => {
      expect(parseRawMetrics('abc,,10')).toEqual({ cpu: 0, gpu: 0, ram: 10 });
    });
  });

  describe('formatCpu', () => {
    it('renders cores for values >= 1000 mCore', () => {
      expect(formatCpu(2500)).toBe('2.5 Core');
    });

    it('renders mCore for smaller values', () => {
      expect(formatCpu(635)).toBe('635.0 mCore');
    });
  });

  describe('formatGpu', () => {
    it('returns Integrated for zero or negative', () => {
      expect(formatGpu(0)).toBe('Integrated');
    });

    it('labels high-end cards above the high threshold', () => {
        expect(formatGpu(8306.5)).toBe('8.1 GB');
    });

    it('labels mid-range cards above the mid threshold', () => {
      expect(formatGpu(2111.7)).toContain('RTX4060');
    });

    it('shows raw MB for small GPU footprints', () => {
      expect(formatGpu(22)).toBe('22.0 MB');
    });
  });

  describe('formatRam', () => {
    it('renders GB for values >= 1024 MB', () => {
      expect(formatRam(4994.9)).toBe('4.9 GB');
    });

    it('renders MB for smaller values', () => {
      expect(formatRam(512)).toBe('512 MB');
    });
  });

  describe('calcMemoryPercent', () => {
    it('computes a bounded percentage', () => {
      expect(calcMemoryPercent(8192, 16384)).toBe(50);
    });

    it('caps at 100', () => {
      expect(calcMemoryPercent(40000, 16384)).toBe(100);
    });

    it('respects the minimum floor', () => {
      expect(calcMemoryPercent(1, 16384, 5)).toBe(5);
    });

    it('returns 0 when baseline is invalid', () => {
      expect(calcMemoryPercent(100, 0)).toBe(0);
    });
  });
});
