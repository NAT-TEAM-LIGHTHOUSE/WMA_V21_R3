import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SuperParentPage } from './super-parent.page';

describe('SuperParentPage', () => {
  let component: SuperParentPage;
  let fixture: ComponentFixture<SuperParentPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(SuperParentPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
