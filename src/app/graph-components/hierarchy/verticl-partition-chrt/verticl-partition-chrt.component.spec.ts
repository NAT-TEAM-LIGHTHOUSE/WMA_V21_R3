import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { VerticlPartitionChrtComponent } from './verticl-partition-chrt.component';

describe('VerticlPartitionChrtComponent', () => {
  let component: VerticlPartitionChrtComponent;
  let fixture: ComponentFixture<VerticlPartitionChrtComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ VerticlPartitionChrtComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(VerticlPartitionChrtComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
