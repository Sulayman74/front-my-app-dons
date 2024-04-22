import { Component, inject } from '@angular/core';

import { AuthService } from '../../../services/auth.service';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import {MatTableModule} from '@angular/material/table';
import { Router } from '@angular/router';

@Component({
  selector: 'app-donations',
  standalone: true,
  imports: [CommonModule,MatButtonModule,MatTableModule],
  templateUrl: './donations.component.html',
  styleUrl: './donations.component.scss',
})
export class DonationsComponent {
  private _authService = inject(AuthService);
  private _router = inject(Router)
  onLogout() {
    this._authService.logout();
this._router.navigate(['/home'])
  }
}
