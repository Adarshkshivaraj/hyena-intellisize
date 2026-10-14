import { Injectable, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

/**
 * SSR-safe wrapper around localStorage.
 * Single responsibility: persistence. Everything is JSON serialized.
 */
@Injectable({ providedIn: 'root' })
export class StorageService {
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  get<T>(key: string, fallback: T): T {
    if (!this.isBrowser) {
      return fallback;
    }
    try {
      const raw = localStorage.getItem(key);
      return raw === null ? fallback : (JSON.parse(raw) as T);
    } catch {
      return fallback;
    }
  }

  set<T>(key: string, value: T): void {
    if (!this.isBrowser) {
      return;
    }
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
      /* storage full or unavailable — ignore in this UI context */
    }
  }

  remove(key: string): void {
    if (!this.isBrowser) {
      return;
    }
    localStorage.removeItem(key);
  }
}
