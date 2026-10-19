import { Frame_Component_Module } from '../../shared_modules/frame-components/frame-components-module';
import { FrameSelectorComponent } from '../frame-selector/frame-selector.component';

// export const FramesModule = Frame_Component_Module;
export const FramesModule = [FrameSelectorComponent, ...Frame_Component_Module];
