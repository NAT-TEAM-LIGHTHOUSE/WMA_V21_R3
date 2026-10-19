import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { HundredPerStackedAreaChartComponent } from './hundred-per-stacked-area-chart.component';

describe('HundredPerStackedAreaChartComponent', () => {
  let component: HundredPerStackedAreaChartComponent;
  let fixture: ComponentFixture<HundredPerStackedAreaChartComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ HundredPerStackedAreaChartComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(HundredPerStackedAreaChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
