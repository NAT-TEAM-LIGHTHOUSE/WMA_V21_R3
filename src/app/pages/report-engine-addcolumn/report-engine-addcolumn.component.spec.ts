import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ReportEngineAddcolumnComponent } from './report-engine-addcolumn.component';

describe('ReportEngineAddcolumnComponent', () => {
  let component: ReportEngineAddcolumnComponent;
  let fixture: ComponentFixture<ReportEngineAddcolumnComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ReportEngineAddcolumnComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ReportEngineAddcolumnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
