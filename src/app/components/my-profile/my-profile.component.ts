import { Component, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { animate, style, transition, trigger } from '@angular/animations';

import { AuthService } from '../../services/auth.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CommonModule } from '@angular/common';
import { FooterComponent } from '../footer/footer.component';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import RegisterForm from '../../utils/types/register-form';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-my-profile',
  standalone: true,
  imports: [CommonModule, FormsModule, MatButtonModule, MatFormFieldModule, MatIconModule, MatInputModule, ReactiveFormsModule, MatSnackBarModule, FooterComponent],
  templateUrl: './my-profile.component.html',
  styleUrl: './my-profile.component.scss'
})
export class MyProfileComponent {

  private _authService = inject(AuthService)
  private _userService = inject(UserService)
  myProfile !: RegisterForm

  profilSignal = signal({})

  profileForm !: FormGroup<any>;

  updated: boolean = false;

  constructor(private _fb: FormBuilder, private _snackbar: MatSnackBar) {
    this.profileForm = this._fb.group({
      firstname: [''],
      lastname: [''],
      email: [''],
      phoneNumber: [''],
      password: [''] // Vous pouvez laisser vide car c'est un champ sensible
    })

    this._authService.testProfilSignal()
    this._userService.getProfile().subscribe({
      next: (profile) => {
        if (profile) {

          this.myProfile = profile
          this.initializeForm();

        }

      },
      error: (error) => {
        console.error('Erreur lors de la récupération du profil :', error);
        // Gérer l'erreur ici
      }
    })


  }


  initializeForm(): void {

    this.profileForm = this._fb.group({
      firstname: [this.myProfile.firstname || ''],
      lastname: [this.myProfile.lastname || ''],
      email: [this.myProfile.email || ''],
      phoneNumber: [this.myProfile.phoneNumber || ''],
      password: [null] // Vous pouvez laisser vide car c'est un champ sensible
    })
  }

  onSubmit(): void {

    const updatedProfile = this.profileForm.value
    const id = this.myProfile.id

    this.profilSignal.set({
      updatedProfile
    })

    this._userService.updateProfile(id, updatedProfile).subscribe((profile) => {
      if (profile) {
        this.updated = true;
        this._snackbar.open(`Votre profil a bien été mis à jour ${profile.firstname}`, 'OK', {
          horizontalPosition: "right",
          verticalPosition: "top"
        })
        setTimeout(() => {
          this.updated = false
        }, 4000);
      }
    })
  }
}

