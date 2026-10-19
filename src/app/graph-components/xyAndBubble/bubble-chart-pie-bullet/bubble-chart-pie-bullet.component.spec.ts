import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { BubbleChartPieBulletComponent } from './bubble-chart-pie-bullet.component';

describe('BubbleChartPieBulletComponent', () => {
  let component: BubbleChartPieBulletComponent;
  let fixture: ComponentFixture<BubbleChartPieBulletComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ BubbleChartPieBulletComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(BubbleChartPieBulletComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
