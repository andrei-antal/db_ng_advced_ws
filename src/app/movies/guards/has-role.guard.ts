import { CanActivateFn, Router } from '@angular/router';
import { AuthService, Role } from '../services/auth.service';
import { inject } from '@angular/core';

export const hasRoleGuard: CanActivateFn = (route) => {
  const router = inject(Router);
  const authService = inject(AuthService);
  const roles: Role[] = route.data['roles'];
  if (roles?.includes(authService.role!)) {
    return true;
  }
  return router.parseUrl('/');
};
