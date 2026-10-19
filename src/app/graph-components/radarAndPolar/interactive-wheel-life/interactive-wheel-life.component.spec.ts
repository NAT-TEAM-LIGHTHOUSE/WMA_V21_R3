import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { InteractiveWheelLifeComponent } from './interactive-wheel-life.component';

describe('InteractiveWheelLifeComponent', () => {
  let component: InteractiveWheelLifeComponent;
  let fixture: ComponentFixture<InteractiveWheelLifeComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ InteractiveWheelLifeComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(InteractiveWheelLifeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
