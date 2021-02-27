import { HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { ApiService } from './api.service';

interface UserInfo {
  token: string | null
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  userInfo = new BehaviorSubject<UserInfo>({token: null});
  constructor(private apiService: ApiService) { 
    this.loadUserInfo();
  }

  public login(username: string, password: string): Observable<any> {
    return this.apiService.makeRequest('post','/login',{username: username, password: password}).pipe(
      tap(resp => this.setData(resp))
   );
  }

  public logout(): Observable<any> {
    return this.apiService.makeRequest('post','/logout').pipe(
      tap(response => {
        if (response instanceof HttpResponse) {
          localStorage.clear();
          this.userInfo.next({token: null});
        }
      })
   );
  }

  public isLoggedIn() {
    return localStorage.getItem(ApiService.API_TOKEN) !== null;
  }

  public isLoggedOut() {
    return !this.isLoggedIn();
  }

  private setData(authResult:any) {
    if (authResult instanceof HttpResponse) {
      localStorage.setItem(ApiService.API_TOKEN, authResult.body.token);
      let userInfo = {token: authResult.body.token};
      this.userInfo.next(userInfo);
    }
  }

  private loadUserInfo() {
    let token = localStorage.getItem(ApiService.API_TOKEN);
    let userInfo = {token: token};
    this.userInfo.next(userInfo);
  }
}
