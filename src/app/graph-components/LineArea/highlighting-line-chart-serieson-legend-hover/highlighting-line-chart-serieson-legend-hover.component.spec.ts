import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { HighlightingLineChartSeriesonLegendHoverComponent } from './highlighting-line-chart-serieson-legend-hover.component';

describe('HighlightingLineChartSeriesonLegendHoverComponent', () => {
  let component: HighlightingLineChartSeriesonLegendHoverComponent;
  let fixture: ComponentFixture<HighlightingLineChartSeriesonLegendHoverComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ HighlightingLineChartSeriesonLegendHoverComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(HighlightingLineChartSeriesonLegendHoverComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
