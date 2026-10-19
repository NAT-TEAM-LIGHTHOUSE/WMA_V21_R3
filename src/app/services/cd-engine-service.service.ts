import { ChangeDetectorRef, Injectable, NgZone } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class CdEngineService {
  isRunning = true;
  public components = new Map<string, any>();

  constructor(private ngZone: NgZone) { }

  register(key: string, cd: any) {
    if (!this.isRunning || !key || !cd) return;

    const existing: any = this.components.get(key);

    if (existing) {
      // avoid duplicate same instance
      if (!existing.includes(cd)) {
        existing.push(cd);
      }

    } else {
      this.components.set(key, [cd]);
    }
  }

  unregister(key: string, cdr?: any) {
    if (!this.isRunning) return;

    if (cdr && this.components?.get(key)) {
      for (let cd of this.components.get(key)) {
        if (cd === cdr) {
          this.components.delete(key);
          return;
        }
      }
    } else {
      this.components.delete(key);
    }
  }

  // detect(key?: string) {
  //   if (!this.isRunning) return;
  //   this.ngZone.run(() => {
  //     if (key) {
  //       this.components.get(key)?.detectChanges();
  //     } else {
  //       this.components.forEach(cd => cd.detectChanges());
  //     }
  //   })
  // }

  detect(key?: string) {
    if (!this.isRunning) return;

    this.ngZone.run(() => {
      if (key) {
        const arr = this.components.get(key);
        arr?.forEach(cd => this.safeDetect(cd));
        return;
      }

      this.components.forEach(arr => {
        arr.forEach(cd => this.safeDetect(cd));
      });
    });
  }

  private safeDetect(cd: ChangeDetectorRef) {
    try {
      cd.detectChanges();
    } catch { }
  }

  mark(key?: string) {
    if (!this.isRunning) return;

    this.ngZone.run(() => {
      if (key) {
        const arr = this.components.get(key);
        arr?.forEach(cd => cd.markForCheck());
        return;
      }

      this.components.forEach(arr => {
        arr.forEach(cd => cd.markForCheck());
      });
    });
  }

  shiftKeysAfterDelete(frameSeqid: any, deletedRownum: number) {
    const newMap = new Map<string, any>();

    for (const [oldKey, cdr] of this.components.entries()) {
      const [leftPart, keyFrameSeqid] = oldKey.split('#');

      if (String(keyFrameSeqid) !== String(frameSeqid)) {
        newMap.set(oldKey, cdr);
        continue;
      }

      const lastUnderscoreIndex = leftPart.lastIndexOf('_');

      const itemSeqid = leftPart.substring(0, lastUnderscoreIndex);
      const keyRownum = Number(leftPart.substring(lastUnderscoreIndex + 1));

      // skip deleted row key
      if (keyRownum === deletedRownum) {
        continue;
      }

      // shift only rows after deleted row
      if (keyRownum > deletedRownum) {
        const newKey = `${itemSeqid}_${keyRownum - 1}#${keyFrameSeqid}`;
        newMap.set(newKey, cdr);
      } else {
        newMap.set(oldKey, cdr);
      }
    }

    this.components = newMap;
    console.log(this.components);
  }

  // mark(key?: string) {
  //   if (!this.isRunning) return;
  //   this.ngZone.run(() => {
  //     if (key) {
  //       this.components.get(key)?.markForCheck();
  //     } else {
  //       this.components.forEach(cd => cd.markForCheck());
  //     }
  //   })
  // }
}
