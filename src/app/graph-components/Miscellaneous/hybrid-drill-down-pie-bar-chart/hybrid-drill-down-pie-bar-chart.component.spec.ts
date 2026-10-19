import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { HybridDrillDownPieBarChartComponent } from './hybrid-drill-down-pie-bar-chart.component';

describe('HybridDrillDownPieBarChartComponent', () => {
  let component: HybridDrillDownPieBarChartComponent;
  let fixture: ComponentFixture<HybridDrillDownPieBarChartComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ HybridDrillDownPieBarChartComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(HybridDrillDownPieBarChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
