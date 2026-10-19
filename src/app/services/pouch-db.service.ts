import { HttpClient } from '@angular/common/http';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { isPlatformServer } from '@angular/common';

import { applyLoggingDecorator } from './decorator-application';
import { GlobalObjectsService } from './global-objects.service';
import { DbCoordinatorService } from './db-coordinator.service';

@Injectable({
  providedIn: 'root'
})
export class PouchDBService {

  private _db: any;
  private _jsonData: any;
  allData: any;
  dbId: any;

  private PouchDB: any;              // ✅ dynamic loader
  private isReady = false;           // ✅ prevent multiple init
  private changesListener: any;      // ✅ prevent memory leak

  constructor(
    public http: HttpClient,
    private globalObjects: GlobalObjectsService,
    private dbCor: DbCoordinatorService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    if (this.globalObjects.serviceFlag) {
      return applyLoggingDecorator(this, "pouch-db-service");
    }
  }

  // ✅ INIT DB (SSR SAFE)
  async initDB() {

    if (isPlatformServer(this.platformId)) return;
    if (this.isReady) return;

    if (!this.PouchDB) {
      this.PouchDB = (await import('pouchdb-browser')).default;
    }

    let id = this.globalObjects.getLocallData('dbId');

    if (!id) {
      id = new Date().getTime();
      this.globalObjects.setDataLocally('dbId', id);
    }

    let name = `lhsV7DB${id}`;
    this.dbId = name;

    this._db = new this.PouchDB(name, { location: 'default' });

    this.dbCor.registerDb('_pouch_' + name);

    this.removeOldDb();

    this.isReady = true;
  }

  // ✅ SAFE INDEXEDDB CHECK
  removeOldDb() {
    if (typeof indexedDB !== 'undefined') {
      indexedDB.databases().then(res => {
        if (res) {
          for (let d of res) {
            if (d.name?.includes('lhsErpDB') && d.name !== '_pouch_lhsErpDB') {
              this.deleteDb(d.name);
            }
          }
        }
      });
    }
  }

  async listPouchDatabases(): Promise<any[]> {
    if (typeof indexedDB !== 'undefined') {
      return indexedDB.databases();
    }
    return [];
  }

  deleteDb(name) {
    if (typeof indexedDB !== 'undefined') {
      indexedDB.deleteDatabase(name);
    }
  }

  // ✅ FIXED
  async checkDbExists(dbName: string): Promise<boolean> {
    if (!this.PouchDB) {
      this.PouchDB = (await import('pouchdb-browser')).default;
    }

    const db = new this.PouchDB(dbName);
    try {
      const info = await db.info();
      return info.doc_count >= 0;
    } catch {
      return false;
    }
  }

  deleteDataBase() {
    let id = this.globalObjects.getLocallData('dbId');
    let name = `_pouch_lhsV7DB${id}`;

    indexedDB.deleteDatabase(name);
    // return new Promise((resolve, reject) => {
    // this.PouchDB(name).destroy().then(() => {
    //   this._db = null;
    //   this.isReady = false;
    //   console.log("database deleted");
    //   // resolve("done");
    // });
    // })
  }

  destroyDataBase() {
    let id = this.globalObjects.getLocallData('dbId');
    let name = `_pouch_lhsV7DB${id}`;

    this.PouchDB(name).destroy().then(async () => {
      this._db = null;
      this.isReady = false;
      await this.initDB();
    });
  }

  addJSON(json) {
    return this._db.post(json);
  }

  async updateJSON(json) {
    return await this._db.put(json).catch(() => { });
  }

  deleteJSON(json): Promise<any> {
    if (json._id) {
      return this._db.remove(json._id, json._rev);
    } else {
      return this._db.remove(json.id, json.value.rev);
    }
  }

  getObject(id) {
    return new Promise((resolve) => {

      if (!id) {
        resolve({ resStatus: "noData" });
        return;
      }

      if (!this._db) {
        resolve({ resStatus: "noData" });
        return;
      }

      this._db.get(id).then(doc => {
        resolve({
          resStatus: "Success",
          resData: doc
        });
      }).catch(() => {
        resolve({ resStatus: "noData" });
      });
    });
  }

  // ✅ MEMORY LEAK FIX
  getAll() {
    if (!this._jsonData) {
      return this._db.allDocs({ include_docs: true })
        .then(docs => {

          this._jsonData = docs.rows.map(row => {
            row.doc.Date = new Date(row.doc.Date);
            return row.doc;
          });

          if (!this.changesListener) {
            this.changesListener = this._db.changes({
              live: true,
              since: 'now',
              include_docs: true
            }).on('change', this.onDatabaseChange);
          }

          return this._jsonData;
        });
    } else {
      return Promise.resolve(this._jsonData);
    }
  }

  private onDatabaseChange = (change) => {
    var index = this.findIndex(this._jsonData, change.id);
    var localData = this._jsonData[index];

    if (change.deleted) {
      if (localData) {
        this._jsonData.splice(index, 1);
      }
    } else {
      change.doc.Date = new Date(change.doc.Date);

      if (localData && localData._id === change.id) {
        this._jsonData[index] = change.doc;
      } else {
        this._jsonData.splice(index, 0, change.doc);
      }
    }
  }

  private findIndex(array, id) {
    var low = 0, high = array.length, mid;
    while (low < high) {
      mid = (low + high) >>> 1;
      array[mid]._id < id ? low = mid + 1 : high = mid;
    }
    return low;
  }

  public put(id: string, document: any) {
    document._id = id;

    return new Promise((resolve, reject) => {
      this._db.get(id).then(res => {
        document._rev = res._rev;
        this._db.put(document);
        resolve(document);
      }).catch(error => {
        if (error.status == "404") {
          this._db.put(document);
          resolve(document);
        } else {
          reject(error);
        }
      });
    });
  }

  public putData(id: string) {
    this._db.get(id).then(doc => {
      return this._db.put({
        _id: id,
        _rev: doc._rev
      });
    });
  }

  deleteObject(id) {

    return new Promise((resolve, reject) => {
      try {
        this._db.allDocs({ include_docs: true }).then(docs => {
          docs.rows.forEach(row => {
            if (row.doc._id?.includes(id)) {
              this._db.remove(row.doc._id, row.doc._rev);
             
            }
             resolve("done");
          });
        });
      } catch {
        reject();
        alert("Error in deleting object " + id);
      }
    });

  }

  getAllDocs() {
    return this._db?.allDocs({
      include_docs: true,
      attachments: true
    });
  }
}