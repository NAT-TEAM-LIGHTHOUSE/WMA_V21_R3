// src/app/services/system-health.ts

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

export interface SystemHealthSnapshot {
  cpuThreads: number | null;
  operatingSystem: string;
  browserName: string;
  browserVersion: string;
  userAgent: string;
  language: string;
  platform: string;
  online: boolean;
  networkOnline: boolean;
  networkType: string;
  networkRttMs: number | null;
  estimatedDownloadMbps: number | null;
  deviceMemoryGb: number | null;

  appMemoryUsedBytes: number | null;
  appMemoryLimitBytes: number | null;
  storageUsedBytes: number | null;
  storageQuotaBytes: number | null;

  sessionUptimeMs: number;
  serverHost: string;
  environment: string;
  screenResolution: string;
  viewportSize: string;
  colorDepth: number;
  timezone: string;
  cookiesEnabled: boolean;
  touchSupported: boolean;
}

export interface ServerSystemDetails {
  ipAddress: string | null;
  hostname: string | null;
  osName: string | null;
  cpuUsagePercent: number | null;
  totalRamMb: number | null;
  usedRamMb: number | null;
  freeRamMb: number | null;
  uptime: string | null;
  diskUsagePercent: number | null;
  gpu: string | null;
  printers: string[];
}

interface ExtendedNavigator extends Navigator {
  deviceMemory?: number;
  connection?: {
    effectiveType?: string;
    type?: string;
    rtt?: number;
    downlink?: number;
    saveData?: boolean;
  };
}

interface PerformanceMemory {
  usedJSHeapSize: number;
  totalJSHeapSize: number;
  jsHeapSizeLimit: number;
}

@Injectable({
  providedIn: 'root',
})
export class SystemHealth {
  private readonly sessionStart = Date.now();

  constructor(private readonly http: HttpClient) {}

  async getSystemDetails(): Promise<ServerSystemDetails> {
    const data = {
      lwsdp: {
        service_type: 'get_system_details',
        ret_res_flag: 'T',
      },
    };
    const response = await firstValueFrom(
      this.http.post<unknown>(
        'http://localhost:8151/EPA/',data
      )
    );
    const details = this.parseSystemDetails(response);
    console.log('System details:', details);
    return details;
  }

  private parseSystemDetails(response: unknown): ServerSystemDetails {
    const formattedDetails = this.findFormattedDetails(response);
    if (!formattedDetails) {
      throw new Error('System details response did not contain formatted para_value data.');
    }

    const values = new Map<string, string>();
    for (const entry of formattedDetails.split('###')) {
      const separatorIndex = entry.indexOf('#');
      if (separatorIndex > 0) {
        values.set(
          entry.slice(0, separatorIndex).trim().toLowerCase(),
          entry.slice(separatorIndex + 1).trim()
        );
      }
    }

    const parseNumber = (key: string): number | null => {
      const value = values.get(key);
      if (!value) {
        return null;
      }
      const parsed = Number.parseFloat(value.replace(/[^\d.-]/g, ''));
      return Number.isFinite(parsed) ? parsed : null;
    };

    return {
      ipAddress: values.get('ipaddress') || null,
      hostname: values.get('hostname') || null,
      osName: values.get('osname') || null,
      cpuUsagePercent: parseNumber('cpuusage'),
      totalRamMb: parseNumber('totalram'),
      usedRamMb: parseNumber('usedram'),
      freeRamMb: parseNumber('freeram'),
      uptime: values.get('uptime') || null,
      diskUsagePercent: parseNumber('diskusage'),
      gpu: values.get('gpu') || null,
      printers: (values.get('printers') || '')
        .split(',')
        .map(printer => printer.trim())
        .filter(Boolean),
    };
  }

  private findFormattedDetails(value: unknown): string | null {
    if (typeof value === 'string') {
      return value.includes('ipAddress#') && value.includes('cpuUsage#')
        ? value
        : null;
    }

    if (Array.isArray(value)) {
      for (const entry of value) {
        const found = this.findFormattedDetails(entry);
        if (found) {
          return found;
        }
      }
      return null;
    }

    if (value && typeof value === 'object') {
      for (const entry of Object.values(value)) {
        const found = this.findFormattedDetails(entry);
        if (found) {
          return found;
        }
      }
    }

    return null;
  }

  async getSnapshot(scopeUrl?: string): Promise<SystemHealthSnapshot> {
    const nav = navigator as ExtendedNavigator;

    const perf = performance as Performance & {
      memory?: PerformanceMemory;
    };

    const memory = perf.memory;
    const connection = nav.connection;

    let storageUsedBytes: number | null = null;
    let storageQuotaBytes: number | null = null;

    try {
      if (navigator.storage?.estimate) {
        const estimate = await navigator.storage.estimate();

        storageUsedBytes = estimate.usage ?? null;
        storageQuotaBytes = estimate.quota ?? null;
      }
    } catch (error) {
      console.warn('Storage estimate unavailable:', error);
    }

    const browser = this.detectBrowser(nav.userAgent);
    const operatingSystem = this.detectOS(nav.userAgent, nav.platform);

    let serverHost = 'Unavailable';
    let environment = 'Browser';

    try {
      const currentUrl = new URL(window.location.href);
      serverHost = currentUrl.hostname || 'Unavailable';

      environment =
        currentUrl.hostname === 'localhost' ||
        currentUrl.hostname === '127.0.0.1'
          ? 'Development'
          : 'Production';
    } catch {
      // Keep fallback values.
    }

    return {
      cpuThreads: nav.hardwareConcurrency ?? null,
      operatingSystem,
      browserName: browser.name,
      browserVersion: browser.version,
      userAgent: nav.userAgent || 'Unavailable',
      language: nav.language || 'Unavailable',
      platform: nav.platform || 'Unavailable',

      online: navigator.onLine,
      networkOnline: navigator.onLine,
      networkType:
        connection?.effectiveType ??
        connection?.type ??
        'Unknown',
      networkRttMs: connection?.rtt ?? null,
      estimatedDownloadMbps: connection?.downlink ?? null,
      deviceMemoryGb: nav.deviceMemory ?? null,

      appMemoryUsedBytes: memory?.usedJSHeapSize ?? null,
      appMemoryLimitBytes: memory?.jsHeapSizeLimit ?? null,
      storageUsedBytes,
      storageQuotaBytes,

      sessionUptimeMs: Date.now() - this.sessionStart,
      serverHost,
      environment,

      screenResolution:
        `${screen.width} × ${screen.height}`,
      viewportSize:
        `${window.innerWidth} × ${window.innerHeight}`,
      colorDepth: screen.colorDepth,
      timezone:
        Intl.DateTimeFormat().resolvedOptions().timeZone,
      cookiesEnabled: navigator.cookieEnabled,
      touchSupported:
        'ontouchstart' in window || navigator.maxTouchPoints > 0,
    };
  }

  private detectOS(userAgent: string, platform: string): string {
    if (/Windows/i.test(userAgent)) return 'Windows';
    if (/Android/i.test(userAgent)) return 'Android';
    if (/iPhone|iPad|iPod/i.test(userAgent)) return 'iOS';
    if (/Macintosh|Mac OS X/i.test(userAgent)) return 'macOS';
    if (/Linux/i.test(userAgent) || /Linux/i.test(platform)) {
      return 'Linux';
    }
    return 'Unknown';
  }

  private detectBrowser(
    userAgent: string
  ): { name: string; version: string } {
    const patterns: [RegExp, string][] = [
      [/Edg\/([\d.]+)/, 'Microsoft Edge'],
      [/OPR\/([\d.]+)/, 'Opera'],
      [/SamsungBrowser\/([\d.]+)/, 'Samsung Internet'],
      [/Firefox\/([\d.]+)/, 'Firefox'],
      [/Chrome\/([\d.]+)/, 'Chrome'],
      [/Version\/([\d.]+).*Safari/, 'Safari'],
    ];

    for (const [pattern, name] of patterns) {
      const match = userAgent.match(pattern);
      if (match) {
        return { name, version: match[1] };
      }
    }

    return { name: 'Unknown', version: 'Unknown' };
  }
}