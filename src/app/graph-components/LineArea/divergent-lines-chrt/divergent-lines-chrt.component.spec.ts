import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { DivergentLinesChrtComponent } from './divergent-lines-chrt.component';

describe('DivergentLinesChrtComponent', () => {
  let component: DivergentLinesChrtComponent;
  let fixture: ComponentFixture<DivergentLinesChrtComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ DivergentLinesChrtComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(DivergentLinesChrtComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
