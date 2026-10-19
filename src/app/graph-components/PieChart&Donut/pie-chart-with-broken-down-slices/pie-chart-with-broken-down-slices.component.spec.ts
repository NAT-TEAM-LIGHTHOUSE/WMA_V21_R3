import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { PieChartWithBrokenDownSlicesComponent } from './pie-chart-with-broken-down-slices.component';

describe('PieChartWithBrokenDownSlicesComponent', () => {
  let component: PieChartWithBrokenDownSlicesComponent;
  let fixture: ComponentFixture<PieChartWithBrokenDownSlicesComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ PieChartWithBrokenDownSlicesComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(PieChartWithBrokenDownSlicesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
