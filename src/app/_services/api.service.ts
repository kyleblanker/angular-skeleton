import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse, HttpRequest } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { environment } from '../../environments/environment';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import {MatSnackBar} from '@angular/material/snack-bar';

type HeaderType = { [name: string]: string | string[] };

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  static API_TOKEN = 'apiToken';
  private supportedMethods = [
    'get', 'post', 'put', 'delete'
  ];

  constructor(private http: HttpClient, private router: Router, private snackBar: MatSnackBar) { }

  httpOptions(token: any, defaultHeaders: HeaderType = {}) {
    let headers: HeaderType = defaultHeaders ?? {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    };

    if(token) {
      headers['Authorization'] = 'Bearer ' + token;
    }

    return {
      headers: new HttpHeaders(headers)
    }
  }

  makeRequest(method: string, endpoint: string, data: { [ name: string ]: any} = {}, defaultHeaders: HeaderType = {}): Observable<any> {
    method = method.toLowerCase();
    if(!this.supportedMethods.includes(method)) {
      throw new Error('Invalid HTTP method: ' + method);
    }

    let requestUrl = environment.apiUrl + endpoint;

    // Convert the data object into a query string if GET request
    if(method == 'get') {
      var queryString = Object.keys(data).map(key => encodeURIComponent(key) + '=' +encodeURIComponent(data[key])).join('&');
      if(queryString.length) {
        if(requestUrl.indexOf('?') >= 0) {
          requestUrl = requestUrl + '&' + queryString;
        } else {
          requestUrl = requestUrl + '?' + queryString;
        }
      }
    }

    let token = localStorage.getItem(ApiService.API_TOKEN);
    let options = this.httpOptions(token,defaultHeaders);

    const req = new HttpRequest(method, requestUrl, data, options);

    return this.http.request(req).pipe(
      catchError(error => {
        if(!(error instanceof HttpErrorResponse)) {
          return throwError(error);
        }

        switch(error.status) {
          case 401:
            this.router.navigate(['login']);
            break;
          case 429:
            this.snackBar.open('Too many requests, please try again later.', 'Close',{duration: 2000});
            break;
        }
        return throwError(error);
      })
    )
  }
}
