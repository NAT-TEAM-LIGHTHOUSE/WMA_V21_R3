import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { SunburstFlvorWheelChrtComponent } from './sunburst-flvor-wheel-chrt.component';

describe('SunburstFlvorWheelChrtComponent', () => {
  let component: SunburstFlvorWheelChrtComponent;
  let fixture: ComponentFixture<SunburstFlvorWheelChrtComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ SunburstFlvorWheelChrtComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(SunburstFlvorWheelChrtComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
