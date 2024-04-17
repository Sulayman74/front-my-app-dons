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
  onClick() {
    console.log('hello');
    this._router.navigate(['sign-in'])
  }
}
