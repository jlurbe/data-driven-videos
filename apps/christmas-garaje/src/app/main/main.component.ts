import { Component, OnDestroy, OnInit } from '@angular/core';
import { SocialAuthService, SocialUser } from '@abacritt/angularx-social-login';
import { Subscription } from 'rxjs';

@Component({
  selector: 'dd-videos-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss'],
})
export class MainComponent implements OnInit, OnDestroy {
  authSubscription!: Subscription;
  user: SocialUser | undefined;
  videoUrl: string;

  constructor(private authService: SocialAuthService) {
    // Get from local strorage
    const user = localStorage.getItem('user');
    const videoUrl = localStorage.getItem('videoUrl');
    this.user = user ? JSON.parse(user) : undefined;
    this.videoUrl = videoUrl ? videoUrl : '';
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
    this.videoUrl = '';

    this.authService.signOut().catch(() => {});
  }

  googleSignin(googleWrapper: any) {
    googleWrapper.click();
  }
}
