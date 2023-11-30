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
  videoUrl: string | null;

  constructor(private authService: SocialAuthService) {
    // Get from local strorage
    const user = localStorage.getItem('user');
    this.user = user ? JSON.parse(user) : undefined;
    this.videoUrl = localStorage.getItem('videoUrl');
  }

  ngOnInit(): void {
    this.authSubscription = this.authService.authState.subscribe((user) => {
      this.user = user;
      this.videoUrl = `${process.env['NX_RESULTS_URL']}/${process.env['NX_PROJECT_NAME']}/${user?.email}.mp4`;

      // Save to local storage
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('videoUrl', this.videoUrl);
    });
  }

  ngOnDestroy(): void {
    this.authSubscription.unsubscribe();
  }

  logout() {
    // Remove from localStorage
    localStorage.removeItem('user');
    localStorage.removeItem('videoUrl');

    this.user = undefined;
    this.videoUrl = null;

    this.authService.signOut().catch((err) => {});
  }

  googleSignin(googleWrapper: any) {
    googleWrapper.click();
  }
}
