import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { StreamOrThemeRiverChartComponent } from './stream-or-theme-river-chart.component';

describe('StreamOrThemeRiverChartComponent', () => {
  let component: StreamOrThemeRiverChartComponent;
  let fixture: ComponentFixture<StreamOrThemeRiverChartComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ StreamOrThemeRiverChartComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(StreamOrThemeRiverChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
