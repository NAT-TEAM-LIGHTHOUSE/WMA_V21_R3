import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular/standalone';
import { SuperPage } from './super.page';
import { MultiLevelTabPage } from '../multi-level-tab/multi-level-tab.page';
import { RouterModule, Routes } from '@angular/router';
import { DevFrameItemListPage } from '../dev-frame-item-list/dev-frame-item-list.page';
import { DevObjectMastEditorPage } from '../dev-object-mast-editor/dev-object-mast-editor.page';
import { DevFrameMastEditorPage } from '../dev-frame-mast-editor/dev-frame-mast-editor.page';
import { DevImageIconMastEditorPage } from '../dev-image-icon-mast-editor/dev-image-icon-mast-editor.page';
import { ParentMenuPage } from '../parent-menu/parent-menu.page';
import { DownloadPopoverComponent } from 'src/app/components/frames/download-popover/download-popover.component';
import { AlertMsgBoxesPage } from '../alert-msg-boxes/alert-msg-boxes.page';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { GlobalComponentsModule } from 'src/app/global-components.module';
import { TreeCallpagePage } from '../tree-callpage/tree-callpage.page';
import { Geolocation } from '@ionic-native/geolocation/ngx';
// import { UsersettingPage } from '../usersetting_old/usersetting.page';




const routes: Routes = [
  {path: '',
  component: SuperPage},
  // {path:'entry-list', component:EntryListPage},
  {path:'app-multi-level-tab', component:MultiLevelTabPage},

];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    DragDropModule,
    GlobalComponentsModule,
    // RouterModule.forChild(routes),
  ],
  declarations: [SuperPage,],
  // entryComponents: [SuperPage,MultiLevelTabPage, DevFrameItemListPage, DevObjectMastEditorPage,TreeCallpagePage,UsersettingPage,
  //    DevFrameMastEditorPage, DevImageIconMastEditorPage,ParentMenuPage,AlertMsgBoxesPage,DownloadPopoverComponent],
     exports: [SuperPage],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ],
  providers:[Geolocation]
})
export class SuperPageModule {}
