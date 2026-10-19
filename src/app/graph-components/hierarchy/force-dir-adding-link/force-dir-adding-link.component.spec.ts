import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ForceDirAddingLinkComponent } from './force-dir-adding-link.component';

describe('ForceDirAddingLinkComponent', () => {
  let component: ForceDirAddingLinkComponent;
  let fixture: ComponentFixture<ForceDirAddingLinkComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ForceDirAddingLinkComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ForceDirAddingLinkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
