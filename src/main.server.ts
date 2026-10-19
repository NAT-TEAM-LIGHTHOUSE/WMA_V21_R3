// Polyfill for SSR: define self if not present
if (typeof self === 'undefined') {
    (globalThis as any).self = globalThis;
}

// Ensure Angular JIT compiler is available in dev/SSR environments that expect it
import '@angular/compiler';
import { BootstrapContext, bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { config } from './app/app.config.server';

const bootstrap = (context: BootstrapContext) =>
    bootstrapApplication(AppComponent, config, context);



export default bootstrap;
