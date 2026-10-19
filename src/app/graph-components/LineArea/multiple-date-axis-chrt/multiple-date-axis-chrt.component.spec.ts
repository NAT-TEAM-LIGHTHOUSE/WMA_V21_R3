import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { MultipleDateAxisChrtComponent } from './multiple-date-axis-chrt.component';

describe('MultipleDateAxisChrtComponent', () => {
  let component: MultipleDateAxisChrtComponent;
  let fixture: ComponentFixture<MultipleDateAxisChrtComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ MultipleDateAxisChrtComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(MultipleDateAxisChrtComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
