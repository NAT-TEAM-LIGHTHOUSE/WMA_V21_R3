import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { SingleLvlPackdCircleComponent } from './single-lvl-packd-circle.component';

describe('SingleLvlPackdCircleComponent', () => {
  let component: SingleLvlPackdCircleComponent;
  let fixture: ComponentFixture<SingleLvlPackdCircleComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ SingleLvlPackdCircleComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(SingleLvlPackdCircleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
