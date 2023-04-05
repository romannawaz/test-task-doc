import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InsertContentComponent } from './insert-content.component';

describe('InsertContentComponent', () => {
  let component: InsertContentComponent;
  let fixture: ComponentFixture<InsertContentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InsertContentComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InsertContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
