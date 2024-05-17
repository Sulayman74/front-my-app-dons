import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';

import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { UserService } from '../../services/user.service';
import { MyErrorStateMatcher } from '../../utils/error-state-matcher';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-password',
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
    MatIconModule,
    MatInputModule,
    ReactiveFormsModule,
    MatSnackBarModule,
  ],
  templateUrl: './password.component.html',
  styleUrl: './password.component.scss',
})
export class PasswordComponent {
  password!: FormGroup;
  userId!: string;
  matcher = new MyErrorStateMatcher();

  inputLengthClass: string = '';
  errorMessage: string = '';
  passwordFieldType: string = 'password';

  constructor(
    public dialogRef: MatDialogRef<PasswordComponent>,
    private _fb: FormBuilder,
    private _userService: UserService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _snackbar: MatSnackBar
  ) {
    this.password = this._fb.group({
      oldPassword: ['', Validators.required],
      newPassword: ['', Validators.required],
    });
    console.log('hello', this.data.userId);
  }

  onSubmit() {
    this.userId = this.data.userId;
    const datas = {
      id: this.userId,
      oldPassword: this.password.controls['oldPassword'].value,
      newPassword: this.password.controls['newPassword'].value,
    };
    this._userService.updateUserPassword(
      this.userId,
      datas.oldPassword,
      datas.newPassword
    ).subscribe((values)=>{
      console.log("mots de passe",values);
    })

    this._snackbar.open('Mot de passe bien effectué', 'OK');
    this.dialogRef.close(datas);
  }
  clearErrorMessage() {
    this.errorMessage = '';
  }
  togglePasswordVisibility(event: Event) {
    event.preventDefault();
    this.passwordFieldType =
      this.passwordFieldType === 'password' ? 'text' : 'password';
  }
  checkInputLength(value: string) {
    if (value.length >= 8) {
      this.inputLengthClass = 'valid';
    } else {
      this.inputLengthClass = 'invalid';
    }
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
