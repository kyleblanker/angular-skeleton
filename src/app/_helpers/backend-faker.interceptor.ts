import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HTTP_INTERCEPTORS, 
  HttpResponse
} from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';

import { delay, dematerialize, materialize, mergeMap } from 'rxjs/operators';
import { AuthService } from '../_services/auth.service';

let users = [
  {
    username: 'admin@example.com',
    password: 'password'
  },
  {
    username: 'user@example.com',
    password: 'password'
  }
];

@Injectable()
export class BackendFakerInterceptor implements HttpInterceptor {

  constructor(private authService: AuthService) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const { url, method, headers, body } = request;
    let urlObj = new URL(url);
    let authService = this.authService;

    return of(null)
      .pipe(mergeMap(handleRoute))
      .pipe(materialize())
      .pipe(delay(300))
      .pipe(dematerialize());
  
    function handleRoute() {
      switch (true) {
        case urlObj.pathname.endsWith('/login') && method === 'POST':
          return login(authService, urlObj.search);
        case urlObj.pathname.endsWith('/logout') && method === 'POST':
          return logout(authService, urlObj.search);
        case urlObj.pathname.endsWith('/data') && method === 'GET':
          return data(authService, urlObj.search); 
        default:
          return next.handle(request);
      }    
    }

    function data(authService: AuthService, search?: string) {
      if (!isLoggedIn(authService)) return unauthorized();

      let response = {
        current_page: 1,
        data:[
          {
            name:"Example",
            string:"A random string",
            date:"2021-02-26 16:08:48",
        }],
        per_page:5,
        total:1
      };

      return ok(response);
    }

    function login(authService: AuthService, search?: string) {
      const { username, password } = body;
      const user = users.find(x => x.username === username && x.password === password);
      if (!user) return error('Invalid username or password');

      let token = 'fake-auth-user-token';
      if(user.username == 'admin@example.com') {
        token = 'fake-auth-admin-token'
      }

      let response = {
        token: token
      };

      return ok(response);
    }

    function logout(authService: AuthService, search?: string) {
      if (!isLoggedIn(authService)) return unauthorized();

      let response = {
        message: 'User logged out'
      };

      return ok(response);
    }
  
    function ok(body?: any) {
      console.warn('Using fake backend response: ' + url, body);
      return of(new HttpResponse({ status: 200, body }))
    }

    function error(message: string) {
      console.warn('Using fake backend response: ' + url);
      return throwError({ error: { message } });
    }

    function unauthorized() {
      console.warn('Using fake backend response: ' + url);
      return throwError({ status: 401, error: { message: 'Unauthorized' } });
    }

    function isLoggedIn(authService: AuthService) {
      return authService.isLoggedIn();
    }
  }
}

export const BackendFakerProvider = {
  provide: HTTP_INTERCEPTORS,
  useClass: BackendFakerInterceptor,
  multi: true
};