import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatOptionModule } from '@angular/material/core';
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogClose, MatDialogContent, MatDialogRef, MatDialogTitle } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { DestinataireService } from '../../services/destinataire.service';
import { DonationService } from '../../services/donation.service';
import { UserService } from '../../services/user.service';
import Destinataire from '../../utils/types/destinataire';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-edit-don',
  standalone: true,
  imports: [CommonModule,
    FormsModule,
    MatButtonModule,
    MatDialogActions,
    MatDialogClose,
    MatDialogContent,
    MatDialogTitle,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    ReactiveFormsModule,
    MatSelectModule,
    MatOptionModule,
    MatSnackBarModule],
  templateUrl: './edit-don.component.html',
  styleUrl: './edit-don.component.scss'
})
export class EditDonComponent {

  editForm !: FormGroup
  dirtyInput: boolean = false
  montantsPresets: number[] = [70, 140, 210, 280, 350, 420, 490, 560, 630, 700, 770, 840, 910];

  userId !: any
  destinataires !: Destinataire[]
  editedDonation !: any

  constructor(
    public dialogRef: MatDialogRef<EditDonComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, private _destinataireService: DestinataireService, private _donationService: DonationService, private _userService: UserService, private _fb: FormBuilder, private _snackbar: MatSnackBar) {


    this.userId = this._userService.getProfile()
    this._destinataireService.getDestinataires().subscribe({
      next: (destinataire) => {
        // Faire quelque chose avec les destinataire
        if (destinataire && destinataire.length > 0) {
          this.destinataires = destinataire
        }

      },
      error: (error) => {
        console.error('Erreur lors de la récupération des donations :', error);
        // Gérer l'erreur ici
      }
    });

    this.editForm = this._fb.group({
      destinataire: [''],
      amount: [this.data.don.amount, Validators.required],
    })

  }

  onSubmit() {

    let form = this.editForm.value
    const donId = this.data.don.id


    if (this.editForm.valid) {
      console.log("don modifié et id du don", form, donId);
      this._donationService.updateDonation(donId, form).subscribe((editedDon) => {
        console.log("don edité", editedDon);
      })

      this._snackbar.open("Don bien modifié", "OK")
    }
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

}
