import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Lease } from './lease';
import { catchError } from 'rxjs/operators';
import { MessageService } from '../message/message.service';
import { Observable, of } from 'rxjs/index';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class LeaseService {
  private url = '/jboss-api/lease';
  private proxyUrl = '/3scale';

  constructor(private messageService: MessageService, private http: HttpClient) {}

  search(offset: number, pageSize: number, filter: string): Observable<any> {
    const url = `${this.url}/search`;

    const options = {
      headers: httpOptions.headers,
      params: {
        offset: offset.toString(),
        pageSize: pageSize.toString(),
        filter: filter
      }
    };

    return this.http.get<any>(url, options).pipe(
      catchError(res => {
        return this.handleError('search()', res);
      })
    );
  }

  proxySearch(offset: number, pageSize: number, filter: string): Observable<any> {
    const url = `${this.proxyUrl}/jboss-api/lease/search`;

    const options = {
      headers: httpOptions.headers,
      params: {
        offset: offset.toString(),
        pageSize: pageSize.toString(),
        filter: filter,
        user_key: '3227f77bda35677fe06859bff2eb0949'
      }
    };
    return this.http.get<any>(url, options).pipe(
      catchError(res => {
        return this.handleError('proxySearch()', res);
      })
    );
  }

  get(id: number): Observable<Lease> {
    return this.http.get<Lease>(this.url + `/${id}`, httpOptions).pipe(
      catchError(res => {
        return this.handleError(`get(${id})`, res);
      })
    );
  }

  getByProcessId(id: number): Observable<Lease> {
    return this.http.get<Lease>(this.url + `/process/${id}`, httpOptions).pipe(
      catchError(res => {
        return this.handleError(`getByProcessId(${id})`, res);
      })
    );
  }

  update(newLease: Lease): Observable<Lease> {
    return this.http.put<Lease>(this.url, newLease, httpOptions).pipe(
      catchError(res => {
        return this.handleError('update()', res);
      })
    );
  }

  updateProcessId(id: number, processInstanceId: number): Observable<Lease> {
    const url = `${this.url}/process`;
    const options = {
      headers: httpOptions.headers,
      params: {
        id: id.toString(),
        processInstanceId: processInstanceId.toString()
      }
    };
    return this.http.put<Lease>(url, null, options).pipe(
      catchError(res => {
        return this.handleError('updateProcessId()', res);
      })
    );
  }

  private handleError(method: string, res: HttpErrorResponse): Observable<any> {
    this.messageService.error(`${method} ${res.message}`);
    console.error(res.error);
    return of(null);
  }
}
