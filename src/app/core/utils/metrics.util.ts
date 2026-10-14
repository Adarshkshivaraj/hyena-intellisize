import { SIZING_CONFIG } from '../config/sizing.config';

/** Formats mCores into a human-readable CPU string. */
export function formatCpu(cpu: number): string {
  if (cpu < SIZING_CONFIG.cpuCoreThreshold) {
    return `${cpu.toFixed(1)} mCore`;
  }
  const cores = cpu / SIZING_CONFIG.cpuCoreThreshold;
  return `${cores.toFixed(1)} Core`;
}

/** Formats GPU memory (MB) into a human-readable label. */
export function formatGpu(gpu: number): string {
  if (gpu <= 0) {
    return 'Integrated';
  }
  const gpuGb = gpu / SIZING_CONFIG.ramGbThreshold;
  if (gpu > SIZING_CONFIG.gpuHighThreshold) {
      return `${gpuGb.toFixed(1)} GB`;
  }
  if (gpu > SIZING_CONFIG.gpuMidThreshold) {
    return `RTX4060 (${gpuGb.toFixed(1)} GB)`;
  }
  return `${gpu.toFixed(1)} MB`;
}

/** Formats RAM (MB) into a human-readable string. */
export function formatRam(ram: number): string {
  if (ram < SIZING_CONFIG.ramGbThreshold) {
    return `${ram.toFixed(0)} MB`;
  }
  const ramGb = ram / SIZING_CONFIG.ramGbThreshold;
  return `${ramGb.toFixed(1)} GB`;
}

/** Computes a bounded memory-consumption percentage for a given RAM against a baseline. */
export function calcMemoryPercent(ram: number, baselineMb: number, minPercent = 0): number {
  if (baselineMb <= 0) {
    return 0;
  }
  const percent = Math.round((ram / baselineMb) * 100);
  return Math.min(100, Math.max(minPercent, percent));
}

/** Parses a raw "cpu,gpu,ram" string into numeric parts. */
export function parseRawMetrics(raw: string): { cpu: number; gpu: number; ram: number } {
  const [cpuStr, gpuStr, ramStr] = raw.split(',').map((part) => part.trim());
  return {
    cpu: Number.parseFloat(cpuStr) || 0,
    gpu: Number.parseFloat(gpuStr) || 0,
    ram: Number.parseFloat(ramStr) || 0,
  };
}
