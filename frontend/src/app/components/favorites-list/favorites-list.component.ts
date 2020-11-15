import { Component, OnInit } from '@angular/core';
import { Book } from '../../models/book';
import { BookService } from '../../services/book.service';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationDialog } from '../confirmation-dialog/confirmation-dialog.component';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-favorites-list',
  templateUrl: './favorites-list.component.html',
  styleUrls: ['./favorites-list.component.scss']
})
export class FavoritesListComponent implements OnInit {

  private FAVORITE_BOOKS_KEY: string = 'favoriteBooks';
  private BOOKS_KEY: string = 'books';
  private SNACKBAR_ACTION: string = 'Close';
  public BORROWED: string = 'BORROWED';
  public AVAILABLE: string = 'AVAILABLE';
  public favoriteBooks: Book[];
  private dialogText: string = 'Are you sure you wish to remove that book from favorites?';

  constructor(
    private bookService: BookService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {
  }

  ngOnInit(): void {
    this.updateFavoriteBooks();
  }

  updateFavoriteBooks(): void {
    // https://stackoverflow.com/questions/3357553/how-do-i-store-an-array-in-localstorage
    this.favoriteBooks = [];
    let favoriteBooks = localStorage.getItem(this.FAVORITE_BOOKS_KEY);
    if (favoriteBooks === null) {
      // no favorite books
    } else {
      let json = JSON.parse(favoriteBooks);
      let favoriteBooksIds = json[this.BOOKS_KEY];
      for (const favoriteBookId of favoriteBooksIds) {
        this.bookService.getBook(favoriteBookId).subscribe(res => this.favoriteBooks.push(res as Book));
      }
    }
  }

  removeBookFromFavorites(id: string): void {
    let favoriteBooks = localStorage.getItem(this.FAVORITE_BOOKS_KEY);
    let array = JSON.parse(favoriteBooks)[this.BOOKS_KEY];
    let newArray = array.filter(x => x != id);
    localStorage.setItem(this.FAVORITE_BOOKS_KEY, JSON.stringify({'books': newArray}));
    this.showSnackbar('Book successfully removed from favorites.');
    this.updateFavoriteBooks();
  }

  openDialog(id): void {
    // https://material.angular.io/components/dialog/overview
    const dialogRef = this.dialog.open(ConfirmationDialog, {
      data: {text: this.dialogText
      }});

    dialogRef.afterClosed().subscribe(res => {
      if (res) {
        this.removeBookFromFavorites(id)
      }
    })
  }

  isBookAvailable(status): boolean {
    return status === this.AVAILABLE
  }

  showSnackbar(message: string): void {
    // https://material.angular.io/components/snack-bar/overview
    this.snackBar.open(message, this.SNACKBAR_ACTION, {
      duration: 3000
    });
  }

}
