import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditDonComponent } from './edit-don.component';

describe('EditDonComponent', () => {
  let component: EditDonComponent;
  let fixture: ComponentFixture<EditDonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditDonComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EditDonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
