import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { StockChartVolumeProfileComponent } from './stock-chart-volume-profile.component';

describe('StockChartVolumeProfileComponent', () => {
  let component: StockChartVolumeProfileComponent;
  let fixture: ComponentFixture<StockChartVolumeProfileComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ StockChartVolumeProfileComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(StockChartVolumeProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
