import { Component } from '@angular/core';
import { AuthGoogleService } from '../auth-google.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  constructor(private authGoogleService: AuthGoogleService) {
    this.authGoogleService.initLogin();
  }

  login() {
    this.authGoogleService.login();
  }
}
