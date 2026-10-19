import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { FrameDesktopClendarComponent } from './frame-desktop-clendar.component';

describe('FrameDesktopClendarComponent', () => {
  let component: FrameDesktopClendarComponent;
  let fixture: ComponentFixture<FrameDesktopClendarComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ FrameDesktopClendarComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(FrameDesktopClendarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
