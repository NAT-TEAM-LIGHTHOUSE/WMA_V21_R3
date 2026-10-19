/// <reference types="@angular/localize" />

// Polyfill for SSR: define self if not present
// if (typeof self === 'undefined') {
// 	(globalThis as any).self = globalThis;
// }
// Ensure Angular JIT compiler is available in dev/SSR environments that expect it
import '@angular/compiler';
import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { appConfig } from './app/app.config';
import { addIcons } from 'ionicons';
import * as allIcons from 'ionicons/icons';  
import '@angular/localize/init';
import { setAssetPath } from '@stencil/core';

setAssetPath(window.location.origin);

bootstrapApplication(AppComponent, appConfig);

addIcons(allIcons);

