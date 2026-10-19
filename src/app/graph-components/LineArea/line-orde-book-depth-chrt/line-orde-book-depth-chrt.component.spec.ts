import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { LineOrdeBookDepthChrtComponent } from './line-orde-book-depth-chrt.component';

describe('LineOrdeBookDepthChrtComponent', () => {
  let component: LineOrdeBookDepthChrtComponent;
  let fixture: ComponentFixture<LineOrdeBookDepthChrtComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ LineOrdeBookDepthChrtComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(LineOrdeBookDepthChrtComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
