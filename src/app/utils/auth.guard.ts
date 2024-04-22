import { AuthService } from '../services/auth.service';
import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

@Injectable()
export class AuthGuard {
  constructor(
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  canActivate(): boolean {
    // if (!this.authService.isAuthenticated) {
    //   this.snackBar.open('Accès restreint. Veuillez vous connecter pour continuer.', 'Fermer', {
    //     duration: 3000
    //   });
    //   this.router.navigateByUrl('/home');
    //   return false; // Indique que l'accès est refusé
    // }
    // return true; // Indique que l'accès est autorisé

    // Vérifie si l'utilisateur est authentifié et s'il a un JWT valide
    if (this.authService.isAuthenticated() && this.authService.accessToken) {
      return true; // Autoriser l'accès à la route
    } else {
      this.snackBar.open('Accès restreint. Veuillez vous connecter pour continuer.', 'Fermer', {
            duration: 3000
          });
      // Rediriger vers la page de connexion si l'utilisateur n'est pas authentifié ou s'il n'a pas de JWT
      this.router.navigate(['/home']);
      return false;
    }
   
  }


}
