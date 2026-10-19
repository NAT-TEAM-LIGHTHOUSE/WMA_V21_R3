import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { LogirithmicScaleChartComponent } from './logirithmic-scale-chart.component';

describe('LogirithmicScaleChartComponent', () => {
  let component: LogirithmicScaleChartComponent;
  let fixture: ComponentFixture<LogirithmicScaleChartComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ LogirithmicScaleChartComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(LogirithmicScaleChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
