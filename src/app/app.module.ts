import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { HeaderComponent } from './layouts/header/header.component';
import { PageComponent } from './components/page/page.component';
import { MainComponent } from './layouts/main/main.component';
import { LayoutComponent } from './layouts/layout/layout.component';
import { InsertContentComponent } from './modals/insert-content/insert-content.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    PageComponent,
    MainComponent,
    LayoutComponent,
    InsertContentComponent,
  ],
  imports: [BrowserModule, ReactiveFormsModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
