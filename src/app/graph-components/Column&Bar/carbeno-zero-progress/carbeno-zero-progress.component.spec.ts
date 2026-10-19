import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { CarbenoZeroProgressComponent } from './carbeno-zero-progress.component';

describe('CarbenoZeroProgressComponent', () => {
  let component: CarbenoZeroProgressComponent;
  let fixture: ComponentFixture<CarbenoZeroProgressComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ CarbenoZeroProgressComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(CarbenoZeroProgressComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
