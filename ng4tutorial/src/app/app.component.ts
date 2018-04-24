import { Component, Injectable } from '@angular/core';
import { Item } from './item';
import { NgForm } from '@angular/forms';
import { Http, Headers } from '@angular/http';
import 'rxjs/add/operator/toPromise';

@Injectable()
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  constructor(private _http: Http) { }
  private headers = new Headers({ 'Content-Type': 'application/json' });

  title = 'Laravel Angular 4 App';
  onSubmit(form: NgForm): Promise<Item> {
    return this._http.post('http://127.0.0.1:8000/api/items', JSON.stringify(form.value), { headers: this.headers })
      .toPromise()
      .then(res => res.json().data)
      .catch(this.handleError);
  }
  private handleError(error: any): Promise<any> {
    console.error('An error occurred', error); // for demo purposes only
    return Promise.reject(error.message || error);
  }
}
