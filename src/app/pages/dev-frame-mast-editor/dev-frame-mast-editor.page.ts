import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular/standalone';
import { format } from 'cl-sql-formatter';
import { applyLoggingDecorator } from 'src/app/services/decorator-application';
import { GlobalObjectsService } from 'src/app/services/global-objects.service';
import { STANDALONE_IMPORTS } from 'src/app/shared_modules/ionic.imports';

@Component({
standalone: true,
imports : [...STANDALONE_IMPORTS],
  selector: 'app-dev-frame-mast-editor',
  templateUrl: './dev-frame-mast-editor.page.html',
  styleUrls: ['./dev-frame-mast-editor.page.scss'],
})
export class DevFrameMastEditorPage implements OnInit {
  @Input() data: any;
  @Input() frame: any;

  constructor(private modalctrl: ModalController,private globalObjects:GlobalObjectsService) { 
    if(this.globalObjects.pagesFlag){
    return applyLoggingDecorator(this,"dev-frame-mast-editor-page")
  }}

  ngOnInit() {}
  beautify_sql_text(data) {
    this.data.sql_text = format(data, {
      language: 'plsql',
      uppercase: true,
    });
  }
  minifier_sql_text(text) {
    this.data.sql_text = text.replace(/\s{1,}/g, " ").replace(/\s{1,}\(/, "(").replace(/\s{1,}\)/, ")");
  }
  beautify_pl_sql_text(data) {
    this.data.pl_sql_text = format(data, {
      language: 'plsql',
      uppercase: true,
    });
  }

  minifier_pl_sql_text(text) {
    this.data.pl_sql_text = text.replace(/\s{1,}/g, " ").replace(/\s{1,}\(/, "(").replace(/\s{1,}\)/, ")");
  }

  closePage() {
    this.modalctrl.dismiss();
  }
}
