import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ReportEngineTemplateSaveComponent } from './report-engine-template-save.component';

describe('ReportEngineTemplateSaveComponent', () => {
  let component: ReportEngineTemplateSaveComponent;
  let fixture: ComponentFixture<ReportEngineTemplateSaveComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ReportEngineTemplateSaveComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ReportEngineTemplateSaveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
