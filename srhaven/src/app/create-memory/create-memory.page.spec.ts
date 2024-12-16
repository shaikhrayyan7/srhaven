import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CreateMemoryPage } from './create-memory.page';

describe('CreateMemoryPage', () => {
  let component: CreateMemoryPage;
  let fixture: ComponentFixture<CreateMemoryPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateMemoryPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
