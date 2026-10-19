import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { YesAndNoGuageComponent } from './yes-and-no-guage.component';

describe('YesAndNoGuageComponent', () => {
  let component: YesAndNoGuageComponent;
  let fixture: ComponentFixture<YesAndNoGuageComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ YesAndNoGuageComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(YesAndNoGuageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
