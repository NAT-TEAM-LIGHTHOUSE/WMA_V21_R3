import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { LineWithCustomsBulletComponent } from './line-with-customs-bullet.component';

describe('LineWithCustomsBulletComponent', () => {
  let component: LineWithCustomsBulletComponent;
  let fixture: ComponentFixture<LineWithCustomsBulletComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ LineWithCustomsBulletComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(LineWithCustomsBulletComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
