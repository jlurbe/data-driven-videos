import { Component } from '@angular/core';
import { AuthGoogleService } from '../auth-google.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss'],
})
export class MainComponent {
  constructor(private authGoogleService: AuthGoogleService) {
    this.authGoogleService.initLogin();
  }

  getProfile() {
    return this.authGoogleService.getProfile();
  }

  logout() {
    this.authGoogleService.logout();
  }
}
