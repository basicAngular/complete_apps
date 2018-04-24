import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { jqxSchedulerComponent } from '../assets/jqwidgets-ts/angular_jqxscheduler';

@NgModule({
  declarations: [
    AppComponent,
    jqxSchedulerComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
