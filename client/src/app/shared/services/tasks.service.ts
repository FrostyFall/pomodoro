import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';

import { ITask } from '../interfaces/task.interface';
import { IBackendTask } from '../interfaces/backend-task';
import { environment } from 'src/environments/environment.development';

@Injectable({ providedIn: 'root' })
export class TasksService {
  private tasksSource$ = new BehaviorSubject<ITask[]>([]);
  tasks$ = this.tasksSource$.asObservable();

  constructor(private readonly httpClient: HttpClient) {
    this.fetchTasks();
  }

  public getTasks(): Observable<IBackendTask[]> {
    return this.httpClient.get<IBackendTask[]>(`${environment.apiUrl}/tasks`);
  }

  public updateTask(task: ITask): Observable<IBackendTask> {
    const updatedTask = this.httpClient
      .patch<IBackendTask>(`${environment.apiUrl}/tasks/${task.id}`, task)
      .pipe(
        tap(() => {
          this.fetchTasks();
        })
      );

    return updatedTask;
  }

  private fetchTasks(): void {
    this.getTasks().subscribe((value) => {
      const tasks: ITask[] = value.map((task) => {
        return {
          id: task.id,
          name: task.name,
          ticksTotal: task.ticksTotal,
          ticksDone: task.ticksDone,
        };
      });

      this.tasksSource$.next(tasks);
    });
  }
}
