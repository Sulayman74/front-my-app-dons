import { Component, EventEmitter, Output, ViewChild } from '@angular/core';
import { MatDrawer, MatSidenav, MatSidenavModule } from '@angular/material/sidenav';
import { Router, RouterModule } from '@angular/router';

import { AuthService } from '../../services/auth.service';
import { BehaviorSubject } from 'rxjs';
import { CommonModule } from '@angular/common';
import { LoadingService } from '../../services/loading.service';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatToolbarModule } from '@angular/material/toolbar';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatIconModule, MatProgressBarModule, MatSidenavModule, MatToolbarModule, RouterModule,],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.scss'
})
export class LayoutComponent {
  role!: string

  loading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  constructor(public _loadingService: LoadingService, private _authService: AuthService, private _router: Router, private _userService: UserService) {
    this._userService.getProfile().subscribe((profile) => {
      this.role = profile.role
      console.log(profile)
    })
  }

  onLogout() {
    this._authService.logout();
    this._router.navigate(['/home']);
  }
}
