import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Subscription} from 'rxjs';
import { applyLoggingDecorator } from 'src/app/services/decorator-application';
import { GlobalObjectsService } from 'src/app/services/global-objects.service';
import { STANDALONE_IMPORTS } from 'src/app/shared_modules/ionic.imports';


interface Quote {
  quoteText: string;
  quoteAuthor: string;
}
@Component({
standalone : true,
imports : [...STANDALONE_IMPORTS],
  selector: 'app-frame-dashboard-footer',
  templateUrl: './frame-dashboard-footer.component.html',
  styleUrls: ['./frame-dashboard-footer.component.scss'],
})


export class FrameDashboardFooterComponent implements OnInit {
  quote: Quote | null = null;
  @Input() frame: any = {};
  @Input() wsdp: any = {};
  @Input() wscp: any = {};
  flagtoruncanvasfilter: boolean;
  @Input() wscp_send_input: any = {};
  @Input() wsdpcl: any = {};
  @Output() emitPass: EventEmitter<any> = new EventEmitter<any>();
  @Output() emitOnChange: EventEmitter<any> = new EventEmitter<any>();
  @Input() sessionObj: any = {}
  tableRows = [];
  @Input() displayPhoto: any;
  imgData: any;
  constructor(private http : HttpClient,private globalObjects:GlobalObjectsService) {
    if(this.globalObjects.frameFlag){
      return applyLoggingDecorator(this,"frame-dashboard-footer")
    }
   }
  private quoteInterval: Subscription;
  ngOnInit() {
    this.fetchQuote();
  }
  fetchQuote(): void {
    const url = 'https://api.forismatic.com/api/1.0/?method=getQuote&format=jsonp&lang=en&jsonp=JSONP_CALLBACK';

    this.http.jsonp(url, 'callback').subscribe(
      (data: any) => {
        this.quote = {
          quoteText: data.quoteText || 'No quote text available',
          quoteAuthor: data.quoteAuthor || 'Unknown'
        };
      },
      (error: any) => {
        console.error('Error fetching the quote:', error);
      }
    );
  }
}
