import { Router, RouterLink, RouterModule } from '@angular/router';

import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [MatButtonModule, RouterModule, RouterLink, MatIconModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {
  constructor(private _router: Router) {}
  onConnect() {
    this._router.navigate(['sign-in'])
  }
  onRegister() {
    this._router.navigate(['sign-up'])
  }
}
