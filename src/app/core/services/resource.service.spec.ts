import { TestBed } from '@angular/core/testing';
import { ResourceService } from './resource.service';

describe('ResourceService', () => {
  let service: ResourceService;

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({});
    service = TestBed.inject(ResourceService);
  });

  it('seeds default resources when storage is empty', () => {
    expect(service.resources().length).toBeGreaterThan(0);
    expect(service.activeResourceId()).toBeTruthy();
  });

  it('initializes a valid Tab 1 selection', () => {
    expect(service.tab1SelectedMachine()).toBe('SRV-APP-03');
    expect(service.tab1SelectedPlugin()).toBeTruthy();
    expect(service.tab1Metrics().ram).not.toBe('0 GB');
  });

  it('resets the plugin when the Tab 1 machine changes', () => {
    service.setTab1Machine('SRV-WEB-02');
    expect(service.tab1SelectedMachine()).toBe('SRV-WEB-02');
    expect(service.tab1SelectedPlugin()).toBe('Cache Manager');
  });

  it('creates a new resource and makes it active', () => {
    const before = service.resources().length;
    const created = service.createResource('My Resource');
    expect(service.resources().length).toBe(before + 1);
    expect(service.activeResourceId()).toBe(created.id);
  });

  it('toggles plugin selection on the active resource', () => {
    const created = service.createResource('Toggle Test');
    service.selectResource(created.id);

    expect(service.isPluginSelected('SRV-APP-03', 'API Gateway Agent')).toBe(false);
    service.togglePlugin('SRV-APP-03', 'API Gateway Agent');
    expect(service.isPluginSelected('SRV-APP-03', 'API Gateway Agent')).toBe(true);

    service.togglePlugin('SRV-APP-03', 'API Gateway Agent');
    expect(service.isPluginSelected('SRV-APP-03', 'API Gateway Agent')).toBe(false);
  });

  it('aggregates metrics across selected plugins', () => {
    const created = service.createResource('Aggregate Test');
    service.selectResource(created.id);
    service.togglePlugin('SRV-APP-03', 'API Gateway Agent');

    const metrics = service.activeResourceMetrics();
    expect(metrics.cpuValue).toBe(635);
    expect(metrics.ramValue).toBeCloseTo(4994.9);
    expect(service.totalSelectedPluginsCount()).toBe(1);
  });

  it('summarizes only machines that have selections', () => {
    const created = service.createResource('Summary Test');
    service.selectResource(created.id);
    service.togglePlugin('SRV-WEB-02', 'Cache Manager');

    const summaries = service.selectedMachineSummaries();
    expect(summaries.length).toBe(1);
    expect(summaries[0].name).toBe('SRV-WEB-02');
    expect(summaries[0].selectedPlugins[0].name).toBe('Cache Manager');
  });

  it('selects and clears all plugins for a machine', () => {
    const created = service.createResource('Select All Test');
    service.selectResource(created.id);

    expect(service.areAllPluginsSelected('SRV-APP-03')).toBe(false);
    service.toggleAllPlugins('SRV-APP-03');
    expect(service.areAllPluginsSelected('SRV-APP-03')).toBe(true);

    service.toggleAllPlugins('SRV-APP-03');
    expect(service.areAllPluginsSelected('SRV-APP-03')).toBe(false);
  });

  it('deletes a resource and re-points the active id', () => {
    const created = service.createResource('To Delete');
    service.selectResource(created.id);
    service.deleteResource(created.id);

    expect(service.resources().some((r) => r.id === created.id)).toBe(false);
    expect(service.activeResourceId()).not.toBe(created.id);
  });
});
