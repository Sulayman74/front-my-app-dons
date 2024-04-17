import { BehaviorSubject, merge } from 'rxjs';
import {
  ErrorStateMatcher,
  ShowOnDirtyErrorStateMatcher,
} from '@angular/material/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  FormGroupDirective,
  FormsModule,
  NgForm,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

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

export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(
    control: FormControl | null,
    form: FormGroupDirective | NgForm | null
  ): boolean {
    const isSubmitted = form && form.submitted;
    return !!(
      control &&
      control.invalid &&
      (control.dirty || control.touched || isSubmitted)
    );
  }
}

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
    MatToolbarModule,
    RouterModule,
    MatProgressBarModule,
    MatSidenavModule,
  ],
  providers: [
    { provide: ErrorStateMatcher, useClass: ShowOnDirtyErrorStateMatcher },
  ],
  templateUrl: './sign-in.component.html',
  styleUrl: './sign-in.component.scss',
})
export class SignInComponent {
  formulaireSignIn!: FormGroup;
  strongPasswordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  email = new FormControl('', [Validators.required, Validators.email]);
  nom = new FormControl('', [Validators.minLength(2), Validators.required]);
  firstname = new FormControl('', [
    Validators.minLength(3),
    Validators.required,
  ]);
  password = new FormControl('', [
    Validators.required,
    Validators.pattern(this.strongPasswordRegex),
  ]);

  matcher = new MyErrorStateMatcher();

  loading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  constructor(
    private _formBuilder: FormBuilder,
    private _router: Router,
    public _loadingService: LoadingService
  ) {
    this.formulaireSignIn = this._formBuilder.group({
      email: [''],
      nom: [''],
      firstname: [''],
      phoneNumber: [''],
      password: [''],
    });
  }
  onClick() {
    this._router.navigate(['/home']);

    console.log("it's clicking on button menu");
  }

  onSubmit() {
    console.log('hello', this.formulaireSignIn);
  }
}
