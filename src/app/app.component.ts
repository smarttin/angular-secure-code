import { Component, OnInit } from '@angular/core';
import { AuthService } from './services/auth.service';
import { Observable } from 'rxjs';
import { User } from './model/user';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  isLoggedIn$: Observable<boolean>;
  isLoggedOut$: Observable<boolean>;

  constructor(private authService: AuthService, private router: Router) {

  }

  ngOnInit(): void {
    this.isLoggedIn$ = this.authService.isLoggedIn$;
    this.isLoggedOut$ = this.authService.isLoggedOut$;
  }

  logout() {
    this.authService.logout().subscribe(
      (result) => {
        console.log('User logout successful');
        this.router.navigate(['/login']);
      },
      (error) => console.log(error),
      () => {}
    );
  }

}
