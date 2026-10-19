import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { LineChartAddingDataEverySecondComponent } from './line-chart-adding-data-every-second.component';

describe('LineChartAddingDataEverySecondComponent', () => {
  let component: LineChartAddingDataEverySecondComponent;
  let fixture: ComponentFixture<LineChartAddingDataEverySecondComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ LineChartAddingDataEverySecondComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(LineChartAddingDataEverySecondComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
