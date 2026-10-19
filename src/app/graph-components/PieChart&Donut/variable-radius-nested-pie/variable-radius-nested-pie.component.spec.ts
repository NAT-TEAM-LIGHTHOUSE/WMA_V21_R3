import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { VariableRadiusNestedPieComponent } from './variable-radius-nested-pie.component';

describe('VariableRadiusNestedPieComponent', () => {
  let component: VariableRadiusNestedPieComponent;
  let fixture: ComponentFixture<VariableRadiusNestedPieComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ VariableRadiusNestedPieComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(VariableRadiusNestedPieComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
