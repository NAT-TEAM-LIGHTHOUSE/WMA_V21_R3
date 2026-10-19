import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { DonutWithRadialGradientComponent } from './donut-with-radial-gradient.component';

describe('DonutWithRadialGradientComponent', () => {
  let component: DonutWithRadialGradientComponent;
  let fixture: ComponentFixture<DonutWithRadialGradientComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ DonutWithRadialGradientComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(DonutWithRadialGradientComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
