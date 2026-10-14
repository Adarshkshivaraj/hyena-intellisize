import { Injectable, computed, inject, signal } from '@angular/core';
import { SIZING_CONFIG, STORAGE_KEYS } from '../config/sizing.config';
import {
  MachineInfo,
  ResourceItem,
  SelectedMachineSummary,
  SizingMetrics,
} from '../models/machine-data.model';
import { MachineDataService } from './machine-data.service';
import { StorageService } from './storage.service';
import { calcMemoryPercent, formatCpu, formatGpu, formatRam } from '../utils/metrics.util';

interface Tab1Selection {
  machine: string;
  plugin: string;
}

const EMPTY_METRICS: SizingMetrics = {
  cpu: '0 Core',
  cpuValue: 0,
  gpu: 'None',
  gpuValue: 0,
  ram: '0 GB',
  ramValue: 0,
  memoryConsumption: '0%',
  memoryConsumptionValue: 0,
};

/**
 * Application state for resources and Tab 1 selection.
 * Delegates data lookups to {@link MachineDataService} and persistence to
 * {@link StorageService}, keeping this service focused on state + derivations.
 */
@Injectable({ providedIn: 'root' })
export class ResourceService {
  private readonly data = inject(MachineDataService);
  private readonly storage = inject(StorageService);

  readonly machines = signal<MachineInfo[]>(this.data.getMachines());

  // Tab 1 selection
  readonly tab1SelectedMachine = signal<string>('');
  readonly tab1SelectedPlugin = signal<string>('');

  // Tab 2 resources
  readonly resources = signal<ResourceItem[]>([]);
  readonly activeResourceId = signal<string>('');

  readonly activeResource = computed<ResourceItem | null>(() => {
    const list = this.resources();
    const activeId = this.activeResourceId();
    return list.find((r) => r.id === activeId) ?? list[0] ?? null;
  });

  /** Metrics for the single plugin selected in Tab 1. */
  readonly tab1Metrics = computed<SizingMetrics>(() => {
    const plugin = this.data.getPlugin(this.tab1SelectedMachine(), this.tab1SelectedPlugin());
    if (!plugin) {
      return EMPTY_METRICS;
    }
    return {
      cpu: plugin.formattedCpu,
      cpuValue: plugin.cpu,
      gpu: plugin.formattedGpu,
      gpuValue: plugin.gpu,
      ram: plugin.formattedRam,
      ramValue: plugin.ram,
      memoryConsumption: `${plugin.memoryConsumptionPercent}%`,
      memoryConsumptionValue: plugin.memoryConsumptionPercent,
    };
  });

  /** Aggregated metrics across all selected plugins of the active resource. */
  readonly activeResourceMetrics = computed<SizingMetrics>(() => {
    const resource = this.activeResource();
    if (!resource) {
      return EMPTY_METRICS;
    }

    let totalCpu = 0;
    let totalGpu = 0;
    let totalRam = 0;
    let count = 0;

    for (const machine of this.machines()) {
      for (const pluginName of resource.selectedPlugins[machine.name] ?? []) {
        const plugin = machine.plugins.find((p) => p.name === pluginName);
        if (plugin) {
          totalCpu += plugin.cpu;
          totalGpu += plugin.gpu;
          totalRam += plugin.ram;
          count++;
        }
      }
    }

    if (count === 0) {
      return EMPTY_METRICS;
    }

    const memoryPercent = calcMemoryPercent(totalRam, SIZING_CONFIG.aggregateBaselineMb, 1);
    return {
      cpu: formatCpu(totalCpu),
      cpuValue: totalCpu,
      gpu: formatGpu(totalGpu),
      gpuValue: totalGpu,
      ram: formatRam(totalRam),
      ramValue: totalRam,
      memoryConsumption: `${memoryPercent}%`,
      memoryConsumptionValue: memoryPercent,
    };
  });

  /** Machines with only their selected plugins, for the summary view. */
  readonly selectedMachineSummaries = computed<SelectedMachineSummary[]>(() => {
    const resource = this.activeResource();
    if (!resource) {
      return [];
    }
    return this.machines().reduce<SelectedMachineSummary[]>((acc, machine) => {
      const selectedNames = resource.selectedPlugins[machine.name] ?? [];
      if (selectedNames.length > 0) {
        acc.push({
          name: machine.name,
          selectedPlugins: machine.plugins.filter((p) => selectedNames.includes(p.name)),
        });
      }
      return acc;
    }, []);
  });

  readonly totalSelectedPluginsCount = computed<number>(() => {
    const resource = this.activeResource();
    if (!resource) {
      return 0;
    }
    return Object.values(resource.selectedPlugins).reduce((sum, list) => sum + list.length, 0);
  });

  constructor() {
    this.restoreState();
  }

  // ---- Tab 1 ----

  setTab1Machine(machineName: string): void {
    this.tab1SelectedMachine.set(machineName);
    const firstPlugin = this.data.getMachine(machineName)?.plugins[0]?.name ?? '';
    this.tab1SelectedPlugin.set(firstPlugin);
    this.persistTab1Selection();
  }

  setTab1Plugin(pluginName: string): void {
    this.tab1SelectedPlugin.set(pluginName);
    this.persistTab1Selection();
  }

  // ---- Tab 2: resources ----

  selectResource(resourceId: string): void {
    this.activeResourceId.set(resourceId);
    this.storage.set(STORAGE_KEYS.activeResourceId, resourceId);
  }

  createResource(name: string): ResourceItem {
    const trimmed = name.trim() || `Resource ${this.resources().length + 1}`;
    const resource: ResourceItem = {
      id: `res-${crypto.randomUUID()}`,
      name: trimmed,
      createdAt: Date.now(),
      selectedPlugins: {},
    };
    this.resources.update((list) => [...list, resource]);
    this.activeResourceId.set(resource.id);
    this.persistResources();
    return resource;
  }

  deleteResource(resourceId: string): void {
    this.resources.update((list) => {
      const filtered = list.filter((r) => r.id !== resourceId);
      if (this.activeResourceId() === resourceId) {
        this.activeResourceId.set(filtered[0]?.id ?? '');
      }
      return filtered;
    });
    this.persistResources();
  }

  togglePlugin(machineName: string, pluginName: string): void {
    const activeId = this.activeResourceId();
    if (!activeId) {
      return;
    }
    this.resources.update((list) =>
      list.map((resource) => {
        if (resource.id !== activeId) {
          return resource;
        }
        const current = resource.selectedPlugins[machineName] ?? [];
        const updated = current.includes(pluginName)
          ? current.filter((p) => p !== pluginName)
          : [...current, pluginName];
        return {
          ...resource,
          selectedPlugins: { ...resource.selectedPlugins, [machineName]: updated },
        };
      }),
    );
    this.persistResources();
  }

  isPluginSelected(machineName: string, pluginName: string): boolean {
    const resource = this.activeResource();
    return (resource?.selectedPlugins[machineName] ?? []).includes(pluginName);
  }

  areAllPluginsSelected(machineName: string): boolean {
    const machine = this.data.getMachine(machineName);
    if (!machine || machine.plugins.length === 0) {
      return false;
    }
    const selected = this.activeResource()?.selectedPlugins[machineName] ?? [];
    return machine.plugins.every((p) => selected.includes(p.name));
  }

  toggleAllPlugins(machineName: string): void {
    const activeId = this.activeResourceId();
    const machine = this.data.getMachine(machineName);
    if (!activeId || !machine) {
      return;
    }
    const selectAll = !this.areAllPluginsSelected(machineName);
    const updated = selectAll ? machine.plugins.map((p) => p.name) : [];
    this.resources.update((list) =>
      list.map((resource) =>
        resource.id === activeId
          ? {
              ...resource,
              selectedPlugins: { ...resource.selectedPlugins, [machineName]: updated },
            }
          : resource,
      ),
    );
    this.persistResources();
  }

  // ---- persistence ----

  private restoreState(): void {
    this.restoreTab1Selection();
    this.restoreResources();
  }

  private restoreTab1Selection(): void {
    const fallbackMachine = this.data.getFirstMachine();
    const saved = this.storage.get<Tab1Selection | null>(STORAGE_KEYS.tab1Selection, null);

    if (saved && this.data.getPlugin(saved.machine, saved.plugin)) {
      this.tab1SelectedMachine.set(saved.machine);
      this.tab1SelectedPlugin.set(saved.plugin);
      return;
    }
    if (fallbackMachine) {
      this.tab1SelectedMachine.set(fallbackMachine.name);
      this.tab1SelectedPlugin.set(fallbackMachine.plugins[0]?.name ?? '');
    }
  }

  private restoreResources(): void {
    const saved = this.storage.get<ResourceItem[]>(STORAGE_KEYS.resources, []);
    const resources = saved.length > 0 ? saved : this.buildDefaultResources();
    this.resources.set(resources);

    const savedActiveId = this.storage.get<string>(STORAGE_KEYS.activeResourceId, '');
    const activeId = resources.some((r) => r.id === savedActiveId)
      ? savedActiveId
      : (resources[0]?.id ?? '');
    this.activeResourceId.set(activeId);

    if (saved.length === 0) {
      this.persistResources();
    }
  }

  private buildDefaultResources(): ResourceItem[] {
    return [
      {
        id: 'res-name-a',
        name: 'Name A',
        createdAt: Date.now() - 100_000,
        selectedPlugins: {
          'SRV-APP-03': ['API Gateway Agent', 'Session Manager'],
          'SRV-CACHE-07': ['Cache Manager', 'Eviction Policy Agent'],
          'SRV-DB-01': ['Backup Agent', 'Query Optimizer'],
          'SRV-ML-04': ['Batch Scheduler', 'GPU Inference Engine'],
          'SRV-WEB-02': ['Cache Manager', 'Compression Engine', 'SSL Certificate Monitor'],
        },
      },
      {
        id: 'res-name-b',
        name: 'Name B',
        createdAt: Date.now() - 50_000,
        selectedPlugins: {
          'SRV-APP-03': ['Auth Service Connector', 'Task Scheduler'],
          'SRV-CACHE-07': ['Cluster Health Monitor', 'Memory Compactor'],
          'SRV-ML-04': ['GPU Memory Manager', 'Model Trainer', 'Tensor Optimizer'],
        },
      },
    ];
  }

  private persistTab1Selection(): void {
    this.storage.set<Tab1Selection>(STORAGE_KEYS.tab1Selection, {
      machine: this.tab1SelectedMachine(),
      plugin: this.tab1SelectedPlugin(),
    });
  }

  private persistResources(): void {
    this.storage.set(STORAGE_KEYS.resources, this.resources());
    this.storage.set(STORAGE_KEYS.activeResourceId, this.activeResourceId());
  }
}
