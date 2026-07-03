import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';

import { PostsResponse } from '../models/pagination';
import { Post } from '../models/post';

@Injectable({
  providedIn: 'root',
})
export class PostsService {

  private http = inject(HttpClient);

  getPosts(
    page = 1,
    limit = 10,
    origin = '',
    destination = '',
    status = '',
    travelDate = ''
  ): Observable<PostsResponse> {

    return this.http.get<PostsResponse>(
      `${environment.apiUrl}/posts`,
      {
        params: {
          page,
          limit,
          origin,
          destination,
          status,
          travelDate,
        },
      }
    );
  }
getMyPosts(): Observable<Post[]> {
  return this.http.get<Post[]>(
    `${environment.apiUrl}/posts/my`
  );
}

  createPost(post: any) {
    return this.http.post(
      `${environment.apiUrl}/posts`,
      post
    );
  }

  updatePost(id: string, post: any) {
    return this.http.patch(
      `${environment.apiUrl}/posts/${id}`,
      post
    );
  }

  updateStatus(id: string, status: string) {
    return this.http.patch(
      `${environment.apiUrl}/posts/${id}/status`,
      {
        status,
      }
    );
  }

  deletePost(id: string) {
    return this.http.delete(
      `${environment.apiUrl}/posts/${id}`
    );
  }

}