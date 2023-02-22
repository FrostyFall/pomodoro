import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { environment } from 'src/environments/environment.development';
import { ILog, IBackendLog } from '../interfaces';

@Injectable({ providedIn: 'any' })
export class GraphService {
  constructor(private readonly httpClient: HttpClient) {}

  public getWorkLogs(): Observable<ILog[]> {
    return this.httpClient
      .get<IBackendLog[]>(`${environment.apiUrl}/logs?name=work`)
      .pipe(
        map((backLog: IBackendLog[]) => {
          return backLog.map((log: IBackendLog) => {
            return {
              id: log.id,
              modeId: log.modeId,
              createdAt: log.createdAt,
            };
          });
        })
      );
  }

  public getShortBreakLogs(): Observable<ILog[]> {
    return this.httpClient
      .get<IBackendLog[]>(`${environment.apiUrl}/logs?name=short%20break`)
      .pipe(
        map((backLog: IBackendLog[]) => {
          return backLog.map((log: IBackendLog) => {
            return {
              id: log.id,
              modeId: log.modeId,
              createdAt: log.createdAt,
            };
          });
        })
      );
  }

  public getLongBreakLogs(): Observable<ILog[]> {
    return this.httpClient
      .get<IBackendLog[]>(`${environment.apiUrl}/logs?name=long%20break`)
      .pipe(
        map((backLog: IBackendLog[]) => {
          return backLog.map((log: IBackendLog) => {
            return {
              id: log.id,
              modeId: log.modeId,
              createdAt: log.createdAt,
            };
          });
        })
      );
  }

  public createWorkLog(): Observable<IBackendLog> {
    return this.httpClient.post<IBackendLog>(`${environment.apiUrl}/logs`, {
      modeName: 'work',
    });
  }

  public createShortBreakLog(): Observable<IBackendLog> {
    return this.httpClient.post<IBackendLog>(`${environment.apiUrl}/logs`, {
      modeName: 'short break',
    });
  }

  public createLongBreakLog(): Observable<IBackendLog> {
    return this.httpClient.post<IBackendLog>(`${environment.apiUrl}/logs`, {
      modeName: 'long break',
    });
  }

  public storeNotificationsSub(sub: string): Observable<any> {
    return this.httpClient.post<any>(`${environment.apiUrl}/logs/sub`, {
      sub,
    });
  }

  public sendNotification(msg: string): Observable<any> {
    return this.httpClient.post<any>(
      `${environment.apiUrl}/logs/notifications`,
      {
        msg,
      }
    );
  }
}
