import { BehaviorSubject, catchError } from 'rxjs';
import {
  ErrorStateMatcher,
  ShowOnDirtyErrorStateMatcher,
} from '@angular/material/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Router, RouterModule } from '@angular/router';

import { AuthService } from '../../../services/auth.service';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { LoadingService } from '../../../services/loading.service';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MyErrorStateMatcher } from '../../../utils/error-state-matcher';
import { NotificationService } from '../../../utils/error.service';

@Component({
  selector: 'app-sign-up',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    ReactiveFormsModule,
    MatToolbarModule,
    RouterModule,
    MatProgressBarModule,
    MatSidenavModule,
    MatSnackBarModule,
  ],
  providers: [
    { provide: ErrorStateMatcher, useClass: ShowOnDirtyErrorStateMatcher },
  ],
  templateUrl: './sign-up.component.html',
  styleUrl: './sign-up.component.scss',
})
export class SignUpComponent {
  registerForm!: FormGroup;
  strongPasswordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

  matcher = new MyErrorStateMatcher();

  inputLengthClass: string = '';
  errorMessage: string = '';

  loading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  constructor(
    private _formBuilder: FormBuilder,
    private _router: Router,
    public _loadingService: LoadingService,
    private _authService: AuthService,
    public errorService: NotificationService,
    private _snackbar: MatSnackBar
  ) {
    this.registerForm = this._formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      lastname: ['', [Validators.required, Validators.minLength(2)]],
      firstname: ['', [Validators.required, Validators.minLength(3)]],
      phoneNumber: [''],
      password: [
        '',
        [Validators.required, Validators.pattern(this.strongPasswordRegex)],
      ],
    });
  }
  // onSubmit() {
  //   const registerForm = this.registerForm.value;

  //   this._authService.registerForm(registerForm).subscribe(
  //     (register: any) => {
  //       if (register.token) {
  //         this._authService.accessToken = register.token;
  //         this._authService.isAuthenticated;
  //         this._router.navigate(['/sign-in']);
  //       }

  //       this.registerForm.reset();
  //     },
  //     (error) => {
  //       console.log(error);
  //       this.errorMessage = error.message;
  //     }
  //   );
  // }

  onSubmit() {
    if (this.registerForm.valid) {
      const userData = this.registerForm.value;
      this._authService
        .registerForm(userData)
        .pipe(
          catchError((error) => {
            console.error(error); // Afficher l'erreur dans la console
            this.errorMessage =
              'Désolé cet utilisateur existe déjà avec cette adresse mail';

            // Afficher le message d'erreur dans votre template
            throw error; // Renvoyer l'erreur pour qu'elle puisse être traitée par d'autres opérateurs catchError() ou par le gestionnaire d'erreur global
          })
        )
        .subscribe((register) => {
          if (register.token) {
            this._authService.accessToken = register.token;
            this._authService.isAuthenticated;
            this._snackbar.open('Veuillez vous connectez avec vos identifiants','Fermer')
            this._router.navigate(['/sign-in']);
          }

          this.registerForm.reset();
        });
    }
  }

  checkInputLength(value: string) {
    if (value.length >= 8) {
      this.inputLengthClass = 'valid';
    } else {
      this.inputLengthClass = 'invalid';
    }
  }

  clearErrorMessage() {
    this.errorMessage = '';
  }

  onLogout() {
    this._authService.logout();
    this._router.navigate(['/home']);
  }
}
