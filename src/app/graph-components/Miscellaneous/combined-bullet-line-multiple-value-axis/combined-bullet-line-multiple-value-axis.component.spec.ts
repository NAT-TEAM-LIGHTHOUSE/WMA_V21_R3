import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { CombinedBulletLineMultipleValueAxisComponent } from './combined-bullet-line-multiple-value-axis.component';

describe('CombinedBulletLineMultipleValueAxisComponent', () => {
  let component: CombinedBulletLineMultipleValueAxisComponent;
  let fixture: ComponentFixture<CombinedBulletLineMultipleValueAxisComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ CombinedBulletLineMultipleValueAxisComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(CombinedBulletLineMultipleValueAxisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
