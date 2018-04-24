import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { AccordionModule, BsDropdownModule } from 'ngx-bootstrap';
import { FormsModule} from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';
import {ChartModule} from 'primeng/chart';
import { HttpModule } from '@angular/http';
import { AboutComponent } from './about/about.component';
import { HomeComponent } from './home/home.component';
import { RouterModule } from '@angular/router';
import { ContactComponent } from './contact/contact.component';
import { appRoutes } from './routerConfig';
import { ScheduleComponent } from './schedule/schedule.component';

@NgModule({
  declarations: [
    AppComponent,
    AboutComponent,
    HomeComponent,
    ContactComponent,
    ScheduleComponent
  ],
  imports: [
    BsDropdownModule.forRoot(),
    AccordionModule.forRoot(), BrowserModule, FormsModule, HttpClientModule, HttpModule, RouterModule,
    RouterModule.forRoot(appRoutes)
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
