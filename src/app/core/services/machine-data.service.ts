import { Injectable } from '@angular/core';
import { MACHINES_DATA } from '../data/machines-data';
import { SIZING_CONFIG } from '../config/sizing.config';
import { MachineInfo, MachinesRawData, PluginDetail } from '../models/machine-data.model';
import {
  calcMemoryPercent,
  formatCpu,
  formatGpu,
  formatRam,
  parseRawMetrics,
} from '../utils/metrics.util';

/**
 * Single source of truth for machine/plugin data.
 * Owns the raw JSON and exposes it as strongly-typed, display-ready models so
 * that components and templates remain fully generic and data-agnostic.
 */
@Injectable({ providedIn: 'root' })
export class MachineDataService {
  private readonly machineList: MachineInfo[];
  private readonly machineIndex: Map<string, MachineInfo>;

  constructor() {
    this.machineList = this.parse(MACHINES_DATA);
    this.machineIndex = new Map(this.machineList.map((m) => [m.name, m]));
  }

  /** All machines with parsed plugins. */
  getMachines(): MachineInfo[] {
    return this.machineList;
  }

  /** A machine by name, or undefined. */
  getMachine(name: string): MachineInfo | undefined {
    return this.machineIndex.get(name);
  }

  /** A plugin within a machine, or undefined. */
  getPlugin(machineName: string, pluginName: string): PluginDetail | undefined {
    return this.getMachine(machineName)?.plugins.find((p) => p.name === pluginName);
  }

  /** The first machine (used as a sensible default selection). */
  getFirstMachine(): MachineInfo | undefined {
    return this.machineList[0];
  }

  private parse(raw: MachinesRawData): MachineInfo[] {
    return Object.entries(raw).map(([machineName, plugins], idx) => {
      const pluginDetails = this.parsePlugins(plugins);
      return {
        name: machineName,
        index: idx + 1,
        displayName: `Machine ${idx + 1} (${machineName})`,
        totalPluginsCount: pluginDetails.length,
        plugins: pluginDetails,
      };
    });
  }

  private parsePlugins(plugins: MachinesRawData[string]): PluginDetail[] {
    return Object.entries(plugins).map(([pluginName, rawVal]) => {
      const { cpu, gpu, ram } = parseRawMetrics(rawVal);
      return {
        name: pluginName,
        rawMetrics: rawVal,
        cpu,
        gpu,
        ram,
        formattedCpu: formatCpu(cpu),
        formattedGpu: formatGpu(gpu),
        formattedRam: formatRam(ram),
        memoryConsumptionPercent: calcMemoryPercent(ram, SIZING_CONFIG.singlePluginBaselineMb, 5),
      };
    });
  }
}
