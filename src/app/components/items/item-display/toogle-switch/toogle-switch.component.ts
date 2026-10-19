import { Component, Input, OnInit, Output,EventEmitter, ChangeDetectorRef } from '@angular/core';
import { applyLoggingDecorator } from 'src/app/services/decorator-application';
import { GlobalObjectsService } from 'src/app/services/global-objects.service';
import { STANDALONE_IMPORTS } from 'src/app/shared_modules/ionic.imports';

@Component({
standalone : true,
  selector: 'app-toogle-switch',
  templateUrl: './toogle-switch.component.html',
  styleUrls: ['./toogle-switch.component.scss'],
   imports :[STANDALONE_IMPORTS]
})
export class ToogleSwitchComponent implements OnInit {

  @Input() toggle: any;
  @Output() emitPass: EventEmitter<any> = new EventEmitter<any>();
  toggleMode = false;
  constructor(private cdr: ChangeDetectorRef,private globalObjects:GlobalObjectsService) {
    if(this.globalObjects.itemFlag){
      return applyLoggingDecorator(this,"toggle-switch")
    }
   }

  ngOnInit() {
    if (this.toggle.value) {
      if (this.toggle.value.toUpperCase() === 'Y') {
        this.toggleMode = true;
      } else {
        this.toggle.value = 'N'
        this.toggleMode = false;
      }
    } else {
      this.toggle.value = 'N'
    }
  }

  ngAfterViewChecked() {
    if (this.toggle.display_setting_str) {
      let keys = Object.keys(this.toggle.display_setting_str);
      let b = document.getElementById(this.toggle.apps_item_seqid);
      if (b) {

        for (let k of keys) {
          if (k.toLocaleLowerCase() == 'active') {
            b.style.setProperty('--background-checked', this.toggle.display_setting_str[k]);
            b.style.setProperty('--handle-background-checked', this.toggle.display_setting_str[k]);
            // this.cdr.detectChanges();
          } else if (k.toLocaleLowerCase() == 'inactive') {
            b.style.setProperty('--background', this.toggle.display_setting_str[k]);
            b.style.setProperty('--handle-background', this.toggle.display_setting_str[k]);
            // this.cdr.detectChanges();
          } else {
            b.style.setProperty('--' + k, this.toggle.display_setting_str[k])
            // this.cdr.detectChanges();
          }
        }

      }
    }

  }


  itemClick(mode) {
    if (mode) {
      this.toggle.value = "Y";
      this.toggle.item_default_value = "";
      this.emitPass.emit(this.toggle);
    } else {
      this.toggle.value = "N";
      this.toggle.item_default_value = "";
      this.emitPass.emit(this.toggle);
    }
  }

}
