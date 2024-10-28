import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  Component,
  Inject,
  OnInit,
  inject,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogModule,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import Destinataire from '../../utils/types/destinataire';
import { UserService } from '../../services/user.service';
import { DestinataireService } from '../../services/destinataire.service';
import {
  Observable,
  catchError,
  debounceTime,
  distinctUntilChanged,
  map,
  of,
  startWith,
  switchMap,
  tap,
} from 'rxjs';
import { DataService } from '../../services/data.service';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatOptionModule } from '@angular/material/core';
import Address from '../../utils/types/address';
import { error } from 'console';

@Component({
  selector: 'app-new-destinataire',
  standalone: true,
  imports: [
    CommonModule,
    MatAutocompleteModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    ReactiveFormsModule,
    FormsModule,
    MatButtonModule,
    MatDialogModule,
    MatDialogActions,
    MatOptionModule,
    MatDialogClose,
    MatDialogContent,
    MatDialogTitle,
    MatSnackBarModule,
  ],
  templateUrl: './new-destinataire.component.html',
  styleUrl: './new-destinataire.component.scss',
})
export class NewDestinataireComponent implements OnInit, AfterViewInit {
  newDestinataireForm!: FormGroup;
  userId!: string;
  countries!: any;
  cities!: any;
  cityOptions: any[] = [];
  options: string[] = [];
  filteredCountries$!: Observable<string[]> | undefined;
  filteredAddress$!: Observable<any> | undefined;
  currentPosition!: GeolocationPosition;
  private _destinataireService = inject(DestinataireService);
  private _dataService = inject(DataService);
  constructor(
    public dialogRef: MatDialogRef<NewDestinataireComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Destinataire,
    private _fb: FormBuilder,
    private _snackbar: MatSnackBar,
    private _userService: UserService
  ) {
    this.getCities();

    this.newDestinataireForm = this._fb.group({
      city: [this.cityOptions[0]?.properties.city],
      country: [''],
      street: [''],
      zipcode: [this.cityOptions[0]?.properties.postcode],
      email: ['', [Validators.email, Validators.required]],
      firstname: ['', [Validators.required, Validators.minLength(3)]],
      lastname: ['', [Validators.required, Validators.minLength(2)]],
      isFamily: [''],
      phoneNumber: [''],
    });

    this._userService.getProfile().subscribe((response) => {
      this.userId = response.id;
    });
    this._dataService.getCountries().subscribe((countries: any) => {
      this.countries = countries;
      this.options = this.sortCountries();
    });
  }
  ngAfterViewInit(): void {}

  ngOnInit(): void {
    this.filteredCountries$ = this.newDestinataireForm
      ?.get('country')
      ?.valueChanges.pipe(
        startWith(''),
        debounceTime(300),
        distinctUntilChanged(),
        map((value) => this._filter(value || ''))
      );
  }

  sortCountries(): string[] {
    return this.countries.map((countryName: any) => countryName.name.common);
  }
  getCities() {
    this.newDestinataireForm
      ?.get('city')
      ?.valueChanges.pipe(
        startWith(''),
        debounceTime(300),
        distinctUntilChanged()
      )
      .subscribe((value) => {
        if (value?.length > 3) {
          this._dataService.searchAddress(value)?.subscribe((address) => {
            this.cityOptions = address.features;
            console.log(this.cityOptions);
          });
        }
      });
  }
  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.options?.filter((option) =>
      option.toLowerCase().includes(filterValue)
    );
  }

  onSubmit() {
    this.data = this.newDestinataireForm.value;

    if (this.newDestinataireForm.valid) {
      this.newDestinataireForm.value.userId = this.userId;
      this._destinataireService
        .createDestinataire(this.data)
        .subscribe((destinataire) => {
          console.log('destinataire from modal', destinataire);
        });
      this._snackbar.open('Don bien effectué', 'OK');
      this.dialogRef.close(this.data);
    }
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
