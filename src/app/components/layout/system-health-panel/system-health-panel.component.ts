import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular/standalone';
import {
  ServerSystemDetails,
  SystemHealth,
  SystemHealthSnapshot,
} from 'src/app/services/system-health';
import { GlobalObjectsService } from 'src/app/services/global-objects.service';
import { STANDALONE_IMPORTS } from 'src/app/shared_modules/ionic.imports';

interface NetworkTransferResult {
  bytes: number;
  seconds: number;
  mbps: number;
}

interface NetworkTestResult {
  pingMs: number;
  download: NetworkTransferResult;
  upload: NetworkTransferResult;
}

// Add above @Component

interface PcPerformanceDetails {
  cpuName: string | null;
  gpuName: string | null;
  osName: string | null;
  architecture: string | null;
  cpuUsagePercent: number | null;
  hostname: string | null;
  ipAddress: string | null;
  printers: string[];
  ramUsedBytes: number | null;
  ramTotalBytes: number | null;
  ramFreeBytes: number | null;
  diskUsagePercent: number | null;
  uptimeMs: number | null;
  uptime: string | null;
}
@Component({
  standalone: true,
  selector: 'app-system-health-panel',
  templateUrl: './system-health-panel.component.html',
  styleUrls: ['./system-health-panel.component.scss'],
  imports: [STANDALONE_IMPORTS],
})

export class SystemHealthPanelComponent implements OnInit {
  private readonly networkTestConfig = {
    pingUrl: 'https://speed.cloudflare.com/__down?bytes=0',
    downloadUrl: 'https://speed.cloudflare.com/__down?bytes=50000000',
    uploadUrl: 'https://speed.cloudflare.com/__up',
    timeoutMs: 15000,
    testDurationSec: 8,
    uploadChunkBytes: 256 * 1024,
  };

  snapshot: SystemHealthSnapshot | null = null;
  networkTest: NetworkTestResult | null = null;
  serverDetailsExpanded = false;
  loading = true;
  errorMessage = '';
  networkErrorMessage = '';

  constructor(
    private modalController: ModalController,
    private systemHealth: SystemHealth,
    private globalObjects: GlobalObjectsService
  ) {}

  ngOnInit(): void {
    void this.refresh();
  }

  async refresh(): Promise<void> {
    this.loading = true;
    this.errorMessage = '';
    this.networkErrorMessage = '';
    this.networkTest = null;
    try {
      const [snapshotResult, networkResult, systemDetailsResult] = await Promise.allSettled([
        this.systemHealth.getSnapshot(this.globalObjects.getLocallData('scopeUrl')),
        this.runNetworkTest(),
        this.systemHealth.getSystemDetails(),
      ]);

      if (snapshotResult.status === 'fulfilled') {
        this.snapshot = snapshotResult.value;
      } else {
        throw snapshotResult.reason;
      }

      if (networkResult.status === 'fulfilled') {
        this.networkTest = networkResult.value;
      } else {
        console.error('Unable to complete network performance tests.', networkResult.reason);
        this.networkErrorMessage = 'Network tests could not be completed.';
      }

      if (systemDetailsResult.status === 'rejected') {
        console.error('Unable to retrieve server system details.', systemDetailsResult.reason);
      } else {
        this.applySystemDetails(systemDetailsResult.value);
      }
    } catch (error) {
      console.error('Unable to load system health information.', error);
      this.errorMessage = 'System health information could not be loaded.';
    } finally {
      this.loading = false;
    }
  }

  async refreshSystemInformation(): Promise<void> {
    this.loading = true;
    this.errorMessage = '';
    try {
      const [snapshotResult, systemDetailsResult] = await Promise.allSettled([
        this.systemHealth.getSnapshot(this.globalObjects.getLocallData('scopeUrl')),
        this.systemHealth.getSystemDetails(),
      ]);

      if (snapshotResult.status === 'rejected') {
        throw snapshotResult.reason;
      }
      this.snapshot = snapshotResult.value;

      if (systemDetailsResult.status === 'rejected') {
        console.error('Unable to retrieve server system details.', systemDetailsResult.reason);
      } else {
        this.applySystemDetails(systemDetailsResult.value);
      }
    } catch (error) {
      console.error('Unable to refresh system information.', error);
      this.errorMessage = 'System health information could not be refreshed.';
    } finally {
      this.loading = false;
    }
  }

  private applySystemDetails(details: ServerSystemDetails): void {
    this.pcDetails = {
      ...this.pcDetails,
      gpuName: details.gpu,
      osName: details.osName,
      cpuUsagePercent: details.cpuUsagePercent,
      diskUsagePercent: details.diskUsagePercent,
      hostname: details.hostname,
      ipAddress: details.ipAddress,
      printers: details.printers,
      ramTotalBytes: details.totalRamMb == null ? null : details.totalRamMb * 1024 ** 2,
      ramUsedBytes: details.usedRamMb == null ? null : details.usedRamMb * 1024 ** 2,
      ramFreeBytes: details.freeRamMb == null ? null : details.freeRamMb * 1024 ** 2,
      uptime: details.uptime,
    };
  }

  private async fetchWithTimeout(url: string, options: RequestInit = {}): Promise<Response> {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), this.networkTestConfig.timeoutMs);
    try {
      return await fetch(url, { ...options, signal: controller.signal });
    } finally {
      clearTimeout(timer);
    }
  }

  private async pingTest(): Promise<number> {
    const start = performance.now();
    const response = await this.fetchWithTimeout(this.networkTestConfig.pingUrl);
    if (!response.ok) {
      throw new Error(`Ping test failed with status ${response.status}.`);
    }
    await response.arrayBuffer();
    return performance.now() - start;
  }

  private async downloadTest(): Promise<NetworkTransferResult> {
    const response = await this.fetchWithTimeout(this.networkTestConfig.downloadUrl);
    if (!response.ok || !response.body) {
      throw new Error(`Download test failed with status ${response.status}.`);
    }

    const reader = response.body.getReader();
    let bytes = 0;
    const start = performance.now();
    try {
      while ((performance.now() - start) / 1000 < this.networkTestConfig.testDurationSec) {
        const { done, value } = await reader.read();
        if (done) {
          break;
        }
        bytes += value.byteLength;
      }
    } finally {
      await reader.cancel();
    }

    const seconds = (performance.now() - start) / 1000;
    return { bytes, seconds, mbps: this.toMbps(bytes, seconds) };
  }

private async uploadTest(): Promise<NetworkTransferResult> {
  const chunk = new Uint8Array(this.networkTestConfig.uploadChunkBytes);
  const start = performance.now();

  const response = await this.fetchWithTimeout(
    this.networkTestConfig.uploadUrl,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/octet-stream',
      },
      body: chunk,
    }
  );

  if (!response.ok) {
    throw new Error(`Upload test failed: ${response.status}`);
  }

  await response.arrayBuffer();

  const seconds = (performance.now() - start) / 1000;

  return {
    bytes: chunk.byteLength,
    seconds,
    mbps: this.toMbps(chunk.byteLength, seconds),
  };
}

  private async runNetworkTest(): Promise<NetworkTestResult> {
    const [pingMs, download, upload] = await Promise.all([
      this.pingTest(),
      this.downloadTest(),
      this.uploadTest(),
    ]);
    return { pingMs, download, upload };
  }

  private toMbps(bytes: number, seconds: number): number {
    return seconds > 0 ? (bytes * 8) / seconds / 1_000_000 : 0;
  }

  get internetStatus(): string {
    const downloadMbps = this.networkTest?.download.mbps;
    if (downloadMbps == null) {
      return 'Unavailable';
    }
    return downloadMbps > 50 ? 'Excellent' : downloadMbps > 10 ? 'Good' : 'Poor';
  }

  get internetStatusClass(): string {
    return this.internetStatus === 'Excellent' || this.internetStatus === 'Good'
      ? 'status-good'
      : this.internetStatus === 'Poor'
        ? 'status-poor'
        : '';
  }

  close(): void {
    void this.modalController.dismiss();
  }

  openServerDetails(): void {
    this.serverDetailsExpanded = !this.serverDetailsExpanded;
  }

  formatBytes(bytes: number | null): string {
    if (bytes == null || !Number.isFinite(bytes)) {
      return 'Unavailable';
    }
    if (bytes < 1024 ** 3) {
      return `${(bytes / 1024 ** 2).toFixed(0)} MB`;
    }
    return `${(bytes / 1024 ** 3).toFixed(1)} GB`;
  }

  formatDuration(milliseconds: number): string {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const days = Math.floor(totalSeconds / 86400);
    const hours = Math.floor((totalSeconds % 86400) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    return days > 0
      ? `${days}d ${hours}h ${minutes}m`
      : hours > 0
        ? `${hours}h ${minutes}m`
        : `${minutes}m ${totalSeconds % 60}s`;
  }

  get memoryUsagePercent(): number | null {
    const snapshot = this.snapshot;
    if (!snapshot) {
      return null;
    }
    const { appMemoryUsedBytes, appMemoryLimitBytes } = snapshot;
    if (!appMemoryUsedBytes || !appMemoryLimitBytes) {
      return null;
    }
    return Math.min(100, Math.round((appMemoryUsedBytes / appMemoryLimitBytes) * 100));
  }

  get storageUsagePercent(): number | null {
    const snapshot = this.snapshot;
    if (!snapshot) {
      return null;
    }
    const { storageUsedBytes, storageQuotaBytes } = snapshot;
    if (storageUsedBytes == null || !storageQuotaBytes) {
      return null;
    }
    return Math.min(100, Math.round((storageUsedBytes / storageQuotaBytes) * 100));
  }



  // Add these properties inside SystemHealthPanelComponent.

pcDetails: PcPerformanceDetails = {
  cpuName: null,
  gpuName: null,
  osName: null,
  architecture: null,
  cpuUsagePercent: null,
  hostname: null,
  ipAddress: null,
  printers: [],
  ramUsedBytes: null,
  ramTotalBytes: null,
  ramFreeBytes: null,
  diskUsagePercent: null,
  uptimeMs: null,
  uptime: null,
};

// Replace these values with actual measurements returned by your API.
get cpuPercent(): number | null {
  return this.pcDetails.cpuUsagePercent;
}

get ramPercent(): number | null {
  const { ramUsedBytes, ramTotalBytes } = this.pcDetails;

  if (
    ramUsedBytes == null ||
    ramTotalBytes == null ||
    ramTotalBytes <= 0
  ) {
    return null;
  }

  return Math.min(
    100,
    Math.round((ramUsedBytes / ramTotalBytes) * 100)
  );
}

get diskPercent(): number | null {
  return this.pcDetails.diskUsagePercent;
}

get ramLabel(): string {
  const { ramUsedBytes, ramTotalBytes } = this.pcDetails;

  if (ramUsedBytes == null || ramTotalBytes == null) {
    return 'Unavailable';
  }

  return `${this.formatBytes(ramUsedBytes)} / ${this.formatBytes(ramTotalBytes)}`;
}

get uptimeLabel(): string {
  return this.pcDetails.uptime
    ?? (this.pcDetails.uptimeMs == null
      ? 'Unavailable'
      : this.formatDuration(this.pcDetails.uptimeMs));
}

get cpuLabel(): string {
  return this.pcDetails.cpuName
    ?? (this.snapshot?.cpuThreads != null
      ? `${this.snapshot.cpuThreads} logical threads`
      : 'Unavailable');
}

get cpuUsageLabel(): string {
  return this.pcDetails.cpuUsagePercent == null
    ? 'Unavailable'
    : `${this.pcDetails.cpuUsagePercent.toFixed(2)}%`;
}

get gpuLabel(): string {
  return this.pcDetails.gpuName ?? 'Unavailable';
}

get osLabel(): string {
  return [
    this.pcDetails.osName ?? this.snapshot?.operatingSystem,
    this.pcDetails.architecture,
  ].filter(Boolean).join(' ') || 'Unavailable';
}
}
