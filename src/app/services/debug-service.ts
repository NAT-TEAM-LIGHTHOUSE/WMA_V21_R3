import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class DebugService {
     private originalConsole = {
    log: console.log.bind(console),
    debug: console.debug.bind(console),
    info: console.info.bind(console),
    warn: console.warn.bind(console)
  };

  consoleEnabled=true
  constructor() {}

  enableConsole() {
    console.log = this.originalConsole.log;
    console.debug = this.originalConsole.debug;
    console.info = this.originalConsole.info;
    console.warn = this.originalConsole.warn;
  }

  disableConsole() {
    console.log = () => {};
    console.debug = () => {};
    console.info = () => {};
    console.warn = () => {};
  }
}
