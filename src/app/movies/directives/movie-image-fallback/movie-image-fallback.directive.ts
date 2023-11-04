import {
  Directive,
  ElementRef,
  HostListener,
  Input,
  OnInit,
  inject,
} from '@angular/core';

@Directive({
  selector: '[ngmMovieImageFallback]',
  standalone: true,
})
export class MovieImageFallbackDirective implements OnInit {
  @Input() ngmMovieImageFallback: string | undefined;

  @HostListener('error')
  setImage() {
    this.#el.src = this.ngmMovieImageFallback;
  }

  #el = inject(ElementRef).nativeElement;

  ngOnInit() {
    if (!this.ngmMovieImageFallback) {
      this.ngmMovieImageFallback = 'assets/noImage1.jpg';
    }
  }
}
