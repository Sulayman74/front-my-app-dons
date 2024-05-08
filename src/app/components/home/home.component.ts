import { Router, RouterLink, RouterModule } from '@angular/router';

import { Component } from '@angular/core';
import { FooterComponent } from '../footer/footer.component';
import { LayoutComponent } from '../layout/layout.component';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [MatButtonModule, RouterModule, RouterLink, MatIconModule, LayoutComponent, FooterComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {
  constructor(private _router: Router) { }

  onConnect() {
    this._router.navigate(['sign-in'])
  }
  onRegister() {
    this._router.navigate(['sign-up'])
  }


}
