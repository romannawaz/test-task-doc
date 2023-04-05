import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { PageDataService } from '../../services/page-data.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  scale = 100;

  @Output() scaleEvent = new EventEmitter<number>();

  constructor(private pageDataService: PageDataService) {}

  ngOnInit(): void {
    this._emit();
  }

  increase(): void {
    if (this.scale === 100) return;
    this.scale += 10;

    this._emit();
  }

  decrease(): void {
    if (this.scale === 0) return;
    this.scale -= 10;

    this._emit();
  }

  showData(): void {
    console.log(this.pageDataService.dataSubject.value);
  }

  private _emit(): void {
    this.scaleEvent.emit(this.scale / 100);
  }
}
