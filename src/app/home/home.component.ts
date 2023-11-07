import { Component, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { NonNullableFormBuilder, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../movies/services/auth.service';

@Component({
  selector: 'ngm-home',
  standalone: true,
  imports: [RouterModule, ReactiveFormsModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent {
  #fb = inject(NonNullableFormBuilder);
  #router = inject(Router);
  authService = inject(AuthService);
  error = undefined;

  loginForm = this.#fb.group({
    user: [''],
    password: [''],
  });

  submit() {
    const { user, password } = this.loginForm.value;
    this.authService.login(user, password).subscribe({
      next: () => {
        this.error = undefined;
        this.#router.navigate(['/movies']);
      },
      error: (err) => {
        this.error = err;
      },
    });
  }
}
