import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {BookService} from '../../services/book.service';
import {Page} from '../../models/page';
import {Book} from '../../models/book';
import {MatTableDataSource} from "@angular/material/table";
import {MatPaginator} from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";

@Component({
  selector: 'app-books-list',
  templateUrl: './books-list.component.html',
  styleUrls: ['./books-list.component.scss']
})
export class BooksListComponent implements OnInit, AfterViewInit {

  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  public filterValues = {};
  public displayedColumns: string[] = ['title', 'author', 'genre', 'status'];
  public dataSource: MatTableDataSource<Book> = new MatTableDataSource<Book>();
  public pageSizeOptions: number[] = [10, 15, 20, 50, 100];
  public genres: string[] = ['Biography/Autobiography', 'Classic', 'Comic/Graphic Novel', 'Crime/Detective',
    'Essay', 'Fable', 'Fairy tale', 'Fanfiction', 'Fantasy', 'Fiction in verse', 'Fiction narrative', 'Folklore',
    'Historical fiction', 'Horror', 'Humor', 'Legend', 'Metafiction', 'Mystery', 'Mythology', 'Mythopoeia',
    'Narrative nonfiction', 'Realistic fiction', 'Reference book', 'Science fiction', 'Short story', 'Speech',
    'Suspense/Thriller', 'Tall tale', 'Textbook', 'Western', 'Other'];
  public selectedGenres: string[] = this.genres;
  public statuses: string[] = ['available', 'borrowed', 'returned', 'damaged', 'processing'];
  public filterGenre: string;
  public filterStatus: string;
  public filterTitle: string;
  public filterAuthor: string;

  public filterBy = [
    {
      column: 'title',
      options: []
    },
    {
      column: 'author',
      options: []
    },
    {
      column: 'genre',
      options: []
    },
    {
      column: 'status',
      options: []
    }
  ]

  constructor(
    private bookService: BookService,
  ) {
  }

  ngOnInit(): void {
    this.bookService.getBooks({pageIndex: 0, pageSize: 5000})
      .subscribe(res => {
        let x = res as Page<Book>;
        this.dataSource.data = x.content
        this.dataSource.filterPredicate = this.createFilter();
      });
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.filterBy.filter((o) => {
      o.options = this.getFilterObject(this.dataSource.data, o.column);
    });
  }

  filterChange(filter, stringMatch): void {
    this.filterValues[filter.column] = stringMatch.trim().toLocaleLowerCase();
    this.dataSource.filter = JSON.stringify(this.filterValues);
  }

  createFilter() {
    return function (data: any, filter: string): boolean {
      let searchTerms = JSON.parse(filter);
      let isFilterSet = false;
      for (const col in searchTerms) {
        if (searchTerms[col].toString() !== '') {
          isFilterSet = true;
        } else {
          delete searchTerms[col];
        }
      }
      let search = () => {
        let found = false;
        if (isFilterSet) {
          let allMatch = true;
          for (const col in searchTerms) {
            if (data[col].toString().toLocaleLowerCase().indexOf(searchTerms[col].trim().toLocaleLowerCase()) != -1) {
              found = true;
            } else {
              allMatch = false;
            }
          }
          return found && allMatch
        } else {
          return true;
        }
      }
      return search()
    }
  }

  getFilterObject(data, key): any[] {
    const unique = [];
    data.filter((obj) => {
      if (!unique.includes(obj[key])) {
        unique.push(obj[key]);
      }
      return obj;
    });
    return unique;
  }

  onKey(event): void {
    this.selectedGenres = this.search(event.target.value);
  }

  search(value: string): string[] {
    let filter = value.toLocaleLowerCase();
    return this.genres.filter(o => o.toLocaleLowerCase().startsWith(filter))
  }

}
