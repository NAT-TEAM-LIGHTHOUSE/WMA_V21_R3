import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { RotatingGlobewithCirclesComponent } from './rotating-globewith-circles.component';

describe('RotatingGlobewithCirclesComponent', () => {
  let component: RotatingGlobewithCirclesComponent;
  let fixture: ComponentFixture<RotatingGlobewithCirclesComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ RotatingGlobewithCirclesComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(RotatingGlobewithCirclesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
