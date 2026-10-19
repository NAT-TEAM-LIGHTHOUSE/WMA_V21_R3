import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { StackedWaterfallChartComponent } from './stacked-waterfall-chart.component';

describe('StackedWaterfallChartComponent', () => {
  let component: StackedWaterfallChartComponent;
  let fixture: ComponentFixture<StackedWaterfallChartComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ StackedWaterfallChartComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(StackedWaterfallChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
