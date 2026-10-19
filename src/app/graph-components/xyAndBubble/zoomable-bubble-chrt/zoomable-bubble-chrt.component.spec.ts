import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ZoomableBubbleChrtComponent } from './zoomable-bubble-chrt.component';

describe('ZoomableBubbleChrtComponent', () => {
  let component: ZoomableBubbleChrtComponent;
  let fixture: ComponentFixture<ZoomableBubbleChrtComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ZoomableBubbleChrtComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ZoomableBubbleChrtComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
