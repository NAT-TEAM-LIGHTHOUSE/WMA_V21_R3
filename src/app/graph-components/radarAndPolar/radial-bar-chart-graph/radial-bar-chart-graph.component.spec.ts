import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { RadialBarChartGraphComponent } from './radial-bar-chart-graph.component';

describe('RadialBarChartGraphComponent', () => {
  let component: RadialBarChartGraphComponent;
  let fixture: ComponentFixture<RadialBarChartGraphComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ RadialBarChartGraphComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(RadialBarChartGraphComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
