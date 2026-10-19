import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { SemiCirclaPieChartComponent } from './semi-circla-pie-chart.component';

describe('SemiCirclaPieChartComponent', () => {
  let component: SemiCirclaPieChartComponent;
  let fixture: ComponentFixture<SemiCirclaPieChartComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ SemiCirclaPieChartComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(SemiCirclaPieChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
