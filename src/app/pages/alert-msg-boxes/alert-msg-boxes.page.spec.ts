import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { AlertMsgBoxesPage } from './alert-msg-boxes.page';

describe('AlertMsgBoxesPage', () => {
  let component: AlertMsgBoxesPage;
  let fixture: ComponentFixture<AlertMsgBoxesPage>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AlertMsgBoxesPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(AlertMsgBoxesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
