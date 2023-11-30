import { Component, OnDestroy, OnInit } from '@angular/core';
import { SocialAuthService, SocialUser } from '@abacritt/angularx-social-login';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss'],
})
export class MainComponent implements OnInit, OnDestroy {
  authSubscription!: Subscription;
  user: SocialUser | undefined;
  videoUrl = '';
  isLoggedIn = false;

  constructor(private authService: SocialAuthService) {}

  ngOnInit(): void {
    console.log('init');
    this.authSubscription = this.authService.authState.subscribe((user) => {
      this.user = user;
      this.isLoggedIn = user != null;
      this.videoUrl = `${process.env['NX_RESULTS_URL']}/${process.env['NX_PROJECT_NAME']}/${user?.email}.mp4`;
    });
  }

  ngOnDestroy(): void {
    console.log('destroy');
    this.authSubscription.unsubscribe();
  }
  // login() {
  //   this.authService.signIn(GoogleLoginProvider.PROVIDER_ID);
  // }

  logout() {
    console.log('logout');
    this.authService.signOut().then((user) => {
      this.user = undefined;
      this.isLoggedIn = false;
    });
  }

  googleSignin(googleWrapper: any) {
    googleWrapper.click();
  }
}
