import { Component, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { filter } from 'rxjs/operators';
import { ErrorDisplayComponent } from './error-display/error-display.component';
import { ErrorDisplayService } from './_services/error-display.service';
import { LoaderService } from './_services/loader.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {

  loading = false;

  constructor(private errorService: ErrorDisplayService,
              public dialog: MatDialog,
              public loaderService: LoaderService) {
  }

  ngOnInit() {
    this.errorService.errors$.pipe(filter(err => err && !!err)).subscribe(err => {
      this.loaderService.setLoading(false);
      const dialogRef = this.dialog.open(ErrorDisplayComponent, { width: '80%', data: err });
      dialogRef.afterClosed().subscribe(_ => {
        console.log('closed: ' , _); // reload ?
      });
    })
  }

  ngOnDestroy() {
  }


}
