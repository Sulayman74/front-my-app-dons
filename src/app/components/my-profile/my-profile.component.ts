import { Component, inject, signal } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { FooterComponent } from '../footer/footer.component';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { PasswordComponent } from '../../modals/password/password.component';
import RegisterForm from '../../utils/types/register-form';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-my-profile',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    ReactiveFormsModule,
    MatSnackBarModule,
    FooterComponent,

  ],
  templateUrl: './my-profile.component.html',
  styleUrl: './my-profile.component.scss',
})
export class MyProfileComponent {
  private _authService = inject(AuthService);
  private _userService = inject(UserService);
  myProfile!: RegisterForm;
  profilSignal = signal({});

  profileForm!: FormGroup<any>;
  userId!: string;
  updated: boolean = false;

  constructor(
    private _fb: FormBuilder,
    private _snackbar: MatSnackBar,
    private dialog: MatDialog
  ) {
    this.profileForm = this._fb.group({
      firstname: [''],
      lastname: [''],
      email: [''],
      phoneNumber: [''],
      password: [''], // Vous pouvez laisser vide car c'est un champ sensible
    });

    this._authService.testProfilSignal();
    this._userService.getProfile().subscribe({
      next: (profile) => {
        if (profile) {
          this.myProfile = profile;
          this.userId = profile.id;
          this.initializeForm();
        }
      },
      error: (error) => {
        console.error('Erreur lors de la récupération du profil :', error);
        // Gérer l'erreur ici
      },
    });
  }

  openPasswordModal(event:Event) {
    event.preventDefault()
    const dialogRef = this.dialog.open(PasswordComponent, {
      width: '400px',
      height:'380px',
      data: { userId: this.userId },
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log('The dialog was closed');
    });
  }

  initializeForm(): void {
    this.profileForm = this._fb.group({
      firstname: [this.myProfile.firstname || ''],
      lastname: [this.myProfile.lastname || ''],
      email: [this.myProfile.email || ''],
      phoneNumber: [this.myProfile.phoneNumber || ''],
      password: [null], // Vous pouvez laisser vide car c'est un champ sensible
    });
  }
  onPasswordUpdated(newPassword: any) {
    // Gérez ici les actions après la mise à jour du mot de passe
    console.log('Le mot de passe a été mis à jour avec succès :', newPassword);
  }
  

  onSubmit(): void {
    const updatedProfile = this.profileForm.value;
    const id = this.myProfile.id;

    this.profilSignal.set({
      updatedProfile,
    });

    this._userService.updateProfile(id, updatedProfile).subscribe((profile) => {
      if (profile) {
        this.updated = true;
        this._snackbar.open(
          `Votre profil a bien été mis à jour ${profile.firstname}`,
          'OK',
          {
            horizontalPosition: 'right',
            verticalPosition: 'top',
          }
        );
        setTimeout(() => {
          this.updated = false;
        }, 4000);
      }
    });
  }
}
