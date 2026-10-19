import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ColumnsGrainyGradientsComponent } from './columns-grainy-gradients.component';

describe('ColumnsGrainyGradientsComponent', () => {
  let component: ColumnsGrainyGradientsComponent;
  let fixture: ComponentFixture<ColumnsGrainyGradientsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ColumnsGrainyGradientsComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ColumnsGrainyGradientsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
