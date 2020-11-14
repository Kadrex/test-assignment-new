import { Component, OnInit } from '@angular/core';
import { BookService } from '../../services/book.service';
import { Book } from '../../models/book';
import { Observable } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { map, switchMap } from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationDialog } from '../confirmation-dialog/confirmation-dialog.component';

@Component({
  selector: 'app-book-detail',
  templateUrl: './book-detail.component.html',
  styleUrls: ['./book-detail.component.scss']
})
export class BookDetailComponent implements OnInit {

  public book$: Observable<Book | Error>;
  private dialogText: string = 'Do you really wish to delete this book?';
  public addRemoveFavorite: string = 'Add to favorites';
  public BORROWED: string = 'BORROWED';
  private AVAILABLE: string = 'AVAILABLE';
  private FAVORITE_BOOKS_KEY: string = 'favoriteBooks';
  private BOOKS_KEY: string = 'books';

  constructor(
    private route: ActivatedRoute,
    private bookService: BookService,
    private dialog: MatDialog
  ) {
  }

  ngOnInit(): void {
    this.book$ = this.route.params
      .pipe(map(params => params.id))
      .pipe(switchMap(id => this.bookService.getBook(id)))
  }

  deleteBook(): void {
    let id;
    this.book$.subscribe(res => {
      id = res['id']
      this.bookService.deleteBook(id).subscribe()
      window.location.href = '/books'
    })

  }

  isBookAvailable(status): boolean {
    return status === this.AVAILABLE
  }

  openDialog(): void {
    // https://material.angular.io/components/dialog/overview
    const dialogRef = this.dialog.open(ConfirmationDialog, {
      data: {text: this.dialogText
      }});

    dialogRef.afterClosed().subscribe(res => {
      if (res) {
        this.deleteBook()
      }
    })
  }

  isInFavorites(id: string): boolean {
    let favoriteBooks = localStorage.getItem(this.FAVORITE_BOOKS_KEY);
    if (favoriteBooks === null) {
      return false;
    }
    let array = JSON.parse(favoriteBooks)[this.BOOKS_KEY];
    return !!array.some(x => x === id);
  }

  addBookToFavorites(id: string): void {
    // https://stackoverflow.com/questions/3357553/how-do-i-store-an-array-in-localstorage
    let favoriteBooks = localStorage.getItem(this.FAVORITE_BOOKS_KEY);
    if (favoriteBooks === null) {
      let favorites = {'books': [id]};
      localStorage.setItem(this.FAVORITE_BOOKS_KEY, JSON.stringify(favorites));
    } else {
      let json = JSON.parse(favoriteBooks);
      json[this.BOOKS_KEY].push(id);
      localStorage.setItem(this.FAVORITE_BOOKS_KEY, JSON.stringify(json));
    }
  }

  removeBookFromFavorites(id: string): void {
    let favoriteBooks = localStorage.getItem(this.FAVORITE_BOOKS_KEY);
    let array = JSON.parse(favoriteBooks)[this.BOOKS_KEY];
    let newArray = array.filter(x => x != id);
    localStorage.setItem(this.FAVORITE_BOOKS_KEY, JSON.stringify({'books': newArray}));
  }

}

export interface DialogData {
  text: string;
}
