import {Component, OnInit} from '@angular/core';
import { BookService } from '../../services/book.service';
import { Book } from '../../models/book';
import { Observable } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { map, switchMap } from 'rxjs/operators';
import { MatDialog } from "@angular/material/dialog";
import { ConfirmationDialog } from "../confirmation-dialog/confirmation-dialog.component";

@Component({
  selector: 'app-book-detail',
  templateUrl: './book-detail.component.html',
  styleUrls: ['./book-detail.component.scss']
})
export class BookDetailComponent implements OnInit {

  public book$: Observable<Book | Error>;
  private dialogText: string = 'Do you really wish to delete this book?';
  public BORROWED: string = 'BORROWED';
  private AVAILABLE: string = 'AVAILABLE';

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
    const dialogRef = this.dialog.open(ConfirmationDialog, {
      data: {text: this.dialogText
      }});

    dialogRef.afterClosed().subscribe(res => {
      if (res) {
        this.deleteBook()
      }
    })
  }

}

export interface DialogData {
  text: string;
}
