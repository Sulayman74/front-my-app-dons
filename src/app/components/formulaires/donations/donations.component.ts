import { Component, OnInit, inject } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';

import { AuthService } from '../../../services/auth.service';
import { CommonModule } from '@angular/common';
import Donation from '../../../utils/types/donation';
import { DonationService } from '../../../services/donation.service';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';

@Component({
  selector: 'app-donations',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatTableModule],
  templateUrl: './donations.component.html',
  styleUrl: './donations.component.scss',
})
export class DonationsComponent implements OnInit{
  private _authService = inject(AuthService);
  private _donationService = inject(DonationService);
  private _router = inject(Router);
  
  donationSource: Donation[] = [];
  displayedColumns: string[] = ['amount', 'user', 'createdAt', 'archived'];
  
  ngOnInit(): void {
    this._donationService.getDonations().subscribe((donation:any)=>{
      console.log("hello donation",donation);
      this.donationSource = donation
    })
  }
  onLogout() {
    this._authService.logout();
    this._router.navigate(['/home']);
  }
}
