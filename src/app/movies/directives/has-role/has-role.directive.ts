import {
  Directive,
  Input,
  TemplateRef,
  ViewContainerRef,
  inject,
} from '@angular/core';
import { AuthService, Role } from '../../services/auth.service';

@Directive({
  selector: '[ngmHasRole]',
  standalone: true,
})
export class HasRoleDirective {
  @Input() ngmHasRole!: string;

  #template = inject(TemplateRef);
  #view = inject(ViewContainerRef);
  #authService = inject(AuthService);

  ngOnInit() {
    if (
      this.#authService.isAuthenticated &&
      this.#authService.role === this.ngmHasRole
    ) {
      this.#view.createEmbeddedView(this.#template);
    } else {
      this.#view.clear();
    }
  }
}
