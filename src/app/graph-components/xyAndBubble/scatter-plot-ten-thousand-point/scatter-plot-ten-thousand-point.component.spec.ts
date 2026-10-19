import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ScatterPlotTenThousandPointComponent } from './scatter-plot-ten-thousand-point.component';

describe('ScatterPlotTenThousandPointComponent', () => {
  let component: ScatterPlotTenThousandPointComponent;
  let fixture: ComponentFixture<ScatterPlotTenThousandPointComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ScatterPlotTenThousandPointComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ScatterPlotTenThousandPointComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
