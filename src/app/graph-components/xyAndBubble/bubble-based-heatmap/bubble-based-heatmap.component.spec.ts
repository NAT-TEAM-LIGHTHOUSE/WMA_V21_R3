import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { BubbleBasedHeatmapComponent } from './bubble-based-heatmap.component';

describe('BubbleBasedHeatmapComponent', () => {
  let component: BubbleBasedHeatmapComponent;
  let fixture: ComponentFixture<BubbleBasedHeatmapComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ BubbleBasedHeatmapComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(BubbleBasedHeatmapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
