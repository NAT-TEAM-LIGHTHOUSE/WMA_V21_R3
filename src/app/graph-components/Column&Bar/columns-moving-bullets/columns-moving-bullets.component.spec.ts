import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ColumnsMovingBulletsComponent } from './columns-moving-bullets.component';

describe('ColumnsMovingBulletsComponent', () => {
  let component: ColumnsMovingBulletsComponent;
  let fixture: ComponentFixture<ColumnsMovingBulletsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ColumnsMovingBulletsComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ColumnsMovingBulletsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
