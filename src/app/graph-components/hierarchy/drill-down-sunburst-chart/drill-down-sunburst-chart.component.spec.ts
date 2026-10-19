import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { DrillDownSunburstChartComponent } from './drill-down-sunburst-chart.component';

describe('DrillDownSunburstChartComponent', () => {
  let component: DrillDownSunburstChartComponent;
  let fixture: ComponentFixture<DrillDownSunburstChartComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ DrillDownSunburstChartComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(DrillDownSunburstChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
