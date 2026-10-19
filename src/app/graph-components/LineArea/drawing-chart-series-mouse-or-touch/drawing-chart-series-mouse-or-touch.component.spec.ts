import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { DrawingChartSeriesMouseOrTouchComponent } from './drawing-chart-series-mouse-or-touch.component';

describe('DrawingChartSeriesMouseOrTouchComponent', () => {
  let component: DrawingChartSeriesMouseOrTouchComponent;
  let fixture: ComponentFixture<DrawingChartSeriesMouseOrTouchComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ DrawingChartSeriesMouseOrTouchComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(DrawingChartSeriesMouseOrTouchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
