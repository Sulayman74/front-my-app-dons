import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditedDestinataireComponent } from './edited-destinataire.component';

describe('EditedDestinataireComponent', () => {
  let component: EditedDestinataireComponent;
  let fixture: ComponentFixture<EditedDestinataireComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditedDestinataireComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EditedDestinataireComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
