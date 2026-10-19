import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ChordDiagramAnimatedBulletsComponent } from './chord-diagram-animated-bullets.component';

describe('ChordDiagramAnimatedBulletsComponent', () => {
  let component: ChordDiagramAnimatedBulletsComponent;
  let fixture: ComponentFixture<ChordDiagramAnimatedBulletsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ChordDiagramAnimatedBulletsComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ChordDiagramAnimatedBulletsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
