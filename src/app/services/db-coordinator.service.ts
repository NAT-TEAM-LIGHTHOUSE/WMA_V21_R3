import { isPlatformBrowser, isPlatformServer } from '@angular/common';
import { Inject, Injectable, NgZone, OnDestroy, PLATFORM_ID } from '@angular/core';

interface Msg {
  type: 'check' | 'reply';
  dbName: string;
  from: string;
}

@Injectable({ providedIn: 'root' })
export class DbCoordinatorService implements OnDestroy {
  private channel = new BroadcastChannel('pouchdb_coord');
  private tabId = Math.random().toString(36).slice(2);
  private openDbs = new Set<string>();

  dbId: any;

  constructor(private zone: NgZone, @Inject(PLATFORM_ID) private platformId: Object,) {
    if (!isPlatformBrowser(this.platformId)) return;
    this.dbId = sessionStorage.getItem('dbId');
    this.dbId = '_pouch_' + this.dbId;
    this.channel.onmessage = (ev) => {
      this.zone.run(() => this.handleMessage(ev.data as Msg));
    };
  }

  /** Mark a DB as open in this tab */
  registerDb(dbName: string) {
    if (isPlatformServer(this.platformId)) return;

    this.dbId = dbName;
    this.openDbs.add(dbName);
  }

  /** Remove when closed manually */
  unregisterDb(dbName: string) {
    this.openDbs.delete(dbName);
  }

  /** Ask all other tabs if they have this DB */
  async isAlive(dbName: string, timeoutMs = 50000): Promise<boolean> {
    return new Promise((resolve) => {
      let answered = false;

      const correlationId = dbName + ':' + Date.now();
      const handler = (ev: MessageEvent) => {
        const msg = ev.data as Msg;
        if (msg.type === 'reply' && msg.dbName === dbName) {
          answered = true;
          cleanup();
          resolve(true);
        }
      };

      const cleanup = () => {
        clearTimeout(timer);
        this.channel.removeEventListener('message', handler);
      };

      this.channel.addEventListener('message', handler);

      this.channel.postMessage({ type: 'check', dbName, from: this.tabId });

      const timer = setTimeout(() => {
        if (!answered) {
          cleanup();
          resolve(false);
        }
      }, timeoutMs);
    });
  }

  /** Check all IndexedDB databases, and delete ones that are not alive */
  async cleanupOrphans() {
     if (isPlatformServer(this.platformId)) return;
    const dbs = await window.indexedDB.databases(); // gives array of {name, version}
     for (const db of dbs) {
      const name = db.name || '';
      // this.dbId = await window.sessionStorage.getItem('dbId');
      if (this.dbId == name) continue;
      if (!name.startsWith('_pouch_')) continue; // filter to pouchdb names

      const alive = await this.isAlive(name);
      if (!alive) {
        console.log('Deleting orphan DB:', name);

        await this.deleteDb(name);
      }
    }
  }

  /** Delete a DB by name */
  private deleteDb(name: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const req = indexedDB.deleteDatabase(name);
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
      req.onblocked = () => reject(new Error('Delete blocked'));
    });
  }

  private handleMessage(msg: Msg) {
    if (msg.from === this.tabId) return;
    if (msg.type === 'check' && this.dbId == msg.dbName) {
      this.channel.postMessage({ type: 'reply', dbName: msg.dbName, from: this.tabId });
    }
  }

  ngOnDestroy(): void {
    this.channel.close();
  }
}
