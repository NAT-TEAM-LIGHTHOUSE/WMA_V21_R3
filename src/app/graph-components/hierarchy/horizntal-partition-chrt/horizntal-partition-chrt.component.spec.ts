import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { HorizntalPartitionChrtComponent } from './horizntal-partition-chrt.component';

describe('HorizntalPartitionChrtComponent', () => {
  let component: HorizntalPartitionChrtComponent;
  let fixture: ComponentFixture<HorizntalPartitionChrtComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ HorizntalPartitionChrtComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(HorizntalPartitionChrtComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
