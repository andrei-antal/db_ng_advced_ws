import { Injectable } from '@angular/core';
import { Observable, of, tap, throwError } from 'rxjs';

const MOCK_USER = {
  user: 'user',
  password: 'user',
};
const MOCK_ADMIN = {
  user: 'admin',
  password: 'admin',
};

const MOCK_TOKEN = '1234567890';

export const enum Role {
  User = 'User',
  Admin = 'Admin',
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  #isAuthenticated = false;
  #token?: string;
  #role?: Role;

  get isAuthenticated(): boolean {
    return this.#isAuthenticated;
  }

  get token(): string | undefined {
    return this.#token;
  }

  get role(): Role | undefined {
    return this.#role;
  }

  login(user?: string, pass?: string): Observable<{ token: string }> {
    if (user === MOCK_USER.user && pass === MOCK_USER.password) {
      this.#isAuthenticated = true;
      this.#role = Role.User;
      return of({ token: MOCK_TOKEN }).pipe(
        tap(({ token }) => (this.#token = token))
      );
    }
    if (user === MOCK_ADMIN.user && pass === MOCK_ADMIN.password) {
      this.#isAuthenticated = true;
      this.#role = Role.Admin;
      return of({ token: MOCK_TOKEN }).pipe(
        tap(({ token }) => (this.#token = token))
      );
    }

    return throwError(() => 'Invalid user or password');
  }

  logout(): void {
    this.#isAuthenticated = false;
    this.#token = undefined;
    this.#role = undefined;
  }
}
