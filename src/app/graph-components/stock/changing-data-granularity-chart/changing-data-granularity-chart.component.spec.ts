import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ChangingDataGranularityChartComponent } from './changing-data-granularity-chart.component';

describe('ChangingDataGranularityChartComponent', () => {
  let component: ChangingDataGranularityChartComponent;
  let fixture: ComponentFixture<ChangingDataGranularityChartComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ChangingDataGranularityChartComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ChangingDataGranularityChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
