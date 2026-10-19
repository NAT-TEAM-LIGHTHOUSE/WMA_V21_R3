import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { SingleSelectLovRefPage } from './single-select-lov-ref.page';

describe('SingleSelectLovRefPage', () => {
  let component: SingleSelectLovRefPage;
  let fixture: ComponentFixture<SingleSelectLovRefPage>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ SingleSelectLovRefPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(SingleSelectLovRefPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
