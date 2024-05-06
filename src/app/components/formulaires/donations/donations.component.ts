import { AfterViewInit, Component, OnInit, ViewChild, inject } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatPaginator, MatPaginatorIntl, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';

import { AuthService } from '../../../services/auth.service';
import { CommonModule } from '@angular/common';
import { ConfirmationDialogComponent } from '../../../modals/confirmation-dialog/confirmation-dialog.component';
import Donation from '../../../utils/types/donation';
import { DonationService } from '../../../services/donation.service';
import { EditDonComponent } from '../../../modals/edit-don/edit-don.component';
import { LoadingService } from '../../../services/loading.service';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { NewDonComponent } from '../../../modals/new-don/new-don.component';
import { Router } from '@angular/router';
import { UserService } from '../../../services/user.service';

@Component({
  selector: 'app-donations',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatFormFieldModule, MatIconModule, MatInputModule, MatPaginatorModule, MatProgressBarModule, MatProgressSpinnerModule, MatSidenavModule, MatSortModule, MatTableModule, MatToolbarModule, MatDialogModule],
  providers: [
    MatPaginatorIntl
  ],
  templateUrl: './donations.component.html',
  styleUrl: './donations.component.scss',
})
export class DonationsComponent implements OnInit, AfterViewInit {

  private _authService = inject(AuthService);
  private _userService = inject(UserService)
  private _donationService = inject(DonationService);
  private _router = inject(Router);
  loading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  donationSource = new MatTableDataSource<Donation>([])
  displayedColumns: string[] = ['amount', 'user', 'destinataire', 'createdAt', 'archived', 'modification'];

  greetings !: string
  resultsLength = 0;
  newDonation !: Donation
  editedDonation !: any
  userId !: string
  role !: string


  @ViewChild(MatPaginator) paginator!: MatPaginator
  @ViewChild(MatSort) sort!: MatSort;
  constructor(public _loadingService: LoadingService, public paginationLabel: MatPaginatorIntl, private _matDialog: MatDialog) {

  }


  ngOnInit(): void {
    this._loadingService.startLoading();
    this.paginationLabel.previousPageLabel = "Page précédente";
    this.paginationLabel.nextPageLabel = "Page suivante";
    this.paginationLabel.firstPageLabel = "Première page"
    this.paginationLabel.lastPageLabel = "Dernière page"



  }


  loadDonations() {
    this._donationService.getDonations().subscribe({
      next: (donations) => {


        this.donationSource.paginator = this.paginator;
        this.donationSource.sort = this.sort;

        if (donations && donations.length > 0) {
          this.donationSource.data = donations;
          this.donationSource.filterPredicate = this.customFilterPredicate.bind(this);
          this._loadingService.stopLoading();
        } else {
          setTimeout(() => {
            this._loadingService.stopLoading()
          }, 3000);
        }



      },
      error: (error) => {
        console.error('Erreur lors de la récupération des donations :', error);
        // Gérer l'erreur ici
      }
    });
  }
  customFilterPredicate(data: any, filter: string): boolean {
    // Convertir le filtre en minuscules pour la comparaison insensible à la casse
    const lowercaseFilter = filter.trim().toLowerCase();

    // Vérifier si le filtre correspond à la valeur de l'élément ou à une propriété imbriquée
    return data.amount.toString().toLowerCase().includes(lowercaseFilter) || data.createdAt.toString().toLowerCase().includes(lowercaseFilter) ||
      (data.user.firstname && data.user.firstname?.toLowerCase().includes(lowercaseFilter)) ||
      (data.destinataire.firstname && data.destinataire?.firstname.toLowerCase().includes(lowercaseFilter));
  }


  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.donationSource.filter = filterValue.trim().toLowerCase();
    // console.log("filtre", this.donationSource.filter);

    if (this.donationSource.paginator) {
      this.donationSource.paginator.firstPage();
    }
  }

  ngAfterViewInit(): void {
    this.loadDonations()
    this.donationSource.paginator = this.paginator
    this.donationSource.sort = this.sort
    this.getProfil()

  }

  getProfil() {
    this._userService.getProfile().subscribe((profile) => {
      console.log("mon profil", profile.role);
      this.role = profile.role
      const firstname = profile.firstname
      const lastname = profile.lastname
      this.greetings = `Bienvenue ${firstname + ' ' + lastname}`
      this.userId = profile.id
    })

  }

  addDon() {
    const dialogRef = this._matDialog.open(NewDonComponent, {
      hasBackdrop: true
    })
    dialogRef.afterClosed().subscribe(result => {


      if (result) {
        this.newDonation = result
        // Ajoutez le nouveau don à la liste existante
        this.donationSource.data.push(this.newDonation);

        // Mettez à jour la source de données MatTableDataSource
        this.loadDonations()
      }
    })
  }

  editDon(don: Donation) {
    const dialogRef = this._matDialog.open(EditDonComponent, {
      hasBackdrop: true,
      data: { don }
    })
    dialogRef.afterClosed().subscribe(result => {
      // Ajoutez le nouveau don à la liste existante


      if (result) {
        console.log(result);
        this.editedDonation = result
        this.donationSource.data.push(this.editedDonation);

        this.loadDonations()
      }
    })


  }

  deleteDonation(id: string): void {
    const dialogRef = this._matDialog.open(ConfirmationDialogComponent, {
      data: 'Confirmez-vous la suppression de cette donation ?'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this._donationService.deleteDonation(id).subscribe(() => {
          console.log('Donation deleted successfully');
          this.loadDonations()

        }
        )
      }
    });
  }

  onLogout() {
    this._authService.logout();
    this._router.navigate(['/home']);
  }
}


