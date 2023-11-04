import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
} from '@angular/core';
import { Movie } from '../../model/movie';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { WordCountPipe } from '../../pipes/word-count.pipe';

export interface CommentUpdate {
  id: string;
  newComment: string;
}

@Component({
  selector: 'ngm-movie-item',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterModule, WordCountPipe],
  templateUrl: './movie-item.component.html',
  styleUrls: ['./movie-item.component.scss'],
})
export class MovieItemComponent implements OnChanges {
  @Input() movie!: Movie;
  @Input() editable = true;
  @Output() commentUpdate = new EventEmitter<CommentUpdate>();
  @Output() movieDelete = new EventEmitter<string>();

  commentSaved = false;
  movieComment = '';

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['movie']) {
      this.movieComment = changes['movie'].currentValue.comment;
      this.commentSaved = this.movieComment.length > 0;
    }
  }

  saveComment(): void {
    if (!this.commentSaved) {
      this.commentUpdate.emit({
        id: this.movie.id,
        newComment: this.movieComment,
      });
    } else {
      this.commentSaved = false;
    }
  }

  clearComment(): void {
    this.commentUpdate.emit({
      id: this.movie.id,
      newComment: '',
    });
  }
}
