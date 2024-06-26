import { BehaviorSubject, catchError } from 'rxjs';
import { Component, inject } from '@angular/core';
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
import { Router, RouterModule } from '@angular/router';

import { AuthService } from '../../../services/auth.service';
import { CommonModule } from '@angular/common';
import { LoadingService } from '../../../services/loading.service';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MyErrorStateMatcher } from '../../../utils/error-state-matcher';
import { SignInResponse } from '../../../utils/types/sign-in-response';

@Component({
  selector: 'app-sign-in',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    ReactiveFormsModule,
    RouterModule,
    MatProgressBarModule

  ],
  providers: [
    { provide: ErrorStateMatcher, useClass: ShowOnDirtyErrorStateMatcher },
  ],
  templateUrl: './sign-in.component.html',
  styleUrl: './sign-in.component.scss',
})
export class SignInComponent {
  connexionForm!: FormGroup;
  // strongPasswordRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[-_&à%£*€!?])[A-Za-z\d\-_&à%£*€!?]+$/;
  strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*-_?&])[A-Za-z\d@$!%*-_?&]{8,}$/;

  matcher = new MyErrorStateMatcher();

  errorMessage: string = '';
  inputLengthClass: string = '';

  passwordFieldType: string = 'password';


  loading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  constructor(
    private _formBuilder: FormBuilder,
    private _router: Router,
    public _loadingService: LoadingService,
    private _authService: AuthService
  ) {
    this.connexionForm = this._formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: [
        '',
        [Validators.required, Validators.pattern(this.strongPasswordRegex)],
      ],
    });
  }

  onSubmit() {

    if (this.connexionForm.valid) {
      const formData = this.connexionForm.value;
      this._authService.connexionForm(formData)
        .pipe(
          catchError((error) => {
            console.error(error)
            this.errorMessage = 'Identifiants incorrects'
            throw error
          })
        ).subscribe((connexion: SignInResponse) => {

          if (connexion.token) {
            this._authService.accessToken = connexion.token;
            // connexion.isAuthenticated = true;
            this._authService.isAuthenticated();
            if (connexion.isAuthenticated) {
              this._router.navigate(['/donations']);
            }
          }
          this.connexionForm.reset();
          console.log(connexion.token);
        })

    }
    // this._authService.connexionForm(formData).subscribe((connexion: any) => {
    //   if (connexion.token) {
    //     this._authService.accessToken = connexion.token;
    //     this.connexionForm.reset();
    //     // connexion.isAuthenticated = true;
    //     this._authService.isAuthenticated;
    //     if (connexion.isAuthenticated) {
    //       this._router.navigate(['/donations']);
    //     }
    //   }
    //   console.log(connexion.token);
    // });
  }
  clearErrorMessage() {
    this.errorMessage = '';
  }
  checkInputLength(value: string) {
    if (value.length >= 8) {
      this.inputLengthClass = 'valid';
    } else {
      this.inputLengthClass = 'invalid';
    }
  }
  togglePasswordVisibility(event:Event) {
    event.preventDefault()
    this.passwordFieldType = this.passwordFieldType === 'password' ? 'text' : 'password';
  }

  // Dans votre composant TypeScript
  normalizeEmail() {
    const emailControl = this.connexionForm.get('email');
    if (emailControl) {
      const currentValue = emailControl.value;
      if (typeof currentValue === 'string') {
        emailControl.setValue(currentValue.toLowerCase(), { emitEvent: false });
      }
    }
  }


  onLogout() {
    this._authService.logout();
    this._router.navigate(['/home'])
  }
}
