import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { XyChrtValueBasedLineGraphsComponent } from './xy-chrt-value-based-line-graphs.component';

describe('XyChrtValueBasedLineGraphsComponent', () => {
  let component: XyChrtValueBasedLineGraphsComponent;
  let fixture: ComponentFixture<XyChrtValueBasedLineGraphsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ XyChrtValueBasedLineGraphsComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(XyChrtValueBasedLineGraphsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
