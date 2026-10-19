import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { EmailComposer } from '@awesome-cordova-plugins/email-composer/ngx';
import { applyLoggingDecorator } from 'src/app/services/decorator-application';
import { GlobalObjectsService } from 'src/app/services/global-objects.service';
import { STANDALONE_IMPORTS } from 'src/app/shared_modules/ionic.imports';

@Component({
standalone : true,
imports : [STANDALONE_IMPORTS],
  selector: 'app-email-input',
  templateUrl: './email-input.component.html',
  styleUrls: ['./email-input.component.scss'],
})
export class EmailInputComponent implements OnInit {
  @Input() emailinput: any;
  @Output() emitOnChange: EventEmitter<any> = new EventEmitter<any>();
  current_page_parameter: any = {};
  constructor(private emailComposer: EmailComposer, private globalObjects: GlobalObjectsService) {
    if(this.globalObjects.itemFlag){
      return applyLoggingDecorator(this,"email-input")
    }
   }

  ngOnInit() {
    var str = this.emailinput.position;
    if(str != null){
      var style = str.split("~");
    }
   
    this.current_page_parameter = this.globalObjects.current_page_parameter;
    if (this.emailinput.item_sub_type == 'EMAIL_COMPOSER') {
      this.emailinput.value = this.emailinput.item_default_value ? this.emailinput.item_default_value : this.emailinput.value;
    }
  }


  onChange(onChange) {
    if(this.emailinput.msgError){
      this.emailinput.msgError = "";
    }
      this.emitOnChange.emit(this.emailinput)
  }

  cleardata() {
    this.emailinput.value= "";
  }

  emailcomposer(emailinput) {
    let email = {
      to: emailinput,
      cc: [],
      bcc: [],
      attachments: [],
      isHtml: true
    }
    this.emailComposer.open(email);
  }

}
