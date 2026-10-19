import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { AnimatedXyBubbleTimelineComponent } from './animated-xy-bubble-timeline.component';

describe('AnimatedXyBubbleTimelineComponent', () => {
  let component: AnimatedXyBubbleTimelineComponent;
  let fixture: ComponentFixture<AnimatedXyBubbleTimelineComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AnimatedXyBubbleTimelineComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(AnimatedXyBubbleTimelineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
