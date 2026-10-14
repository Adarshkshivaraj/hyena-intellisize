/**
 * Centralized sizing thresholds and baselines.
 * Keeping these here avoids magic numbers scattered across services.
 */
export const SIZING_CONFIG = {
  /** mCores that constitute a full CPU core. */
  cpuCoreThreshold: 1000,
  /** MB that constitute 1 GB of RAM. */
  ramGbThreshold: 1024,
  /** Baseline RAM (MB) used for a single plugin's memory consumption %. */
  singlePluginBaselineMb: 16384,
  /** Baseline RAM (MB) used for an aggregated resource's memory consumption %. */
  aggregateBaselineMb: 32768,
  /** GPU (MB) above which a high-end card label is used. */
  gpuHighThreshold: 5000,
  /** GPU (MB) above which a mid-range card label is used. */
  gpuMidThreshold: 1000,
} as const;

/** LocalStorage keys used for persistence. */
export const STORAGE_KEYS = {
  resources: 'hyena_intellisize_resources',
  activeResourceId: 'hyena_intellisize_active_resource_id',
  tab1Selection: 'hyena_intellisize_tab1_selection',
} as const;
