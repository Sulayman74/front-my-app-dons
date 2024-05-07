import { CommonModule } from '@angular/common';
import { Component, Inject, inject } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogClose, MatDialogContent, MatDialogModule, MatDialogRef, MatDialogTitle } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import Destinataire from '../../utils/types/destinataire';
import { UserService } from '../../services/user.service';
import { DestinataireService } from '../../services/destinataire.service';

@Component({
  selector: 'app-new-destinataire',
  standalone: true,
  imports: [
    CommonModule, MatFormFieldModule, MatInputModule, MatIconModule, ReactiveFormsModule, FormsModule, MatButtonModule, MatDialogModule, MatDialogActions,
    MatDialogClose,
    MatDialogContent,
    MatDialogTitle,
    MatSnackBarModule
  ],
  templateUrl: './new-destinataire.component.html',
  styleUrl: './new-destinataire.component.scss'
})
export class NewDestinataireComponent {

  newDestinataireForm !: FormGroup
  userId !: string
  private _destinataireService = inject(DestinataireService)
  constructor(
    public dialogRef: MatDialogRef<NewDestinataireComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Destinataire, private _fb: FormBuilder, private _snackbar: MatSnackBar, private _userService: UserService,) {

    this.newDestinataireForm = this._fb.group({
      city: [''],
      country: [''],
      street: [''],
      zipcode: [''],
      email: [''],
      firstname: ['', [Validators.required, Validators.minLength(3)]],
      lastname: ['', [Validators.required, Validators.minLength(2)]],
      isFamily: [''],
      phoneNumber: [''],
    })

    this._userService.getProfile().subscribe((response) => {
      console.log(response.id);
      this.userId = response.id

    })

  }



  onSubmit() {


    this.data = this.newDestinataireForm.value

    if (this.newDestinataireForm.valid) {
      this.newDestinataireForm.value.userId = this.userId
      this._destinataireService.createDestinataire(this.data).subscribe((destinataire) => {
        console.log("destinataire from modal", destinataire)
      })
      this._snackbar.open("Don bien effectué", "OK")
      this.dialogRef.close(this.data);
    }
  }


  onNoClick(): void {
    this.dialogRef.close();
  }

}
