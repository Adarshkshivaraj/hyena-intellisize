import { TestBed } from '@angular/core/testing';
import { StorageService } from './storage.service';

describe('StorageService', () => {
  let service: StorageService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StorageService);
    localStorage.clear();
  });

  it('returns the fallback when a key is missing', () => {
    expect(service.get('missing', 'fallback')).toBe('fallback');
  });

  it('round-trips a serialized value', () => {
    service.set('key', { a: 1, b: [2, 3] });
    expect(service.get('key', null)).toEqual({ a: 1, b: [2, 3] });
  });

  it('returns the fallback on malformed JSON', () => {
    localStorage.setItem('bad', '{not-json');
    expect(service.get('bad', 42)).toBe(42);
  });

  it('removes a key', () => {
    service.set('key', 'value');
    service.remove('key');
    expect(service.get('key', 'gone')).toBe('gone');
  });
});
