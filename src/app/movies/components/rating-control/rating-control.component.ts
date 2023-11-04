import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'ngm-rating-control',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './rating-control.component.html',
  styleUrl: './rating-control.component.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: RatingControlComponent,
    },
  ],
})
export class RatingControlComponent implements ControlValueAccessor {
  starStates = [false, false, false, false, false];
  onChange!: (rating: number) => {};
  onTouched!: () => {};

  writeValue(rating: number): void {
    this.updateRating(rating);
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  ratingChange(newRating: number) {
    this.updateRating(newRating);
    this.onChange(newRating);
    this.onTouched();
  }

  updateRating(newRating: number) {
    this.starStates = this.starStates.map((_, index) => index < newRating);
  }
}
