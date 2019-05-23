import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { MessageService } from './message/message.service';
import { Observable, of } from 'rxjs/index';

const headers: HttpHeaders = new HttpHeaders()
  .append('Content-Type', 'application/json')
  .append('Authorization', 'Basic ' + btoa('pamAdmin:redhatpam1!'));

const httpOptions = {
  headers: headers
};
const baseUrl = '/services/rest';
const processId = 'malware.inspect';
const containerId = 'malware_1.0.0-SNAPSHOT';

@Injectable({
  providedIn: 'root'
})
export class KieService {
  constructor(private messageService: MessageService, private http: HttpClient) { }

  startProcess(filename: string): Observable<any> {
    const url = `${baseUrl}/server/containers/${containerId}/processes/${processId}/instances`;

    const body = {
      filename: filename
    };
    return this.http.post<any>(url, body, httpOptions).pipe(
      catchError(res => this.handleError('process()', res))
    );
  }

  getProcesses(): Observable<any> {
    const url = `${baseUrl}/server/containers/${containerId}/processes/${processId}/instances`;
    return this.http.get<any>(url, httpOptions).pipe(
      catchError(res => this.handleError('getProcesses()', res))
    );
  }

  getTasks(): Observable<any> {
    const url = `${baseUrl}/server/queries/tasks/instances/pot-owners`;
    return this.http.get<any>(url, httpOptions).pipe(
      catchError(res => this.handleError('getTasks()', res))
    );
  }

  getTask(taskInstanceId: number): Observable<any> {
    const url = `${baseUrl}/server/containers/${containerId}/tasks/${taskInstanceId}/contents/input`;
    return this.http.get<any>(url, httpOptions).pipe(
      catchError(res => this.handleError('getTask()', res))
    );
  }

  claim(taskInstanceId: number): Observable<any> {
    const url = `${baseUrl}/server/containers/${containerId}/tasks/${taskInstanceId}/states/claimed`;
    return this.http.put<any>(url, null, httpOptions).pipe(
      catchError(res => this.handleError('claim()', res))
    );
  }

  start(taskInstanceId: number): Observable<any> {
    const url = `${baseUrl}/server/containers/${containerId}/tasks/${taskInstanceId}/states/started`;
    return this.http.put<any>(url, null, httpOptions).pipe(
      catchError(res => this.handleError('start()', res))
    );
  }

  complete(taskInstanceId: number): Observable<any> {
    const url = `${baseUrl}/server/containers/${containerId}/tasks/${taskInstanceId}/states/completed`;

    return this.http.put<any>(url, null, httpOptions).pipe(
      catchError(res => this.handleError('complete()', res))
    );
  }

  private handleError(method: string, res: HttpErrorResponse): Observable<any> {
    this.messageService.error(`${method} ${res.message}`);
    console.error(res.error);
    return of(null);
  }
}
