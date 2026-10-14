import { TestBed } from '@angular/core/testing';
import { MachineDataService } from './machine-data.service';

describe('MachineDataService', () => {
  let service: MachineDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MachineDataService);
  });

  it('parses all machines from the source data', () => {
    const machines = service.getMachines();
    expect(machines.length).toBeGreaterThan(0);
    expect(machines[0].index).toBe(1);
    expect(machines[0].displayName).toContain('Machine 1');
  });

  it('parses plugin metrics into numbers and display strings', () => {
    const plugin = service.getPlugin('SRV-APP-03', 'API Gateway Agent');
    expect(plugin).toBeDefined();
    expect(plugin?.cpu).toBe(635);
    expect(plugin?.gpu).toBe(22);
    expect(plugin?.ram).toBe(4994.9);
    expect(plugin?.formattedRam).toBe('4.9 GB');
  });

  it('returns undefined for unknown machine or plugin', () => {
    expect(service.getMachine('UNKNOWN')).toBeUndefined();
    expect(service.getPlugin('SRV-APP-03', 'Nope')).toBeUndefined();
  });

  it('exposes the first machine as a default', () => {
    expect(service.getFirstMachine()?.name).toBe('SRV-APP-03');
  });
});
