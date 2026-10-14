/**
 * Raw plugin metric string format: "cpu,gpu,ram"
 * Example: "635.0,22.0,4994.9"
 */
export type PluginRawMetrics = string;

/** A machine's raw plugin map as provided by the source JSON. */
export interface PluginRawMap {
  [pluginName: string]: PluginRawMetrics;
}

/** The full raw machines dataset keyed by machine name. */
export interface MachinesRawData {
  [machineName: string]: PluginRawMap;
}

/** A single plugin with parsed and display-ready metrics. */
export interface PluginDetail {
  name: string;
  rawMetrics: PluginRawMetrics;
  cpu: number;
  gpu: number;
  ram: number;
  formattedCpu: string;
  formattedGpu: string;
  formattedRam: string;
  memoryConsumptionPercent: number;
}

/** A machine with its parsed plugins. */
export interface MachineInfo {
  name: string;
  index: number;
  displayName: string;
  totalPluginsCount: number;
  plugins: PluginDetail[];
}

/** Map of machine name to the list of selected plugin names. */
export interface SelectedPluginsMap {
  [machineName: string]: string[];
}

/** A user-created resource holding plugin selections. */
export interface ResourceItem {
  id: string;
  name: string;
  createdAt: number;
  selectedPlugins: SelectedPluginsMap;
}

/** Display-ready sizing metrics rendered by the metric cards. */
export interface SizingMetrics {
  cpu: string;
  cpuValue: number;
  gpu: string;
  gpuValue: number;
  ram: string;
  ramValue: number;
  memoryConsumption: string;
  memoryConsumptionValue: number;
}

/** A machine paired with only its selected plugins (summary view). */
export interface SelectedMachineSummary {
  name: string;
  selectedPlugins: PluginDetail[];
}
