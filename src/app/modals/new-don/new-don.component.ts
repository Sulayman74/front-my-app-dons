import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogTitle, MatDialogContent, MatDialogActions, MatDialogClose, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { DestinataireService } from '../../services/destinataire.service';
import Destinataire from '../../utils/types/destinataire';
import { CommonModule } from '@angular/common';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { DonationService } from '../../services/donation.service';
import { UserService } from '../../services/user.service';
import Donation from '../../utils/types/donation';

@Component({
  selector: 'app-new-don',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatButtonModule,
    MatDialogActions,
    MatDialogClose,
    MatDialogContent,
    MatDialogTitle,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    MatSelectModule,
    MatOptionModule,
    MatSnackBarModule
  ],
  templateUrl: './new-don.component.html',
  styleUrl: './new-don.component.scss'
})
export class NewDonComponent {

  addDonForm !: FormGroup
  dirtyInput: boolean = false
  montantsPresets: number[] = [70, 140, 210, 280, 350, 420, 490, 560, 630, 700, 770, 840, 910];

  userId !: any
  destinataires !: Destinataire[]
  constructor(
    public dialogRef: MatDialogRef<NewDonComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Donation, private _destinataireService: DestinataireService, private _donationService: DonationService, private _userService: UserService, private _fb: FormBuilder, private _snackbar: MatSnackBar) {

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

    this.addDonForm = this._fb.group({
      destinataireId: ['', Validators.required],
      amount: ['', Validators.required],
      archived: [false],
      userId: [''],


    })

    this._userService.getProfile().subscribe((response) => {
      console.log(response.id);
      this.userId = response.id

    })


  }




  onSubmit() {


    this.data = this.addDonForm.value

    if (this.addDonForm.valid) {
      this.addDonForm.value.userId = this.userId
      this._donationService.createDonation(this.data).subscribe((donation) => {
        console.log("donation from modal", donation)
        this._donationService.donationSignal.set(donation)
      })
      this._snackbar.open("Don bien effectué", "OK")
      this.dialogRef.close(this.data);
    }
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
