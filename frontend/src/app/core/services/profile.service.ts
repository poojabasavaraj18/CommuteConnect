import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class UsersService {

  private http = inject(HttpClient);

  getProfile(): Observable<any> {
    return this.http.get(
      `${environment.apiUrl}/profile`
    );
  }

  updateProfile(data: { name?: string; email?: string }): Observable<any> {
    return this.http.patch(
      `${environment.apiUrl}/profile`,
      data
    );
  }

}