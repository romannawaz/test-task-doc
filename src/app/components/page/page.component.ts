import { Component, HostListener, Input, OnInit } from '@angular/core';

import { IData, PageDataService } from '../../services/page-data.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-page',
  templateUrl: './page.component.html',
  styleUrls: ['./page.component.scss'],
})
export class PageComponent implements OnInit {
  private subscriptions: Subscription = new Subscription();

  @Input() pageNumber!: number;

  @HostListener('contextmenu', ['$event'])
  onClick($event: PointerEvent) {
    $event.preventDefault();

    const newData = {
      index: Date.now(),
      page: this.pageNumber,
      coords: {
        x: $event.offsetX,
        y: $event.offsetY,
      },
    };

    this.pageDataService.addData(newData);
  }

  data: IData[] = [];

  constructor(public pageDataService: PageDataService) {}

  ngOnInit(): void {
    this.subscriptions.add(
      this.pageDataService.dataSubject$.subscribe((data: IData[]) => {
        this.data = [...data.filter((el) => el.page == this.pageNumber)];
      })
    );
  }

  filter(index: number) {
    this.pageDataService.removeData(index);
  }

  saveData(data: IData) {
    this.pageDataService.addData(data);
  }

  updateCoords(data: IData) {
    this.pageDataService.updateCoords(data);
  }
}
