import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ChangingDataWordCloudComponent } from './changing-data-word-cloud.component';

describe('ChangingDataWordCloudComponent', () => {
  let component: ChangingDataWordCloudComponent;
  let fixture: ComponentFixture<ChangingDataWordCloudComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ChangingDataWordCloudComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ChangingDataWordCloudComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
