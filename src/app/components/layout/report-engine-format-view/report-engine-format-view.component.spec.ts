import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ReportEngineFormatViewComponent } from './report-engine-format-view.component';

describe('ReportEngineFormatViewComponent', () => {
  let component: ReportEngineFormatViewComponent;
  let fixture: ComponentFixture<ReportEngineFormatViewComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ReportEngineFormatViewComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ReportEngineFormatViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
