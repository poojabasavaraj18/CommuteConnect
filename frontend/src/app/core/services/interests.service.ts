import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class InterestsService {

  private http = inject(HttpClient);

  expressInterest(postId: string): Observable<any> {
    return this.http.post(
      `${environment.apiUrl}/interests/${postId}`,
      {}
    );
  }

  myInterests(): Observable<any[]> {
    return this.http.get<any[]>(
      `${environment.apiUrl}/interests/my`
    );
  }

  receivedInterests(): Observable<any[]> {
    return this.http.get<any[]>(
      `${environment.apiUrl}/interests/received`
    );
  }

  updateStatus(interestId: string, status: 'ACCEPTED' | 'REJECTED'): Observable<any> {
    return this.http.patch(
      `${environment.apiUrl}/interests/${interestId}/status`,
      { status }
    );
  }

  removeInterest(postId: string): Observable<any> {
    return this.http.delete(
      `${environment.apiUrl}/interests/${postId}`
    );
  }

}