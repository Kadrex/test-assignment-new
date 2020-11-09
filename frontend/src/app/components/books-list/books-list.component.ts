import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import { BookService } from '../../services/book.service';
import {Page} from '../../models/page';
import { Book } from '../../models/book';
import {MatTableDataSource} from "@angular/material/table";
import {MatPaginator} from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";

@Component({
  selector: 'app-books-list',
  templateUrl: './books-list.component.html',
  styleUrls: ['./books-list.component.scss']
})
export class BooksListComponent implements OnInit, AfterViewInit {

  pageSizeOptions: number[] = [10, 15, 20, 50];
  displayedColumns: string[] = ['title', 'author', 'genre', 'available'];
  dataSource: MatTableDataSource<Book> = new MatTableDataSource<Book>();
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  private yes: string = 'Yes';
  private no: string = 'No';


  constructor(
    private bookService: BookService,
  ) {
  }

  ngOnInit(): void {
    this.bookService.getBooks({pageIndex: 0, pageSize: 5000})
      .subscribe(res => {
        let x = res as Page<Book>;
        this.dataSource.data = x.content
      })
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  isAvailable(book): string {
    if (book.status == 'AVAILABLE') {
      return this.yes
    }
    return this.no
  }

}
