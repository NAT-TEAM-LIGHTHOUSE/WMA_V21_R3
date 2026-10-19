import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AppkeyValidationNewPage } from './appkey-validation-new.page';

describe('AppkeyValidationNewPage', () => {
  let component: AppkeyValidationNewPage;
  let fixture: ComponentFixture<AppkeyValidationNewPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(AppkeyValidationNewPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
