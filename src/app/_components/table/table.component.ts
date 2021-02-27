import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { MatSort, Sort, SortDirection } from '@angular/material/sort';


export interface TableOptions {
  sortColumn: string;
  sortDirection: SortDirection;
  columns: { def: string; title: string; }[],
  pageSize: number,
  page: number,
  total: number,
  loading: boolean
};

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss']
})
export class TableComponent implements OnInit {

  @Input() data = [{}];
  @Input() tableOptions: TableOptions = {
    columns:  [{def: "", title: ""}],
    sortColumn: "",
    sortDirection: "desc",
    pageSize: 5,
    page: 1,
    total: 0,
    loading: false
  }

  @Output() pageChange = new EventEmitter<PageEvent>();
  @Output() sortChange = new EventEmitter<Sort>();
  @ViewChild(MatSort, { static: false }) sort: MatSort;

  displayedColumns: string[] = [];

  constructor() {}

  ngOnInit(): void {
    for(let column of this.tableOptions.columns) {
      this.displayedColumns.push(column.def);
    }
  }

  ngAfterViewInit() {
    this.sort.sortChange.subscribe(sort => {
      this.sortChange.emit(sort);
    });
  }

  pageEvent(event?:PageEvent) {
    this.pageChange.emit(event);
  }
}
