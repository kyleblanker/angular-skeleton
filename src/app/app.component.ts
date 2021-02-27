import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './_services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title: string = "Skeleton"
  isAuthenticated = false;
  constructor(private authService: AuthService, private router: Router) {

    this.authService.userInfo.subscribe(value => {
      if(value.token) {
        this.isAuthenticated = true;
      } else {
        this.isAuthenticated = false;
      }
    });
   }

   public logout() {
     if(confirm('Are you sure you want to sign out?')) {
      this.authService.logout().subscribe(_ => {
        this.router.navigate(['login']);
       });
     }
   }
}
