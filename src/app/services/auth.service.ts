import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User } from '../model/user';
import { Observable, BehaviorSubject } from 'rxjs';
import { map, tap, filter, shareReplay } from 'rxjs/operators';

export const ANONYMOUS_USER: User = {
  id: undefined,
  email: ''
};

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private subject = new BehaviorSubject<User>(ANONYMOUS_USER);
  user$: Observable<User> = this.subject.asObservable();
  isLoggedIn$: Observable<Boolean> = this.user$.pipe(map(user => !!user.id));
  isLoggedOut$: Observable<Boolean> = this.isLoggedIn$.pipe(map(isLoggedIn => !isLoggedIn));

  constructor(private http: HttpClient) { }

  signUp(email: string, password: string) {
    return this.http.post<User>('/api/signup', {email, password})
      .pipe(
        shareReplay(),
        tap(user => this.subject.next(user))
      );
  }
}
