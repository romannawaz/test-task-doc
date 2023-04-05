import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface ICoords {
  x: number;
  y: number;
}

export interface IData {
  index?: number;
  page?: number;
  type?: 'text' | 'image';
  content?: string | ArrayBuffer | null;
  coords: ICoords;
}

@Injectable({
  providedIn: 'root',
})
export class PageDataService {
  dataSubject = new BehaviorSubject<IData[]>([]);

  constructor() {}

  get dataSubject$(): Observable<IData[]> {
    return this.dataSubject.asObservable();
  }

  addData(data: IData): void {
    this.dataSubject.next([...this.dataSubject.value, data]);
  }

  updateCoords(data: IData) {
    const index = this.dataSubject.value.findIndex(
      (el) => el.index === data.index
    );

    this.dataSubject.value[index] = data;

    this.dataSubject.next(this.dataSubject.value);
  }

  removeData(index: number) {
    const filtered = this.dataSubject.value.filter((el) => el.index !== index);

    this.dataSubject.next(filtered);
  }
}
