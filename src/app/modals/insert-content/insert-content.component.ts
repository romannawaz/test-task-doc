import { DOCUMENT } from '@angular/common';
import {
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Inject,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { FormControl } from '@angular/forms';
import { Subscription, fromEvent, takeUntil } from 'rxjs';
import { IData } from '../../services/page-data.service';

@Component({
  selector: 'app-insert-content',
  templateUrl: './insert-content.component.html',
  styleUrls: ['./insert-content.component.scss'],
})
export class InsertContentComponent implements OnInit, OnDestroy {
  private subscriptions: Subscription = new Subscription();

  @Output() remove = new EventEmitter<number>();
  @Output() done = new EventEmitter<IData>();
  @Output() onDragEnd = new EventEmitter<IData>();

  @Input() item!: IData;

  element: HTMLElement;

  @HostListener('click', ['$event'])
  onClick($event: PointerEvent) {
    $event.stopPropagation();
  }

  textInput: FormControl<string> = new FormControl();
  imageInput: FormControl<any> = new FormControl();

  type: 'text' | 'image' | null = null;

  url: string | ArrayBuffer | null = null;

  isDone = false;

  constructor(
    private elementRef: ElementRef,
    @Inject(DOCUMENT) private document: any
  ) {
    this.element = this.elementRef.nativeElement as HTMLElement;
  }

  ngOnInit() {
    if (this.item.content && this.item.type) {
      this.type = this.item.type;
      this.item.type === 'text'
        ? this.textInput.setValue(this.item.content as string)
        : (this.url = this.item.content);

      this.isDone = true;

      this.move();
    }

    this.element.style.position = 'absolute';
    this.element.style.left = this.item.coords.x + 'px';
    this.element.style.top = this.item.coords.y + 'px';
  }

  destroy($event: MouseEvent): void {
    $event.stopPropagation();
    this.remove.emit(this.item.index);
  }

  save(): void {
    this.isDone = true;

    this.done.emit({
      index: this.item.index,
      type: this.type!,
      content: this.type === 'text' ? this.textInput.value : this.url,
      coords: {
        x: this.item.coords.x,
        y: this.item.coords.y,
      },
    });

    this.move();
  }

  readUrl(event: any) {
    if (event.target.files && event.target.files[0]) {
      var reader = new FileReader();

      reader.onload = (event: ProgressEvent) => {
        this.url = (<FileReader>event.target).result;

        this.save();
      };

      reader.readAsDataURL(event.target.files[0]);
    }
  }

  move() {
    const dragStart$ = fromEvent<MouseEvent>(this.element, 'mousedown');
    const dragEnd$ = fromEvent<MouseEvent>(this.document, 'mouseup');
    const drag$ = fromEvent<MouseEvent>(this.document, 'mousemove').pipe(
      takeUntil(dragEnd$)
    );

    let initialX: number,
      initialY: number,
      currentX = this.item.coords.x,
      currentY = this.item.coords.y;

    let dragSub: Subscription;

    const dragStartSub = dragStart$.subscribe((event: MouseEvent) => {
      initialX = event.clientX - currentX;
      initialY = event.clientY - currentY;

      dragSub = drag$.subscribe((event: MouseEvent) => {
        event.preventDefault();

        currentX = event.clientX - initialX;
        currentY = event.clientY - initialY;

        this.element.style.left = currentX + 'px';
        this.element.style.top = currentY + 'px';
      });
    });

    const dragEndSub = dragEnd$.subscribe(() => {
      initialX = currentX;
      initialY = currentY;

      this.onDragEnd.emit({
        index: this.item.index,
        type: this.type!,
        page: this.item.page,
        content: this.type === 'text' ? this.textInput.value : this.url,
        coords: {
          x: currentX,
          y: currentY,
        },
      });

      if (dragSub) {
        dragSub.unsubscribe();
      }
    });

    this.subscriptions.add(dragStartSub);
    this.subscriptions.add(dragEndSub);
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
