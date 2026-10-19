import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FrameSelectorComponent } from './components/frame-selector/frame-selector.component';
import { FrameCanvasComponent } from './components/frames/frame-canvas/frame-canvas.component';
import { FrameOtpComponent } from './components/frames/frame-otp/frame-otp.component';
import { TreesetComponent } from './components/items/item-display/treeset/treeset.component';
// Import all components, directives, and pipes you want globally
// Example imports (add all relevant components here):
// ...add other components

@NgModule({
  imports: [
    CommonModule,
    FormsModule
    // ...add other modules if needed
  ],
  declarations: [
    FrameSelectorComponent,
    FrameCanvasComponent,
    FrameOtpComponent,
    TreesetComponent,
    // ...add other components
  ],
  exports: [
    FrameSelectorComponent,
    FrameCanvasComponent,
    FrameOtpComponent,
    TreesetComponent,
    // ...add other components
  ]
})
export class GlobalComponentsModule {}
