import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { HundredStackedColumnChartComponent } from './hundred-stacked-column-chart.component';

describe('HundredStackedColumnChartComponent', () => {
  let component: HundredStackedColumnChartComponent;
  let fixture: ComponentFixture<HundredStackedColumnChartComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ HundredStackedColumnChartComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(HundredStackedColumnChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
