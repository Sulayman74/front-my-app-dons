import { AfterViewInit, Component, OnInit, ViewChild, inject } from '@angular/core';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatPaginator, MatPaginatorIntl, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';

import { AuthService } from '../../../services/auth.service';
import { BehaviorSubject } from 'rxjs';
import { CommonModule } from '@angular/common';
import { ConfirmationDialogComponent } from '../../../modals/confirmation-dialog/confirmation-dialog.component';
import Destinataire from '../../../utils/types/destinataire';
import { DestinataireService } from '../../../services/destinataire.service';
import { EditedDestinataireComponent } from '../../../modals/edited-destinataire/edited-destinataire.component';
import { LoadingService } from '../../../services/loading.service';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { NewDestinataireComponent } from '../../../modals/new-destinataire/new-destinataire.component';
import { Router } from '@angular/router';
import { UserService } from '../../../services/user.service';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatFormFieldModule, MatIconModule, MatInputModule, MatPaginatorModule, MatProgressBarModule, MatSortModule, MatTableModule, MatDialogModule],
  providers: [
    MatPaginatorIntl
  ],
  templateUrl: './users.component.html',
  styleUrl: './users.component.scss'
})

export class UsersComponent implements OnInit, AfterViewInit {

  private _authService = inject(AuthService);
  private _userService = inject(UserService)
  private _destinataireService = inject(DestinataireService)
  public _loadingService = inject(LoadingService)
  private _router = inject(Router);

  greetings !: string
  resultsLength = 0;
  newDestinataire !: Destinataire
  editedDestinataire !: any
  userId !: string
  role !: string
  destinataireSource = new MatTableDataSource<Destinataire>([])
  displayedColumns: string[] = ['id', 'lastname', 'firstname', 'createdAt', 'email', 'phoneNumber', 'country', 'modification'];
  loading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  @ViewChild(MatPaginator) paginator!: MatPaginator
  @ViewChild(MatSort) sort!: MatSort;
  constructor(public paginationLabel: MatPaginatorIntl, private _matDialog: MatDialog) {

  }

  ngOnInit(): void {
    this._loadingService.startLoading();
    this.paginationLabel.previousPageLabel = "Page précédente";
    this.paginationLabel.nextPageLabel = "Page suivante";
    this.paginationLabel.firstPageLabel = "Première page"
    this.paginationLabel.lastPageLabel = "Dernière page"
  }


  loadDestinataires() {
    this._destinataireService.getDestinataires().subscribe({
      next: (destinataire) => {


        this.destinataireSource.paginator = this.paginator;
        this.destinataireSource.sort = this.sort;

        if (destinataire && destinataire.length > 0) {
          this.destinataireSource.data = destinataire;
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
    return data.createdAt.toString().toLowerCase().includes(lowercaseFilter) ||
      (data.user.firstname && data.user.firstname?.toLowerCase().includes(lowercaseFilter)) ||
      (data.destinataire.firstname && data.destinataire?.firstname.toLowerCase().includes(lowercaseFilter));
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.destinataireSource.filter = filterValue.trim().toLowerCase();
    // console.log("filtre", this.destinataireSource.filter);

    if (this.destinataireSource.paginator) {
      this.destinataireSource.paginator.firstPage();
    }
  }

  ngAfterViewInit(): void {
    this.loadDestinataires()
    this.destinataireSource.paginator = this.paginator
    this.destinataireSource.sort = this.sort
    this.getProfil()

  }

  getProfil() {
    this._userService.getProfile().subscribe((profile) => {
      console.log("mon profil", profile.role);
      this.role = profile.role
      const firstname = profile.firstname
      const lastname = profile.lastname
      this.greetings = `${firstname + ' ' + lastname}`
      this.userId = profile.id
    })

  }
  addDestinataire() {
    const dialogRef = this._matDialog.open(NewDestinataireComponent, {
      hasBackdrop: true
    })
    dialogRef.afterClosed().subscribe(result => {


      if (result) {
        this.newDestinataire = result
        // Ajoutez le nouveau don à la liste existante
        this.destinataireSource.data.push(this.newDestinataire);

        // Mettez à jour la source de données MatTableDataSource
        this.loadDestinataires()
      }
    })
  }

  editDon(don: Destinataire) {
    const dialogRef = this._matDialog.open(EditedDestinataireComponent, {
      hasBackdrop: true,
      data: { don }
    })
    dialogRef.afterClosed().subscribe(result => {
      // Ajoutez le nouveau don à la liste existante


      if (result) {
        console.log(result);
        this.editedDestinataire = result
        this.destinataireSource.data.push(this.editedDestinataire);

        this.loadDestinataires()
      }
    })


  }

  deleteDonation(id: string): void {
    const dialogRef = this._matDialog.open(ConfirmationDialogComponent, {
      data: 'Confirmez-vous la suppression de cette donation ?'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this._destinataireService.deleteDestinataire(id).subscribe(() => {
          console.log('Destinataire deleted successfully');
          this.loadDestinataires()

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
